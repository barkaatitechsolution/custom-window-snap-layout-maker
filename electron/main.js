const { app, BrowserWindow, ipcMain, screen, globalShortcut, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const Store = require('electron-store');
const snapWindow = require('./snap-window');

const store = new Store();
let mainWindow;
let tray;
let overlayWindow;
let snapFlowData = null;

const defaultLayouts = {
  trading: {
    id: 'trading',
    name: 'Trading',
    icon: 'chart',
    zones: [
      { id: 1, x: 0, y: 0, width: 50, height: 70, label: 'Main Chart' },
      { id: 2, x: 50, y: 0, width: 25, height: 35, label: 'Order Book' },
      { id: 3, x: 75, y: 0, width: 25, height: 35, label: 'Positions' },
      { id: 4, x: 50, y: 35, width: 50, height: 35, label: 'Charts 2-4' },
      { id: 5, x: 0, y: 70, width: 100, height: 30, label: 'News/Feed' }
    ],
    hotkey: 'Ctrl+Shift+1'
  },
  videoEditing: {
    id: 'videoEditing',
    name: 'Video Editing',
    icon: 'video',
    zones: [
      { id: 1, x: 0, y: 0, width: 60, height: 60, label: 'Preview' },
      { id: 2, x: 60, y: 0, width: 40, height: 30, label: 'Media Bin' },
      { id: 3, x: 60, y: 30, width: 40, height: 30, label: 'Effects' },
      { id: 4, x: 0, y: 60, width: 100, height: 40, label: 'Timeline' }
    ],
    hotkey: 'Ctrl+Shift+2'
  },
  programming: {
    id: 'programming',
    name: 'Programming',
    icon: 'code',
    zones: [
      { id: 1, x: 0, y: 0, width: 50, height: 70, label: 'IDE/Editor' },
      { id: 2, x: 50, y: 0, width: 50, height: 40, label: 'Browser/Docs' },
      { id: 3, x: 50, y: 40, width: 50, height: 30, label: 'Terminal' },
      { id: 4, x: 0, y: 70, width: 100, height: 30, label: 'Output/Debug' }
    ],
    hotkey: 'Ctrl+Shift+3'
  },
  streaming: {
    id: 'streaming',
    name: 'Streaming',
    icon: 'stream',
    zones: [
      { id: 1, x: 0, y: 0, width: 70, height: 70, label: 'Game/Capture' },
      { id: 2, x: 70, y: 0, width: 30, height: 35, label: 'Chat' },
      { id: 3, x: 70, y: 35, width: 30, height: 35, label: 'Alerts/Donations' },
      { id: 4, x: 0, y: 70, width: 50, height: 30, label: 'OBS/Controls' },
      { id: 5, x: 50, y: 70, width: 50, height: 30, label: 'Music/Spotify' }
    ],
    hotkey: 'Ctrl+Shift+4'
  },
  office: {
    id: 'office',
    name: 'Office',
    icon: 'office',
    zones: [
      { id: 1, x: 0, y: 0, width: 35, height: 100, label: 'Email' },
      { id: 2, x: 35, y: 0, width: 40, height: 60, label: 'Document' },
      { id: 3, x: 75, y: 0, width: 25, height: 60, label: 'Calendar' },
      { id: 4, x: 35, y: 60, width: 65, height: 40, label: 'Spreadsheet' }
    ],
    hotkey: 'Ctrl+Shift+5'
  },
  gaming: {
    id: 'gaming',
    name: 'Gaming',
    icon: 'game',
    zones: [
      { id: 1, x: 0, y: 0, width: 75, height: 100, label: 'Game' },
      { id: 2, x: 75, y: 0, width: 25, height: 50, label: 'Discord' },
      { id: 3, x: 75, y: 50, width: 25, height: 50, label: 'Stream Chat' }
    ],
    hotkey: 'Ctrl+Shift+6'
  },
  design: {
    id: 'design',
    name: 'Design',
    icon: 'design',
    zones: [
      { id: 1, x: 0, y: 0, width: 60, height: 70, label: 'Canvas' },
      { id: 2, x: 60, y: 0, width: 40, height: 35, label: 'Layers' },
      { id: 3, x: 60, y: 35, width: 40, height: 35, label: 'Properties' },
      { id: 4, x: 0, y: 70, width: 40, height: 30, label: 'Tools' },
      { id: 5, x: 40, y: 70, width: 60, height: 30, label: 'Color/Swatches' }
    ],
    hotkey: 'Ctrl+Shift+7'
  },
  research: {
    id: 'research',
    name: 'Research',
    icon: 'research',
    zones: [
      { id: 1, x: 0, y: 0, width: 50, height: 50, label: 'Browser 1' },
      { id: 2, x: 50, y: 0, width: 50, height: 50, label: 'Browser 2' },
      { id: 3, x: 0, y: 50, width: 50, height: 50, label: 'Notes' },
      { id: 4, x: 50, y: 50, width: 50, height: 50, label: 'References' }
    ],
    hotkey: 'Ctrl+Shift+8'
  },
  database: {
    id: 'database',
    name: 'Database',
    icon: 'database',
    zones: [
      { id: 1, x: 0, y: 0, width: 40, height: 60, label: 'SQL Editor' },
      { id: 2, x: 40, y: 0, width: 60, height: 60, label: 'Data Viewer' },
      { id: 3, x: 0, y: 60, width: 50, height: 40, label: 'Schema' },
      { id: 4, x: 50, y: 60, width: 50, height: 40, label: 'Logs' }
    ],
    hotkey: 'Ctrl+Shift+9'
  }
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    backgroundColor: '#0f0f14',
    icon: path.join(__dirname, '../assets/icons/icon.png')
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  if (process.env.SNAP_DEBUG) {
    mainWindow.webContents.on('console-message', (e, level, message, line, sourceId) => {
      console.log(`[renderer:${level}] ${message} (${sourceId}:${line})`);
    });
    mainWindow.webContents.on('did-finish-load', () => {
      console.log('[debug] renderer loaded OK');
    });
    mainWindow.webContents.on('render-process-gone', (e, details) => {
      console.error('[debug] renderer gone:', details.reason);
    });
  }

  if (!store.get('layouts')) {
    store.set('layouts', defaultLayouts);
  }

  createTray();
  registerHotkeys();
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, '../assets/icons/tray-icon.png'));
  tray = new Tray(icon);
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => mainWindow.show() },
    { label: 'Quit', click: () => app.quit() }
  ]);
  
  tray.setToolTip('Custom Snap Manager');
  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => mainWindow.show());
}

