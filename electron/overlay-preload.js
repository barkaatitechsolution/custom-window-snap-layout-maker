const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('overlayAPI', {
  getLayoutAndZones: () => ipcRenderer.invoke('overlay-get-data'),
  zoneClicked: (zoneId) => ipcRenderer.send('overlay-zone-clicked', zoneId),
  cancelSnap: () => ipcRenderer.send('overlay-cancel'),
  onZoneSnapped: (callback) => ipcRenderer.on('zone-snapped', (event, zoneId) => callback(zoneId)),
  onFinished: (callback) => ipcRenderer.on('overlay-finished', () => callback())
});