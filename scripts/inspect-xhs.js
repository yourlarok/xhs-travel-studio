const { app, BrowserWindow } = require("electron");
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, webPreferences: { partition: "persist:xhs-travel-studio", contextIsolation: true, sandbox: true } });
  await win.loadURL("https://www.xiaohongshu.com/search_result?keyword=%E6%88%90%E9%83%BD%E6%97%85%E8%A1%8C&source=web_search_result_notes");
  await wait(8000);
  const result = await win.webContents.executeJavaScript(`(() => ({
    url: location.href,
    title: document.title,
    body: (document.body?.innerText || '').slice(0, 5000),
    links: [...document.querySelectorAll('a[href]')].slice(0, 120).map(a => ({ href: a.href, text: (a.innerText || '').trim().slice(0, 200) })),
    explore: document.querySelectorAll('a[href*="/explore/"]').length,
    discovery: document.querySelectorAll('a[href*="/discovery/item/"]').length,
    scripts: [...document.scripts].map(s => s.src).filter(Boolean).slice(0, 20)
  }))()`);
  console.log(JSON.stringify(result, null, 2));
  app.quit();
});
