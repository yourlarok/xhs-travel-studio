const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn, execFile } = require("child_process");
const { promisify } = require("util");
const execFileAsync = promisify(execFile);

const activeRuns = new Map();
const STAGE_ORDER = ["research", "evidence", "content", "images", "quality", "review"];

async function locateCodex() {
  const result = await execFileAsync("where.exe", ["codex"], { windowsHide: true, timeout: 5000 });
  const paths = result.stdout.split(/\r?\n/).map(value => value.trim()).filter(Boolean);
  return paths.find(value => /\.cmd$/i.test(value)) || paths[0];
}

function safeRunId() {
  return `${new Date().toISOString().replace(/[:.]/g, "-")}-${Math.random().toString(36).slice(2, 7)}`;
}

function researchContext(input = {}) {
  const xhs = (input.xhsItems || []).slice(0, 90).map((item, index) => ({
    ref: `xhs-${index + 1}`, query: item.keyword || "", title: item.title || "", url: item.href || "",
    public_engagement: item.publicEngagement ?? null, observed_text: String(item.rawText || "").slice(0, 320), captured_at: item.capturedAt || input.capturedAt || ""
  }));
  const tripadvisor = (input.taItems || []).slice(0, 24).map((item, index) => ({
    ref: `ta-${index + 1}`, query: item.query || "", place: item.name || "", url: item.webUrl || "", rating: item.rating ?? null,
    reviews: (item.reviews || []).slice(0, 5).map(review => ({ date: review.publishedDate || "", trip_type: review.tripType || "", traveler_location: review.userLocation || "", text: String(review.text || "").slice(0, 600) }))
  }));
  return { captured_at: input.capturedAt || new Date().toISOString(), xhs, tripadvisor };
}

function buildPrompt(payload) {
  const evidence = researchContext(payload.research);
  const settings = payload.settings || {};
  return [
    "Use the installed china-travel-intelligence and china-inbound-travel-editorial Skills exactly.",
    "Create a production-ready 12-week Xiaohongshu image-text content plan and the first seven-card post for international independent visitors to China.",
    "Treat Xiaohongshu items as observed demand/local-detail leads and Tripadvisor reviews as traveler-experience signals only. Never copy review wording.",
    "Do not invent operational facts. Any price, hours, booking, passport, payment, station exit, or transport claim lacking an official source must be labeled unconfirmed and added to quality.warnings.",
    "Keep duration, RMB budget per person, and execution difficulty central. Use calm global English and preserve useful Chinese place names.",
    "Each calendar post must cite at least one evidence ref when evidence exists. Avoid duplicate promises and vary traveler moments and decisions.",
    "The first article must have exactly seven distinct cards with at least four layout types. Image prompts must contain no text and must match the card purpose.",
    "Return only JSON conforming to the supplied schema. Do not edit files.",
    `SETTINGS=${JSON.stringify({ city: settings.city, audience: settings.audience, tone: settings.tone, language: settings.language, planDuration: settings.planDuration, planBudget: settings.planBudget, planDifficulty: settings.planDifficulty, visualStyle: settings.visualStyle })}`,
    `PREVIOUS_TITLES=${JSON.stringify((payload.previousTitles || []).slice(-100))}`,
    `EVIDENCE=${JSON.stringify(evidence)}`
  ].join("\n\n");
}

async function runCodex({ payload, runDir, send, run }) {
  const codexPath = await locateCodex();
  const outputPath = path.join(runDir, "production.json");
  const schemaPath = path.join(runDir, "pipeline-schema.json");
  fs.copyFileSync(path.join(__dirname, "pipeline-schema.json"), schemaPath);
  const effort = ["low", "medium", "high", "xhigh"].includes(payload.effort) ? payload.effort : "high";
  const model = /^[a-zA-Z0-9._-]{1,80}$/.test(payload.model || "") ? payload.model : "gpt-5.6-sol";
  const commandArgs = ["exec", "--skip-git-repo-check", "--sandbox", "read-only", "--ephemeral", "-m", model, "-c", `model_reasoning_effort="${effort}"`, "--output-schema", schemaPath, "-o", outputPath, "-"];
  send("content", "running", `Codex 正在生成12周日历与首篇内容 · ${model} / ${effort}`);
  await new Promise((resolve, reject) => {
    const shell = process.platform === "win32" ? (process.env.ComSpec || "cmd.exe") : "/bin/sh";
    if (process.platform === "win32") {
      // Prefer an 8.3 path so cmd never has to parse a quoted Program Files path.
      const shortCodexPath = /^([A-Z]):\\Program Files\\/i.test(codexPath)
        ? codexPath.replace(/^([A-Z]):\\Program Files\\/i, "$1:\\PROGRA~1\\")
        : codexPath;
      const args = ["/d", "/c", "call", shortCodexPath, ...commandArgs];
      const child = spawn(shell, args, { cwd: runDir, windowsHide: true });
      run.child = child;
      return attachCodexProcess(child, { run, resolve, reject, send, payload });
    }
    const child = spawn(shell, ["-lc", [codexPath, ...commandArgs].join(" ")], { cwd: runDir, windowsHide: true });
    run.child = child;
    return attachCodexProcess(child, { run, resolve, reject, send, payload });
  });
  const artifact = JSON.parse(fs.readFileSync(outputPath, "utf8"));
  send("content", "complete", `已生成 ${artifact.calendar.length} 周日历和 ${artifact.article.cards.length} 张卡片`);
  return artifact;
}

