const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const STORAGE = {
  settings: "travelStudio.settings.v3",
  events: "travelStudio.events.v3",
  calendar: "travelStudio.calendar.v3",
  ownSnapshots: "travelStudio.ownSnapshots.v1",
  marketSnapshots: "travelStudio.marketSnapshots.v1"
};

const defaultSettings = {
  city: "成都",
  language: "英文为主 + 中文地名",
  audience: "第一次来中国、不会中文的自由行游客",
  tone: "友好、具体、像本地朋友",
  storyArc: "兴趣 → 行动 → 理解 → 保存",
  emojiLevel: "克制：每篇 2–5 个",
  planDuration: "3–5 小时 · 半日",
  planBudget: "¥80–150 / 人",
  planDifficulty: "Easy · 首次来华可执行",
  imageTapnow: true,
  imageApi: true,
  imageWeb: false,
  imageOfficial: false,
  imageProvider: "TapNow / Seedream 5 Pro",
  imageCount: "7",
  visualStyle: "Editorial travel poster, warm natural light, restrained red accent, cream paper texture, clean negative space for English typography, documentary realism, vertical 3:4",
  license: "仅使用可商用或明确授权素材",
  generateTime: "09:00",
  publishMode: "每天审核后发布",
  factCheck: true,
  duplicateCheck: true,
  aiLabel: true,
  tapnowEndpoint: "",
  tapnowModel: "seedream-5-pro",
  tapnowKey: ""
};

const draft = {
  title: "Your First 24 Hours in Chengdu — No Chinese Needed",
  topic: "Your First 24 Hours in Chengdu",
  body: `Chengdu is an easy city to love — but your first day feels much smoother with one compact route. Save this before you land. 🧭

08:30 · Start with breakfast near 文殊院 Wenshu Monastery
Order 红油抄手 (hóng yóu chāo shǒu), chilli-oil wontons. Point to the name if speaking feels awkward. Budget ¥15–25.

10:00 · Slow down at 人民公园 People's Park
Choose a riverside tea seat, order 盖碗茶, and watch the city settle into its morning rhythm. Tea usually costs ¥20–40; ask the price before sitting.

12:30 · Pick your lunch comfort level
Easy: a mall restaurant with photo menus. More local: a small noodle shop near 奎星楼街. Allow ¥30–60 per person.

14:00 · Walk, don't over-plan
Explore 宽窄巷子 for architecture, then leave the busiest lane for quieter side streets. The atmosphere matters more than checking every shop.

PLAN COORDINATES
⏱ 3–5 hours · door-to-door
¥ ¥80–150 per person · food + local metro
◎ Easy · one metro transfer, no advance booking

Reality check: opening hours and prices change. Recheck before departure. Would you choose the easiest route or the most local one?`,
  tags: ["#ChinaTravel", "#Chengdu", "#FirstTimeInChina", "#成都旅行", "#TravelChina"]
};

