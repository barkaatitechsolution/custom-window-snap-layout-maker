import React, { useState, useRef, useCallback, useEffect } from 'react';

function LayoutEditor({ layout, onSave, onCancel, monitorInfo }) {
  const makeDefault = () => ({
    id: `custom_${Date.now()}`,
    name: 'New Layout',
    icon: 'custom',
    zones: [
      { id: 1, x: 0, y: 0, width: 50, height: 50, label: 'Zone 1', app: '' },
      { id: 2, x: 50, y: 0, width: 50, height: 50, label: 'Zone 2', app: '' },
      { id: 3, x: 0, y: 50, width: 50, height: 50, label: 'Zone 3', app: '' },
      { id: 4, x: 50, y: 50, width: 50, height: 50, label: 'Zone 4', app: '' }
    ],
    hotkey: ''
  });

  const [layoutData, setLayoutData] = useState(layout ? JSON.parse(JSON.stringify(layout)) : makeDefault());

  const [selectedZone, setSelectedZone] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOrigin, setDragOrigin] = useState(null);
  const [dragType, setDragType] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (layout) {
      setLayoutData(JSON.parse(JSON.stringify(layout)));
      setSelectedZone(null);
      setIsDragging(false);
      setDragType(null);
    }
  }, [layout?.id]);

  useEffect(() => {
    setSelectedZone(null);
  }, [layout]);

  const colors = [
    '#3b82f6', '#10b981', '#8b5cf6', '#ef4444',
    '#f59e0b', '#ec4899', '#06b6d4', '#84cc16',
    '#f97316', '#6366f1'
  ];

  const getZoneColor = (index) => colors[index % colors.length];

  const handleMouseDown = useCallback((e, zoneId, type) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedZone(zoneId);
    setIsDragging(true);
    setDragType(type);

    const rect = containerRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    setDragStart({ x: startX, y: startY });

    const zone = layoutData.zones.find(z => z.id === zoneId);
    setDragOrigin(zone ? { x: zone.x, y: zone.y, width: zone.width, height: zone.height } : null);
  }, [layoutData.zones]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !selectedZone || !dragOrigin) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const dx = x - ((dragStart.x / rect.width) * 100);
    const dy = y - ((dragStart.y / rect.height) * 100);

    setLayoutData(prev => ({
      ...prev,
      zones: prev.zones.map(zone => {
        if (zone.id !== selectedZone) return zone;
        const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

        if (dragType === 'move') {
          const newX = clamp(dragOrigin.x + dx, 0, 100 - dragOrigin.width);
          const newY = clamp(dragOrigin.y + dy, 0, 100 - dragOrigin.height);
          return { ...zone, x: Math.round(newX), y: Math.round(newY) };
        }

        if (dragType === 'resize-se') {
          const newWidth = clamp(dragOrigin.width + dx, 10, 100 - dragOrigin.x);
          const newHeight = clamp(dragOrigin.height + dy, 10, 100 - dragOrigin.y);
          return { ...zone, width: Math.round(newWidth), height: Math.round(newHeight) };
        }

        if (dragType === 'resize-e') {
          const newWidth = clamp(dragOrigin.width + dx, 10, 100 - dragOrigin.x);
          return { ...zone, width: Math.round(newWidth) };
        }

        if (dragType === 'resize-s') {
          const newHeight = clamp(dragOrigin.height + dy, 10, 100 - dragOrigin.y);
          return { ...zone, height: Math.round(newHeight) };
        }

        return zone;
      })
    }));
  }, [isDragging, selectedZone, dragStart, dragOrigin, dragType]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragType(null);
    setDragOrigin(null);
  }, []);

  const addZone = () => {
    const newId = Math.max(0, ...layoutData.zones.map(z => z.id)) + 1;
    setLayoutData(prev => ({
      ...prev,
      zones: [
        ...prev.zones,
        {
          id: newId,
          x: 0,
          y: 0,
          width: 25,
          height: 25,
          label: `Zone ${newId}`,
          app: ''
        }
      ]
    }));
  };

  const removeZone = (zoneId) => {
    if (layoutData.zones.length <= 1) return;
    setLayoutData(prev => ({
      ...prev,
      zones: prev.zones.filter(z => z.id !== zoneId)
    }));
    if (selectedZone === zoneId) setSelectedZone(null);
  };

  const updateZoneLabel = (zoneId, label) => {
    setLayoutData(prev => ({
      ...prev,
      zones: prev.zones.map(z => z.id === zoneId ? { ...z, label } : z)
    }));
  };

  const updateZoneApp = (zoneId, app) => {
    setLayoutData(prev => ({
      ...prev,
      zones: prev.zones.map(z => z.id === zoneId ? { ...z, app } : z)
    }));
  };

  const handleSave = () => {
    onSave(layoutData);
  };

  const icons = {
    chart: '📈', video: '🎬', code: '💻', stream: '📡',
    office: '💼', game: '🎮', design: '🎨', research: '🔍',
    database: '🗄️', custom: '🔲'
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="editor-title">
          <input
            type="text"
            value={layoutData.name}
            onChange={(e) => setLayoutData(prev => ({ ...prev, name: e.target.value }))}
            className="layout-name-input"
          />
          <select
            value={layoutData.icon}
            onChange={(e) => setLayoutData(prev => ({ ...prev, icon: e.target.value }))}
            className="icon-select"
          >
            {Object.keys(icons).map(icon => (
              <option key={icon} value={icon}>{icons[icon]} {icon}</option>
            ))}
          </select>
        </div>
        <div className="editor-actions">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save Layout</button>
        </div>
      </div>

      <div className="editor-body">
        <div className="editor-canvas" 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="canvas-grid">
            {[...Array(20)].map((_, i) => (
              <div key={`h-${i}`} className="grid-line horizontal" style={{ top: `${i * 5}%` }} />
            ))}
            {[...Array(20)].map((_, i) => (
              <div key={`v-${i}`} className="grid-line vertical" style={{ left: `${i * 5}%` }} />
            ))}
          </div>

          {layoutData.zones.map((zone, index) => (
            <div
              key={zone.id}
              className={`editor-zone ${selectedZone === zone.id ? 'selected' : ''}`}
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.width}%`,
                height: `${zone.height}%`,
                backgroundColor: getZoneColor(index)
              }}
              onClick={(e) => { e.stopPropagation(); setSelectedZone(zone.id); }}
            >
              <div 
                className="zone-move-handle"
                onMouseDown={(e) => handleMouseDown(e, zone.id, 'move')}
              />
              <div className="zone-content">
                <span className="zone-label">{zone.label}</span>
                <span className="zone-size">{zone.width}x{zone.height}</span>
              </div>
              <div 
                className="resize-handle resize-se"
                onMouseDown={(e) => handleMouseDown(e, zone.id, 'resize-se')}
              />
              <div 
                className="resize-handle resize-e"
                onMouseDown={(e) => handleMouseDown(e, zone.id, 'resize-e')}
              />
              <div 
                className="resize-handle resize-s"
                onMouseDown={(e) => handleMouseDown(e, zone.id, 'resize-s')}
              />
            </div>
          ))}

        </div>

        <div className="editor-sidebar">
          <div className="editor-panel">
            <div className="panel-header">
              <h3>Layout Settings</h3>
            </div>
            
            <div className="form-group">
              <label>Hotkey</label>
              <input
                type="text"
                value={layoutData.hotkey}
                onChange={(e) => setLayoutData(prev => ({ ...prev, hotkey: e.target.value }))}
                placeholder="Ctrl+Shift+1"
                className="input"
              />
            </div>
          </div>

          <div className="editor-panel">
            <div className="panel-header">
              <h3>Zones ({layoutData.zones.length})</h3>
              <button className="btn-small" onClick={addZone}>+ Add</button>
            </div>
            
            <div className="zones-list">
              {layoutData.zones.map((zone, index) => (
                <div
                  key={zone.id}
                  className={`zone-item ${selectedZone === zone.id ? 'selected' : ''}`}
                  onClick={() => setSelectedZone(zone.id)}
                >
                  <div 
                    className="zone-color" 
                    style={{ backgroundColor: getZoneColor(index) }}
                  />
                  <input
                    type="text"
                    value={zone.label}
                    onChange={(e) => updateZoneLabel(zone.id, e.target.value)}
                    className="zone-label-input"
                  />
                  <span className="zone-app-badge">
                    {zone.app ? zone.app : '—'}
                  </span>
                  <button 
                    className="btn-remove"
                    onClick={(e) => { e.stopPropagation(); removeZone(zone.id); }}
                    disabled={layoutData.zones.length <= 1}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {selectedZone && (
            <div className="editor-panel">
              <h3>Selected Zone</h3>
              {layoutData.zones.filter(z => z.id === selectedZone).map(zone => (
                <div key={zone.id} className="zone-properties">
                  <div className="form-row">
                    <div className="form-group">
                      <label>X Position</label>
                      <input
                        type="number"
                        value={zone.x}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setLayoutData(prev => ({
                            ...prev,
                            zones: prev.zones.map(z => z.id === zone.id ? { ...z, x: val } : z)
                          }));
                        }}
                        min="0"
                        max={100 - zone.width}
                        className="input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Y Position</label>
                      <input
                        type="number"
                        value={zone.y}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setLayoutData(prev => ({
                            ...prev,
                            zones: prev.zones.map(z => z.id === zone.id ? { ...z, y: val } : z)
                          }));
                        }}
                        min="0"
                        max={100 - zone.height}
                        className="input"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Width %</label>
                      <input
                        type="number"
                        value={zone.width}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 10;
                          setLayoutData(prev => ({
                            ...prev,
                            zones: prev.zones.map(z => z.id === zone.id ? { ...z, width: val } : z)
                          }));
                        }}
                        min="10"
                        max={100 - zone.x}
                        className="input"
                      />
                    </div>
                    <div className="form-group">
                      <label>App/Command</label>
                      <input
                        type="text"
                        value={zone.app || ''}
                        onChange={(e) => updateZoneApp(zone.id, e.target.value)}
                        placeholder="e.g., notepad.exe, chrome.exe"
                        className="input"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Height %</label>
                      <input
                        type="number"
                        value={zone.height}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 10;
                          setLayoutData(prev => ({
                            ...prev,
                            zones: prev.zones.map(z => z.id === zone.id ? { ...z, height: val } : z)
                          }));
                        }}
                        min="10"
                        max={100 - zone.y}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LayoutEditor;