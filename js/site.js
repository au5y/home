// === Austin Miller personal site — data-driven scroll + hiker ===
//
// All tracker numbers (states, ballparks, national parks, NH 4000-footers)
// are read at runtime from data/adventures.md — that file is the single
// source of truth. Nothing here hardcodes progress; update the checkboxes
// in that file to update the site.

const ADVENTURES_URL = 'data/adventures.md';

// Reference data only (not progress data): state name -> map code, and
// the 12x8 grid layout used to draw the tile map.
const STATE_NAME_TO_CODE = {
  'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
  'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
  'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA',
  'Kansas':'KS','Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD',
  'Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO',
  'Montana':'MT','Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ',
  'New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH',
  'Oklahoma':'OK','Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC',
  'South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT',
  'Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY'
};

const TILE_MAP = [
  ['',  '',  '',  '',  '',  '',  '',  '',  '',  '',  '',  'ME'],
  ['',  '',  '',  '',  '',  '',  '',  '',  '',  'VT','NH', ''  ],
  ['WA','',  'MT','ND','MN','',  'WI','',  'MI','NY','MA', ''  ],
  ['OR','ID','WY','SD','IA','IL','IN','',  'PA','NJ','CT','RI'],
  ['CA','NV','UT','CO','NE','MO','KY','OH','WV','MD','DE', ''  ],
  ['',  'AZ','NM','KS','AR','TN','VA','NC','',  '',  '',  ''  ],
  ['HI','',  'OK','LA','MS','AL','GA','SC','',  '',  '',  ''  ],
  ['AK','',  'TX','',  '',  'FL','',  '',  '',  '',  '',  ''  ]
];

// === Parse the tracker markdown into { "Section Title": [{label, done}] } ===
function parseAdventures(markdown) {
  const sections = {};
  let current = null;
  markdown.split('\n').forEach(line => {
    const heading = line.match(/^###\s+(.+?)\s*$/);
    if (heading) {
      current = [];
      sections[heading[1]] = current;
      return;
    }
    const item = line.match(/^-\s*\[([ xX])\]\s*(.+?)\s*$/);
    if (item && current) {
      current.push({ label: item[2], done: item[1].toLowerCase() === 'x' });
    }
  });
  return sections;
}

function renderPct(pctEl, done, total) {
  if (!pctEl) return;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const bar = pctEl.querySelector('.bar i');
  const num = pctEl.querySelector('.num');
  if (bar) bar.style.width = pct + '%';
  if (num) num.textContent = pct + '%';
}

function renderStates(items) {
  const done = items.filter(i => i.done);
  const usMap = document.getElementById('usMap');
  if (usMap) {
    usMap.innerHTML = '';
    const visited = new Set(done.map(i => STATE_NAME_TO_CODE[i.label]));
    TILE_MAP.forEach(row => {
      row.forEach(code => {
        const div = document.createElement('div');
        if (!code) {
          div.className = 'cell empty';
        } else {
          div.className = 'cell' + (visited.has(code) ? ' done' : '');
          div.textContent = code;
          div.title = code + (visited.has(code) ? ' ✓' : '');
        }
        usMap.appendChild(div);
      });
    });
  }

  const countEl = document.getElementById('statesCount');
  if (countEl) countEl.textContent = done.length + ' of ' + items.length + ' states.';
  renderPct(document.getElementById('statesPct'), done.length, items.length);

  const remainingEl = document.getElementById('statesRemaining');
  if (remainingEl) {
    const remaining = items.filter(i => !i.done).map(i => i.label);
    remainingEl.textContent = remaining.length
      ? 'Still on the list: ' + remaining.join(', ') + '.'
      : 'All 50 states, done.';
  }
}

function renderChecklist(items, listElId, countElId, pctElId, suffix) {
  const listEl = document.getElementById(listElId);
  if (listEl) {
    listEl.innerHTML = '';
    items.forEach(({ label, done }) => {
      const row = document.createElement('div');
      row.className = 'row-chk' + (done ? ' done' : '');
      row.innerHTML = '<span class="box"></span><span></span>';
      row.lastChild.textContent = label;
      listEl.appendChild(row);
    });
  }
  const done = items.filter(i => i.done).length;
  const countEl = document.getElementById(countElId);
  if (countEl) countEl.textContent = done + ' of ' + items.length + suffix;
  renderPct(document.getElementById(pctElId), done, items.length);
}

function renderBallparks(items) {
  // Ballpark entries are formatted "Name (Team)" — show just the name.
  const shortened = items.map(i => ({
    label: i.label.replace(/\s*\([^)]*\)\s*$/, ''),
    done: i.done
  }));
  renderChecklist(shortened, 'ballparksList', 'ballparksCount', 'ballparksPct', ' ballparks.');
}