const slides = [
  `<div class="slide layout-cover photo-teahouse"><div class="cover-copy"><small>FIRST 24 HOURS · CHENGDU</small><h3>A soft landing in the tea-house city</h3><p>One calm route for your first day — with no Chinese required.</p><em>Save before you land ↗</em></div><div class="guide-footer"><b>CHINA, MADE DOABLE</b><span>01 / 07</span></div></div>`,
  `<div class="slide layout-paper"><small>PLAN AT A GLANCE</small><h3>Is this plan right for you?</h3><p class="intro">Designed for a first morning when your energy — and your Mandarin — may be limited.</p><div class="metric-grid"><div><b>3–5h</b><span>DOOR TO DOOR</span></div><div><b>¥80–150</b><span>PER PERSON</span></div><div><b>EASY</b><span>LOW FRICTION</span></div></div><p class="margin-note">1 metro transfer · no booking · photo-menu fallback</p><div class="guide-footer"><b>THE 3 COORDINATES</b><span>02 / 07</span></div></div>`,
  `<div class="slide layout-route"><small>YOUR HALF-DAY ROUTE</small><h3>Move gently, not quickly.</h3><div class="route-line"><div class="route-stop"><i>1</i><time>08:30</time><b>文殊院 · Wenshu Monastery</b><span>Breakfast · ¥15–25</span></div><div class="route-stop"><i>2</i><time>10:00</time><b>人民公园 · People's Park</b><span>Tea + people-watching · ¥20–40</span></div><div class="route-stop"><i>3</i><time>12:30</time><b>奎星楼街 · Kuixinglou St.</b><span>Lunch · ¥30–60</span></div></div><p class="route-note">Leave 30–45 min as a jet-lag and navigation buffer.</p><div class="guide-footer"><b>BEIJING TIME · UTC+8</b><span>03 / 07</span></div></div>`,
  `<div class="slide layout-photo photo-breakfast"><div class="photo-caption"><small>ORDER THIS FIRST</small><h3>红油抄手</h3><p>Chilli-oil wontons: silky, savoury and usually a little sweet beneath the heat.</p><em>Show the Chinese name · ¥15–25</em></div><div class="guide-footer"><b>LOCAL DETAIL, LOW STRESS</b><span>04 / 07</span></div></div>`,
  `<div class="slide layout-phrase"><small>ONE USEFUL SENTENCE</small><p class="intent">“Not too spicy, please.”</p><h3>不要太辣，谢谢</h3><p class="pinyin">BÚ YÀO TÀI LÀ, XIÈ XIE</p><div class="phrase-note">🌶️ “Not spicy” may still contain chilli oil in Chengdu. If you have an allergy, use a translated allergy card instead.</div><div class="guide-footer"><b>SAY IT · SHOW IT · SAVE IT</b><span>05 / 07</span></div></div>`,
  `<div class="slide layout-choice"><small>CHOOSE YOUR COMFORT LEVEL</small><h3>Easy or more local?</h3><div class="choice-grid"><div><span>LOWEST FRICTION</span><b>Mall lunch</b><p>Photo menus, indoor seating and predictable payment flow.</p></div><div><span>MORE LOCAL</span><b>Noodle shop</b><p>Point to a dish name, expect a faster pace and fewer English cues.</p></div></div><p class="choice-note">Both are valid. A good itinerary fits your energy, not someone else's checklist.</p><div class="guide-footer"><b>YOUR TRIP, YOUR SETTINGS</b><span>06 / 07</span></div></div>`,
  `<div class="slide layout-save"><small>SCREENSHOT THIS</small><h3>Your first-day pocket checklist</h3><div class="save-list"><p><i>01</i> Add Chinese place names to your map</p><p><i>02</i> Keep ¥80–150 available per person</p><p><i>03</i> Screenshot the food + phrase cards</p><p><i>04</i> Recheck hours before leaving</p></div><p class="next-note">Next guide: Chengdu in 24 hours — Easy, Balanced or Deep Dive?</p><div class="guide-footer"><b>@ CHINA TRAVEL STUDIO</b><span>07 / 07</span></div></div>`
];

let signals = [];
let ownSnapshots = [];
let marketSnapshots = [];

const weeklyThemes = [
  ["Arrival without panic", "Airport → city: easiest route", "支付失败的 B 计划", "First breakfast order card"],
  ["Food without fear", "Non-spicy Chengdu map", "How to order with screenshots", "Night market hygiene cues"],
  ["Navigation confidence", "Chinese map-name cheat sheet", "Metro vs taxi decision card", "One-transfer half-day route"],
  ["First-trip survival", "What needs booking?", "Public toilets & practical cues", "48-hour easy-mode itinerary"],
  ["City rhythm", "Tea-house etiquette", "Morning vs evening neighbourhoods", "A local-paced Sunday"],
  ["Smart choices", "Panda Base gate strategy", "Famous street alternatives", "Rainy-day route"],
  ["Culture decoded", "Temple etiquette in one card", "Why locals drink covered-bowl tea", "Useful phrases that sound human"],
  ["City confidence", "Solo dinner guide", "Last metro backup", "24 hours: balanced mode"],
  ["Local texture", "Markets worth an early start", "Small museums, big context", "Photogenic without the queue"],
  ["Neighbourhood depth", "One district, three budgets", "A slow afternoon route", "Independent shop etiquette"],
  ["Seasonal intelligence", "What the weather changes", "Festival crowd strategy", "Packing by lived scenario"],
  ["Deep-dive finale", "Easy / Balanced / Deep Dive", "What tourists usually miss", "Build-your-own Chengdu day"]
];

let currentSlide = 0;
let settings = { ...defaultSettings };
let capabilities = null;
let xhsConnected = false;
let loginPoll = null;

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[ch]));
}

function beijingParts(date = new Date()) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  }).format(date);
}

function beijingStamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  }).formatToParts(date).reduce((acc, item) => ({ ...acc, [item.type]: item.value }), {});
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+08:00`;
}

function startBeijingClock() {
  const update = () => {
    $("#beijingClock").textContent = beijingParts();
    $("#nextRun").textContent = `下次 ${settings.generateTime || "09:00"} 生成`;
  };
  update();
  setInterval(update, 1000);
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2400);
}

function track(name, properties = {}) {
  const events = JSON.parse(localStorage.getItem(STORAGE.events) || "[]");
  events.push({ event: name, occurred_at: beijingStamp(), timezone: "Asia/Shanghai", properties });
  localStorage.setItem(STORAGE.events, JSON.stringify(events.slice(-500)));
}

function loadSettings() {
  try { settings = { ...defaultSettings, ...JSON.parse(localStorage.getItem(STORAGE.settings) || "{}") }; }
  catch { settings = { ...defaultSettings }; }
  const form = $("#settingsForm");
  Object.entries(settings).forEach(([name, value]) => {
    const field = form.elements.namedItem(name);
    if (!field) return;
    if (field.type === "checkbox") field.checked = Boolean(value);
    else field.value = value;
  });
}

function saveSettings(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  settings = { ...settings };
  Object.keys(defaultSettings).forEach(key => {
    const field = event.currentTarget.elements.namedItem(key);
    settings[key] = field?.type === "checkbox" ? field.checked : (data.get(key) ?? settings[key]);
  });
  localStorage.setItem(STORAGE.settings, JSON.stringify(settings));
  $("#saveState").textContent = `已于 ${beijingParts()}（北京时间）保存`;
  $("#imageModeBadge").textContent = `${settings.tapnowModel || "Seedream 5 Pro"} · ${settings.imageCount}张`;
  track("settings_saved", { image_sources: enabledImageSources(), coordinates: [settings.planDuration, settings.planBudget, settings.planDifficulty] });
  toast("设置已保存在本机");
}

function enabledImageSources() {
  return [settings.imageTapnow && "tapnow", settings.imageApi && "api", settings.imageWeb && "licensed_web", settings.imageOfficial && "official"].filter(Boolean);
}

function renderDraft() {
  $("#topicTitle").textContent = draft.topic;
  $("#titleInput").value = draft.title;
  $("#bodyInput").value = draft.body;
  $("#tags").innerHTML = draft.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("");
  $("#generatedTime").textContent = `今天 ${new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date())} 生成 · 北京时间`;
  $("#slides").innerHTML = slides.join("");
  $("#dots").innerHTML = slides.map((_, index) => `<i class="${index === 0 ? "active" : ""}"></i>`).join("");
  $("#imageModeBadge").textContent = `${settings.tapnowModel || "Seedream 5 Pro"} · ${settings.imageCount}张`;
  showSlide(0);
}

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  $("#slides").style.transform = `translateX(-${currentSlide * 100}%)`;
  $$("#dots i").forEach((dot, idx) => dot.classList.toggle("active", idx === currentSlide));
  $("#slideCounter").textContent = `${currentSlide + 1} / ${slides.length}`;
  track("swipe_depth", { slide: currentSlide + 1 });
}

function renderQueue() {
  const list = $("#queueList");
  list.innerHTML = `<div class="queue-item"><div><h3>${escapeHtml(draft.title)}</h3><small>成都 · 7张图 · ${escapeHtml(settings.planDuration)} · ${escapeHtml(settings.planBudget)} · ${escapeHtml(settings.planDifficulty)}</small></div><button class="primary queue-review">开始审核</button></div>`;
  $("#queueCount").textContent = "1";
  $(".queue-review", list).addEventListener("click", () => switchView("today"));
}

function startOfBeijingDay() {
  const now = new Date();
  const text = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  return new Date(`${text}T00:00:00+08:00`);
}

function renderCalendar() {
  const days = Number($("#calendarHorizon").value || 84);
  const weekCount = days / 7;
  const base = startOfBeijingDay();
  const dateFmt = new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", month: "short", day: "numeric" });
  const phases = [
    ["W1–4", "First-trip survival", "解决落地、支付、点餐、导航"],
    ["W5–8", "City confidence", "帮读者从会走变成会选择"],
    ["W9–12", "Local depth", "用文化理解与街区深挖建立辨识度"]
  ];
  $("#quarterRoadmap").innerHTML = phases.slice(0, Math.ceil(weekCount / 4)).map((p, i) => `<div class="phase phase-${i + 1}"><span>${p[0]}</span><b>${p[1]}</b><small>${p[2]}</small></div>`).join("");
  $("#calendarGrid").innerHTML = weeklyThemes.slice(0, weekCount).map((week, idx) => {
    const begin = new Date(base.getTime() + idx * 7 * 86400000);
    const end = new Date(begin.getTime() + 6 * 86400000);
    const modes = ["Easy", "Balanced", "Deep Dive"];
    return `<article class="week-card"><div class="week-head"><span>W${String(idx + 1).padStart(2, "0")}</span><small>${dateFmt.format(begin)}—${dateFmt.format(end)}</small></div><h3>${week[0]}</h3>${week.slice(1).map((topic, postIdx) => `<div class="calendar-post"><i>${["TUE", "THU", "SAT"][postIdx]}</i><div><b>${topic}</b><small>${modes[postIdx]} · ${postIdx === 0 ? "3–5h" : postIdx === 1 ? "¥80–200" : "执行对比"}</small></div></div>`).join("")}</article>`;
  }).join("");
}

function renderDiscovery(items = signals) {
  $("#signalCount").textContent = `${items.length} 条`;
  if (!items.length) {
    $("#signalList").innerHTML = `<div class="empty-state">没有缓存或样例数据。运行“同步真实需求”后，这里只显示实际读取到的公开内容。</div>`;
    return;
  }
  $("#signalList").innerHTML = items.map((item, index) => `<article class="signal-card" data-index="${index}"><div class="signal-score"><strong>${item.publicEngagement == null ? "—" : escapeHtml(formatCount(item.publicEngagement))}</strong><small>公开互动</small></div><div class="signal-copy"><div><span class="source-pill">${escapeHtml(item.keyword || "小红书公开搜索")}</span><span class="coord-pill">真实采集</span></div><h3>${escapeHtml(item.title || "未识别标题")}</h3><p>${escapeHtml(item.rawText || "")}</p><div class="mini-scores"><span>${escapeHtml(formatBeijingTime(item.capturedAt))}</span><span>指标缺失时不推测</span></div></div><button class="ghost add-signal">加入日历</button></article>`).join("");
}

function renderAnalytics() {
  const latest = ownSnapshots.at(-1);
  const pairs = latest ? metricPairs(latest.metrics || []) : [];
  $("#metricCards").innerHTML = pairs.length ? pairs.slice(0, 4).map(item => `<div class="metric-card"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.display)}</strong><em>平台实时可见值</em></div>`).join("") : `<div class="section-card empty-state metric-empty">尚无真实账号数据。登录后点击“即时同步”。</div>`;
  if (latest) {
    $("#analyticsCapturedAt").textContent = `最近同步：${formatBeijingTime(latest.capturedAt)}`;
    $("#ownDataState").textContent = `${pairs.length} 个可解析指标`;
  }
  const key = pairs[0]?.label;
  const series = key ? ownSnapshots.map(snapshot => ({ at: snapshot.capturedAt, pair: metricPairs(snapshot.metrics || []).find(item => item.label === key) })).filter(item => item.pair?.value != null) : [];
  if (series.length) {
    const max = Math.max(...series.map(item => item.pair.value), 1);
    $("#trendChart").classList.remove("empty-chart");
    $("#trendChart").innerHTML = series.slice(-12).map(item => `<div><i data-height="${Math.max(5, item.pair.value / max * 100)}"></i><span>${new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(item.at))}</span></div>`).join("");
    $$("#trendChart i").forEach(bar => bar.style.setProperty("--bar", `${bar.dataset.height}%`));
  } else {
    $("#trendChart").classList.add("empty-chart");
    $("#trendChart").innerHTML = `<div class="empty-state">至少完成一次真实同步后生成趋势；不会填充样例曲线。</div>`;
  }
  if (pairs.length) {
    const max = Math.max(...pairs.slice(0, 6).map(item => item.value || 0), 1);
    $("#funnelChart").classList.remove("empty-chart");
    $("#funnelChart").innerHTML = pairs.slice(0, 6).map(item => `<div data-width="${Math.max(30, (item.value || 0) / max * 100)}"><span>${escapeHtml(item.label)}</span><b>${escapeHtml(item.display)}</b></div>`).join("");
    $$("#funnelChart > div").forEach(row => row.style.setProperty("--funnel", `${row.dataset.width}%`));
  } else $("#funnelChart").innerHTML = `<div class="empty-state">等待创作中心返回可见指标。</div>`;
  $("#dimensionTable").innerHTML = realRecommendations();
  const names = ["topic_signal_captured", "draft_generated", "image_generated", "review_started", "revision_saved", "approved", "publish_opened", "metrics_imported", "swipe_depth", "save", "comment_intent", "follow_from_post"];
  $("#eventSchema").innerHTML = names.map(name => `<span>${name}</span>`).join("");
  renderMarketData();
}

function formatCount(value) {
  if (value >= 10000) return `${(value / 10000).toFixed(value >= 100000 ? 0 : 1)}万`;
  return new Intl.NumberFormat("zh-CN").format(value);
}

function formatBeijingTime(value) {
  if (!value) return "时间未知";
  return `${new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value))} 北京时间`;
}

function metricPairs(lines) {
  const words = "曝光|阅读|观看|浏览|点赞|收藏|评论|分享|互动|涨粉|粉丝|点击率|完播率";
  const result = [];
  lines.forEach(line => {
    const label = String(line).match(new RegExp(words))?.[0];
    const match = String(line).match(/(\d+(?:\.\d+)?)\s*(万|w|%|k)?/i);
    if (!label || !match) return;
    const unit = (match[2] || "").toLowerCase();
    const value = Number(match[1]) * (unit === "万" || unit === "w" ? 10000 : unit === "k" ? 1000 : 1);
    if (!result.some(item => item.label === label)) result.push({ label, value, display: match[0] });
  });
  return result;
}

function realRecommendations() {
  if (ownSnapshots.length < 2) return `<div class="empty-state">需要至少两次真实快照才能比较变化并给出微调建议。</div>`;
  const previous = metricPairs(ownSnapshots.at(-2).metrics || []);
  const latest = metricPairs(ownSnapshots.at(-1).metrics || []);
  const changes = latest.map(item => {
    const before = previous.find(old => old.label === item.label);
    return before && before.value ? { ...item, delta: (item.value - before.value) / before.value } : null;
  }).filter(Boolean).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  if (!changes.length) return `<div class="empty-state">两次快照暂时没有可比较的同名指标。</div>`;
  return changes.slice(0, 4).map(item => `<article><b>${escapeHtml(item.label)} ${item.delta >= 0 ? "上升" : "下降"} ${Math.abs(item.delta * 100).toFixed(1)}%</b><p>${item.delta >= 0 ? "保留当前封面与信息密度，下一篇只改变一个变量用于验证。" : "下一篇优先测试更明确的时长、预算、难度承诺，并保持其他变量不变。"}</p></article>`).join("");
}

function renderMarketData() {
  const latest = marketSnapshots.at(-1);
  const items = latest?.items || [];
  $("#marketCount").textContent = `${items.length} 条`;
  $("#marketStatus").textContent = latest ? `真实采集于 ${formatBeijingTime(latest.capturedAt)}；关键词：${latest.keywords.join("、")}` : "尚未采集真实公开数据。";
  $("#marketTable").innerHTML = items.length ? `<table><thead><tr><th>关键词</th><th>公开标题</th><th>公开互动</th></tr></thead><tbody>${items.map(item => `<tr><td>${escapeHtml(item.keyword)}</td><td>${escapeHtml(item.title || "未识别")}</td><td>${item.publicEngagement == null ? "平台未显示" : escapeHtml(formatCount(item.publicEngagement))}</td></tr>`).join("")}</tbody></table>` : `<div class="empty-state">没有缓存或样例内容。</div>`;
}

function statusCard(name, detail, available, priority) {
  return `<article class="capability-card ${available ? "available" : "missing"}"><div><span>${priority}</span><i>${available ? "已检测" : "未配置"}</i></div><h3>${escapeHtml(name)}</h3><p>${escapeHtml(detail)}</p></article>`;
}

async function refreshCapabilities() {
  $("#capabilityGrid").innerHTML = `<div class="loading-card">正在检测本地终端与图像服务…</div>`;
  if (!window.studio?.getCapabilities) {
    $("#capabilityGrid").innerHTML = statusCard("浏览器预览", "桌面运行时未连接，请从本地 App 打开。", false, "PREVIEW");
    return;
  }
  try {
    capabilities = await window.studio.getCapabilities();
    const content = capabilities.content || {};
    const image = capabilities.image || {};
    $("#capabilityGrid").innerHTML = [
      statusCard("Codex CLI", content.codex?.detail || content.codex?.path || "首选内容引擎", Boolean(content.codex?.available), "CONTENT · P1"),
      statusCard("TapNow / Seedream", image.tapnow?.detail || "首选图像引擎", Boolean(image.tapnow?.available), "IMAGE · P1"),
      statusCard("DeepSeek", content.deepseek?.detail || "API 或命令行回退", Boolean(content.deepseek?.available), "CONTENT · P2"),
      statusCard("Ollama / LM Studio", content.ollama?.available || content.lmstudio?.available ? "本地模型服务可用" : "可选本地回退", Boolean(content.ollama?.available || content.lmstudio?.available), "CONTENT · P3")
    ].join("");
    track("capability_scan", { codex: Boolean(content.codex?.available), tapnow: Boolean(image.tapnow?.available) });
  } catch (error) {
    $("#capabilityGrid").innerHTML = statusCard("检测失败", error.message, false, "ERROR");
  }
}

async function renderSkills() {
  const host = $("#skillAssembly");
  if (!window.studio?.getSkills) {
    host.innerHTML = `<label><input type="checkbox" checked><span><b>China Inbound Travel Editorial</b><small>核心导览内容 Skill</small></span></label>`;
    return;
  }
  try {
    const result = await window.studio.getSkills();
    const skills = Array.isArray(result) ? result : (result.skills || []);
    host.innerHTML = skills.map(skill => {
      const id = skill.name || skill.id || "skill";
      const checked = id.includes("china-inbound") || id === "imagegen";
      return `<label><input type="checkbox" value="${escapeHtml(id)}" ${checked ? "checked" : ""}><span><b>${escapeHtml(id)}</b><small>${escapeHtml(skill.description || skill.scope || "本地 Skill")}</small></span></label>`;
    }).join("") || `<p class="muted">没有检测到可装配 Skill。</p>`;
  } catch (error) {
    host.innerHTML = `<p class="muted">Skill 读取失败：${escapeHtml(error.message)}</p>`;
  }
}

function switchView(name) {
  if (name !== "connect" && !xhsConnected) {
    name = "connect";
    toast("请先连接小红书账号");
  }
  const titles = { connect: "连接小红书", today: "今日草稿", queue: "审核队列", discovery: "需求雷达", calendar: "内容日历", analytics: "数据分析", agent: "Agent装配", settings: "自动化设置" };
  $$(".view").forEach(view => view.classList.remove("active"));
  $$(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.view === name));
  $(`#${name}View`)?.classList.add("active");
  $("#viewTitle").textContent = titles[name] || "旅图工坊";
  $(".header-actions").hidden = name !== "today";
  if (name === "agent") { refreshCapabilities(); renderSkills(); }
  if (name === "analytics") renderAnalytics();
  track("view_opened", { view: name });
}

