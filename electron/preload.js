const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getMonitorInfo: () => ipcRenderer.invoke('get-monitor-info'),
  getLayouts: () => ipcRenderer.invoke('get-layouts'),
  saveLayout: (layout) => ipcRenderer.invoke('save-layout', layout),
  deleteLayout: (layoutId) => ipcRenderer.invoke('delete-layout', layoutId),
  applyLayout: (layoutId) => ipcRenderer.invoke('apply-layout', layoutId),
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  closeWindow: () => ipcRenderer.invoke('window-close'),
  onActivateLayout: (callback) => ipcRenderer.on('activate-layout', (event, layoutId) => callback(layoutId)),
  launchApp: (zoneApp) => ipcRenderer.invoke('launch-app', zoneApp)
});