function renderParks(items) {
  const done = items.filter(i => i.done);
  const countEl = document.getElementById('parksCount');
  if (countEl) countEl.textContent = done.length + ' of ' + items.length + ' parks.';
  renderPct(document.getElementById('parksPct'), done.length, items.length);

  const visitedEl = document.getElementById('parksVisitedList');
  if (visitedEl) {
    // Park entries are formatted "Name, State[, State...]" — show just the name.
    visitedEl.textContent = done.map(i => i.label.split(',')[0].trim()).join(' · ');
  }
}

function renderPeaks(items) {
  renderChecklist(items, 'peaksList', 'peaksCount', 'peaksPct', ' of the NH 48.');
}

async function loadAdventures() {
  try {
    const res = await fetch(ADVENTURES_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('adventures fetch failed: ' + res.status);
    const sections = parseAdventures(await res.text());

    if (sections['All 50 States']) renderStates(sections['All 50 States']);
    if (sections['MLB Ballparks']) renderBallparks(sections['MLB Ballparks']);
    if (sections['U.S. National Parks']) renderParks(sections['U.S. National Parks']);
    if (sections['New Hampshire 4000 Footers']) renderPeaks(sections['New Hampshire 4000 Footers']);
  } catch (err) {
    console.error('Could not load adventures tracker:', err);
  }
}

// === Sky color cycles with the real time of day, sunrise through sunset ===
const SKY_KEYFRAMES = [
  { t: 0,    top: '#0a1810', mid: '#152620', bot: '#1a2420' }, // midnight
  { t: 5,    top: '#16213a', mid: '#3a3a5c', bot: '#5c4a5e' }, // predawn
  { t: 6.5,  top: '#ff9a5a', mid: '#ffb27a', bot: '#ffd9a0' }, // sunrise
  { t: 8.5,  top: '#8fc4e8', mid: '#bfe0e8', bot: '#eaf3e0' }, // morning
  { t: 12,   top: '#5aa0d8', mid: '#a8d0e0', bot: '#d8e8d0' }, // midday
  { t: 16,   top: '#4a7cb0', mid: '#8fb0c8', bot: '#e0c898' }, // afternoon
  { t: 18,   top: '#d8623a', mid: '#f0925a', bot: '#ffcf7f' }, // sunset
  { t: 19.5, top: '#3a2050', mid: '#8a4560', bot: '#e08050' }, // dusk
  { t: 21,   top: '#141c30', mid: '#2a2840', bot: '#4a3850' }, // twilight
  { t: 24,   top: '#0a1810', mid: '#152620', bot: '#1a2420' }  // back to midnight
];

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerpColor(hexA, hexB, f) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB);
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * f));
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
}

function skyColorsAt(hour) {
  let lo = SKY_KEYFRAMES[0], hi = SKY_KEYFRAMES[SKY_KEYFRAMES.length - 1];
  for (let i = 0; i < SKY_KEYFRAMES.length - 1; i++) {
    if (hour >= SKY_KEYFRAMES[i].t && hour <= SKY_KEYFRAMES[i + 1].t) {
      lo = SKY_KEYFRAMES[i]; hi = SKY_KEYFRAMES[i + 1];
      break;
    }
  }
  const span = hi.t - lo.t;
  const f = span ? (hour - lo.t) / span : 0;
  return {
    top: lerpColor(lo.top, hi.top, f),
    mid: lerpColor(lo.mid, hi.mid, f),
    bot: lerpColor(lo.bot, hi.bot, f)
  };
}

