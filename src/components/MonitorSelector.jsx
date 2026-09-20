import React from 'react';

function MonitorSelector({ monitorInfo }) {
  if (!monitorInfo) {
    return (
      <div className="monitors-container">
        <div className="loading">Loading monitor information...</div>
      </div>
    );
  }

  return (
    <div className="monitors-container">
      <div className="content-header">
        <h2>Monitor Setup</h2>
        <p className="subtitle">Your display configuration</p>
      </div>

      <div className="monitors-grid">
        {monitorInfo.all.map((monitor, index) => (
          <div 
            key={monitor.id} 
            className={`monitor-card ${monitor.isPrimary ? 'primary' : ''}`}
          >
            <div className="monitor-preview">
              <div 
                className="monitor-screen"
                style={{
                  aspectRatio: `${monitor.width}/${monitor.height}`
                }}
              >
                <div className="monitor-content">
                  <span className="monitor-number">{index + 1}</span>
                  {monitor.isPrimary && <span className="primary-badge">Primary</span>}
                </div>
              </div>
              <div className="monitor-stand"></div>
            </div>
            
            <div className="monitor-info">
              <h3>{monitor.label || `Display ${index + 1}`}</h3>
              <div className="monitor-specs">
                <div className="spec">
                  <span className="spec-label">Resolution</span>
                  <span className="spec-value">{monitor.width} × {monitor.height}</span>
                </div>
                <div className="spec">
                  <span className="spec-label">Work Area</span>
                  <span className="spec-value">
                    {monitor.workArea.width} × {monitor.workArea.height}
                  </span>
                </div>
                <div className="spec">
                  <span className="spec-label">Position</span>
                  <span className="spec-value">
                    ({monitor.workArea.x}, {monitor.workArea.y})
                  </span>
                </div>
              </div>
            </div>

            {monitor.isPrimary && (
              <div className="monitor-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Primary Display
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="monitor-tips">
        <h3>Tips</h3>
        <ul>
          <li>Layouts automatically adapt to your screen resolution</li>
          <li>Use the layout editor to create custom zones for each monitor</li>
          <li>Hotkeys apply layouts to the primary monitor by default</li>
        </ul>
      </div>
    </div>
  );
}

export default MonitorSelector;
