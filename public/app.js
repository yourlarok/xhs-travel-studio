const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const STORAGE = {
  settings: "travelStudio.settings.v3",
  events: "travelStudio.events.v3",
  calendar: "travelStudio.calendar.v3",
  ownSnapshots: "travelStudio.ownSnapshots.v1",
  marketSnapshots: "travelStudio.marketSnapshots.v1",
  researchSnapshots: "travelStudio.researchSnapshots.v1",
  comments: "travelStudio.comments.v1",
  productionArtifact: "travelStudio.productionArtifact.v1",
  pipelinePrefs: "travelStudio.pipelinePrefs.v1"
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

let draft = {
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

let slides = [
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
let researchSnapshots = [];
let commentRecords = [];

let generatedCalendar = [];
let productionArtifact = null;
let currentPipelineRunId = null;
let pipelineStageState = {};
const PIPELINE_STAGES = [
  ["research", "真实采集"], ["evidence", "证据包"], ["content", "日历与内容"],
  ["images", "图片生成"], ["quality", "质量门禁"], ["review", "审核队列"]
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

function localImageUrl(filePath) {
  if (!filePath) return "";
  return encodeURI(`file:///${String(filePath).replace(/\\/g, "/")}`);
}

function buildProductionSlides(artifact) {
  const imageMap = new Map((artifact.generated_images || []).map(item => [Number(item.page), localImageUrl(item.path)]));
  return (artifact.article.cards || []).map((card, index) => {
    const image = imageMap.get(Number(card.page));
    const facts = (card.facts || []).slice(0, 4).map((fact, factIndex) => `<p><i>${String(factIndex + 1).padStart(2, "0")}</i>${escapeHtml(fact)}</p>`).join("");
    const imageStyle = image ? ` style="background-image:linear-gradient(180deg,rgba(20,28,23,.08),rgba(20,28,23,.72)),url('${image}')"` : "";
    const cls = image ? "slide layout-photo production-photo" : index === 1 ? "slide layout-paper" : index === 2 ? "slide layout-route" : "slide layout-save";
    return `<div class="${cls}"${imageStyle}><small>${escapeHtml(card.eyebrow)}</small><h3>${escapeHtml(card.headline)}</h3><p class="intro">${escapeHtml(card.subhead)}</p><div class="save-list">${facts}</div><div class="guide-footer"><b>${escapeHtml(card.role.toUpperCase())}</b><span>${String(index + 1).padStart(2, "0")} / ${String(artifact.article.cards.length).padStart(2, "0")}</span></div></div>`;
  });
}

function applyProductionArtifact(artifact, persist = true) {
  if (!artifact?.article) return;
  productionArtifact = artifact;
  generatedCalendar = Array.isArray(artifact.calendar) ? artifact.calendar : [];
  draft = {
    production: true,
    title: artifact.article.title,
    topic: artifact.article.topic,
    body: artifact.article.caption,
    tags: artifact.article.tags || [],
    series: artifact.article.series || "DATA-LED GUIDE",
    coordinates: artifact.article.coordinates,
    quality: artifact.article.quality
  };
  slides = buildProductionSlides(artifact);
  if (persist) localStorage.setItem(STORAGE.productionArtifact, JSON.stringify(artifact));
  renderDraft(); renderQueue(); renderCalendar();
}

function renderDraft() {
  if (!draft.production) {
    $("#todayStatus").textContent = "尚未生产";
    $("#todayStatus").className = "status status-neutral";
    $("#todayReadiness").textContent = "等待真实数据与证据";
    $("#topicScore").textContent = "未评分";
    $("#topicTitle").textContent = "等待生产链路";
    $("#titleInput").value = ""; $("#bodyInput").value = ""; $("#tags").innerHTML = "";
    $("#seriesLabel").textContent = "NO PRODUCTION ARTIFACT";
    $("#slides").innerHTML = `<div class="slide layout-paper"><small>PRODUCTION CENTER</small><h3>Run the evidence pipeline first.</h3><p class="intro">Research, calendar, copy and images will appear here only after a real run.</p><div class="guide-footer"><b>NO MOCK CONTENT</b><span>—</span></div></div>`;
    $("#dots").innerHTML = "<i class=\"active\"></i>"; $("#slideCounter").textContent = "0 / 0";
    $("#generatedTime").textContent = "尚无真实生产结果"; return;
  }
  $("#topicTitle").textContent = draft.topic;
  $("#todayStatus").textContent = draft.quality?.ready_for_review ? "等待审核" : "需处理";
  $("#todayStatus").className = `status ${draft.quality?.ready_for_review ? "" : "status-warning"}`;
  $("#todayReadiness").textContent = draft.quality?.ready_for_review ? "证据与图片达到审核门槛" : (draft.quality?.warnings?.[0] || "存在未解决质量问题");
  $("#topicScore").textContent = draft.quality?.score != null ? `质量分 ${draft.quality.score}` : "未评分";
  $("#seriesLabel").textContent = draft.series || "DATA-LED GUIDE";
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
  if (!draft.production) { list.innerHTML = `<div class="empty-state">生产链路尚未生成可审核内容。</div>`; $("#queueCount").textContent = "0"; return; }
  const coords = draft.coordinates || {};
  list.innerHTML = `<div class="queue-item"><div><h3>${escapeHtml(draft.title)}</h3><small>${escapeHtml(settings.city)} · ${slides.length}张图 · ${escapeHtml(coords.duration || "未评分")} · ${escapeHtml(coords.budget || "未评分")} · ${escapeHtml(coords.difficulty || "未评分")} · 质量分 ${draft.quality?.score ?? "—"}</small></div><button class="primary queue-review">开始审核</button></div>`;
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
  if (!generatedCalendar.length) {
    $("#quarterRoadmap").innerHTML = "";
    $("#calendarGrid").innerHTML = `<div class="empty-state">尚无数据驱动的内容日历。请在“链路执行中心”运行完整链路。</div>`;
    return;
  }
  $("#calendarGrid").innerHTML = generatedCalendar.slice(0, weekCount).map((week, idx) => {
    const begin = new Date(base.getTime() + idx * 7 * 86400000);
    const end = new Date(begin.getTime() + 6 * 86400000);
    return `<article class="week-card"><div class="week-head"><span>W${String(idx + 1).padStart(2, "0")}</span><small>${dateFmt.format(begin)}—${dateFmt.format(end)}</small></div><h3>${escapeHtml(week.theme)}</h3>${(week.posts || []).map((post, postIdx) => `<div class="calendar-post"><i>${["TUE", "THU", "SAT"][postIdx] || "POST"}</i><div><b>${escapeHtml(post.title)}</b><small>${escapeHtml(post.duration)} · ${escapeHtml(post.budget)} · ${escapeHtml(post.difficulty)}</small></div></div>`).join("")}</article>`;
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
  const accessibleWithoutXhs = new Set(["pipeline", "agent", "settings"]);
  if (name !== "connect" && !xhsConnected && !accessibleWithoutXhs.has(name)) {
    name = "connect";
    toast("请先连接小红书账号");
  }
  const titles = { connect: "连接小红书", today: "今日草稿", queue: "审核队列", pipeline: "链路执行中心", discovery: "需求雷达", calendar: "内容日历", analytics: "数据分析", comments: "评论运营", growth: "成长实验室", agent: "Agent装配", settings: "自动化设置" };
  $$(".view").forEach(view => view.classList.remove("active"));
  $$(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.view === name));
  $(`#${name}View`)?.classList.add("active");
  $("#viewTitle").textContent = titles[name] || "旅图工坊";
  $(".header-actions").hidden = name !== "today";
  if (name === "agent") { refreshCapabilities(); renderSkills(); }
  if (name === "analytics") renderAnalytics();
  if (name === "comments") renderComments();
  if (name === "growth") { renderContentScores(); auditSkillGroup(); }
  if (name === "pipeline") loadPipelineHistory();
  track("view_opened", { view: name });
}

async function checkXhsStatus() {
  if (!window.studio?.getXhsStatus) return { connected: false };
  try {
    const status = await window.studio.getXhsStatus();
    xhsConnected = Boolean(status.connected);
    $("#xhsStatus").textContent = status.connected ? "小红书已连接" : "小红书未连接";
    $("#xhsStatus").classList.toggle("connected", Boolean(status.connected));
    $$(".workspace-nav").forEach(item => { item.disabled = !xhsConnected && !accessibleViewWithoutXhs(item.dataset.view); });
    const home = $("#homeLoginStatus");
    home.classList.toggle("connected", xhsConnected); home.classList.remove("error");
    $("b", home).textContent = xhsConnected ? "小红书账号已连接" : "尚未连接小红书";
    $("small", home).textContent = xhsConnected ? "真实数据读取与发布准备已解锁" : "点击下方按钮打开官方登录窗口";
    $("#homeConnectXhs").textContent = xhsConnected ? "进入内容工作台" : "连接小红书创作服务平台";
    $("#homeLoginError").textContent = "";
    return status;
  } catch (error) {
    xhsConnected = false;
    $$(".workspace-nav").forEach(item => { item.disabled = !accessibleViewWithoutXhs(item.dataset.view); });
    $("#xhsStatus").textContent = "连接状态未知";
    const home = $("#homeLoginStatus"); home.classList.add("error");
    $("b", home).textContent = "连接检查失败";
    $("#homeLoginError").textContent = error.message || "无法检查小红书状态";
    return { connected: false };
  }
}

function accessibleViewWithoutXhs(view) {
  return ["pipeline", "agent", "settings"].includes(view);
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

function buildResearchQueries(seeds, limit) {
  const city = settings.city || "成都";
  const moments = ["地铁怎么走", "需要多久", "人均多少钱", "第一次去难不难", "附近吃什么", "预约和排队", "外国游客注意事项", "替代路线"];
  const base = [...new Set([city, ...seeds])];
  const queries = [];
  for (const place of base) for (const moment of moments) queries.push(`${place} ${moment}`);
  return queries.slice(0, limit);
}

function pipelineLog(message, status = "info") {
  const host = $("#pipelineLog"); if (!host) return;
  const line = `[${beijingParts()}] [${status.toUpperCase()}] ${message}`;
  host.textContent = host.textContent === "等待运行…" ? line : `${host.textContent}\n${line}`;
  host.scrollTop = host.scrollHeight;
}

function renderPipelineStages() {
  const completed = PIPELINE_STAGES.filter(([id]) => ["complete", "warning", "skipped"].includes(pipelineStageState[id]?.status)).length;
  const failed = Object.values(pipelineStageState).some(item => ["failed", "cancelled"].includes(item.status));
  const percent = Math.round(completed / PIPELINE_STAGES.length * 100);
  $("#pipelineStages").innerHTML = PIPELINE_STAGES.map(([id,label],index) => {
    const state = pipelineStageState[id] || { status: "waiting", message: "等待上游阶段" };
    const icon = state.status === "complete" ? "✓" : state.status === "running" ? "…" : state.status === "warning" || state.status === "skipped" ? "!" : state.status === "failed" ? "×" : String(index + 1);
    const statusLabel = { waiting: "等待", running: "运行中", complete: "完成", warning: "警告", skipped: "跳过", failed: "失败", cancelled: "已停止" }[state.status] || state.status;
    return `<div class="pipeline-stage ${state.status}"><i>${icon}</i><b>${label}</b><span>${escapeHtml(state.message)}</span><small>${statusLabel}</small></div>`;
  }).join("");
  $("#pipelinePercent").textContent = `${percent}%`;
  $("#pipelineBar").style.setProperty("--progress", `${percent}%`);
}

function renderPipelineReadiness() {
  const content = capabilities?.content || {};
  const image = capabilities?.image || {};
  const checks = [
    ["xhs", "小红书会话", xhsConnected, xhsConnected ? "可读取公开内容与账号数据" : "需要先登录官方窗口"],
    ["codex", "内容引擎", Boolean(content.codex?.available), content.codex?.detail || "等待本机 Codex 检测"],
    ["trip", "Tripadvisor", Boolean($("#pipelineTripadvisorKey")?.value), $("#pipelineTripadvisorKey")?.value ? "本次运行使用 API" : "未配置 Key：允许降级，但证据覆盖会降低"],
    ["image", "图片策略", enabledImageSources().length > 0, enabledImageSources().length ? enabledImageSources().join(" + ") : "未启用图片来源"],
    ["review", "人工审核", true, "发布前始终需要你的确认"],
  ];
  const ready = checks.filter(item => item[2]).length;
  $("#readinessHeadline").textContent = ready >= 4 ? "可以开始运行，结果仍需审核" : "存在运行前置风险";
  $("#readinessSummary").textContent = `${ready}/${checks.length} 项前置条件满足；系统不会用样例数据补齐缺口。`;
  $("#readinessItems").innerHTML = checks.map(([id, label, ok, detail]) => `<div class="readiness-item ${ok ? "ready" : "blocked"}" data-check="${id}"><i>${ok ? "✓" : "!"}</i><span><b>${label}</b><small>${escapeHtml(detail)}</small></span></div>`).join("");
}

function renderPipelineDecision(research = null, quality = null) {
  const evidence = research ? `${(research.xhsItems?.length || 0) + (research.taItems?.length || 0)} 条/地点` : "—";
  const risk = quality?.warnings?.length ? `${quality.warnings.length} 项待确认` : quality ? "未发现警告" : "—";
  const publish = quality?.ready_for_review ? "可进入审核" : quality ? "阻止发布" : "—";
  $("#pipelineDecision").innerHTML = [["证据覆盖", evidence, "小红书细节 + 国际游客信号"], ["事实风险", risk, "价格、时间、预约、支付"], ["发布条件", publish, "图片、审核、人工确认"]].map(([label, value, note]) => `<div><b>${label}</b><strong>${escapeHtml(value)}</strong><small>${note}</small></div>`).join("");
  $("#pipelineDecisionState").textContent = quality ? (quality.ready_for_review ? "可审核" : "需处理") : research ? "已采集" : "等待";
}

function updatePipelineStage(stage, status, message, runId = currentPipelineRunId) {
  if (runId) currentPipelineRunId = runId;
  pipelineStageState[stage] = { status, message, at: new Date().toISOString() };
  renderPipelineStages(); pipelineLog(`${stage}: ${message}`, status);
  $("#pipelineStatus").textContent = status === "failed" ? "失败" : status === "cancelled" ? "已停止" : status === "complete" && stage === "review" ? "等待审核" : "运行中";
}

async function collectDualSourceResearch({ seeds, scale, apiKey, progress }) {
  if (!window.studio?.scanMarket || !window.studio?.researchTripadvisor) throw new Error("请在桌面 App 中运行生产链路");
  const queryLimit = scale <= 360 ? 12 : scale <= 720 ? 24 : 40;
  const xhsQueries = buildResearchQueries(seeds, queryLimit);
  const englishCityNames = { "北京": "Beijing", "上海": "Shanghai", "成都": "Chengdu", "重庆": "Chongqing", "西安": "Xi'an", "杭州": "Hangzhou", "广州": "Guangzhou", "深圳": "Shenzhen", "苏州": "Suzhou", "南京": "Nanjing" };
  const englishCity = englishCityNames[settings.city] || settings.city || "Chengdu";
  const englishQueries = [...new Set([`${englishCity} attractions`, `${englishCity} restaurants`, `${englishCity} things to do`, `${englishCity} first time travel`])];
  progress?.(`正在执行 ${xhsQueries.length} 组小红书查询与 Tripadvisor 官方 API`);
  const [xhs, tripadvisor] = await Promise.all([
    window.studio.scanMarket({ keywords: xhsQueries }),
    window.studio.researchTripadvisor({ apiKey, queries: englishQueries, language: "en", maxLocations: 3 })
  ]);
  const xhsItems = (xhs.results || []).flatMap(group => (group.items || []).map(item => ({ ...item, keyword: group.keyword, source: "xiaohongshu", capturedAt: group.capturedAt || xhs.capturedAt })));
  const taItems = tripadvisor.items || [];
  const xhsNeedsLogin = (xhs.results || []).some(group => group.needsLogin);
  const xhsEmptyQueries = (xhs.results || []).filter(group => !(group.items || []).length).map(group => group.keyword).slice(0, 12);
  const snapshot = { capturedAt: new Date().toISOString(), seeds, scale, xhsItems, taItems, xhsNeedsLogin, xhsQueryCount: (xhs.results || []).length, xhsEmptyQueries, xhsDiagnostics: (xhs.results || []).slice(0, 4).map(group => group.diagnostic), tripadvisorConnected: Boolean(tripadvisor.connected), tripadvisorNeedsKey: Boolean(tripadvisor.needsKey) };
  researchSnapshots.push(snapshot); researchSnapshots = researchSnapshots.slice(-12);
  localStorage.setItem(STORAGE.researchSnapshots, JSON.stringify(researchSnapshots));
  signals = xhsItems; renderDiscovery();
  return snapshot;
}

async function loadPipelineHistory() {
  if (!window.studio?.getPipelineHistory) return;
  try {
    const history = await window.studio.getPipelineHistory();
    $("#pipelineHistoryState").textContent = `${history.length} 次`;
    $("#pipelineHistory").innerHTML = history.length ? history.map(run => `<article class="pipeline-run-card ${escapeHtml(run.status)}"><b>${escapeHtml(run.runId)}</b><span>${formatBeijingTime(run.startedAt)} · 小红书 ${run.payloadSummary?.xhs || 0}/${run.payloadSummary?.xhsQueries || 0} 组 · Tripadvisor ${run.payloadSummary?.tripadvisor || 0}</span><small>${escapeHtml(run.status)}${run.payloadSummary?.xhsNeedsLogin ? " · 需要小红书登录" : ""}${run.error ? ` · ${escapeHtml(run.error)}` : ""}</small></article>`).join("") : `<div class="empty-state">暂无生产任务。</div>`;
  } catch (error) { pipelineLog(`历史读取失败：${error.message}`, "warning"); }
}

async function runProductionPipeline({ automatic = false } = {}) {
  if (currentPipelineRunId) return toast("已有生产任务正在运行");
  const button = $("#runPipelineNow"); button.disabled = true; $("#cancelPipeline").disabled = false;
  pipelineStageState = {}; renderPipelineStages(); $("#pipelineLog").textContent = ""; $("#pipelineStatus").textContent = "运行中";
  const seeds = $("#pipelineSeeds").value.split(/[,，\n]/).map(value => value.trim()).filter(Boolean);
  const scale = Number($("#pipelineScale").value || 720);
  updatePipelineStage("research", "running", automatic ? "北京时间自动任务已触发" : "手动任务已触发", "pending");
  try {
    const research = await collectDualSourceResearch({ seeds, scale, apiKey: $("#pipelineTripadvisorKey").value, progress: message => updatePipelineStage("research", "running", message) });
    renderPipelineDecision(research);
    $("#pipelineSourceState").textContent = `小红书 ${research.xhsItems.length}/${research.xhsQueryCount || 0} 组${research.xhsNeedsLogin ? "（需要登录）" : research.xhsItems.length ? "" : "（查询未返回卡片）"} · Tripadvisor ${research.taItems.length} 个地点${research.tripadvisorNeedsKey ? "（缺少 Key）" : ""}`;
    if (!research.xhsItems.length && !research.taItems.length && research.xhsNeedsLogin) throw new Error("小红书公开检索需要登录，登录窗口已打开；完成登录后重新运行");
    updatePipelineStage("research", "complete", `小红书 ${research.xhsItems.length} 条；Tripadvisor ${research.taItems.length} 个地点${research.tripadvisorNeedsKey ? "（未配置 Key）" : ""}`);
    updatePipelineStage("evidence", "running", "正在按来源角色整理证据");
    const previousTitles = generatedCalendar.flatMap(week => (week.posts || []).map(post => post.title));
    const result = await window.studio.runPipeline({ research, settings, previousTitles, model: $("#agentModel").value, effort: $("#reasoningEffort").value });
    if (!result.ok) throw new Error(result.error || "生产链路失败");
    applyProductionArtifact(result.artifact);
    renderPipelineDecision(research, result.artifact.article.quality);
    $("#pipelineRunMeta").textContent = `${result.run.runId} · ${formatBeijingTime(result.run.startedAt)}`;
    $("#pipelineStatus").textContent = "等待审核";
    track("production_pipeline_completed", { run_id: result.run.runId, xhs: research.xhsItems.length, tripadvisor: research.taItems.length, automatic });
    toast("生产链路已完成，内容已进入审核队列");
  } catch (error) {
    const activeStage = PIPELINE_STAGES.find(([id]) => pipelineStageState[id]?.status === "running")?.[0] || "content";
    updatePipelineStage(activeStage, "failed", error.message);
    $("#pipelineStatus").textContent = "失败"; pipelineLog(error.message, "failed"); toast(`链路失败：${error.message}`);
  } finally {
    currentPipelineRunId = null; button.disabled = false; $("#cancelPipeline").disabled = true; loadPipelineHistory();
  }
}

function savePipelinePrefs() {
  const prefs = { auto: $("#pipelineAuto").checked, time: $("#pipelineTime").value || "09:00", seeds: $("#pipelineSeeds").value, scale: $("#pipelineScale").value, lastAutoDate: JSON.parse(localStorage.getItem(STORAGE.pipelinePrefs) || "{}").lastAutoDate || "" };
  localStorage.setItem(STORAGE.pipelinePrefs, JSON.stringify(prefs)); updatePipelineNextRun();
}

function updatePipelineNextRun() {
  const prefs = JSON.parse(localStorage.getItem(STORAGE.pipelinePrefs) || "{}");
  $("#pipelineNextRun").textContent = prefs.auto ? `每天 ${prefs.time || "09:00"}（北京时间）自动运行；App 需保持开启。` : "自动触发尚未启用。";
}

function checkPipelineSchedule() {
  const prefs = JSON.parse(localStorage.getItem(STORAGE.pipelinePrefs) || "{}"); if (!prefs.auto || currentPipelineRunId) return;
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date()).reduce((acc,item)=>(acc[item.type]=item.value,acc),{});
  const day = `${parts.year}-${parts.month}-${parts.day}`; const now = `${parts.hour}:${parts.minute}`;
  if (now === prefs.time && prefs.lastAutoDate !== day) {
    prefs.lastAutoDate = day; localStorage.setItem(STORAGE.pipelinePrefs, JSON.stringify(prefs)); runProductionPipeline({ automatic: true });
  }
}

async function runDualResearch() {
  const button = $("#runDualResearch");
  const seeds = $("#researchSeeds").value.split(/[,，\n]/).map(v => v.trim()).filter(Boolean);
  const scale = Number($("#researchScale").value || 720);
  button.disabled = true; button.textContent = "研究进行中…";
  $("#researchProgress").textContent = `正在读取真实数据并连接 Tripadvisor 官方 API…`;
  try {
    const snapshot = await collectDualSourceResearch({ seeds, scale, apiKey: $("#tripadvisorKey").value, progress: message => $("#researchProgress").textContent = message });
    $("#researchProgress").textContent = `完成：小红书 ${snapshot.xhsItems.length} 条公开内容；Tripadvisor ${snapshot.taItems.length} 个地点、${snapshot.taItems.reduce((sum,item)=>sum+(item.reviews?.length||0),0)} 条近期评论。${snapshot.tripadvisorNeedsKey ? " Tripadvisor等待API Key。" : ""}`;
    track("dual_source_research_completed", { xhs: snapshot.xhsItems.length, tripadvisor_locations: snapshot.taItems.length, scale });
  } catch (error) { $("#researchProgress").textContent = `研究失败：${error.message}`; }
  finally { button.disabled = false; button.textContent = "运行双源研究"; }
}

function classifyComment(text) {
  if (/过敏|安全|护照|签证|事故|被骗|投诉|违法|危险/.test(text)) return { label: "高风险 · 必须审核", risk: "high" };
  if (/多少钱|价格|多久|几点|预约|地铁|路线|怎么|哪里|请问|支付/.test(text)) return { label: "问题 · 必须审核", risk: "review" };
  if (/错了|不对|已经改|关闭/.test(text)) return { label: "纠错 · 必须核验", risk: "high" };
  return { label: "普通互动 · 可拟稿", risk: "low" };
}

function renderComments() {
  $("#commentCount").textContent = `${commentRecords.length} 条`;
  if (!commentRecords.length) { $("#commentList").innerHTML = `<div class="empty-state">没有缓存评论。点击“同步评论”读取创作中心当前可见内容。</div>`; return; }
  $("#commentList").innerHTML = commentRecords.map((item,index) => {
    const cls = classifyComment(item.text);
    return `<article class="comment-item" data-index="${index}"><div><div class="reply-meta"><span class="risk-pill ${cls.risk === "high" ? "high" : ""}">${cls.label}</span><span class="source-pill">真实评论</span></div><h3>${escapeHtml(item.text.slice(0,180))}</h3><p>${escapeHtml(item.time || formatBeijingTime(item.capturedAt))}</p></div><textarea placeholder="点击生成回复，或在这里自行编辑"></textarea><div><button class="ghost draft-reply">AI拟回复</button><button class="primary prepare-reply" disabled>填入小红书</button></div></article>`;
  }).join("");
}

async function syncComments() {
  const button = $("#syncComments"); button.disabled = true; button.textContent = "正在读取…";
  try {
    const result = await window.studio.readComments();
    if (!result.connected) return toast("请先完成小红书登录");
    commentRecords = result.comments || [];
    localStorage.setItem(STORAGE.comments, JSON.stringify(commentRecords));
    $("#commentState").textContent = result.warning || `最近同步：${formatBeijingTime(result.capturedAt)}`;
    renderComments(); track("comments_synced", { count: commentRecords.length });
  } catch (error) { toast(`评论同步失败：${error.message}`); }
  finally { button.disabled = false; button.textContent = "同步评论"; }
}

async function auditSkillGroup() {
  const host = $("#skillAuditResults");
  if (!host || !window.studio?.getSkills) return;
  const skills = await window.studio.getSkills();
  const expected = [
    ["china-travel-intelligence", "真实旅行情报"], ["china-inbound-travel-editorial", "国际游客编辑"],
    ["xiaohongshu-community-care", "评论运营"], ["creator-growth-science", "增长与治理"]
  ];
  host.innerHTML = expected.map(([id,label]) => {
    const installed = skills.some(skill => skill.name === id);
    return `<article class="audit-card"><strong>${installed ? "100" : "0"}</strong><span>${label}</span><small>${installed ? `${id} 已装配并可被本地 Agent 调用` : `${id} 未检测到，不能进入生产流程`}</small></article>`;
  }).join("");
  const installedCount = expected.filter(([id]) => skills.some(skill => skill.name === id)).length;
  $("#skillAuditState").textContent = `${installedCount}/${expected.length} 项就绪`;
}

function renderContentScores() {
  const host = $("#contentScores"); if (!host) return;
  const proposalHost = $("#skillProposals");
  const latest = ownSnapshots.at(-1);
  if (!latest?.rows?.length) { host.className = "empty-state"; host.textContent = "尚未读取到逐篇作品报告；不会用账号总览数据伪造单篇评分。"; if (proposalHost) proposalHost.textContent = "没有足够的真实证据生成 Skill 变更提案。"; return; }
  const cleanLabel = value => String(value || "").replace(/\s+/g, "").toLowerCase();
  const parseMetric = value => {
    const raw = String(value || "").replace(/,/g, "").trim();
    const match = raw.match(/(-?\d+(?:\.\d+)?)\s*(万|w|k)?\s*(%)?/i);
    if (!match) return null;
    const multiplier = /万|w/i.test(match[2] || "") ? 10000 : /k/i.test(match[2] || "") ? 1000 : 1;
    return Number(match[1]) * multiplier;
  };
  const header = latest.rows[0].map(cleanLabel);
  const findColumn = aliases => header.findIndex(cell => aliases.some(alias => cell.includes(alias)));
  const columns = {
    title: findColumn(["标题", "笔记", "作品", "名称"]),
    reach: findColumn(["曝光", "展现"]),
    ctr: findColumn(["封面点击率", "点击率"]),
    hold3: findColumn(["3秒观看", "3秒留存", "前3秒"]),
    avgWatch: findColumn(["平均观看", "平均播放", "平均观看时长"]),
    completion: findColumn(["完读率", "完播率", "阅读完成率"]),
    saves: findColumn(["收藏"]), comments: findColumn(["评论"]), shares: findColumn(["分享"]),
    follows: findColumn(["涨粉", "新增粉丝", "关注"])
  };
  const videoMode = header.some(cell => /视频|播放|完播|观看时长/.test(cell)) || /视频/.test(latest.pageTitle || "");
  const weights = videoMode
    ? { reach: 10, ctr: 5, hold3: 15, avgWatch: 10, completion: 10, saves: 15, comments: 10, shares: 10, follows: 10 }
    : { reach: 10, ctr: 10, completion: 15, saves: 20, comments: 10, shares: 10, follows: 10 };
  const records = latest.rows.slice(1).filter(row => row.length > 1).map((row, index) => ({
    title: row[columns.title >= 0 ? columns.title : 0] || `作品 ${index + 1}`,
    values: Object.fromEntries(Object.entries(columns).filter(([key, column]) => key !== "title" && column >= 0).map(([key, column]) => [key, parseMetric(row[column])]))
  }));
  const medians = {};
  for (const key of Object.keys(weights)) {
    const values = records.map(record => record.values[key]).filter(Number.isFinite).sort((a,b) => a-b);
    if (values.length) medians[key] = values[Math.floor(values.length / 2)];
  }
  const scored = records.map(record => {
    let score = 0; let available = 0; let observed = 0;
    for (const [key, weight] of Object.entries(weights)) {
      const value = record.values[key]; const baseline = medians[key];
      if (!Number.isFinite(value) || !Number.isFinite(baseline)) continue;
      available += weight; observed += 1;
      const ratio = baseline > 0 ? value / baseline : (value > 0 ? 2 : 1);
      score += Math.min(1, ratio / 2) * weight;
    }
    const sampleConfidence = Math.min(1, records.length / 8);
    return { ...record, score: Math.round(score), available, confidence: Math.round((available / 100) * sampleConfidence * 100), observed };
  });
  if (!scored.some(item => item.observed >= 2)) { host.className = "empty-state"; host.textContent = "已读取作品表，但当前可见列不足以评分。请在创作中心打开含曝光、点击率、收藏、评论、分享等指标的作品报告后重新同步。"; if (proposalHost) proposalHost.textContent = "指标映射不足，不生成变更提案。"; return; }
  host.className = "";
  host.innerHTML = `<table><thead><tr><th>${videoMode ? "视频记录" : "图文记录"}</th><th>证据分</th><th>置信度</th></tr></thead><tbody>${scored.slice(0,12).map(item => `<tr><td>${escapeHtml(item.title)}</td><td>${item.observed >= 2 ? `${item.score}/${item.available}` : "指标不足"}</td><td>${item.observed >= 2 ? `${item.confidence}% · ${item.observed}项指标` : "未评分"}</td></tr>`).join("")}</tbody></table><p class="hint">分数按同批作品中位数归一化；未读取到的质量与合规指标不补分、不重分配权重。</p>`;
  if (proposalHost) {
    const proposals = [];
    if (Number.isFinite(medians.ctr) && medians.ctr < 5) proposals.push({ target: "封面与标题模块", evidence: `同批中位点击率 ${medians.ctr}%`, change: "生成 A/B 封面钩子；保留正文与选题不变，只测试标题层级与首屏承诺。" });
    if (Number.isFinite(medians.completion) && medians.completion < 35) proposals.push({ target: videoMode ? "视频节奏模块" : "卡片信息密度", evidence: `同批中位${videoMode ? "完播" : "完读"}率 ${medians.completion}%`, change: "把关键结论提前，并减少单页信息负担；先回放测试，不改生产 Skill。" });
    if (records.length >= 5 && Number.isFinite(medians.saves) && Number.isFinite(medians.reach) && medians.reach > 0 && medians.saves / medians.reach < 0.01) proposals.push({ target: "可保存性模块", evidence: `中位收藏/曝光 ${((medians.saves / medians.reach) * 100).toFixed(2)}%`, change: "强化路线截图页、预算清单和替代方案；用下一批内容做对照实验。" });
    proposalHost.className = proposals.length ? "proposal-list" : "empty-state";
    proposalHost.innerHTML = proposals.length ? proposals.map((proposal,index) => `<article class="proposal-card"><div><span>提案 ${index + 1} · 尚未应用</span><h3>${proposal.target}</h3><p><b>证据：</b>${proposal.evidence}</p><p><b>拟议改动：</b>${proposal.change}</p></div><button class="ghost approve-experiment" data-proposal="${index}">批准进入回放测试</button></article>`).join("") : "当前数据没有触发预设阈值；不为了“自我进化”而强行修改 Skill。";
  }
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
  $("#runDualResearch").addEventListener("click", runDualResearch);
  $("#runPipelineNow").addEventListener("click", () => runProductionPipeline());
  $("#pipelineLoginXhs").addEventListener("click", event => startXhsLogin(event.currentTarget));
  $("#pipelineRefreshReadiness").addEventListener("click", async () => { await checkXhsStatus(); await refreshCapabilities(); renderPipelineReadiness(); toast("运行条件已刷新"); });
  $("#cancelPipeline").addEventListener("click", async () => {
    if (!currentPipelineRunId || currentPipelineRunId === "pending") return;
    await window.studio.cancelPipeline(currentPipelineRunId); updatePipelineStage("content", "cancelled", "已请求停止当前任务");
  });
  $("#clearPipelineLog").addEventListener("click", () => { $("#pipelineLog").textContent = "等待运行…"; });
  ["pipelineAuto", "pipelineTime", "pipelineSeeds", "pipelineScale"].forEach(id => $(`#${id}`).addEventListener("change", savePipelinePrefs));
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
  $("#syncComments").addEventListener("click", syncComments);
  $("#auditSkills").addEventListener("click", auditSkillGroup);
  $("#skillProposals").addEventListener("click", event => {
    const button = event.target.closest(".approve-experiment"); if (!button) return;
    button.disabled = true; button.textContent = "已批准 · 等待回放";
    track("skill_experiment_approved", { proposal_index: Number(button.dataset.proposal), production_skill_changed: false });
    toast("已进入回放测试队列；生产 Skill 尚未改动");
  });
  $("#commentList").addEventListener("click", async event => {
    const card = event.target.closest(".comment-item"); if (!card) return;
    const item = commentRecords[Number(card.dataset.index)]; const textarea = $("textarea", card);
    if (event.target.closest(".draft-reply")) {
      const button = event.target.closest(".draft-reply"); button.disabled = true; button.textContent = "生成中…";
      try {
        const result = await window.studio.testCodex({ mode: "comment_reply", comment: item.text, model: $("#agentModel").value, effort: "medium" });
        textarea.value = result.output || ""; $(".prepare-reply", card).disabled = !textarea.value.trim();
      } catch (error) { toast(`回复生成失败：${error.message}`); }
      finally { button.disabled = false; button.textContent = "AI拟回复"; }
    }
    if (event.target.closest(".prepare-reply")) {
      const reply = textarea.value.trim(); if (!reply) return;
      const result = await window.studio.prepareCommentReply({ url: item.url, commentText: item.text, reply });
      toast(result.ready ? "回复已填入小红书，请检查后点击发送" : (result.error || "未能定位回复输入框"));
      track("comment_reply_prepared", { risk: classifyComment(item.text).risk, final_click_required: true });
    }
  });
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
    if (!draft.production) return toast("没有真实生产内容，不能准备发布");
    if (!draft.quality?.ready_for_review) return toast("质量门禁未通过，请先处理警告并补齐图片");
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
  $("#generateBtn").addEventListener("click", () => { switchView("pipeline"); runProductionPipeline(); });
  $("#regenerateImages").addEventListener("click", () => { switchView("pipeline"); toast("图片属于生产制品；将按当前证据重新运行完整链路"); runProductionPipeline(); });
  $("#editTopicBtn").addEventListener("click", () => { switchView("discovery"); toast("从需求信号中选择下一篇选题"); });
  $("#titleInput").addEventListener("change", event => { draft.title = event.target.value; track("revision_saved", { field: "title" }); });
  $("#bodyInput").addEventListener("change", event => { draft.body = event.target.value; track("revision_saved", { field: "body" }); });
}

function init() {
  try { ownSnapshots = JSON.parse(localStorage.getItem(STORAGE.ownSnapshots) || "[]"); } catch { ownSnapshots = []; }
  try { marketSnapshots = JSON.parse(localStorage.getItem(STORAGE.marketSnapshots) || "[]"); } catch { marketSnapshots = []; }
  try { researchSnapshots = JSON.parse(localStorage.getItem(STORAGE.researchSnapshots) || "[]"); } catch { researchSnapshots = []; }
  try { commentRecords = JSON.parse(localStorage.getItem(STORAGE.comments) || "[]"); } catch { commentRecords = []; }
  try { productionArtifact = JSON.parse(localStorage.getItem(STORAGE.productionArtifact) || "null"); } catch { productionArtifact = null; }
  try {
    const prefs = JSON.parse(localStorage.getItem(STORAGE.pipelinePrefs) || "{}");
    $("#pipelineAuto").checked = Boolean(prefs.auto); $("#pipelineTime").value = prefs.time || settings.generateTime || "09:00";
    if (prefs.seeds) $("#pipelineSeeds").value = prefs.seeds; if (prefs.scale) $("#pipelineScale").value = prefs.scale;
  } catch {}
  signals = marketSnapshots.at(-1)?.items || [];
  loadSettings();
  if (productionArtifact?.article) applyProductionArtifact(productionArtifact, false);
  else { draft = { production: false, title: "", topic: "", body: "", tags: [] }; slides = []; generatedCalendar = []; }
  renderDraft();
  renderQueue();
  renderCalendar();
  renderDiscovery();
  renderAnalytics();
  renderComments();
  renderContentScores();
  renderPipelineStages(); renderPipelineReadiness(); renderPipelineDecision(); updatePipelineNextRun(); loadPipelineHistory();
  bindEvents();
  startBeijingClock();
  window.__studioShowSlide = showSlide;
  $$(".workspace-nav").forEach(item => { item.disabled = !accessibleViewWithoutXhs(item.dataset.view); });
  const qaView = new URLSearchParams(location.search).get("qa");
  if (qaView) {
    xhsConnected = true;
    $$(".workspace-nav").forEach(item => { item.disabled = false; });
    switchView(qaView);
  } else {
    checkXhsStatus().then(status => { if (status.connected) { switchView("today"); syncOwnData(); scanMarketData(); } else switchView("connect"); });
  }
  setInterval(async () => { if (!document.hidden && (await checkXhsStatus()).connected) syncOwnData(); }, 5 * 60 * 1000);
  setInterval(async () => { if (!document.hidden && (await checkXhsStatus()).connected) scanMarketData(); }, 30 * 60 * 1000);
  refreshCapabilities().then(renderPipelineReadiness);
  renderSkills();
  if (window.studio?.onPipelineProgress) window.studio.onPipelineProgress(event => updatePipelineStage(event.stage, event.status, event.message, event.runId));
  setInterval(checkPipelineSchedule, 30000);
  checkPipelineSchedule();
  track("app_opened", { version: "0.8.9" });
}

document.addEventListener("DOMContentLoaded", init);
