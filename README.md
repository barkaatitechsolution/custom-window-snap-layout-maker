# Custom Snap Manager

A modern Windows application for creating and managing custom window layouts. Design layouts tailored to your workflows (trading, video editing, programming, streaming, and more) and snap windows into place with a single click.

![Custom Snap Manager](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg?style=for-the-badge)

## 🎯 New Features - App Assignment

### Assign Apps to Zones
Now you can assign applications or commands to each zone in your layouts. When a layout is applied, the specified apps will launch automatically!

### How It Works
1. **Select a layout** or create a new one
2. **Click on any zone** to select it, or add a new zone
3. **Enter an app/command** in the "App/Command" field (e.g., `notepad.exe`, `chrome.exe`, `cmd.exe`)
4. **Save the layout**
5. **Apply the layout** using the hotkey (Ctrl+Shift+1-9) or "Apply" button
6. **Assigned apps launch automatically**, then the snap overlay appears for window positioning

### Supported Commands
- Executable names: `notepad.exe`, `chrome.exe`, `code.exe`, `cmd.exe`
- Full paths: `C:\\Program Files\\app\\app.exe`
- Arguments: `chrome.exe --incognito` (store in `args` field)

## Features

- **9 preset layouts** for common workflows (Trading, Video Editing, Programming, Streaming, Office, Gaming, Design, Research, Database)
- **Visual drag-and-drop layout editor** - resize, reposition, add and remove zones visually
- **One-click window snapping** via an interactive overlay - Alt+Tab to a window, click its zone
- **Automatic screen adaptation** - layouts use percentages and scale to any monitor resolution
- **Global hotkeys** for instant layout switching (Ctrl+Shift+1 through Ctrl+Shift+9)
- **System tray** integration with quick show/quit
- **Multi-monitor awareness** - check your display configuration
- **Dark modern UI** - fully responsive across window sizes
- **🆕 App assignment per zone** - launch apps automatically when layouts apply

## 🛠️ Tech Stack

- **Electron** - cross-platform desktop shell
- **React 18** - modern component-based UI
- **koffi (FFI)** - direct Windows API calls (user32.dll) to move real windows
- **webpack** - bundling and build tooling
- **electron-store** - persistent layout storage

## � Getting Started

```bash
# Install dependencies
npm install

# Production build (creates dist/)
npm run build

# Run the app
npm start

# Development mode with hot reload
npm run dev
```

To package an installer:

```bash
npm run dist
```

## 📚 How It Works

### Virtual Grid Editor
Each layout is defined as a set of zones with percentage positions and sizes. In the Editor tab you get a live 20x20 grid canvas where you can:

- **Drag** zones by their top bar to move them
- **Drag corner/side handles** to resize
- **Edit zone names** in the zones list
- **Set the layout hotkey** in Layout Settings
- **Assign apps/commands** to each zone

Layouts are stored as percentages (`x`, `y`, `width`, `height` in 0-100 range), so a layout designed for 1920x1080 scales perfectly to 2560x1440, 1366x768, etc.

### Window Snapping
When you click the apply button on a layout card:

1. A transparent overlay appears over your primary display showing the layout's zones
2. **Alt+Tab** to the window you want in the first zone
3. **Click that zone** - the window is immediately moved and resized to fit
4. Repeat for each zone, then click **Done**
5. Press `Esc` or click outside to cancel

### Hotkeys
Hotkeys are registered **globally** (work even when the app is in the background). Each layout has a configurable hotkey set in the Hotkeys tab.

### App Assignment Workflow
1. Open the **Editor** tab
2. Select a zone or add a new one
3. Enter an app name in the "App/Command" field (e.g., `notepad.exe`)
4. Save the layout
5. Apply the layout via hotkey or button
6. The assigned app launches automatically
7. Snap overlay appears for window positioning

## 📁 Project Structure

```
├── electron/
│   ├── main.js            # Main process (windows, IPC, hotkeys, tray)
│   ├── preload.js         # Renderer bridge (contextIsolation)
│   ├── snap-window.js     # Windows API helpers via koffi (window enumeration, moving)
│   ├── overlay.html       # Zone snap overlay
│   ├── overlay.js         # Overlay rendering & interaction
│   └── overlay-preload.js # Overlay bridge
├── src/
│   ├── App.jsx            # Main React component
│   ├── components/        # Sidebar, LayoutCard, LayoutEditor, Monitors, Hotkeys
│   ├── styles/app.css     # Dark responsive theme
│   ├── data/presetLayouts.js
│   └── utils/
├── assets/icons/          # App + tray icons
└── webpack.config.js
```

## 📸 Screenshots *(Add your screenshots here)*

> **Tip**: Add screenshots of:
> - The Layout Editor with app assignments shown
> - The snap overlay in action
> - Hotkeys configuration

![Layout Editor](assets/img/layout-editor.png)
![Snap Overlay](assets/img/snap-overlay.png)
![Hotkeys Settings](assets/img/hotkeys.png)

## 🎮 Example Layouts with App Assignments

### Trading Layout
- Zone 1 (Main Chart) → `notepad.exe` or trading chart software
- Zone 2 (Order Book) → `chrome.exe`
- Zone 3 (Positions) → `cmd.exe`
- Zone 4 (Charts 2-4) → Your charting software
- Zone 5 (News Feed) → `edge.exe` or `chrome.exe`

### Programming Layout
- Zone 1 (IDE/Editor) → `code.exe`
- Zone 2 (Browser/Docs) → `chrome.exe`
- Zone 3 (Terminal) → `cmd.exe`
- Zone 4 (Output/Debug) → Your build tool

### Gaming Layout
- Zone 1 (Game) → Your game executable
- Zone 2 (Discord) → `discord.exe`
- Zone 3 (Stream Chat) → Your streaming software

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Run app in development mode |
| `npm run build` | Create production build |
| `npm run dev` | Development with hot reload |
| `npm run dist` | Package installer |

## 📝 Notes

- Window snapping uses the Windows `SetWindowPos` API via koffi (N-API, no rebuild needed for Electron)
- Zones apply to the primary display's work area (taskbar excluded)
- At 125%+ DPI scaling the coordinates are handled automatically
- **New**: Apps are launched via `child_process.spawn()` when layouts apply
- App commands should be valid Windows executable names or full paths
- Multiple zones can have the same or different apps assigned
- Empty app field means no app will launch for that zone

## 🛠️ Development

```bash
# Add new preset layout
# 1. Edit src/data/presetLayouts.js
# 2. Add zones with app: '' field
# 3. The UI will automatically support app assignment

# Launch app manually
# Use electronAPI.launchApp({ app: 'notepad.exe', args: [] })
```