// === Austin Miller personal site — data-driven scroll + trail dot ===
//
// All tracker numbers (states, ballparks, national parks, NH 4000-footers)
// are read at runtime from data/adventures.md — that file is the single
// source of truth. Nothing here hardcodes progress; update the checkboxes
// in that file to update the site.

const ADVENTURES_URL = 'data/adventures.md?v=20260731';

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

const STATE_CODE_TO_NAME = Object.fromEntries(
  Object.entries(STATE_NAME_TO_CODE).map(([name, code]) => [code, name])
);

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
          const name = STATE_CODE_TO_NAME[code] || code;
          div.className = 'cell' + (visited.has(code) ? ' done' : '');
          div.textContent = code;
          div.setAttribute('data-full', name + (visited.has(code) ? ' ✓' : ''));
          div.title = name + (visited.has(code) ? ' ✓' : '');
        }
        usMap.appendChild(div);
      });
    });
  }

  const countEl = document.getElementById('statesCount');
  if (countEl) countEl.textContent = done.length + ' of ' + items.length + ' states.';
  renderPct(document.getElementById('statesPct'), done.length, items.length);

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

// Team colors (primary/secondary) and a short abbreviation per MLB team,
// keyed by the team name as it appears in parens in adventures.md.
const TEAM_DATA = {
  'Milwaukee Brewers':        { abbr: 'MIL', primary: '#12284B', secondary: '#FFC52F' },
  'Los Angeles Angels':       { abbr: 'LAA', primary: '#BA0021', secondary: '#003263' },
  'St. Louis Cardinals':      { abbr: 'STL', primary: '#C41E3A', secondary: '#0C2340' },
  'Arizona Diamondbacks':     { abbr: 'AZ',  primary: '#A71930', secondary: '#30B2B0' },
  'New York Mets':            { abbr: 'NYM', primary: '#002D72', secondary: '#FF5910' },
  'Philadelphia Phillies':    { abbr: 'PHI', primary: '#E81828', secondary: '#002D72' },
  'Detroit Tigers':           { abbr: 'DET', primary: '#0C2340', secondary: '#FA4616' },
  'Colorado Rockies':         { abbr: 'COL', primary: '#333366', secondary: '#C4CED4' },
  'Houston Astros':           { abbr: 'HOU', primary: '#002D62', secondary: '#EB6E1F' },
  'Los Angeles Dodgers':      { abbr: 'LAD', primary: '#005A9C', secondary: '#FFFFFF' },
  'Boston Red Sox':           { abbr: 'BOS', primary: '#BD3039', secondary: '#0C2340' },
  'Texas Rangers':            { abbr: 'TEX', primary: '#003278', secondary: '#C0111F' },
  'Cincinnati Reds':          { abbr: 'CIN', primary: '#C6011F', secondary: '#000000' },
  'Kansas City Royals':       { abbr: 'KC',  primary: '#004687', secondary: '#BD9B60' },
  'Miami Marlins':            { abbr: 'MIA', primary: '#00A3E0', secondary: '#000000' },
  'Washington Nationals':     { abbr: 'WSH', primary: '#AB0003', secondary: '#14225A' },
  'San Francisco Giants':     { abbr: 'SF',  primary: '#FD5A1E', secondary: '#27251F' },
  'Baltimore Orioles':        { abbr: 'BAL', primary: '#DF4601', secondary: '#000000' },
  'San Diego Padres':         { abbr: 'SD',  primary: '#2F241D', secondary: '#FFC425' },
  'Pittsburgh Pirates':       { abbr: 'PIT', primary: '#27251F', secondary: '#FDB827' },
  'Cleveland Guardians':      { abbr: 'CLE', primary: '#00385D', secondary: '#E31937' },
  'Chicago White Sox':        { abbr: 'CWS', primary: '#27251F', secondary: '#C4CED4' },
  'Toronto Blue Jays':        { abbr: 'TOR', primary: '#134A8E', secondary: '#E8291C' },
  'Athletics':                { abbr: 'ATH', primary: '#003831', secondary: '#EFB21E' },
  'Seattle Mariners':         { abbr: 'SEA', primary: '#0C2C56', secondary: '#005C5C' },
  'Minnesota Twins':          { abbr: 'MIN', primary: '#002B5C', secondary: '#D31145' },
  'Tampa Bay Rays':           { abbr: 'TB',  primary: '#092C5C', secondary: '#F5D130' },
  'Atlanta Braves':           { abbr: 'ATL', primary: '#13274F', secondary: '#CE1141' },
  'Chicago Cubs':             { abbr: 'CHC', primary: '#0E3386', secondary: '#CC3433' },
  'New York Yankees':         { abbr: 'NYY', primary: '#0C2340', secondary: '#FFFFFF' }
};

