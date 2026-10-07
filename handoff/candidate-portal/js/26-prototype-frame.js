/* ============================================================
   VIEWPORT SWITCHER — prototype chrome.
   The app itself responds to its container, not to the window, so one
   document renders phone, tablet and desktop without a reload.
   ============================================================ */
/* Each frame keeps its true pixel size so the container queries inside it
   resolve honestly — a 1280px desktop frame must query as 1280 even when the
   preview pane is 700px wide. It is scaled down to fit instead of squashed,
   which is the only way the desktop layout is visible in a narrow panel. */
const VP_SIZE = {mobile:[390,844], tablet:[744,1133], fluid:[1440,900]};
const fitBox = document.getElementById('fit');

function fitFrame(){
  const vp = device.dataset.vp;
  const stage = fitBox.parentElement;
  const pct = document.getElementById('vpscale');
  /* Desktop is not a device. It has no bezel and no fixed size: it takes the
     whole stage, which is also the honest preview, because a desktop browser
     is whatever width the person's window happens to be. */
  if(vp === 'fluid'){
    device.style.transform = 'none';
    device.style.width = '100%';
    device.style.height = Math.max(520, window.innerHeight - stage.getBoundingClientRect().top) + 'px';
    fitBox.style.width = '100%';
    fitBox.style.height = device.style.height;
    if(pct) pct.textContent = Math.round(stage.clientWidth) + 'px';
    return;
  }
  const [w, h] = VP_SIZE[vp] || VP_SIZE.mobile;
  device.style.width = w + 'px';
  device.style.height = Math.min(h, Math.round(window.innerHeight * 0.82)) + 'px';
  const avail = stage.clientWidth - 8;
  const scale = Math.min(1, avail / w);
  device.style.transform = scale < 1 ? `scale(${scale})` : 'none';
  fitBox.style.width = Math.round(w * scale) + 'px';
  fitBox.style.height = Math.round(parseFloat(device.style.height) * scale) + 'px';
  if(pct) pct.textContent = scale < 1 ? Math.round(scale * 100) + '%' : '100%';
}

/* ============================================================
   AND THE FRAME YOU CHOSE SURVIVES A RELOAD.

   The hash already restores the app: `#day34/cohort`, `#leader/leadEvals`
   — portal, stage and view, written by the renderer and read by views.js at
   boot. The frame was the one thing it did not carry, so reloading while
   reading a desktop screen dropped you back into the 390px phone and you
   had to press Desktop again. Reviewing this prototype is mostly reload,
   look, edit, reload.

   `localStorage` AND NOT THE HASH, and the line is between the two kinds of
   state that are on this page. The hash is the APP: it is what you send
   somebody when you want them to see the screen you are looking at, and the
   renderer writes it on every render. The frame is not the app — it is
   prototype chrome, this reader's preference for how to look at it, and it
   has no business in a link or in a function that runs 200 times a sweep.
   Keeping it out also keeps `histWrite`'s contract intact: the URL stays
   three fields the boot reader already knows how to parse.

   IN A TRY/CATCH, for the reason `histWrite` is: `localStorage` THROWS
   rather than returning null when storage is denied — a sandboxed iframe or
   a browser set to block site data — and an unguarded read here is the last
   statement in the file, so it would take `fitFrame()` with it and leave the
   frame unsized. A refused write costs the preference and nothing else.

   NO `render()` ON THE RESTORE, though the click handler has one. Nothing in
   the JS reads `data-vp` — the app answers its CONTAINER, which is the whole
   design of this preview — so the attribute plus `fitFrame()` is the entire
   layout change. The click handler's render is there for `S.nav = false`,
   closing the drawer you may have left open on the phone, and at boot the
   drawer is already closed. Calling it anyway would mean a fourth boot
   render for nothing.
   ============================================================ */
const VP_KEY = 'tn-vp';

function vpSet(v, boot){
  if(!VP_SIZE[v]) v = 'mobile';
  document.querySelectorAll('#vp button').forEach(x => x.classList.toggle('on', x.dataset.vp === v));
  device.dataset.vp = v;
  try { localStorage.setItem(VP_KEY, v); } catch(e){ /* storage denied: the
    choice stops surviving a reload, the switcher keeps working */ }
  if(!boot){ S.nav = false; render(); }
  fitFrame();
}

document.getElementById('vp').addEventListener('click', e => {
  const b = e.target.closest('button[data-vp]');
  if(!b) return;
  vpSet(b.dataset.vp);
});
window.addEventListener('resize', fitFrame);

let vpFirst = null;
try { vpFirst = localStorage.getItem(VP_KEY); } catch(e){}
vpSet(vpFirst || 'mobile', true);
/* THE FRAME IS SHOWN ONLY NOW. The early script above hid it; this is the
   first moment the app is actually inside it — the bundle has parsed, every
   pass has run and `fitFrame` has just set the exact scale. Clearing the
   inline value rather than setting `visible` hands the property back to the
   stylesheet, so nothing here can outrank a rule §01 might want later. */
device.style.visibility = '';
