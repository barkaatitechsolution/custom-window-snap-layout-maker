import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LayoutCard from './components/LayoutCard';
import LayoutEditor from './components/LayoutEditor';
import MonitorSelector from './components/MonitorSelector';
import HotkeyManager from './components/HotkeyManager';
import { presetLayouts } from './data/presetLayouts';

function App() {
  const [layouts, setLayouts] = useState(presetLayouts);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [monitorInfo, setMonitorInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('layouts');
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    loadData();
    if (window.electronAPI) {
      window.electronAPI.onActivateLayout((layoutId) => {
        handleApplyLayout(layoutId);
      });
    }
  }, []);

  const loadData = async () => {
    if (window.electronAPI) {
      const [layoutsData, monitorData] = await Promise.all([
        window.electronAPI.getLayouts(),
        window.electronAPI.getMonitorInfo()
      ]);
      if (layoutsData) setLayouts(layoutsData);
      if (monitorData) setMonitorInfo(monitorData);
    } else {
      setMonitorInfo({
        primary: { width: 1920, height: 1080, workArea: { x: 0, y: 0, width: 1920, height: 1040 } },
        all: [{ id: 1, label: 'Display 1', width: 1920, height: 1080, workArea: { x: 0, y: 0, width: 1920, height: 1040 }, isPrimary: true }]
      });
    }
  };

  const handleSaveLayout = async (layout) => {
    if (window.electronAPI) {
      const updatedLayouts = await window.electronAPI.saveLayout(layout);
      setLayouts(updatedLayouts);
      setIsEditing(false);
      setSelectedLayout(null);
      setActiveTab('layouts');
    }
  };

  const handleDeleteLayout = async (layoutId) => {
    if (window.electronAPI) {
      const updatedLayouts = await window.electronAPI.deleteLayout(layoutId);
      setLayouts(updatedLayouts);
      if (selectedLayout?.id === layoutId) {
        setSelectedLayout(null);
        setIsEditing(false);
      }
    }
  };

  const handleApplyLayout = async (layoutId) => {
    if (window.electronAPI) {
      await window.electronAPI.applyLayout(layoutId);
    }
  };

  const handleEditLayout = (layout) => {
    setSelectedLayout(layout);
    setIsEditing(true);
    setActiveTab('editor');
  };

  const handleCreateNew = () => {
    setSelectedLayout({
      id: `custom_${Date.now()}`,
      name: 'New Layout',
      icon: 'custom',
      zones: [
        { id: 1, x: 0, y: 0, width: 50, height: 50, label: 'Zone 1' },
        { id: 2, x: 50, y: 0, width: 50, height: 50, label: 'Zone 2' },
        { id: 3, x: 0, y: 50, width: 50, height: 50, label: 'Zone 3' },
        { id: 4, x: 50, y: 50, width: 50, height: 50, label: 'Zone 4' }
      ],
      hotkey: ''
    });
    setIsEditing(true);
    setActiveTab('editor');
  };

  const handleMinimize = () => window.electronAPI?.minimizeWindow();
  const handleMaximize = () => {
    window.electronAPI?.maximizeWindow();
    setIsMaximized(!isMaximized);
  };
  const handleClose = () => window.electronAPI?.closeWindow();

  return (
    <div className="app">
      <div className="titlebar">
        <div className="titlebar-drag">
          <span className="app-title">Custom Snap Manager</span>
        </div>
        <div className="titlebar-buttons">
          <button className="titlebar-btn minimize" onClick={handleMinimize}>
            <svg width="12" height="12" viewBox="0 0 12 12"><rect y="5" width="12" height="1" fill="currentColor"/></svg>
          </button>
          <button className="titlebar-btn maximize" onClick={handleMaximize}>
            <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="10" stroke="currentColor" strokeWidth="1" fill="none"/></svg>
          </button>
          <button className="titlebar-btn close" onClick={handleClose}>
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1"/></svg>
          </button>
        </div>
      </div>

      <div className="main-container">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="content">
          {activeTab === 'layouts' && (
            <>
              <div className="content-header">
                <h2>Layouts</h2>
                <button className="btn-primary" onClick={handleCreateNew}>
                  <span>+</span> Create Layout
                </button>
              </div>
              
              <div className="layouts-grid">
                {Object.values(layouts).map(layout => (
                  <LayoutCard
                    key={layout.id}
                    layout={layout}
                    isSelected={selectedLayout?.id === layout.id}
                    onSelect={() => setSelectedLayout(layout)}
                    onEdit={() => handleEditLayout(layout)}
                    onDelete={() => handleDeleteLayout(layout.id)}
                    onApply={() => handleApplyLayout(layout.id)}
                  />
                ))}
              </div>
            </>
          )}

          {activeTab === 'editor' && (
            <LayoutEditor
              layout={selectedLayout}
              onSave={handleSaveLayout}
              onCancel={() => { setIsEditing(false); setSelectedLayout(null); }}
              monitorInfo={monitorInfo}
            />
          )}

          {activeTab === 'monitors' && (
            <MonitorSelector monitorInfo={monitorInfo} />
          )}

          {activeTab === 'hotkeys' && (
            <HotkeyManager 
              layouts={layouts} 
              onSaveLayout={handleSaveLayout}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