// Flat, uniform gray for not-yet-visited pennants — baked in directly
// instead of desaturating each team's own colors via a CSS filter, since
// grayscale(1) on wildly different source hues/luminances (a bright team
// yellow vs. a dark navy) doesn't land on the same gray twice. Every
// undone pennant should read identically, regardless of team colors.
const PENNANT_UNDONE_FILL = '#5c5f5a';
const PENNANT_UNDONE_STROKE = '#bcb48f';

function pennantSVG(primary, secondary, abbr, done) {
  // Muted, slightly aged tone rather than the raw team colors — blended
  // toward the card's parchment/ink palette (lerpColor is defined below).
  const fill = done ? lerpColor(primary, '#8a7a5a', 0.28) : PENNANT_UNDONE_FILL;
  const stroke = done ? lerpColor(secondary, '#f4e4b8', 0.2) : PENNANT_UNDONE_STROKE;
  return '<svg viewBox="0 0 46 30" width="46" height="30" aria-hidden="true">' +
    '<path d="M2 2 L2 28 L44 15 Z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<text x="15" y="19.5" text-anchor="middle" font-family="\'JetBrains Mono\',monospace" font-size="10" font-weight="700" fill="' + stroke + '">' + abbr + '</text>' +
    '</svg>';
}

function renderBallparks(items) {
  const done = items.filter(i => i.done);
  const countEl = document.getElementById('ballparksCount');
  if (countEl) countEl.textContent = done.length + ' of ' + items.length + ' ballparks.';
  renderPct(document.getElementById('ballparksPct'), done.length, items.length);

  const gridEl = document.getElementById('ballparksGrid');
  if (gridEl) {
    gridEl.innerHTML = '';
    items.forEach(({ label, done }) => {
      // Ballpark entries are formatted "Park Name (Team Name)".
      const m = label.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
      const parkName = m ? m[1].trim() : label;
      const teamName = m ? m[2].trim() : '';
      const team = TEAM_DATA[teamName] ||
        { abbr: teamName.slice(0, 3).toUpperCase() || '?', primary: '#5a4a2b', secondary: '#f4e4b8' };

      const pennant = document.createElement('div');
      pennant.className = 'pennant' + (done ? ' done' : '');
      pennant.setAttribute('data-full', parkName + ' — ' + teamName);
      pennant.title = parkName + ' (' + teamName + ')';
      pennant.innerHTML = pennantSVG(team.primary, team.secondary, team.abbr, done);
      gridEl.appendChild(pennant);
    });
  }
}

// Official NPS 4-letter unit codes, keyed by the park name as it appears
// before the first comma in adventures.md.
const PARK_CODES = {
  'Acadia':'ACAD','Arches':'ARCH','Badlands':'BADL','Big Bend':'BIBE',
  'Biscayne':'BISC','Black Canyon of the Gunnison':'BLCA','Bryce Canyon':'BRCA',
  'Canyonlands':'CANY','Capitol Reef':'CARE','Carlsbad Caverns':'CAVE',
  'Channel Islands':'CHIS','Congaree':'CONG','Crater Lake':'CRLA',
  'Cuyahoga Valley':'CUVA','Death Valley':'DEVA','Denali':'DENA',
  'Dry Tortugas':'DRTO','Everglades':'EVER','Gates of the Arctic':'GAAR',
  'Gateway Arch':'JEFF','Glacier':'GLAC','Glacier Bay':'GLBA',
  'Grand Canyon':'GRCA','Grand Teton':'GRTE','Great Basin':'GRBA',
  'Great Sand Dunes':'GRSA','Great Smoky Mountains':'GRSM',
  'Guadalupe Mountains':'GUMO','Haleakalā':'HALE','Hawaiʻi Volcanoes':'HAVO',
  'Hot Springs':'HOSP','Indiana Dunes':'INDU','Isle Royale':'ISRO',
  'Joshua Tree':'JOTR','Katmai':'KATM','Kenai Fjords':'KEFJ',
  'Kings Canyon':'KICA','Kobuk Valley':'KOVA','Lake Clark':'LACL',
  'Lassen Volcanic':'LAVO','Mammoth Cave':'MACA','Mesa Verde':'MEVE',
  'Mount Rainier':'MORA','National Park of American Samoa':'NPSA',
  'New River Gorge':'NERI','North Cascades':'NOCA','Olympic':'OLYM',
  'Petrified Forest':'PEFO','Pinnacles':'PINN','Redwood':'REDW',
  'Rocky Mountain':'ROMO','Saguaro':'SAGU','Sequoia':'SEQU',
  'Shenandoah':'SHEN','Theodore Roosevelt':'THRO','Virgin Islands':'VIIS',
  'Voyageurs':'VOYA','White Sands':'WHSA','Wind Cave':'WICA',
  'Wrangell–St. Elias':'WRST','Yellowstone':'YELL','Yosemite':'YOSE','Zion':'ZION'
};

