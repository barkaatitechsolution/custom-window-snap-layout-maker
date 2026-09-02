import React, { useState } from 'react';

function HotkeyManager({ layouts, onSaveLayout }) {
  const [editingHotkey, setEditingHotkey] = useState(null);
  const [recording, setRecording] = useState(false);

  const handleHotkeyChange = (layoutId, hotkey) => {
    const layout = layouts[layoutId];
    if (layout) {
      onSaveLayout({ ...layout, hotkey });
    }
  };

  const startRecording = (layoutId) => {
    setEditingHotkey(layoutId);
    setRecording(true);
  };

  const handleKeyDown = (e, layoutId) => {
    if (!recording || editingHotkey !== layoutId) return;

    e.preventDefault();
    
    const parts = [];
    if (e.ctrlKey) parts.push('Ctrl');
    if (e.shiftKey) parts.push('Shift');
    if (e.altKey) parts.push('Alt');
    if (e.metaKey) parts.push('Win');
    
    const key = e.key;
    if (!['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
      parts.push(key.length === 1 ? key.toUpperCase() : key);
    }

    if (parts.length >= 2) {
      const hotkey = parts.join('+');
      handleHotkeyChange(layoutId, hotkey);
      setRecording(false);
      setEditingHotkey(null);
    }
  };

  return (
    <div className="hotkeys-container">
      <div className="content-header">
        <h2>Keyboard Shortcuts</h2>
        <p className="subtitle">Configure hotkeys for quick layout switching</p>
      </div>

      <div className="hotkeys-list">
        {Object.values(layouts).map(layout => (
          <div 
            key={layout.id} 
            className={`hotkey-item ${editingHotkey === layout.id ? 'editing' : ''}`}
            onKeyDown={(e) => handleKeyDown(e, layout.id)}
          >
            <div className="hotkey-info">
              <div className="hotkey-icon">
                {getIcon(layout.icon)}
              </div>
              <div className="hotkey-details">
                <h3>{layout.name}</h3>
                <p>{layout.zones.length} zones configured</p>
              </div>
            </div>
            
            <div className="hotkey-control">
              {editingHotkey === layout.id ? (
                <div className="hotkey-recording">
                  <span className="recording-dot"></span>
                  Press keys...
                </div>
              ) : (
                <div className="hotkey-display">
                  <kbd>{layout.hotkey || 'Not set'}</kbd>
                  <button 
                    className="btn-small"
                    onClick={() => startRecording(layout.id)}
                  >
                    {layout.hotkey ? 'Change' : 'Set Hotkey'}
                  </button>
                  {layout.hotkey && (
                    <button 
                      className="btn-small btn-danger"
                      onClick={() => handleHotkeyChange(layout.id, '')}
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="hotkeys-help">
        <h3>Hotkey Tips</h3>
        <ul>
          <li>Use <kbd>Ctrl+Shift+</kbd> combinations to avoid conflicts</li>
          <li>Hotkeys work globally - even when the app is in the background</li>
          <li>Each layout needs a unique hotkey combination</li>
        </ul>
      </div>
    </div>
  );
}

function getIcon(icon) {
  const icons = {
    chart: '📈', video: '🎬', code: '💻', stream: '📡',
    office: '💼', game: '🎮', design: '🎨', research: '🔍',
    database: '🗄️', custom: '🔲'
  };
  return icons[icon] || icons.custom;
}

export default HotkeyManager;
