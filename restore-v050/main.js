const { app, BrowserWindow, shell, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFile, spawn } = require("child_process");
const { promisify } = require("util");
const execFileAsync = promisify(execFile);
const { registerXhsIntegration } = require("./xhs-integration");

async function runPowerShell(command) {
  const result = await execFileAsync("powershell.exe", ["-NoProfile", "-Command", command], { windowsHide: true, timeout: 12000 });
  return result.stdout.trim();
}

async function commandInfo(name) {
  try {
    const located = await execFileAsync("where.exe", [name], { windowsHide: true, timeout: 5000 });
    const candidates = located.stdout.split(/\r?\n/).filter(Boolean);
    const commandPath = candidates.find(candidate => /\.(exe|cmd|bat|ps1)$/i.test(candidate)) || candidates[0];
    let version = "";
    try { version = await runPowerShell(`& '${commandPath.replace(/'/g, "''")}' --version 2>$null | Select-Object -First 1`); } catch {}
    return { detected: true, path: commandPath, version };
  } catch {
    return { detected: false, path: "", version: "" };
  }
}

function readSkill(skillPath) {
  try {
    const text = fs.readFileSync(skillPath, "utf8");
    const name = text.match(/^name:\s*["']?([^\r\n"']+)/m)?.[1]?.trim() || path.basename(path.dirname(skillPath));
    const description = text.match(/^description:\s*["']?([^\r\n"']+)/m)?.[1]?.trim() || "";
    return { name, description, path: skillPath };
  } catch { return null; }
}

function listSkills() {
  const roots = [path.join(os.homedir(), ".codex", "skills"), path.join(os.homedir(), ".codex", "skills", ".system")];
  const found = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
      const skillPath = path.join(root, entry.name, "SKILL.md");
      if (fs.existsSync(skillPath)) {
        const skill = readSkill(skillPath); if (skill) found.push(skill);
      }
    }
  }
  return found.sort((a,b) => a.name.localeCompare(b.name));
}

ipcMain.handle("studio:capabilities", async () => {
  const [codex, deepseek, ollama, lmstudio] = await Promise.all([commandInfo("codex"), commandInfo("deepseek"), commandInfo("ollama"), commandInfo("lmstudio")]);
  let tapnow = { detected: false, path: "", port: null };
  try {
    const raw = await runPowerShell("$p=Get-Process TapNow -ErrorAction SilentlyContinue | Select-Object -First 1; if($p){$port=(Get-NetTCPConnection -State Listen -OwningProcess $p.Id -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty LocalPort); [pscustomobject]@{path=$p.Path;port=$port}|ConvertTo-Json -Compress}");
    if (raw) tapnow = { detected: true, ...JSON.parse(raw) };
  } catch {}
  const normalize = (item, fallback) => ({ available: item.detected, path: item.path, detail: item.detected ? (item.version || item.path) : fallback });
  return {
    checkedAt: new Date().toISOString(),
    content: {
      codex: normalize(codex, "未检测到 Codex CLI"),
      deepseek: { ...normalize(deepseek, process.env.DEEPSEEK_API_KEY ? "已检测到 DEEPSEEK_API_KEY" : "未检测到 CLI 或 API Key"), available: deepseek.detected || Boolean(process.env.DEEPSEEK_API_KEY) },
      ollama: normalize(ollama, "未检测到 Ollama"),
      lmstudio: normalize(lmstudio, "未检测到 LM Studio CLI")
    },
    image: {
      tapnow: { available: tapnow.detected, path: tapnow.path, port: tapnow.port, detail: tapnow.detected ? `${tapnow.path || "TapNow"}${tapnow.port ? ` · 127.0.0.1:${tapnow.port}` : ""}` : "未检测到 TapNow 进程" }
    }
  };
});

ipcMain.handle("studio:skills", () => listSkills());
ipcMain.handle("studio:open-skill-folder", () => shell.openPath(path.join(os.homedir(), ".codex", "skills")));
ipcMain.handle("studio:codex-test", async (_event, config = {}) => {
  const effort = ["low","medium","high","xhigh"].includes(config.effort) ? config.effort : "medium";
  const model = /^[a-zA-Z0-9._-]{1,80}$/.test(config.model || "") ? config.model : "gpt-5.6-sol";
  const info = await commandInfo("codex");
  if (!info.detected) return { ok: false, message: "未检测到 Codex CLI" };
  const skills = Array.isArray(config.skills) ? config.skills.slice(0, 12).map(value => String(value).replace(/[^a-zA-Z0-9._-]/g, "")) : [];
  const imageTools = Array.isArray(config.imageTools) ? config.imageTools.slice(0, 8).map(value => String(value).replace(/[^a-zA-Z0-9._-]/g, "")) : [];
  const prompt = [
    "Act as a local capability test for China Travel Studio.",
    "Do not edit files and do not browse. Return only a compact English planning card.",
    "Propose one Chengdu topic for an international first-time visitor.",
    "It must state exactly three coordinates: door-to-door duration, RMB budget per person, and execution difficulty with one reason.",
    `Assembled skills: ${skills.join(", ") || "none"}.`,
    `Enabled image tools: ${imageTools.join(", ") || "none"}.`
  ].join("\n");
  const command = `& '${info.path.replace(/'/g, "''")}' exec --skip-git-repo-check --sandbox read-only -m '${model}' -c 'model_reasoning_effort=\"${effort}\"' -`;
  return await new Promise(resolve => {
    const child = spawn("powershell.exe", ["-NoProfile", "-Command", command], { cwd: __dirname, windowsHide: true });
    let stdout = ""; let stderr = ""; let settled = false;
    const finish = result => { if (!settled) { settled = true; resolve(result); } };
    const timer = setTimeout(() => { child.kill(); finish({ ok: false, message: "Codex 调用超过 120 秒，已停止。" }); }, 120000);
    child.stdout.on("data", chunk => { stdout += chunk.toString(); if (stdout.length > 30000) stdout = stdout.slice(-30000); });
    child.stderr.on("data", chunk => { stderr += chunk.toString(); if (stderr.length > 10000) stderr = stderr.slice(-10000); });
    child.on("error", error => { clearTimeout(timer); finish({ ok: false, message: error.message }); });
    child.on("close", code => {
      clearTimeout(timer);
      finish({ ok: code === 0, message: `${info.version || "Codex CLI"} · model=${model} · reasoning=${effort}`, command: `codex exec --sandbox read-only -m ${model} -c model_reasoning_effort=\"${effort}\"`, output: (stdout || stderr).trim() });
    });
    child.stdin.end(prompt);
  });
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 980,
    minHeight: 680,
    backgroundColor: "#f4f1e9",
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.once("ready-to-show", () => win.show());
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://") || url.startsWith("http://")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });
  win.webContents.once("did-finish-load", () => {
    if (!process.env.STUDIO_SCREENSHOT) return;
    setTimeout(async () => {
      const allowedViews = new Set(["today", "queue", "discovery", "calendar", "analytics", "agent", "settings"]);
      const targetView = allowedViews.has(process.env.STUDIO_VIEW) ? process.env.STUDIO_VIEW : "today";
      if (targetView !== "today") {
        await win.webContents.executeJavaScript(`document.querySelector('[data-view="${targetView}"]').click()`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      if (process.env.STUDIO_ACTION === "connect-xhs") {
        await win.webContents.executeJavaScript("(document.querySelector('#homeConnectXhs') || document.querySelector('#connectXhs'))?.click()");
        await new Promise(resolve => setTimeout(resolve, 6000));
        const external = BrowserWindow.getAllWindows().find(item => item !== win && item.isVisible());
        if (external) {
          const externalImage = await external.webContents.capturePage();
          fs.writeFileSync(process.env.STUDIO_SCREENSHOT.replace(/\.png$/i, "-xhs.png"), externalImage.toPNG());
        }
      }
      if (process.env.STUDIO_ACTION === "prepare-publish") {
        await win.webContents.executeJavaScript("document.querySelector('#approveBtn')?.click(); document.querySelector('#publishNow')?.click()");
        await new Promise(resolve => setTimeout(resolve, 10000));
        const publisher = BrowserWindow.getAllWindows().find(item => item !== win && item.isVisible());
        if (publisher) {
          const publisherImage = await publisher.webContents.capturePage();
          fs.writeFileSync(process.env.STUDIO_SCREENSHOT.replace(/\.png$/i, "-publisher.png"), publisherImage.toPNG());
        }
      }
      const targetSlide = Math.max(1, Number(process.env.STUDIO_SLIDE || 1));
      if (targetSlide > 1) {
        await win.webContents.executeJavaScript(`document.querySelector('#nextSlide').click();`.repeat(targetSlide - 1));
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      const image = await win.webContents.capturePage();
      fs.writeFileSync(process.env.STUDIO_SCREENSHOT, image.toPNG());
      app.quit();
    }, 1200);
  });
  win.loadFile(path.join(__dirname, "public", "index.html"));
}

app.whenReady().then(() => {
  registerXhsIntegration({ ipcMain, BrowserWindow, app });
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