// Stars: fully out at night, fully faded during broad daylight, with a
// smooth fade across dawn (5-8.5) and dusk (16-21).
function nightOpacityAt(hour) {
  if (hour <= 5 || hour >= 21) return 1;
  if (hour <= 8.5) return 1 - (hour - 5) / 3.5;
  if (hour <= 16) return 0;
  if (hour <= 21) return (hour - 16) / 5;
  return 0;
}

// Sun/moon travel a rising-and-falling arc across the sky over their
// respective windows, fading in/out right at the horizon edges of that
// window. `start`/`end` are hours-of-day (end may exceed 24 to wrap past
// midnight, e.g. the moon's window runs 17.5 -> 30.5, i.e. 5:30pm -> 6:30am).
function celestialArcAt(hour, start, end) {
  let h = hour;
  if (h < start) h += 24;
  if (h > end) return null;
  const p = (h - start) / (end - start);
  // x range is intentionally off-center (40-860, not 500) so the arc's peak
  // never lands exactly behind the summit flag at the midpoint of the window.
  const x = 40 + 820 * p;
  const y = 700 - 600 * Math.sin(Math.PI * p);
  const edgeFade = Math.min(1, p / 0.06, (1 - p) / 0.06);
  return { x, y, opacity: Math.max(0, Math.min(1, edgeFade)) };
}

const SUN_WINDOW = [5.5, 18.5];
const MOON_WINDOW = [17.5, 30.5];

function positionCelestial(el, arc) {
  if (!el) return;
  if (!arc) { el.style.opacity = 0; return; }
  el.setAttribute('transform', 'translate(' + arc.x.toFixed(1) + ',' + arc.y.toFixed(1) + ')');
  el.style.opacity = arc.opacity;
}

// The mountain-bg <svg> uses preserveAspectRatio="none" so the mountain art
// stretches to fill the viewport — great for the ridgeline, bad for the sun
// and moon, which would turn into ellipses. Their rx/ry are recomputed here
// from the current non-uniform scale so they always render as true circles
// at a fixed on-screen pixel size, regardless of viewport width/height.
const CELESTIAL_ELLIPSES = {
  'sun-glow': { rx: 56, ry: 56 },
  'sun-core': { rx: 30, ry: 30 },
  'moon-glow': { rx: 46, ry: 46 },
  'moon-main': { rx: 36, ry: 36 },
  // moon-shadow also carries a fixed pixel offset (cx/cy) from the moon's
  // center — that offset needs the same de-stretching or the crescent's
  // shadow would drift off-center on non-square viewports.
  'moon-shadow': { rx: 32, ry: 32, cx: 15, cy: -10 }
};

function updateCelestialSizes() {
  const svg = document.querySelector('.mountain-bg svg');
  if (!svg) return;
  const rect = svg.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const scaleX = rect.width / 1000;
  const scaleY = rect.height / 1000;
  Object.keys(CELESTIAL_ELLIPSES).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const spec = CELESTIAL_ELLIPSES[id];
    el.setAttribute('rx', (spec.rx / scaleX).toFixed(2));
    el.setAttribute('ry', (spec.ry / scaleY).toFixed(2));
    if (spec.cx !== undefined) el.setAttribute('cx', (spec.cx / scaleX).toFixed(2));
    if (spec.cy !== undefined) el.setAttribute('cy', (spec.cy / scaleY).toFixed(2));
  });
}

function initCelestialSizing() {
  updateCelestialSizes();
  window.addEventListener('resize', updateCelestialSizes);
  window.addEventListener('orientationchange', updateCelestialSizes);
  setTimeout(updateCelestialSizes, 200);
  setTimeout(updateCelestialSizes, 800);
}

