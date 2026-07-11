// === Austin Miller personal site — data + scroll-driven hiker ===

// STATES — checked = visited
const STATES = {
  AL:false, AK:false, AZ:true, AR:false, CA:true, CO:true, CT:true,
  DE:true, FL:true, GA:true, HI:false, ID:true, IL:true, IN:true,
  IA:true, KS:true, KY:true, LA:true, ME:true, MD:true, MA:true,
  MI:true, MN:false, MS:false, MO:true, MT:true, NE:true, NV:true,
  NH:true, NJ:true, NM:false, NY:true, NC:false, ND:false, OH:true,
  OK:false, OR:true, PA:true, RI:true, SC:true, SD:false, TN:false,
  TX:true, UT:true, VT:true, VA:true, WA:true, WV:false, WI:true, WY:true
};

// Tile-map layout of the US (12 cols × 8 rows)
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

// BALLPARKS — in order they appear on the list, [name, team, visited]
const BALLPARKS = [
  ['Fenway Park',       'Red Sox',         true ],
  ['Yankee Stadium',    'Yankees',         true ],
  ['Camden Yards',      'Orioles',         true ],
  ['Citi Field',        'Mets',            true ],
  ['Citizens Bank',     'Phillies',        true ],
  ['Nationals Park',    'Nationals',       true ],
  ['Truist Park',       'Braves',          true ],
  ['LoanDepot Park',    'Marlins',         true ],
  ['Great American',    'Reds',            true ],
  ['Busch Stadium',     'Cardinals',       true ],
  ['Kauffman Stadium',  'Royals',          true ],
  ['Coors Field',       'Rockies',         true ],
  ['Oracle Park',       'Giants',          true ],
  ['Steinbrenner Fld',  'Rays · temp',     true ],
  ['Wrigley Field',     'Cubs',            false],
  ['Progressive Fld',   'Guardians',       false],
  ['Rate Field',        'White Sox',       false],
  ['Target Field',      'Twins',           false],
  ['Comerica Park',     'Tigers',          false],
  ['American Family',   'Brewers',         false],
  ['PNC Park',          'Pirates',         false],
  ['Daikin Park',       'Astros',          false],
  ['Globe Life Field',  'Rangers',         false],
  ['Angel Stadium',     'Angels',          false],
  ['Dodger Stadium',    'Dodgers',         false],
  ['Petco Park',        'Padres',          false],
  ['Chase Field',       'Diamondbacks',    false],
  ['T-Mobile Park',     'Mariners',        false],
  ['Rogers Centre',     'Blue Jays',       false],
  ['Sutter Health',     'Athletics',       false]
];

// NH 4000-FOOTERS (list order = the official 48-peak list)
const PEAKS = [
  ['Mt. Washington',    false],
  ['Mt. Adams',         false],
  ['Mt. Jefferson',     false],
  ['Mt. Monroe',        false],
  ['Mt. Madison',       false],
  ['Mt. Lafayette',     true ],
  ['Mt. Lincoln',       true ],
  ['South Twin',        false],
  ['Carter Dome',       false],
  ['Mt. Moosilauke',    false],
  ['Mt. Eisenhower',    false],
  ['North Twin',        false],
  ['Mt. Carrigain',     false],
  ['Mt. Bond',          false],
  ['Middle Carter',     false],
  ['West Bond',         false],
  ['Mt. Garfield',      true ],
  ['Mt. Liberty',       true ],
  ['South Carter',      false],
  ['Wildcat (A)',       false],
  ['Mt. Hancock',       false],
  ['South Kinsman',     false],
  ['Mt. Field',         false],
  ['Mt. Osceola',       false],
  ['Mt. Flume',         true ],
  ['South Hancock',     false],
  ['Mt. Pierce',        false],
  ['North Kinsman',     true ],
  ['Mt. Willey',        false],
  ['Bondcliff',         false],
  ['Zealand Mtn',       false],
  ['N. Tripyramid',     false],
  ['Mt. Cabot',         false],
  ['East Osceola',      false],
  ['M. Tripyramid',     false],
  ['Cannon Mtn',        false],
  ['Mt. Hale',          false],
  ['Mt. Jackson',       false],
  ['Mt. Tom',           false],
  ['Wildcat D',         false],
  ['Mt. Moriah',        false],
  ['Mt. Passaconaway',  false],
  ["Owl's Head",        false],
  ['Galehead',          false],
  ['Mt. Whiteface',     false],
  ['Mt. Waumbek',       false],
  ['Mt. Isolation',     false],
  ['Mt. Tecumseh',      false]
];

// === Render lists once DOM is ready ===
function renderLists() {
  // US map
  const usMap = document.getElementById('usMap');
  if (usMap) {
    TILE_MAP.forEach(row => {
      row.forEach(code => {
        const div = document.createElement('div');
        if (!code) {
          div.className = 'cell empty';
        } else {
          div.className = 'cell' + (STATES[code] ? ' done' : '');
          div.textContent = code;
          div.title = code + (STATES[code] ? ' ✓' : '');
        }
        usMap.appendChild(div);
      });
    });
  }

  // Ballparks
  const bp = document.getElementById('ballparksList');
  if (bp) {
    BALLPARKS.forEach(([name, team, done]) => {
      const row = document.createElement('div');
      row.className = 'row-chk' + (done ? ' done' : '');
      row.innerHTML = '<span class="box"></span><span>' + name + '</span>';
      bp.appendChild(row);
    });
  }

  // Peaks
  const peaksEl = document.getElementById('peaksList');
  if (peaksEl) {
    PEAKS.forEach(([name, done]) => {
      const row = document.createElement('div');
      row.className = 'row-chk' + (done ? ' done' : '');
      row.innerHTML = '<span class="box"></span><span>' + name + '</span>';
      peaksEl.appendChild(row);
    });
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
  renderLists();
  initHiker();
  initCards();
});