// Rough landscape category per park, used to pick a small clipart icon.
const PARK_ICON_TYPE = {
  'Acadia':'coast','Arches':'arch','Badlands':'badland','Big Bend':'cactus',
  'Biscayne':'coast','Black Canyon of the Gunnison':'canyon','Bryce Canyon':'canyon',
  'Canyonlands':'canyon','Capitol Reef':'canyon','Carlsbad Caverns':'cave',
  'Channel Islands':'coast','Congaree':'wetland','Crater Lake':'lake',
  'Cuyahoga Valley':'tree','Death Valley':'dune','Denali':'snowmountain',
  'Dry Tortugas':'coast','Everglades':'wetland','Gates of the Arctic':'tundra',
  'Gateway Arch':'monument','Glacier':'glacier','Glacier Bay':'glacier',
  'Grand Canyon':'canyon','Grand Teton':'snowmountain','Great Basin':'mountain',
  'Great Sand Dunes':'dune','Great Smoky Mountains':'tree',
  'Guadalupe Mountains':'mountain','Haleakalā':'volcano','Hawaiʻi Volcanoes':'volcano',
  'Hot Springs':'hotspring','Indiana Dunes':'dune','Isle Royale':'lake',
  'Joshua Tree':'cactus','Katmai':'volcano','Kenai Fjords':'glacier',
  'Kings Canyon':'canyon','Kobuk Valley':'tundra','Lake Clark':'lake',
  'Lassen Volcanic':'volcano','Mammoth Cave':'cave','Mesa Verde':'canyon',
  'Mount Rainier':'snowmountain','National Park of American Samoa':'coast',
  'New River Gorge':'canyon','North Cascades':'snowmountain','Olympic':'tree',
  'Petrified Forest':'badland','Pinnacles':'mountain','Redwood':'tree',
  'Rocky Mountain':'snowmountain','Saguaro':'cactus','Sequoia':'tree',
  'Shenandoah':'tree','Theodore Roosevelt':'badland','Virgin Islands':'coast',
  'Voyageurs':'lake','White Sands':'dune','Wind Cave':'cave',
  'Wrangell–St. Elias':'glacier','Yellowstone':'geyser','Yosemite':'mountain','Zion':'canyon'
};