async function checkXhsStatus() {
  if (!window.studio?.getXhsStatus) return { connected: false };
  try {
    const status = await window.studio.getXhsStatus();
    xhsConnected = Boolean(status.connected);
    $("#xhsStatus").textContent = status.connected ? "小红书已连接" : "小红书未连接";
    $("#xhsStatus").classList.toggle("connected", Boolean(status.connected));
    $$(".workspace-nav").forEach(item => { item.disabled = !xhsConnected; });
    const home = $("#homeLoginStatus");
    home.classList.toggle("connected", xhsConnected); home.classList.remove("error");
    $("b", home).textContent = xhsConnected ? "小红书账号已连接" : "尚未连接小红书";
    $("small", home).textContent = xhsConnected ? "真实数据读取与发布准备已解锁" : "点击下方按钮打开官方登录窗口";
    $("#homeConnectXhs").textContent = xhsConnected ? "进入内容工作台" : "连接小红书创作服务平台";
    $("#homeLoginError").textContent = "";
    return status;
  } catch (error) {
    xhsConnected = false;
    $("#xhsStatus").textContent = "连接状态未知";
    const home = $("#homeLoginStatus"); home.classList.add("error");
    $("b", home).textContent = "连接检查失败";
    $("#homeLoginError").textContent = error.message || "无法检查小红书状态";
    return { connected: false };
  }
}

