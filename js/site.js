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
  initHiker();
  initCards();
});
