const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('refreshAPI', {
  onProgress: (callback) => ipcRenderer.on('data-refresh:progress', (_event, state) => callback(state)),
  returnToApp: () => ipcRenderer.send('data-refresh:return')
});