async function startXhsLogin(button) {
  if (xhsConnected) { switchView("today"); return; }
  if (!window.studio?.openXhsLogin) {
    $("#homeLoginError").textContent = "当前不是桌面 App 运行环境。"; return;
  }
  const original = button.textContent;
  button.disabled = true; button.textContent = "正在打开官方登录窗口…";
  $("#homeLoginError").textContent = "";
  try {
    const result = await window.studio.openXhsLogin();
    if (!result?.opened) throw new Error(result?.error || "登录窗口未能打开");
    button.textContent = "等待你完成登录…";
    toast("小红书登录窗口已打开；若未看到，请查看任务栏");
    clearInterval(loginPoll);
    loginPoll = setInterval(async () => {
      const status = await checkXhsStatus();
      if (status.connected) {
        clearInterval(loginPoll); loginPoll = null;
        button.disabled = false;
        toast("连接成功，工作台已解锁");
        switchView("today");
        syncOwnData();
      }
    }, 2500);
  } catch (error) {
    button.disabled = false; button.textContent = original;
    $("#homeLoginError").textContent = `打开失败：${error.message}`;
    $("#homeLoginStatus").classList.add("error");
  }
}

async function syncOwnData() {
  if (!window.studio?.readOwnData) return toast("请使用桌面 App 连接小红书");
  const button = $("#refreshOwnData");
  button.disabled = true; button.textContent = "正在读取…";
  try {
    const result = await window.studio.readOwnData();
    if (!result.connected) {
      toast("已打开小红书登录窗口，请完成登录后再次同步");
      await checkXhsStatus(); return;
    }
    ownSnapshots.push(result); ownSnapshots = ownSnapshots.slice(-48);
    localStorage.setItem(STORAGE.ownSnapshots, JSON.stringify(ownSnapshots));
    track("metrics_synced", { source: "xhs_creator", metric_lines: result.metrics?.length || 0, rows: result.rows?.length || 0 });
    renderAnalytics(); await checkXhsStatus(); toast("已保存真实账号数据快照");
  } catch (error) { toast(`同步失败：${error.message}`); }
  finally { button.disabled = false; button.textContent = "即时同步"; }
}

