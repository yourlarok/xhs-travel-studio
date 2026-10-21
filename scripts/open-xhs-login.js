const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");
app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1280, height: 860, autoHideMenuBar: true, webPreferences: { partition: "persist:xhs-travel-studio", contextIsolation: true, nodeIntegration: false, sandbox: true } });
  const statePath = path.join(app.getPath("userData"), "login-state.json");
  setInterval(async () => {
    try {
      const body = await win.webContents.executeJavaScript("document.body?.innerText || ''");
      const needsLogin = /扫码登录|登录后查看|请登录|验证码登录/.test(body);
      fs.writeFileSync(statePath, JSON.stringify({ connected: !needsLogin && body.length > 80, needsLogin, at: new Date().toISOString(), sample: body.slice(0, 300) }, null, 2));
    } catch {}
  }, 5000);
  win.show();
  await win.loadURL("https://www.xiaohongshu.com/");
});
