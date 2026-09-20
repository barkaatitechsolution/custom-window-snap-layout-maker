import { presetLayouts } from './data/presetLayouts';

// Seed the store with preset layouts on first run
const STORAGE_KEY = 'snap_manager_layouts';

function loadLayouts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load layouts', e);
  }
  return presetLayouts;
}

function saveLayouts(layouts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
  } catch (e) {
    console.error('Failed to save layouts', e);
  }
}

export { loadLayouts, saveLayouts };