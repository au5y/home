/* Returns an inline SVG string for the hiker with walk animation.
   Usage: hikerSVG({size:60, facing:'right'}) -> string
*/
function hikerSVG(opts){
  opts = opts || {};
  var size = opts.size || 70;
  var facing = opts.facing || 'right';
  var flip = facing === 'left' ? 'transform:scaleX(-1);transform-origin:center;' : '';
  var id = 'hk' + Math.floor(Math.random()*1e6);
  return `
  <svg class="hiker" viewBox="0 0 60 90" width="${size}" height="${size*1.5}" style="${flip}overflow:visible;">
    <defs>
      <style>
        .hk-body{stroke:#f4e4b8;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;fill:none;}
        .hk-pack{fill:#6b9b6c;stroke:#f4e4b8;stroke-width:1.6;}
        .hk-strap{stroke:#f4e4b8;stroke-width:1.4;fill:none;}
        .hk-hat{fill:#2d5a3d;stroke:#f4e4b8;stroke-width:1.4;}
        .hk-head{fill:#1a2420;stroke:#f4e4b8;stroke-width:1.8;}
        .hk-pole{stroke:#c4a574;stroke-width:1.8;stroke-linecap:round;}
        .${id} .leg-front{animation:${id}-front 0.7s infinite ease-in-out;animation-play-state:paused;transform-origin:30px 58px;}
        .${id} .leg-back {animation:${id}-back  0.7s infinite ease-in-out;animation-play-state:paused;transform-origin:30px 58px;}
        .${id} .arm-front{animation:${id}-arm-f 0.7s infinite ease-in-out;animation-play-state:paused;transform-origin:30px 40px;}
        .${id} .arm-back {animation:${id}-arm-b 0.7s infinite ease-in-out;animation-play-state:paused;transform-origin:30px 40px;}
        .${id} .bob      {animation:${id}-bob   0.7s infinite ease-in-out;animation-play-state:paused;}
        .${id}.walking .leg-front,
        .${id}.walking .leg-back,
        .${id}.walking .arm-front,
        .${id}.walking .arm-back,
        .${id}.walking .bob{animation-play-state:running;}
        @keyframes ${id}-front{0%,100%{transform:rotate(-22deg);}50%{transform:rotate(24deg);} }
        @keyframes ${id}-back {0%,100%{transform:rotate(22deg);} 50%{transform:rotate(-22deg);} }
        @keyframes ${id}-arm-f{0%,100%{transform:rotate(20deg);} 50%{transform:rotate(-24deg);} }
        @keyframes ${id}-arm-b{0%,100%{transform:rotate(-20deg);}50%{transform:rotate(24deg);} }
        @keyframes ${id}-bob  {0%,100%{transform:translateY(0);} 50%{transform:translateY(-1.5px);} }
      </style>
    </defs>
    <g class="${id} hiker-rig">
      <g class="bob">
        <!-- backpack -->
        <path class="hk-pack" d="M16 38 Q14 36 16 33 L24 30 Q26 30 26 33 L26 56 Q26 58 24 58 L17 58 Q15 58 15 56 Z"/>
        <line class="hk-strap" x1="22" y1="34" x2="28" y2="40"/>
        <line class="hk-strap" x1="22" y1="50" x2="28" y2="52"/>
        <!-- body torso -->
        <path class="hk-body" d="M30 40 L30 58"/>
        <!-- head -->
        <circle class="hk-head" cx="32" cy="32" r="5.5"/>
        <!-- hat (brim + crown) -->
        <path class="hk-hat" d="M24 30 L40 30 L36 26 Q32 22 28 26 Z"/>
        <line class="hk-strap" x1="22" y1="30.5" x2="42" y2="30.5" stroke-width="2"/>
        <!-- arms -->
        <line class="hk-body arm-back"  x1="30" y1="40" x2="36" y2="52"/>
        <line class="hk-body arm-front" x1="30" y1="40" x2="38" y2="50"/>
        <!-- hiking pole -->
        <line class="hk-pole arm-front" x1="38" y1="50" x2="44" y2="76"/>
      </g>
      <!-- legs (outside bob so feet stay grounded) -->
      <line class="hk-body leg-back"  x1="30" y1="58" x2="26" y2="74"/>
      <line class="hk-body leg-front" x1="30" y1="58" x2="34" y2="74"/>
    </g>
  </svg>`;
}
window.hikerSVG = hikerSVG;
