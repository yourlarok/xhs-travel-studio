const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("studio", {
  getCapabilities: () => ipcRenderer.invoke("studio:capabilities"),
  getSkills: () => ipcRenderer.invoke("studio:skills"),
  openSkillFolder: () => ipcRenderer.invoke("studio:open-skill-folder"),
  testCodex: (config) => ipcRenderer.invoke("studio:codex-test", config),
  openXhsLogin: () => ipcRenderer.invoke("xhs:open-login"),
  getXhsStatus: () => ipcRenderer.invoke("xhs:status"),
  readOwnData: () => ipcRenderer.invoke("xhs:read-own"),
  scanMarket: (input) => ipcRenderer.invoke("xhs:scan-market", input),
  prepareXhsPublish: (payload) => ipcRenderer.invoke("xhs:prepare-publish", payload)
});