function normalizeAccelerator(hotkey) {
  if (!hotkey) return null;
  return hotkey
    .split('+')
    .map(part => part.trim())
    .map(part => {
      const lower = part.toLowerCase();
      if (lower === 'ctrl') return 'Control';
      if (lower === 'win' || lower === 'meta' || lower === 'super') return 'Super';
      if (lower === 'escape') return 'Esc';
      if (lower === 'return' || lower === 'enter') return 'Enter';
      if (lower === 'delete') return 'Delete';
      if (lower === 'backspace') return 'Backspace';
      if (lower === 'space') return 'Space';
      if (lower === 'arrowup') return 'Up';
      if (lower === 'arrowdown') return 'Down';
      if (lower === 'arrowleft') return 'Left';
      if (lower === 'arrowright') return 'Right';
      if (part.length === 1) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('+');
}

function registerHotkeys() {
  globalShortcut.unregisterAll();
  const layouts = store.get('layouts') || defaultLayouts;
  
  Object.values(layouts).forEach(layout => {
    if (layout.hotkey) {
      const accelerator = normalizeAccelerator(layout.hotkey);
      if (!accelerator) return;
      try {
        const ok = globalShortcut.register(accelerator, () => {
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('activate-layout', layout.id);
          }
        });
        if (!ok) console.warn(`Hotkey in use or invalid: ${layout.hotkey}`);
      } catch (err) {
        console.warn(`Failed to register hotkey ${layout.hotkey}:`, err);
      }
    }
  });
}

function getMonitorInfo() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const allDisplays = screen.getAllDisplays();
  
  return {
    primary: {
      width: primaryDisplay.bounds.width,
      height: primaryDisplay.bounds.height,
      workArea: primaryDisplay.workArea
    },
    all: allDisplays.map(display => ({
      id: display.id,
      label: display.label,
      width: display.bounds.width,
      height: display.bounds.height,
      workArea: display.workArea,
      isPrimary: display.id === primaryDisplay.id
    }))
  };
}

function scaleToPhysical(dips) {
  const primary = screen.getPrimaryDisplay();
  const scaleFactor = primary.scaleFactor || 1;
  return {
    x: Math.round(dips.x * scaleFactor),
    y: Math.round(dips.y * scaleFactor),
    width: Math.round(dips.width * scaleFactor),
    height: Math.round(dips.height * scaleFactor)
  };
}

