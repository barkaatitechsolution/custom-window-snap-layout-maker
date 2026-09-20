const colors = [
  '#6c5ce7', '#10b981', '#3b82f6', '#ef4444',
  '#f59e0b', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];

let zones = [];
let data = null;

const zonesEl = document.getElementById('zones');
const finishBtn = document.getElementById('finish-btn');
const progressEl = document.getElementById('progress');
const progressTextEl = document.getElementById('progress-text');

function renderZones() {
  zonesEl.innerHTML = '';
  zones.forEach((zone, index) => {
    const el = document.createElement('div');
    el.className = 'zone';
    el.style.left = `${zone.x}%`;
    el.style.top = `${zone.y}%`;
    el.style.width = `${zone.width}%`;
    el.style.height = `${zone.height}%`;
    el.dataset.zoneId = zone.id;

    el.innerHTML = `
      <div class="zone-number">${index + 1}</div>
      <div class="zone-label">${escapeHtml(zone.label || `Zone ${index + 1}`)}</div>
    `;

    el.addEventListener('click', () => {
      window.overlayAPI.zoneClicked(zone.id);
    });

    zonesEl.appendChild(el);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function markZoneDone(zoneId) {
  const el = zonesEl.querySelector(`.zone[data-zone-id="${zoneId}"]`);
  if (el) {
    el.classList.remove('filled');
    el.classList.add('done');
  }
}

function updateProgress() {
  const done = zones.filter(z => z.done).length;
  progressEl.textContent = `${done} / ${zones.length} zones snapped`;
  progressTextEl.textContent = done >= zones.length ? 'All snapped!' : 'Tab to next window, then click its zone';
}

async function init() {
  data = await window.overlayAPI.getLayoutAndZones();
  if (!data || !data.zones) return;
  zones = data.zones.map(z => ({ ...z, done: false }));
  renderZones();
  updateProgress();

  window.overlayAPI.onFinished(() => {
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(15,15,20,0.7);z-index:200;color:#fff;font-size:20px;font-weight:700;';
    el.textContent = 'Done';
    document.body.appendChild(el);
    setTimeout(() => window.close(), 500);
  });
}

window.overlayAPI.onZoneSnapped((zoneId) => {
  markZoneDone(zoneId);
  updateProgress();
  setTimeout(() => {
    const nextWaiting = zones.find(z => !z.done);
    const el = document.querySelector('.zone.hint-glow');
    if (el) el.classList.remove('hint-glow');
    if (nextWaiting) {
      const nextEl = zonesEl.querySelector(`.zone[data-zone-id="${nextWaiting.id}"]`);
      if (nextEl) nextEl.classList.add('hint-glow');
    }
  }, 150);
});

finishBtn.addEventListener('click', () => window.overlayAPI.cancelSnap());

init();