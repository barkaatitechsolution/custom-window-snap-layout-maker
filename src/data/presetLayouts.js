export const presetLayouts = {
  trading: {
    id: 'trading',
    name: 'Trading',
    icon: 'chart',
    description: 'Multi-chart setup with order book and market feed',
    zones: [
      { id: 1, x: 0, y: 0, width: 50, height: 70, label: 'Main Chart', app: '' },
      { id: 2, x: 50, y: 0, width: 25, height: 35, label: 'Order Book', app: '' },
      { id: 3, x: 75, y: 0, width: 25, height: 35, label: 'Positions', app: '' },
      { id: 4, x: 50, y: 35, width: 50, height: 35, label: 'Charts 2-4', app: '' },
      { id: 5, x: 0, y: 70, width: 100, height: 30, label: 'News Feed', app: '' }
    ],
    hotkey: 'Ctrl+Shift+1'
  },
  videoEditing: {
    id: 'videoEditing',
    name: 'Video Editing',
    icon: 'video',
    description: 'Editor layout with preview, media bin and timeline',
    zones: [
      { id: 1, x: 0, y: 0, width: 60, height: 60, label: 'Preview', app: '' },
      { id: 2, x: 60, y: 0, width: 40, height: 30, label: 'Media Bin', app: '' },
      { id: 3, x: 60, y: 30, width: 40, height: 30, label: 'Effects', app: '' },
      { id: 4, x: 0, y: 60, width: 100, height: 40, label: 'Timeline', app: '' }
    ],
    hotkey: 'Ctrl+Shift+2'
  },
  programming: {
    id: 'programming',
    name: 'Programming',
    icon: 'code',
    description: 'Development setup with IDE, terminal and docs',
    zones: [
      { id: 1, x: 0, y: 0, width: 50, height: 70, label: 'IDE/Editor', app: '' },
      { id: 2, x: 50, y: 0, width: 50, height: 40, label: 'Browser/Docs', app: '' },
      { id: 3, x: 50, y: 40, width: 50, height: 30, label: 'Terminal', app: '' },
      { id: 4, x: 0, y: 70, width: 100, height: 30, label: 'Output/Debug', app: '' }
    ],
    hotkey: 'Ctrl+Shift+3'
  },
  streaming: {
    id: 'streaming',
    name: 'Streaming',
    icon: 'stream',
    description: 'Stream setup with capture, chat and alerts',
    zones: [
      { id: 1, x: 0, y: 0, width: 70, height: 70, label: 'Game/Capture', app: '' },
      { id: 2, x: 70, y: 0, width: 30, height: 35, label: 'Chat', app: '' },
      { id: 3, x: 70, y: 35, width: 30, height: 35, label: 'Alerts', app: '' },
      { id: 4, x: 0, y: 70, width: 50, height: 30, label: 'OBS Controls', app: '' },
      { id: 5, x: 50, y: 70, width: 50, height: 30, label: 'Music', app: '' }
    ],
    hotkey: 'Ctrl+Shift+4'
  },
  office: {
    id: 'office',
    name: 'Office',
    icon: 'office',
    description: 'Work layout with email, documents and calendar',
    zones: [
      { id: 1, x: 0, y: 0, width: 35, height: 100, label: 'Email', app: '' },
      { id: 2, x: 35, y: 0, width: 40, height: 60, label: 'Document', app: '' },
      { id: 3, x: 75, y: 0, width: 25, height: 60, label: 'Calendar', app: '' },
      { id: 4, x: 35, y: 60, width: 65, height: 40, label: 'Spreadsheet', app: '' }
    ],
    hotkey: 'Ctrl+Shift+5'
  },
  gaming: {
    id: 'gaming',
    name: 'Gaming',
    icon: 'game',
    description: 'Game setup with Discord and stream chat',
    zones: [
      { id: 1, x: 0, y: 0, width: 75, height: 100, label: 'Game', app: '' },
      { id: 2, x: 75, y: 0, width: 25, height: 50, label: 'Discord', app: '' },
      { id: 3, x: 75, y: 50, width: 25, height: 50, label: 'Stream Chat', app: '' }
    ],
    hotkey: 'Ctrl+Shift+6'
  },
  design: {
    id: 'design',
    name: 'Design',
    icon: 'design',
    description: 'Design workflow with canvas, layers and tools',
    zones: [
      { id: 1, x: 0, y: 0, width: 60, height: 70, label: 'Canvas', app: '' },
      { id: 2, x: 60, y: 0, width: 40, height: 35, label: 'Layers', app: '' },
      { id: 3, x: 60, y: 35, width: 40, height: 35, label: 'Properties', app: '' },
      { id: 4, x: 0, y: 70, width: 40, height: 30, label: 'Tools', app: '' },
      { id: 5, x: 40, y: 70, width: 60, height: 30, label: 'Color Picker', app: '' }
    ],
    hotkey: 'Ctrl+Shift+7'
  },
  research: {
    id: 'research',
    name: 'Research',
    icon: 'research',
    description: 'Research setup with multiple browsers and notes',
    zones: [
      { id: 1, x: 0, y: 0, width: 50, height: 50, label: 'Browser 1', app: '' },
      { id: 2, x: 50, y: 0, width: 50, height: 50, label: 'Browser 2', app: '' },
      { id: 3, x: 0, y: 50, width: 50, height: 50, label: 'Notes', app: '' },
      { id: 4, x: 50, y: 50, width: 50, height: 50, label: 'References', app: '' }
    ],
    hotkey: 'Ctrl+Shift+8'
  },
  database: {
    id: 'database',
    name: 'Database',
    icon: 'database',
    description: 'Database management with SQL editor and viewer',
    zones: [
      { id: 1, x: 0, y: 0, width: 40, height: 60, label: 'SQL Editor', app: '' },
      { id: 2, x: 40, y: 0, width: 60, height: 60, label: 'Data Viewer', app: '' },
      { id: 3, x: 0, y: 60, width: 50, height: 40, label: 'Schema', app: '' },
      { id: 4, x: 50, y: 60, width: 50, height: 40, label: 'Logs', app: '' }
    ],
    hotkey: 'Ctrl+Shift+9'
  }
};