function createOverlayWindow() {
  const { workArea } = screen.getPrimaryDisplay();

  overlayWindow = new BrowserWindow({
    x: workArea.x,
    y: workArea.y,
    width: workArea.width,
    height: workArea.height,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: false,
    resizable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'overlay-preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  overlayWindow.loadFile(path.join(__dirname, 'overlay.html'));
  overlayWindow.setAlwaysOnTop(true, 'screen-saver');
  overlayWindow.setVisibleOnAllWorkspaces(true);

  overlayWindow.once('ready-to-show', () => {
    overlayWindow.showInactive();
  });

  overlayWindow.on('closed', () => {
    overlayWindow = null;
    snapFlowData = null;
  });
}

ipcMain.handle('get-monitor-info', () => getMonitorInfo());

ipcMain.handle('get-layouts', () => store.get('layouts'));

ipcMain.handle('save-layout', (event, layout) => {
  const layouts = store.get('layouts') || {};
  layouts[layout.id] = layout;
  store.set('layouts', layouts);
  registerHotkeys();
  return layouts;
});

ipcMain.handle('delete-layout', (event, layoutId) => {
  const layouts = store.get('layouts') || {};
  delete layouts[layoutId];
  store.set('layouts', layouts);
  registerHotkeys();
  return layouts;
});

ipcMain.handle('apply-layout', (event, layoutId) => {
  const layouts = store.get('layouts') || {};
  const layout = layouts[layoutId];
  
  if (!layout) return { success: false, error: 'Layout not found' };

  // Launch apps assigned to zones
  const { spawn } = require('child_process');
  layout.zones.forEach(zone => {
    if (zone.app) {
      try {
        spawn(zone.app, zone.args || [], {
          detached: false,
          stdio: 'ignore'
        });
      } catch (err) {
        console.warn(`Failed to launch app ${zone.app}:`, err);
      }
    }
  });

  snapFlowData = {
    layout,
    monitor: screen.getPrimaryDisplay().workArea,
    scaleFactor: screen.getPrimaryDisplay().scaleFactor || 1
  };

  createOverlayWindow();
  return { success: true };
});

ipcMain.handle('launch-app', (event, zoneApp) => {
  if (!zoneApp || !zoneApp.app) return { success: false };
  
  try {
    const childProcess = require('child_process');
    childProcess.spawn(zoneApp.app, zoneApp.args || [], {
      detached: false,
      stdio: 'ignore'
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('overlay-get-data', () => {
  if (!snapFlowData) return { zones: [] };
  
  const { layout, monitor, scaleFactor } = snapFlowData;

  const zones = layout.zones.map(zone => {
    const dips = {
      x: (zone.x / 100) * monitor.width,
      y: (zone.y / 100) * monitor.height,
      width: (zone.width / 100) * monitor.width,
      height: (zone.height / 100) * monitor.height
    };
    return {
      id: zone.id,
      label: zone.label,
      x: Math.round((zone.x / 100) * 10000) / 100,
      y: Math.round((zone.y / 100) * 10000) / 100,
      width: zone.width,
      height: zone.height,
      boundsPx: scaleToPhysical(dips)
    };
  });

  return { zones };
});

ipcMain.on('overlay-zone-clicked', (event, zoneId) => {
  if (!snapFlowData || !overlayWindow) return;

  const zoneData = snapFlowData.layout.zones.find(z => z.id === zoneId);
  if (!zoneData) return;

  const targetHandle = snapWindow.getForegroundSnappableHandle();
  if (!targetHandle) return;

  const { monitor, scaleFactor } = snapFlowData;

  const dips = {
    x: monitor.x + (zoneData.x / 100) * monitor.width,
    y: monitor.y + (zoneData.y / 100) * monitor.height,
    width: (zoneData.width / 100) * monitor.width,
    height: (zoneData.height / 100) * monitor.height
  };
  const boundsPx = {
    x: Math.round(dips.x * scaleFactor),
    y: Math.round(dips.y * scaleFactor),
    width: Math.round(dips.width * scaleFactor),
    height: Math.round(dips.height * scaleFactor)
  };

  snapWindow.snapWindowToBounds(targetHandle, boundsPx);

  overlayWindow.webContents.send('zone-snapped', zoneId);
});

ipcMain.on('overlay-cancel', () => {
  if (overlayWindow) overlayWindow.close();
});

ipcMain.handle('window-minimize', () => mainWindow.minimize());
ipcMain.handle('window-maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
ipcMain.handle('window-close', () => mainWindow.close());

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