function attachCodexProcess(child, { run, resolve, reject, send, payload }) {
  let stderr = "";
  const started = Date.now();
  const heartbeat = setInterval(() => send("content", "running", `Codex 仍在生成 · 已运行 ${Math.max(1, Math.round((Date.now() - started) / 60000))} 分钟`), 30000);
  const timeout = setTimeout(() => { child.kill(); reject(new Error("Codex 生成超过 10 分钟，已停止")); }, 600000);
  child.stderr.on("data", chunk => { stderr += chunk.toString(); if (stderr.length > 16000) stderr = stderr.slice(-16000); });
  child.on("error", error => { clearInterval(heartbeat); clearTimeout(timeout); reject(error); });
  child.on("close", code => { clearInterval(heartbeat); clearTimeout(timeout); code === 0 ? resolve() : reject(new Error(stderr.trim() || `Codex exited with ${code}`)); });
  child.stdin.end(buildPrompt(payload));
}

function extractImage(result) {
  const candidate = result?.data?.[0] || result?.images?.[0] || result;
  return { url: candidate?.url || candidate?.image_url || result?.url || result?.image_url || "", base64: candidate?.b64_json || candidate?.base64 || result?.b64_json || "" };
}

async function generateImages({ artifact, settings, runDir, send, run }) {
  const endpoint = String(settings.tapnowEndpoint || "").trim();
  if (!settings.imageTapnow || !endpoint) {
    send("images", "skipped", "TapNow 未配置，保留卡片图片提示词并阻止自动发布");
    return [];
  }
  const outputs = [];
  send("images", "running", `TapNow 正在生成 ${artifact.article.cards.length} 张匹配卡片的图片`);
  for (const card of artifact.article.cards) {
    if (run.cancelled) throw new Error("任务已取消");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(settings.tapnowKey ? { Authorization: `Bearer ${settings.tapnowKey}` } : {}) },
      body: JSON.stringify({ model: settings.tapnowModel || "seedream-5-pro", prompt: `${card.image_prompt}. ${settings.visualStyle || ""}`.trim(), size: "1024x1365", n: 1 })
    });
    if (!response.ok) throw new Error(`TapNow HTTP ${response.status}`);
    const extracted = extractImage(await response.json());
    const target = path.join(runDir, `card-${String(card.page).padStart(2, "0")}.png`);
    if (extracted.base64) fs.writeFileSync(target, Buffer.from(extracted.base64, "base64"));
    else if (extracted.url) {
      const imageResponse = await fetch(extracted.url); if (!imageResponse.ok) throw new Error(`图片下载 HTTP ${imageResponse.status}`);
      fs.writeFileSync(target, Buffer.from(await imageResponse.arrayBuffer()));
    } else throw new Error("TapNow 返回中没有可识别的图片");
    outputs.push({ page: card.page, path: target });
    send("images", "running", `已生成 ${outputs.length}/${artifact.article.cards.length} 张`);
  }
  send("images", "complete", `TapNow 已生成 ${outputs.length} 张图片`);
  return outputs;
}

