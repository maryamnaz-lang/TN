/* ============================================================================
   orb.js — behaviour for the brand orb
   ----------------------------------------------------------------------------
   Classic script. No import/export. Wrap is an IIFE; the only global is
   window.BorbOrb.

   Every state except "speaking" is pure CSS. The speaking state is not
   expressible in CSS: it interpolates each chevron's centreline from the mark's
   own geometry out to a vibrating string, so the path is regenerated per frame.

   Load with a plain <script src="orb.js"></script>. Elements are picked up
   automatically on DOMContentLoaded; call BorbOrb.mount(el) for anything added
   later.
   ========================================================================== */

(function () {
  'use strict';

  var BORB_SELECTOR = '.borb';
  var BORB_SPEAKING = 'speaking';
  var BORB_SAMPLES = 64;          // points along each band
  var BORB_MORPH_MS = 460;        // chevron -> thread transition
  var BORB_THIN = 2.05;           // thread half-width, in viewBox units
  var BORB_WAVE_X0 = -16;
  var BORB_WAVE_W = 132;
  var BORB_WAVE_Y = 50;
  var BORB_SEED_W = 13;
  var BORB_SEED_HALF = 2.9;

  /* Each chevron reduced to a centreline (bottom tip -> apex -> top tip) plus
     the measured half-thickness of its stroke. These are viewBox units, so the
     geometry scales with --borb-size for free. */
  var BORB_CHEV = [
    { pts: [[7.97, 95.12], [47.94, 49.87], [24.16, 23.01]], half: 3.82 },
    { pts: [[29.95, 95.12], [69.79, 50.00], [56.94, 35.35]], half: 3.73 },
    { pts: [[70.18, 74.55], [91.65, 49.74], [51.93, 4.37]], half: 3.63 }
  ];

  function borbSmooth(v) { return v * v * v * (v * (v * 6 - 15) + 10); }
  function borbClamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }
  function borbWin(v, a, b) { return borbSmooth(borbClamp01((v - a) / (b - a))); }
  /* magnetic: most of the distance covered early, then it locks on. No
     overshoot — that would read as jello rather than pull. */
  function borbMagnetic(v) { return 1 - Math.pow(1 - v, 3.4); }

  function borbResample(poly, n) {
    var segs = [];
    var total = 0;
    var i;
    for (i = 0; i < poly.length - 1; i++) {
      var d = Math.sqrt(
        Math.pow(poly[i + 1][0] - poly[i][0], 2) +
        Math.pow(poly[i + 1][1] - poly[i][1], 2)
      );
      segs.push(d);
      total += d;
    }
    var out = [];
    for (i = 0; i < n; i++) {
      var target = (i / (n - 1)) * total;
      var acc = 0;
      var k = 0;
      while (k < segs.length - 1 && acc + segs[k] < target) { acc += segs[k]; k++; }
      var t = segs[k] === 0 ? 0 : (target - acc) / segs[k];
      out.push([
        poly[k][0] + (poly[k + 1][0] - poly[k][0]) * t,
        poly[k][1] + (poly[k + 1][1] - poly[k][1]) * t
      ]);
    }
    return out;
  }

  var BORB_CHEV_PTS = [];
  (function () {
    for (var i = 0; i < BORB_CHEV.length; i++) {
      BORB_CHEV_PTS.push(borbResample(BORB_CHEV[i].pts, BORB_SAMPLES));
    }
  }());

  /* Mid-transition the chevron folds through itself, which leaves visible
     corners. Relax the polyline toward its neighbours — strongest halfway
     through, zero at both ends so the chevron and the thread stay exact. */
  function borbRelax(pts, strength) {
    if (strength <= 0.001) { return pts; }
    var cur = pts;
    for (var pass = 0; pass < 2; pass++) {
      var next = cur.slice();
      for (var i = 1; i < cur.length - 1; i++) {
        var ax = (cur[i - 1][0] + cur[i + 1][0]) / 2;
        var ay = (cur[i - 1][1] + cur[i + 1][1]) / 2;
        next[i] = [
          cur[i][0] + (ax - cur[i][0]) * strength,
          cur[i][1] + (ay - cur[i][1]) * strength
        ];
      }
      cur = next;
    }
    return cur;
  }

  function borbBuildBand(centre, half) {
    var top = [];
    var bot = [];
    var i;
    for (i = 0; i < centre.length; i++) {
      var p = centre[i];
      var a = centre[Math.max(0, i - 1)];
      var b = centre[Math.min(centre.length - 1, i + 1)];
      var nx = -(b[1] - a[1]);
      var ny = (b[0] - a[0]);
      var len = Math.sqrt(nx * nx + ny * ny) || 1;
      nx /= len; ny /= len;
      top.push([p[0] + nx * half, p[1] + ny * half]);
      bot.push([p[0] - nx * half, p[1] - ny * half]);
    }
    function fmt(q) { return q[0].toFixed(2) + ' ' + q[1].toFixed(2); }
    var d = 'M ' + fmt(top[0]);
    for (i = 1; i < top.length; i++) { d += ' L ' + fmt(top[i]); }
    for (i = bot.length - 1; i >= 0; i--) { d += ' L ' + fmt(bot[i]); }
    return d + ' Z';
  }

  /* String motion: two counter-travelling modes under a slow amplitude swell,
     with an envelope pinned to zero at both ends so all three threads meet at
     the same two points and separate only through the middle. */
  function borbStringPoint(i, band, t, amp) {
    var u = i / (BORB_SAMPLES - 1);
    var x = BORB_WAVE_X0 + u * BORB_WAVE_W;
    var env = Math.sin(Math.PI * u);
    var ph = band * 2.3;
    var swell = 0.6 + 0.4 * Math.sin(t * 1.4 + ph);
    var f1 = 2.0 + band * 0.6;
    var f2 = 3.4 + band * 0.9;
    var w =
      0.70 * Math.sin(u * Math.PI * f1 - t * 2.4 + ph) +
      0.42 * Math.sin(u * Math.PI * f2 + t * 1.7 - ph * 1.4) +
      0.20 * Math.sin(u * Math.PI * 6.2 + t * 3.1 + ph);
    return [x, BORB_WAVE_Y + amp * env * swell * w * 20];
  }

  function borbCreate(root) {
    if (!root || root.getAttribute('data-borb-bound') === '1') { return null; }
    root.setAttribute('data-borb-bound', '1');

    var svg = root.querySelector('.borb__waves');
    var blades = root.querySelectorAll('.borb__blade');
    if (!svg) { return null; }
    var paths = svg.querySelectorAll('path');
    if (paths.length < 3) { return null; }

    var reduced = false;
    if (window.matchMedia) {
      reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /* a faster transition needs more relaxation: each frame covers more of the
       morph, so the folding corners are sharper between frames */
    var softenPeak = 0.55 + 0.25 * Math.min(1, 900 / BORB_MORPH_MS - 1);

    var morph = 0;
    var target = 0;
    var raf = null;
    var last = null;

    function frame(now) {
      if (last === null) { last = now; }
      var dt = Math.min(BORB_MORPH_MS * 0.06, now - last);
      last = now;
      var step = dt / BORB_MORPH_MS;
      morph = target > morph ? Math.min(target, morph + step) : Math.max(target, morph - step);

      var t = now / 1000;

      /* the generated band sits within ~2px of the real chevron at morph 0, so
         cross-fade the CSS chevrons out across the first slice of the move */
      var fade = borbWin(morph, 0.01, 0.20);
      svg.style.opacity = String(fade);
      for (var bi = 0; bi < blades.length; bi++) {
        blades[bi].style.opacity = morph > 0 ? String(1 - fade) : '';
      }

      /* one cubic Bezier from chevron through a gathered seed out to the
         thread: a single curve, so velocity never drops to zero partway */
      var k = borbMagnetic(morph);
      var k1 = 1 - k;
      var wC = k1 * k1 * k1;
      var wS = 3 * k1 * k * (k1 + k);
      var wW = k * k * k;
      var amp = reduced ? 0 : borbWin(morph, 0.62, 1.00);
      var soften = Math.sin(Math.PI * morph) * softenPeak;

      for (var b = 0; b < 3; b++) {
        var centre = [];
        for (var i = 0; i < BORB_SAMPLES; i++) {
          var u = i / (BORB_SAMPLES - 1);
          var c = BORB_CHEV_PTS[b][i];
          var sx = 50 + (u - 0.5) * BORB_SEED_W;
          var s = borbStringPoint(i, b, t, amp);
          centre.push([
            wC * c[0] + wS * sx + wW * s[0],
            wC * c[1] + wS * BORB_WAVE_Y + wW * s[1]
          ]);
        }
        var half = wC * BORB_CHEV[b].half + wS * BORB_SEED_HALF + wW * BORB_THIN;
        paths[b].setAttribute('d', borbBuildBand(borbRelax(centre, soften), half));
      }

      if (morph === 0 && target === 0) { raf = null; last = null; return; }
      raf = window.requestAnimationFrame(frame);
    }

    function setSpeaking(on) {
      target = on ? 1 : 0;
      if (raf === null) {
        last = null;
        raf = window.requestAnimationFrame(frame);
      }
    }

    function sync() {
      setSpeaking(root.getAttribute('data-state') === BORB_SPEAKING);
    }

    var observer = null;
    if (window.MutationObserver) {
      observer = new window.MutationObserver(sync);
      observer.observe(root, { attributes: true, attributeFilter: ['data-state'] });
    }

    sync();

    return {
      el: root,
      refresh: sync,
      destroy: function () {
        if (observer) { observer.disconnect(); }
        if (raf !== null) { window.cancelAnimationFrame(raf); raf = null; }
        root.removeAttribute('data-borb-bound');
      }
    };
  }

  var borbInstances = [];

  function borbMount(root) {
    var made = borbCreate(root);
    if (made) { borbInstances.push(made); }
    return made;
  }

  function borbMountAll(scope) {
    var host = scope || document;
    var found = host.querySelectorAll(BORB_SELECTOR);
    for (var i = 0; i < found.length; i++) { borbMount(found[i]); }
    return borbInstances.length;
  }

  function borbDestroyAll() {
    for (var i = 0; i < borbInstances.length; i++) { borbInstances[i].destroy(); }
    borbInstances = [];
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { borbMountAll(); });
  } else {
    borbMountAll();
  }

  window.BorbOrb = {
    mount: borbMount,
    mountAll: borbMountAll,
    destroyAll: borbDestroyAll
  };
}());
