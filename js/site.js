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

function pennantSVG(primary, secondary, abbr) {
  // Muted, slightly aged tone rather than the raw team colors — blended
  // toward the card's parchment/ink palette (lerpColor is defined below).
  const mutedPrimary = lerpColor(primary, '#8a7a5a', 0.28);
  const mutedSecondary = lerpColor(secondary, '#f4e4b8', 0.2);
  return '<svg viewBox="0 0 46 30" width="46" height="30" aria-hidden="true">' +
    '<path d="M2 2 L2 28 L44 15 Z" fill="' + mutedPrimary + '" stroke="' + mutedSecondary + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<text x="15" y="19.5" text-anchor="middle" font-family="\'JetBrains Mono\',monospace" font-size="10" font-weight="700" fill="' + mutedSecondary + '">' + abbr + '</text>' +
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
      pennant.innerHTML = pennantSVG(team.primary, team.secondary, team.abbr);
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
  'moon-main': { rx: 36, ry: 36 }
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

  // The hiker's walk-cycle animation only plays while the page is actively
  // scrolling; it freezes mid-stride once scrolling stops (see .walking in
  // hiker.js) rather than looping in place forever.
  let walkStopTimer = null;
  function setWalking(active) {
    const rig = wrap.querySelector('.hiker-rig');
    if (rig) rig.classList.toggle('walking', active);
  }
  function onScroll() {
    setWalking(true);
    clearTimeout(walkStopTimer);
    walkStopTimer = setTimeout(() => setWalking(false), 150);
    update();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
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