// Small single-color clipart shapes (24x24 viewBox), one per landscape category.
const PARK_ICON_SHAPES = {
  mountain: '<path d="M2 19 L9 8 L13 13 L16 9 L22 19 Z"/>',
  snowmountain: '<path d="M2 19 L9 7 L13 12 L16 8 L22 19 Z"/><path d="M9 7 L11 10 L7 10 Z" fill="currentColor" stroke="none"/><path d="M16 8 L17.6 10.2 L14.4 10.2 Z" fill="currentColor" stroke="none"/>',
  canyon: '<path d="M2 8 L6 11 L10 7 L14 12 L18 8 L22 11"/><path d="M2 14 L6 17 L10 13 L14 18 L18 14 L22 17"/>',
  arch: '<path d="M4 21 V13 A8 8 0 0 1 20 13 V21"/>',
  cave: '<path d="M2 20 Q4 10 12 10 Q20 10 22 20"/><circle cx="12" cy="16" r="3"/>',
  cactus: '<path d="M12 21 V9"/><path d="M12 13 Q8 13 8 9 Q8 6 8 6"/><path d="M12 11 Q16 11 16 7 Q16 5 16 5"/>',
  dune: '<path d="M1 16 Q6 10 11 16 T21 16"/><path d="M3 20 Q8 15 13 20 T23 20"/>',
  volcano: '<path d="M3 20 L9 8 L15 8 L21 20 Z"/><path d="M9 8 Q11 4 13 8"/>',
  lake: '<circle cx="12" cy="7" r="2.4"/><path d="M2 16 Q7 13 12 16 T22 16"/><path d="M2 20 Q7 17 12 20 T22 20"/>',
  glacier: '<path d="M2 20 L7 6 L10 14 L13 4 L17 14 L22 20 Z"/>',
  tree: '<path d="M12 2 L17 10 H14 L18 16 H6 L10 10 H7 Z"/><path d="M12 16 V22"/>',
  wetland: '<path d="M4 20 V12 M8 20 V10 M12 20 V13 M16 20 V9 M20 20 V12"/><path d="M2 20 H22"/>',
  coast: '<circle cx="12" cy="7" r="2.4"/><path d="M2 17 Q6 14 10 17 T18 17 T22 15"/><path d="M2 21 Q6 18 10 21 T18 21 T22 19"/>',
  tundra: '<path d="M2 18 H22"/><circle cx="17" cy="15" r="2"/><path d="M4 18 L8 14 L12 18"/>',
  badland: '<path d="M2 20 L5 12 L7 16 L10 6 L13 16 L16 10 L19 18 L22 20"/>',
  geyser: '<path d="M12 22 V16"/><path d="M9 16 Q12 8 15 16"/><path d="M12 2 Q10 5 12 6 Q14 5 12 2"/>',
  monument: '<path d="M6 22 V10 A6 6 0 0 1 18 10 V22"/>',
  hotspring: '<path d="M3 18 Q7 15 12 18 T21 18"/><path d="M8 12 Q9 9 8 6"/><path d="M13 12 Q14 9 13 6"/>'
};

function parkIconSVG(type) {
  const shape = PARK_ICON_SHAPES[type] || PARK_ICON_SHAPES.mountain;
  return '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
    '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    shape + '</g></svg>';
}

function renderParks(items) {
  const done = items.filter(i => i.done);
  const countEl = document.getElementById('parksCount');
  if (countEl) countEl.textContent = done.length + ' of ' + items.length + ' parks.';
  renderPct(document.getElementById('parksPct'), done.length, items.length);

  const gridEl = document.getElementById('parksGrid');
  if (gridEl) {
    gridEl.innerHTML = '';
    items.forEach(({ label, done }) => {
      // Park entries are formatted "Name, State[, State...]".
      const name = label.split(',')[0].trim();
      const code = PARK_CODES[name] || name.slice(0, 4).toUpperCase();
      const iconType = PARK_ICON_TYPE[name] || 'mountain';

      const stamp = document.createElement('div');
      stamp.className = 'stamp' + (done ? ' done' : '');
      stamp.setAttribute('data-full', name);
      stamp.title = name;
      stamp.innerHTML =
        '<div class="stamp-icon">' + parkIconSVG(iconType) + '</div>' +
        '<div class="stamp-code">' + code + '</div>';
      gridEl.appendChild(stamp);
    });
  }
}

function renderPeaks(items) {
  renderChecklist(items, 'peaksList', 'peaksCount', 'peaksPct', ' of the NH 48.');
}

async function loadAdventures() {
  try {
    const res = await fetch(ADVENTURES_URL);
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

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerpColor(hexA, hexB, f) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB);
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * f));
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
}

// === Altimeter checkpoint ticks ===
// One tick per [data-alt] section, positioned along the track by altitude
// fraction. Clicking a tick jumps straight to that section; setActiveAltTick
// (called from initTrailDot's scroll update, which already tracks currentAlt)
// highlights whichever checkpoint the trail dot last passed.
let setActiveAltTick = function () {};

