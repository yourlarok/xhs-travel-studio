const fs = require("fs");
const path = require("path");

const CREATOR_HOME = "https://creator.xiaohongshu.com/";
const CREATOR_DATA = "https://creator.xiaohongshu.com/creator/post/list";
const PUBLISH_URL = "https://creator.xiaohongshu.com/publish/publish?source=official";
const PARTITION = "persist:xhs-travel-studio";

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function registerXhsIntegration({ ipcMain, BrowserWindow, app }) {
  let accountWindow = null;
  let publishWindow = null;
  let readWindow = null;

  function windowOptions(extra = {}) {
    return {
      width: 1280,
      height: 860,
      minWidth: 980,
      minHeight: 700,
      autoHideMenuBar: true,
      backgroundColor: "#ffffff",
      webPreferences: {
        partition: PARTITION,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true
      },
      ...extra
    };
  }

  async function openAccount(url = CREATOR_HOME) {
    if (!accountWindow || accountWindow.isDestroyed()) {
      accountWindow = new BrowserWindow(windowOptions());
      accountWindow.on("closed", () => { accountWindow = null; });
    }
    if (accountWindow.isMinimized()) accountWindow.restore();
    accountWindow.show();
    accountWindow.focus();
    accountWindow.moveTop();
    accountWindow.setAlwaysOnTop(true, "floating");
    setTimeout(() => { if (accountWindow && !accountWindow.isDestroyed()) accountWindow.setAlwaysOnTop(false); }, 1800);
    await accountWindow.loadURL(url);
    return accountWindow;
  }

  async function pageState(win) {
    if (!win || win.isDestroyed()) return { connected: false, url: "", title: "未打开登录窗口" };
    const url = win.webContents.getURL();
    let text = "";
    try { text = await win.webContents.executeJavaScript("document.body?.innerText?.slice(0, 5000) || ''"); } catch {}
    const loginVisible = /扫码登录|验证码登录|登录小红书|请登录/.test(text);
    const connected = url.includes("creator.xiaohongshu.com") && !loginVisible && text.length > 80;
    return { connected, url, title: win.getTitle(), checkedAt: new Date().toISOString() };
  }

  async function getReader(url) {
    if (!readWindow || readWindow.isDestroyed()) {
      readWindow = new BrowserWindow(windowOptions({ show: false }));
      readWindow.on("closed", () => { readWindow = null; });
    }
    await readWindow.loadURL(url);
    await wait(4500);
    return readWindow;
  }

  async function scrapeVisibleAnalytics(win) {
    return win.webContents.executeJavaScript(`(() => {
      const visible = el => {
        const s = getComputedStyle(el); const r = el.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
      };
      const clean = s => (s || '').replace(/\\s+/g, ' ').trim();
      const metricWords = /曝光|阅读|观看|浏览|点赞|收藏|评论|分享|互动|涨粉|粉丝|点击率|完播率/;
      const metrics = [];
      document.querySelectorAll('body *').forEach(el => {
        if (!visible(el) || el.children.length > 5) return;
        const own = clean(el.innerText);
        if (!own || own.length > 120 || !metricWords.test(own) || !/\\d/.test(own)) return;
        metrics.push(own);
      });
      const rows = [...document.querySelectorAll('table tr, [role="row"]')].filter(visible).map(row =>
        [...row.querySelectorAll('th,td,[role="cell"],[role="columnheader"]')].map(cell => clean(cell.innerText)).filter(Boolean)
      ).filter(row => row.length > 1);
      const links = [...document.querySelectorAll('a[href]')].filter(visible).map(a => ({ text: clean(a.innerText), href: a.href })).filter(a => a.text);
      return { metrics: [...new Set(metrics)].slice(0, 80), rows: rows.slice(0, 100), links: links.slice(0, 200), pageTitle: document.title, url: location.href, capturedAt: new Date().toISOString(), bodySample: clean(document.body?.innerText).slice(0, 1000) };
    })()`);
  }

  async function findDataPage(win) {
    const candidate = await win.webContents.executeJavaScript(`(() => {
      const nodes = [...document.querySelectorAll('a[href]')];
      const hit = nodes.find(a => /数据中心|数据看板|内容分析|笔记分析/.test(a.innerText || ''));
      return hit ? hit.href : '';
    })()`);
    if (candidate && candidate.startsWith("https://creator.xiaohongshu.com/")) {
      await win.loadURL(candidate);
      await wait(4500);
    }
  }

  async function findPortalPage(win, pattern) {
    const candidate = await win.webContents.executeJavaScript(`(() => {
      const pattern = new RegExp(${JSON.stringify(pattern.source)}, ${JSON.stringify(pattern.flags)});
      const hit = [...document.querySelectorAll('a[href]')].find(a => pattern.test((a.innerText || '').trim()));
      return hit ? hit.href : '';
    })()`);
    if (candidate && candidate.startsWith("https://creator.xiaohongshu.com/")) {
      await win.loadURL(candidate); await wait(4500); return candidate;
    }
    return "";
  }

  async function scrapeComments(win) {
    return win.webContents.executeJavaScript(`(() => {
      const visible = el => { const s=getComputedStyle(el),r=el.getBoundingClientRect(); return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0; };
      const clean = s => (s || '').replace(/\\s+/g,' ').trim();
      const seen = new Set(); const comments = [];
      [...document.querySelectorAll('li,article,[class*="comment"],[class*="message"],[class*="interact"]')].filter(visible).forEach((node,index) => {
        const text=clean(node.innerText); if(text.length<4||text.length>900||seen.has(text)) return;
        if(!/回复|评论|赞了|提到|问|请问|怎么|哪里|多久|多少|贵|地铁|路线/.test(text)) return;
        seen.add(text); const link=node.querySelector('a[href]')?.href||location.href;
        const time=[...node.querySelectorAll('time,[class*="time"],[class*="date"]')].map(el=>clean(el.innerText)).find(Boolean)||'';
        comments.push({id:link+'#'+index,text:text.slice(0,700),time,url:link,capturedAt:new Date().toISOString()});
      });
      return {comments:comments.slice(0,100),pageTitle:document.title,url:location.href,capturedAt:new Date().toISOString()};
    })()`);
  }

  async function scrapeMarketKeyword(keyword) {
    const url = `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(keyword)}&source=web_search_result_notes`;
    const win = await getReader(url);
    const text = await win.webContents.executeJavaScript("document.body?.innerText?.slice(0, 3000) || ''");
    const diagnostic = { pageTitle: await win.getTitle(), bodySample: text.slice(0, 400), capturedAt: new Date().toISOString() };
    if (/扫码登录|登录后查看更多|请登录|登录后查看/.test(text)) return { needsLogin: true, keyword, items: [], url, diagnostic };
    const result = await win.webContents.executeJavaScript(`(() => {
      const clean = s => (s || '').replace(/\\s+/g, ' ').trim();
      const parseCount = raw => {
        const m = String(raw || '').match(/(\\d+(?:\\.\\d+)?)\\s*(万|w)?/i);
        if (!m) return null; return Math.round(Number(m[1]) * (m[2] ? 10000 : 1));
      };
      const seen = new Set(); const items = [];
      document.querySelectorAll('a[href*="/explore/"], a[href*="/discovery/item/"]').forEach(a => {
        const href = a.href; if (seen.has(href)) return; seen.add(href);
        const card = a.closest('section,article,[class*="note-item"],[class*="feed-card"]') || a.parentElement;
        const text = clean(card?.innerText || a.innerText); if (!text) return;
        const lines = text.split(/\\n/).map(clean).filter(Boolean);
        const title = clean(a.getAttribute('title') || a.querySelector('img')?.alt || lines[0] || '').slice(0, 120);
        const countText = lines.find(line => /^(\\d+(?:\\.\\d+)?)(万|w)?$/i.test(line)) || '';
        items.push({ title, href, publicEngagement: parseCount(countText), rawText: text.slice(0, 260) });
      });
      return { items: items.slice(0, 30), pageTitle: document.title, capturedAt: new Date().toISOString() };
    })()`);
    return { keyword, url, ...result, needsLogin: false, diagnostic };
  }

  async function exportSlides(sender, rect, count) {
    const batch = path.join(app.getPath("userData"), "publish-batches", String(Date.now()));
    fs.mkdirSync(batch, { recursive: true });
    const safeRect = {
      x: Math.max(0, Math.floor(rect.x)), y: Math.max(0, Math.floor(rect.y)),
      width: Math.max(200, Math.floor(rect.width)), height: Math.max(260, Math.floor(rect.height))
    };
    const files = [];
    for (let index = 0; index < Math.min(Number(count) || 7, 9); index += 1) {
      await sender.executeJavaScript(`window.__studioShowSlide(${index})`);
      await wait(450);
      const image = await sender.capturePage(safeRect);
      const target = path.join(batch, `${String(index + 1).padStart(2, "0")}.png`);
      fs.writeFileSync(target, image.toPNG());
      files.push(target);
    }
    await sender.executeJavaScript("window.__studioShowSlide(0)");
    return files;
  }

  async function cdpUpload(webContents, files) {
    if (!webContents.debugger.isAttached()) webContents.debugger.attach("1.3");
    await webContents.debugger.sendCommand("DOM.enable");
    for (let attempt = 0; attempt < 20; attempt += 1) {
      await webContents.executeJavaScript(`(() => {
        const nodes = [...document.querySelectorAll('span,button,div')];
        const tab = nodes.find(n => (n.innerText || '').trim() === '上传图文');
        if (tab) tab.click();
      })()`);
      await wait(500);
      const root = await webContents.debugger.sendCommand("DOM.getDocument", { depth: -1, pierce: true });
      const node = await webContents.debugger.sendCommand("DOM.querySelector", { nodeId: root.root.nodeId, selector: 'input[type="file"]' });
      if (node.nodeId) {
        await webContents.debugger.sendCommand("DOM.setFileInputFiles", { files, nodeId: node.nodeId });
        return true;
      }
    }
    return false;
  }

  async function fillPublisher(win, payload, files) {
    const bodyText = await win.webContents.executeJavaScript("document.body?.innerText?.slice(0, 2500) || ''");
    if (/扫码登录|验证码登录|登录小红书|请登录/.test(bodyText)) return { needsLogin: true };
    const uploaded = await cdpUpload(win.webContents, files);
    if (!uploaded) return { needsLogin: false, ready: false, error: "没有找到图文上传控件，请在窗口中选择“上传图文”后重试。" };
    await wait(6500);
    const title = JSON.stringify(String(payload.title || "").slice(0, 100));
    const body = JSON.stringify(String(payload.body || "").slice(0, 5000));
    const filled = await win.webContents.executeJavaScript(`(() => {
      const title = ${title}; const body = ${body};
      const fire = el => { el.dispatchEvent(new Event('input', {bubbles:true})); el.dispatchEvent(new Event('change', {bubbles:true})); };
      const titleEl = document.querySelector('#title-textarea, textarea[placeholder*="标题"], input[placeholder*="标题"]');
      if (titleEl) { const proto = titleEl.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(titleEl, title); fire(titleEl); }
      const editor = document.querySelector('.ProseMirror, [contenteditable="true"], textarea[placeholder*="正文"], textarea[placeholder*="内容"]');
      if (editor) { if (editor.isContentEditable) { editor.focus(); editor.innerText = body; } else { Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(editor, body); } fire(editor); }
      return { title: Boolean(titleEl), body: Boolean(editor), url: location.href };
    })()`);
    return { needsLogin: false, ready: filled.title && filled.body, uploaded, filled };
  }

  ipcMain.handle("xhs:open-login", async () => {
    try { const win = await openAccount(); return { opened: true, url: win.webContents.getURL() }; }
    catch (error) { return { opened: false, error: error.message }; }
  });
  ipcMain.handle("xhs:status", async () => {
    const win = accountWindow && !accountWindow.isDestroyed() ? accountWindow : await getReader(CREATOR_HOME);
    return pageState(win);
  });
  ipcMain.handle("xhs:read-own", async () => {
    const win = await getReader(CREATOR_DATA);
    const initial = await pageState(win);
    if (!initial.connected) { await openAccount(CREATOR_HOME); return { connected: false, needsLogin: true, capturedAt: new Date().toISOString() }; }
    await findDataPage(win);
    return { connected: true, ...(await scrapeVisibleAnalytics(win)) };
  });
  ipcMain.handle("xhs:read-comments", async () => {
    const win = await getReader(CREATOR_HOME);
    const initial = await pageState(win);
    if (!initial.connected) { await openAccount(CREATOR_HOME); return { connected: false, needsLogin: true, comments: [], capturedAt: new Date().toISOString() }; }
    const page = await findPortalPage(win, /评论|互动|消息/);
    if (!page) return { connected: true, comments: [], warning: "创作中心当前页面没有发现评论或互动入口。", capturedAt: new Date().toISOString() };
    return { connected: true, ...(await scrapeComments(win)) };
  });
  ipcMain.handle("xhs:prepare-comment-reply", async (_event, payload = {}) => {
    const target = /^https:\/\/creator\.xiaohongshu\.com\//.test(payload.url || "") ? payload.url : CREATOR_HOME;
    const win = await openAccount(target); await wait(2500);
    const commentText = JSON.stringify(String(payload.commentText || "").slice(0,160));
    const reply = JSON.stringify(String(payload.reply || "").slice(0,500));
    return win.webContents.executeJavaScript(`(() => {
      const needle=${commentText},reply=${reply}; const nodes=[...document.querySelectorAll('li,article,div')];
      const row=nodes.find(el=>(el.innerText||'').includes(needle)); if(!row)return{ready:false,error:'未在当前页面定位到该评论'};
      const button=[...row.querySelectorAll('button,span,a')].find(el=>/回复/.test(el.innerText||'')); if(button)button.click();
      const scope=row.closest('li,article,[class*="comment"]')||row.parentElement||document;
      const input=scope.querySelector('textarea,input,[contenteditable="true"]')||document.querySelector('textarea[placeholder*="回复"],[contenteditable="true"]');
      if(!input)return{ready:false,error:'已打开评论，但没有发现回复输入框'};
      input.focus(); if(input.isContentEditable)input.innerText=reply; else {const proto=input.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(input,reply);} input.dispatchEvent(new Event('input',{bubbles:true}));
      return{ready:true,finalClickRequired:true};
    })()`);
  });
  ipcMain.handle("xhs:scan-market", async (_event, input = {}) => {
    const keywords = Array.isArray(input.keywords) ? input.keywords.map(String).map(v => v.trim()).filter(Boolean).slice(0, 40) : [];
    const results = [];
    for (const keyword of keywords) results.push(await scrapeMarketKeyword(keyword));
    if (results.some(item => item.needsLogin)) await openAccount("https://www.xiaohongshu.com/");
    return { capturedAt: new Date().toISOString(), results };
  });
  ipcMain.handle("xhs:prepare-publish", async (event, payload = {}) => {
    const files = await exportSlides(event.sender, payload.rect || {}, payload.count || 7);
    if (!publishWindow || publishWindow.isDestroyed()) {
      publishWindow = new BrowserWindow(windowOptions());
      publishWindow.on("closed", () => { publishWindow = null; });
    }
    publishWindow.show(); publishWindow.focus();
    await publishWindow.loadURL(PUBLISH_URL); await wait(4500);
    const result = await fillPublisher(publishWindow, payload, files);
    if (result.needsLogin) {
      const retry = async () => {
        if (!publishWindow || publishWindow.isDestroyed()) return;
        const state = await pageState(publishWindow);
        if (state.connected) {
          publishWindow.webContents.removeListener("did-finish-load", retry);
          await wait(2500); await fillPublisher(publishWindow, payload, files);
        }
      };
      publishWindow.webContents.on("did-finish-load", retry);
    }
    return { ...result, files, finalClickRequired: true };
  });
}

module.exports = { registerXhsIntegration };
