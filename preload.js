const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("studio", {
  getCapabilities: () => ipcRenderer.invoke("studio:capabilities"),
  getSkills: () => ipcRenderer.invoke("studio:skills"),
  openSkillFolder: () => ipcRenderer.invoke("studio:open-skill-folder"),
  testCodex: (config) => ipcRenderer.invoke("studio:codex-test", config),
  openXhsLogin: () => ipcRenderer.invoke("xhs:open-login"),
  getXhsStatus: () => ipcRenderer.invoke("xhs:status"),
  readOwnData: () => ipcRenderer.invoke("xhs:read-own"),
  readComments: () => ipcRenderer.invoke("xhs:read-comments"),
  prepareCommentReply: (payload) => ipcRenderer.invoke("xhs:prepare-comment-reply", payload),
  scanMarket: (input) => ipcRenderer.invoke("xhs:scan-market", input),
  researchTripadvisor: (input) => ipcRenderer.invoke("tripadvisor:research", input),
  runPipeline: (payload) => ipcRenderer.invoke("studio:pipeline-run", payload),
  cancelPipeline: (runId) => ipcRenderer.invoke("studio:pipeline-cancel", runId),
  getPipelineHistory: () => ipcRenderer.invoke("studio:pipeline-history"),
  onPipelineProgress: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on("studio:pipeline-progress", listener);
    return () => ipcRenderer.removeListener("studio:pipeline-progress", listener);
  },
  prepareXhsPublish: (payload) => ipcRenderer.invoke("xhs:prepare-publish", payload)
});
