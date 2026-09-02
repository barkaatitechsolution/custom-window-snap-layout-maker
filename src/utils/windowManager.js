export function calculateZoneBounds(zone, screenWidth, screenHeight, padding = 4) {
  const unitWidth = (screenWidth - padding * 2) / 100;
  const unitHeight = (screenHeight - padding * 2) / 100;

  return {
    x: Math.round(zone.x * unitWidth),
    y: Math.round(zone.y * unitHeight),
    width: Math.round(zone.width * unitWidth),
    height: Math.round(zone.height * unitHeight)
  };
}

export function validateLayout(layout) {
  const errors = [];
  
  if (!layout.name || layout.name.trim() === '') {
    errors.push('Layout name is required');
  }

  if (!layout.zones || layout.zones.length === 0) {
    errors.push('Layout must have at least 1 zone');
  }

  if (layout.zones) {
    let totalArea = 0;
    layout.zones.forEach((zone, index) => {
      if (zone.width < 5 || zone.height < 5) {
        errors.push(`Zone ${index + 1} is too small (minimum 5% width and height)`);
      }
      
      const widthPct = Math.min(zone.width, 100 - zone.x);
      const heightPct = Math.min(zone.height, 100 - zone.y);
      totalArea += (widthPct / 100) * (heightPct / 100);
      
      if (zone.x + zone.width > 100.01 || zone.y + zone.height > 100.01) {
        errors.push(`Zone ${index + 1} extends beyond the screen boundary`);
      }
      if (zone.x < 0 || zone.y < 0) {
        errors.push(`Zone ${index + 1} is positioned outside the screen`);
      }
    });
    
    if (totalArea > 1.01) {
      errors.push('Zones overlap too much - keep total area under 100%');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function formatHotkeyDisplay(hotkey) {
  if (!hotkey) return 'None';
  return hotkey
    .split('+')
    .map(part => part === 'Ctrl' ? 'Ctrl' : part)
    .join(' + ');
}