function initAltimeterTicks() {
  const track = document.getElementById('altTrack');
  const sections = Array.from(document.querySelectorAll('[data-alt]'));
  if (!track || !sections.length) return;

  const maxAlt = Math.max.apply(null, sections.map(s => parseInt(s.dataset.alt, 10) || 0));
  const ticks = sections.map(s => {
    const alt = parseInt(s.dataset.alt, 10) || 0;
    const label = (s.dataset.screenLabel || '').replace(/^\d+\s*/, '');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tick';
    btn.style.top = (maxAlt ? (alt / maxAlt) * 100 : 0) + '%';
    btn.setAttribute('aria-label', 'Jump to ' + (label || 'section'));
    btn.innerHTML = '<span class="tick-label">' + label + '</span>';
    btn.addEventListener('click', () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      s.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });
    track.appendChild(btn);
    return { alt, el: btn };
  });

  setActiveAltTick = function (currentAlt) {
    ticks.forEach(t => t.el.classList.toggle('active', t.alt === currentAlt));
  };
}

// === Trail dot scroll tracking ===
function initTrailDot() {
  const wrap = document.getElementById('trailDot');
  if (!wrap) return;

  const svg = document.querySelector('.mountain-bg svg');
  const trail = document.getElementById('trail-path');
  if (!svg || !trail) return;

  const pathLength = trail.getTotalLength();
  let lastAlt = -1;

  // getScreenCTM() forces a style/layout recalc and never changes from
  // scrolling alone (mountain-bg is position:fixed) — only from resize/
  // orientation changes, so it's cached instead of recomputed every tick.
  let ctm = null;
  function refreshCTM() { ctm = trail.getScreenCTM(); }

  // Section positions are likewise stable between layout passes; reading
  // them here (once, on setup/resize) instead of calling
  // getBoundingClientRect() inside the scroll handler avoids forcing a
  // layout read right after the transform write below on every tick.
  const altSections = Array.from(document.querySelectorAll('[data-alt]'));
  let altOffsets = [];
  function refreshAltOffsets() {
    const scrollNow = window.scrollY;
    altOffsets = altSections.map(s => ({
      top: s.getBoundingClientRect().top + scrollNow,
      alt: parseInt(s.dataset.alt, 10) || 0
    }));
  }

  const progEl = document.getElementById('altProgress');
  const nowEl = document.getElementById('altNow');

  function update() {
    const scroll = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const t = Math.max(0, Math.min(1, scroll / Math.max(1, max)));

    if (!ctm) return;

    const pt = trail.getPointAtLength(pathLength * t);

    const sp1 = svg.createSVGPoint();
    sp1.x = pt.x; sp1.y = pt.y;
    const screen1 = sp1.matrixTransform(ctm);

    wrap.style.transform = 'translate(' + screen1.x.toFixed(1) + 'px,' + screen1.y.toFixed(1) + 'px)';

    // Altimeter
    const thresholdY = scroll + window.innerHeight * 0.55;
    let currentAlt = 0;
    altOffsets.forEach(({ top, alt }) => {
      if (top <= thresholdY) currentAlt = alt;
    });

    if (progEl) progEl.style.height = (t * 100) + '%';
    // Skip the class-toggle/text-write work below when the checkpoint
    // hasn't actually changed since the last frame.
    if (currentAlt !== lastAlt) {
      lastAlt = currentAlt;
      if (nowEl) nowEl.textContent = currentAlt.toLocaleString() + ' ft';
      setActiveAltTick(currentAlt);
    }
  }

  // Native scroll events can fire far more often than the display repaints
  // (especially touch scroll / high-refresh mobile screens); coalescing to
  // one rAF-scheduled update per frame avoids piling up redundant work.
  let rafScheduled = false;
  function scheduleUpdate() {
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(() => {
      rafScheduled = false;
      update();
    });
  }

  function onScroll() {
    scheduleUpdate();
  }

  function onResize() {
    refreshCTM();
    refreshAltOffsets();
    update();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  window.addEventListener('load', onResize);
  // run a couple times to settle after fonts load / mobile viewport resize
  refreshCTM();
  refreshAltOffsets();
  update();
  setTimeout(onResize, 200);
  setTimeout(onResize, 800);
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
  initAltimeterTicks();
  initTrailDot();
  initCards();
});