function registerPipeline({ ipcMain, app }) {
  const runsRoot = path.join(app.getPath("userData"), "pipeline-runs");
  fs.mkdirSync(runsRoot, { recursive: true });
  // Recover runs left in memory as "running" after an app crash or a user
  // closing the desktop app. A new process has no active child for those runs.
  for (const entry of fs.readdirSync(runsRoot, { withFileTypes: true }).filter(item => item.isDirectory())) {
    const statePath = path.join(runsRoot, entry.name, "run.json");
    try {
      const stale = JSON.parse(fs.readFileSync(statePath, "utf8"));
      if (stale.status === "running") {
        stale.status = "failed";
        stale.error = "应用在任务完成前退出，已恢复为失败状态";
        stale.completedAt = new Date().toISOString();
        stale.execution = { ...(stale.execution || {}), phase: "failed", retryable: true, nextAction: "重新运行生产链路", blockers: [stale.error] };
        fs.writeFileSync(statePath, JSON.stringify(stale, null, 2));
      }
    } catch {}
  }
  ipcMain.handle("studio:pipeline-run", async (event, payload = {}) => {
    const runId = safeRunId(); const runDir = path.join(runsRoot, runId); fs.mkdirSync(runDir, { recursive: true });
    const state = { runId, status: "running", startedAt: new Date().toISOString(), currentStage: "research", stages: {}, log: [], payloadSummary: { xhs: payload.research?.xhsItems?.length || 0, xhsQueries: payload.research?.xhsQueryCount || 0, xhsNeedsLogin: Boolean(payload.research?.xhsNeedsLogin), xhsEmptyQueries: (payload.research?.xhsEmptyQueries || []).slice(0, 12), tripadvisor: payload.research?.taItems?.length || 0, tripadvisorNeedsKey: Boolean(payload.research?.tripadvisorNeedsKey) }, execution: { phase: "running", retryable: true, nextAction: "等待研究结果", blockers: [] } };
    const run = { cancelled: false, child: null, state }; activeRuns.set(runId, run);
    const persist = () => fs.writeFileSync(path.join(runDir, "run.json"), JSON.stringify(state, null, 2));
    const send = (stage, status, message) => { const item = { stage, status, message, at: new Date().toISOString() }; state.currentStage = stage; state.stages[stage] = item; state.log.push(item); state.execution.phase = status === "complete" && stage === "review" ? "review" : status === "failed" ? "failed" : status === "cancelled" ? "cancelled" : status; state.execution.retryable = !["review", "cancelled"].includes(state.execution.phase); state.execution.nextAction = status === "failed" ? "修复前置条件后重新运行" : status === "complete" && stage === "review" ? "人工审核并决定是否准备发布" : `等待${STAGE_ORDER[STAGE_ORDER.indexOf(stage) + 1] || "下一阶段"}`; persist(); event.sender.send("studio:pipeline-progress", { runId, ...item }); };
    try {
      send("research", "complete", `已接收真实证据：小红书 ${state.payloadSummary.xhs} 条，Tripadvisor ${state.payloadSummary.tripadvisor} 个地点`);
      if (!state.payloadSummary.xhs && !state.payloadSummary.tripadvisor) {
        const reason = payload.research?.xhsNeedsLogin
          ? "小红书公开检索需要登录，且 Tripadvisor 没有返回证据；已停止生成"
          : payload.research?.xhsQueryCount
            ? `小红书已执行 ${payload.research.xhsQueryCount} 组查询但未返回可解析卡片，Tripadvisor 也没有证据；已停止生成`
            : "没有真实研究数据，已停止生成";
        throw new Error(reason);
      }
      send("evidence", "complete", "已按来源角色建立证据包；未核验事实将进入警告");
      const artifact = await runCodex({ payload, runDir, send, run });
      let images = [];
      try { images = await generateImages({ artifact, settings: payload.settings || {}, runDir, send, run }); }
      catch (error) { send("images", "warning", `图片阶段失败：${error.message}`); }
      artifact.generated_images = images;
      if (images.length < artifact.article.cards.length) {
        artifact.article.quality.ready_for_review = false;
        artifact.article.quality.warnings.push("图片尚未完整生成；不得进入发布准备");
      }
      send("quality", artifact.article.quality.ready_for_review ? "complete" : "warning", `质量分 ${artifact.article.quality.score}；${artifact.article.quality.warnings.length} 条警告`);
      fs.writeFileSync(path.join(runDir, "artifact.json"), JSON.stringify(artifact, null, 2));
      state.status = "review"; state.completedAt = new Date().toISOString(); state.artifactPath = path.join(runDir, "artifact.json"); persist();
      send("review", "complete", "内容已进入人工审核队列，未自动发布");
      return { ok: true, run: state, artifact };
    } catch (error) {
      state.status = run.cancelled ? "cancelled" : "failed"; state.error = error.message; state.execution.blockers = [error.message]; state.completedAt = new Date().toISOString();
      const failedStage = ["research", "evidence", "content", "images", "quality", "review"].includes(state.currentStage) ? state.currentStage : "content";
      send(failedStage, state.status, error.message); return { ok: false, run: state, error: error.message };
    } finally { activeRuns.delete(runId); }
  });
  ipcMain.handle("studio:pipeline-cancel", (_event, runId) => { const run = activeRuns.get(runId); if (!run) return { ok: false }; run.cancelled = true; run.child?.kill(); return { ok: true }; });
  ipcMain.handle("studio:pipeline-history", () => fs.readdirSync(runsRoot, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => {
    try { return JSON.parse(fs.readFileSync(path.join(runsRoot, entry.name, "run.json"), "utf8")); } catch { return null; }
  }).filter(Boolean).sort((a,b) => String(b.startedAt).localeCompare(String(a.startedAt))).slice(0, 30));
}

module.exports = { registerPipeline };