async function scanMarketData() {
  if (!window.studio?.scanMarket) return toast("请使用桌面 App 读取公开数据");
  const keywords = $("#marketKeywords").value.split(/[,，\n]/).map(v => v.trim()).filter(Boolean).slice(0, 5);
  if (!keywords.length) return toast("请先填写至少一个监测关键词");
  const button = $("#scanMarket");
  button.disabled = true; button.textContent = "正在读取公开页面…";
  try {
    const response = await window.studio.scanMarket({ keywords });
    const needsLogin = response.results?.some(item => item.needsLogin);
    const items = (response.results || []).flatMap(group => (group.items || []).map(item => ({ ...item, keyword: group.keyword, capturedAt: group.capturedAt || response.capturedAt })));
    if (needsLogin && !items.length) { toast("公开页面要求登录，已打开小红书登录窗口"); return null; }
    const snapshot = { capturedAt: response.capturedAt, keywords, items };
    marketSnapshots.push(snapshot); marketSnapshots = marketSnapshots.slice(-24);
    localStorage.setItem(STORAGE.marketSnapshots, JSON.stringify(marketSnapshots));
    signals = items;
    renderMarketData(); renderDiscovery();
    $("#signalState").textContent = `最近真实采集：${formatBeijingTime(response.capturedAt)}`;
    track("market_data_synced", { keywords, count: items.length });
    toast(`已读取 ${items.length} 条公开内容`);
    return snapshot;
  } catch (error) { toast(`读取失败：${error.message}`); return null; }
  finally { button.disabled = false; button.textContent = "读取公开数据"; }
}