// The sky runs on a "story clock" instead of the real one: scroll progress
// (t, 0 at base camp -> 1 at the summit) maps onto a full day, so the hike
// itself carries you from dawn through midday into dusk/night as you climb.
function skyHourForScrollT(t) {
  return 5 + t * 15; // 5:00am at the trailhead -> 8:00pm at the summit
}

function applySkyColors(hour) {
  const colors = skyColorsAt(hour);
  const top = document.getElementById('sky-stop-top');
  const mid = document.getElementById('sky-stop-mid');
  const bot = document.getElementById('sky-stop-bot');
  if (top) top.setAttribute('stop-color', colors.top);
  if (mid) mid.setAttribute('stop-color', colors.mid);
  if (bot) bot.setAttribute('stop-color', colors.bot);

  const stars = document.getElementById('sky-stars');
  if (stars) stars.style.opacity = nightOpacityAt(hour);

  positionCelestial(document.getElementById('sky-sun'), celestialArcAt(hour, SUN_WINDOW[0], SUN_WINDOW[1]));
  positionCelestial(document.getElementById('sky-moon'), celestialArcAt(hour, MOON_WINDOW[0], MOON_WINDOW[1]));
}

// === Hiker scroll tracking ===
function initHiker() {
  const wrap = document.getElementById('hikerFixed');
  if (!wrap) return;
  wrap.innerHTML = window.hikerSVG({ size: 76, facing: 'right' });

  const svg = document.querySelector('.mountain-bg svg');
  const trail = document.getElementById('trail-path');
  if (!svg || !trail) return;

  const pathLength = trail.getTotalLength();
  let currentFacing = 1;

  function update() {
    const scroll = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const t = Math.max(0, Math.min(1, scroll / Math.max(1, max)));

    applySkyColors(skyHourForScrollT(t));

    const pt = trail.getPointAtLength(pathLength * t);
    const pt2 = trail.getPointAtLength(Math.min(pathLength, pathLength * t + 4));

    const ctm = trail.getScreenCTM();
    if (!ctm) return;

    const sp1 = svg.createSVGPoint();
    sp1.x = pt.x; sp1.y = pt.y;
    const screen1 = sp1.matrixTransform(ctm);

    const sp2 = svg.createSVGPoint();
    sp2.x = pt2.x; sp2.y = pt2.y;
    const screen2 = sp2.matrixTransform(ctm);

    // facing direction = horizontal component of travel
    const dx = screen2.x - screen1.x;
    if (Math.abs(dx) > 0.5) {
      currentFacing = dx > 0 ? 1 : -1;
    }

    // Hiker is ~76×114; anchor feet to the trail point
    const x = screen1.x - 38;
    const y = screen1.y - 100;

    wrap.style.transform =
      'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scaleX(' + currentFacing + ')';

    // Altimeter
    const altSections = document.querySelectorAll('[data-alt]');
    let currentAlt = 0;
    altSections.forEach(s => {
      const rect = s.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.55) {
        currentAlt = parseInt(s.dataset.alt, 10) || 0;
      }
    });
    const prog = document.getElementById('altProgress');
    const now = document.getElementById('altNow');
    if (prog) prog.style.height = (t * 100) + '%';
    if (now) now.textContent = currentAlt.toLocaleString() + ' ft';
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('orientationchange', update);
  window.addEventListener('load', update);
  // run a couple times to settle after fonts load / mobile viewport resize
  update();
  setTimeout(update, 200);
  setTimeout(update, 800);
}

// === Card entrance via IntersectionObserver ===
function initCards() {
  const cards = document.querySelectorAll('[data-card]');
  if (!('IntersectionObserver' in window)) {
    cards.forEach(c => c.classList.add('in'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('in');
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
  cards.forEach(c => obs.observe(c));
}

// boot
document.addEventListener('DOMContentLoaded', () => {
  loadAdventures();
  initCelestialSizing();
  applySkyColors(skyHourForScrollT(0));
  initHiker();
  initCards();
});