async function mineSignals() {
  const button = $("#mineSignals");
  button.disabled = true;
  button.textContent = "正在同步真实需求…";
  const result = await scanMarketData();
  button.disabled = false; button.textContent = "同步真实需求";
  if (result) track("topic_signal_captured", { count: result.items.length, source: "xhs_public_search" });
}

function exportEvents() {
  const payload = { timezone: "Asia/Shanghai", exported_at: beijingStamp(), events: JSON.parse(localStorage.getItem(STORAGE.events) || "[]") };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `travel-studio-events-${beijingStamp().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function runAgentTest() {
  const log = $("#agentLog");
  const model = $("#agentModel").value;
  const effort = $("#reasoningEffort").value;
  const skills = $$("#skillAssembly input:checked").map(input => input.value);
  const imageTools = $$("#imageToolChecks input:checked").map(input => input.value);
  log.textContent = "正在验证本地运行时…";
  if (!window.studio?.testCodex) {
    log.textContent = "浏览器预览模式：请打开打包后的桌面 App 执行本地能力测试。";
    return;
  }
  try {
    const result = await window.studio.testCodex({ model, effort, skills, imageTools });
    log.textContent = `${result.ok ? "✓" : "!"} ${result.message || "检测完成"}\n\n${result.output || ""}\n\n${result.command || result.preview || ""}`.trim();
    track("agent_capability_test", { model, effort, skills, imageTools, ok: Boolean(result.ok) });
  } catch (error) { log.textContent = `检测失败：${error.message}`; }
}

function bindEvents() {
  $("#nav").addEventListener("click", event => {
    const item = event.target.closest("[data-view]");
    if (item) switchView(item.dataset.view);
  });
  $("#prevSlide").addEventListener("click", () => showSlide(currentSlide - 1));
  $("#nextSlide").addEventListener("click", () => showSlide(currentSlide + 1));
  $("#settingsForm").addEventListener("submit", saveSettings);
  $("#calendarHorizon").addEventListener("change", renderCalendar);
  $("#refreshPlan").addEventListener("click", () => { renderCalendar(); track("calendar_regenerated", { days: $("#calendarHorizon").value }); toast("未来内容路线已重新规划"); });
  $("#mineSignals").addEventListener("click", mineSignals);
  $("#signalList").addEventListener("click", event => {
    const button = event.target.closest(".add-signal");
    if (!button) return;
    const card = button.closest(".signal-card");
    const item = signals[Number(card.dataset.index)] || signals[0];
    track("topic_added_to_calendar", { title: item.title, public_engagement: item.publicEngagement, source_keyword: item.keyword });
    button.textContent = "已加入"; button.disabled = true; toast("选题已加入待排期池");
  });
  $("#refreshCapabilities").addEventListener("click", refreshCapabilities);
  $("#openSkillFolder").addEventListener("click", async () => { if (window.studio?.openSkillFolder) await window.studio.openSkillFolder(); else toast("请在桌面 App 中打开 Skill 目录"); });
  $("#runAgentTest").addEventListener("click", runAgentTest);
  $("#connectXhs").addEventListener("click", event => startXhsLogin(event.currentTarget));
  $("#homeConnectXhs").addEventListener("click", event => startXhsLogin(event.currentTarget));
  $("#homeCheckXhs").addEventListener("click", async event => { event.currentTarget.disabled = true; const status = await checkXhsStatus(); event.currentTarget.disabled = false; if (status.connected) switchView("today"); else toast("仍未检测到登录，请完成官方窗口中的登录"); });
  $("#refreshOwnData").addEventListener("click", syncOwnData);
  $("#scanMarket").addEventListener("click", scanMarketData);
  $(".analysis-switch").addEventListener("click", event => {
    const button = event.target.closest("[data-analysis]"); if (!button) return;
    $$(".analysis-switch button").forEach(item => item.classList.toggle("active", item === button));
    $("#ownAnalysis").classList.toggle("active", button.dataset.analysis === "own");
    $("#marketAnalysis").classList.toggle("active", button.dataset.analysis === "market");
  });
  $("#exportEvents").addEventListener("click", exportEvents);
  $("#approveBtn").addEventListener("click", () => { track("approved", { title: draft.title }); $("#publishDialog").showModal(); });
  $("#publishNow").addEventListener("click", async event => {
    event.preventDefault();
    $("#publishDialog").close();
    track("publish_preparation_started", { platform: "xiaohongshu" });
    if (!window.studio?.prepareXhsPublish) return toast("请使用桌面 App 准备发布");
    const rect = $(".phone").getBoundingClientRect();
    const rawTitle = $("#titleInput").value.trim();
    const publishTitle = Array.from(rawTitle).slice(0, 20).join("");
    const body = `${$("#bodyInput").value.trim()}\n\n${draft.tags.join(" ")}`;
    toast("正在导出7张卡片并准备小红书发布页…");
    try {
      const result = await window.studio.prepareXhsPublish({ title: publishTitle, body, rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, count: slides.length });
      track("publish_ready", { images: result.files?.length || 0, final_click_required: true, title_truncated: publishTitle !== rawTitle });
      toast(result.needsLogin ? "请先登录，登录成功后会自动继续填充" : result.ready ? "发布页已全部填好，请检查后点击平台发布按钮" : (result.error || "发布页已打开，请检查填充状态"));
    } catch (error) { toast(`发布准备失败：${error.message}`); }
  });
  $("#generateBtn").addEventListener("click", () => { track("draft_generated", { trigger: "manual" }); toast("已按核心 Skill 重新生成草稿结构"); });
  $("#regenerateImages").addEventListener("click", () => {
    const tapnowReady = Boolean(capabilities?.image?.tapnow?.available || settings.tapnowEndpoint);
    track("image_generated", { sources: enabledImageSources(), tapnow_ready: tapnowReady });
    toast(tapnowReady ? "已创建 TapNow 优先的多源生图任务" : "TapNow 尚未连接，将按 API → 授权图源回退");
  });
  $("#editTopicBtn").addEventListener("click", () => { switchView("discovery"); toast("从需求信号中选择下一篇选题"); });
  $("#titleInput").addEventListener("change", event => { draft.title = event.target.value; track("revision_saved", { field: "title" }); });
  $("#bodyInput").addEventListener("change", event => { draft.body = event.target.value; track("revision_saved", { field: "body" }); });
}

function init() {
  try { ownSnapshots = JSON.parse(localStorage.getItem(STORAGE.ownSnapshots) || "[]"); } catch { ownSnapshots = []; }
  try { marketSnapshots = JSON.parse(localStorage.getItem(STORAGE.marketSnapshots) || "[]"); } catch { marketSnapshots = []; }
  signals = marketSnapshots.at(-1)?.items || [];
  loadSettings();
  renderDraft();
  renderQueue();
  renderCalendar();
  renderDiscovery();
  renderAnalytics();
  bindEvents();
  startBeijingClock();
  window.__studioShowSlide = showSlide;
  $$(".workspace-nav").forEach(item => { item.disabled = true; });
  checkXhsStatus().then(status => { if (status.connected) { switchView("today"); syncOwnData(); scanMarketData(); } else switchView("connect"); });
  setInterval(async () => { if (!document.hidden && (await checkXhsStatus()).connected) syncOwnData(); }, 5 * 60 * 1000);
  setInterval(async () => { if (!document.hidden && (await checkXhsStatus()).connected) scanMarketData(); }, 30 * 60 * 1000);
  refreshCapabilities();
  renderSkills();
  track("app_opened", { version: "0.5.0" });
}

document.addEventListener("DOMContentLoaded", init);
