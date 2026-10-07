function pageLabel(page){
  const h = page.querySelector('.ph h1');
  const title = h ? h.textContent.trim() : '';
  const mod = crumbMod();
  if(!PARENT[S.view] && mod) return mod[0];
  if(title) return title;
  const c = page.querySelector('.crumb span:not(.sep)');
  if(c && c.textContent.trim()) return c.textContent.trim();
  return mod ? mod[0] : null;
}

const CRUMB_STACK = [];
let CRUMB_PREV = null;

function syncStack(){
  const n = S.hist.length;
  if(n < CRUMB_STACK.length){ CRUMB_STACK.length = n; return; }
  while(CRUMB_STACK.length < n){
    const at = CRUMB_STACK.length;
    CRUMB_STACK.push(at === n - 1 ? CRUMB_PREV : null);
  }
}

function trailParts(page){
  const label = pageLabel(page);
  syncStack();

  const out = S.hist.map((v, i) => {
    const m = crumbMod(v);
    return {label: CRUMB_STACK[i] || (m ? m[0] : null), go: v};
  }).filter(p => p.label);

  if(!out.length && PARENT[S.view]){
    const m = crumbMod();
    if(m) out.push({label: m[0], go: m[1]});
  }

  if(label) out.push({label});
  CRUMB_PREV = label;
  return out;
}

function stripPageHead(page){
  const h = page.querySelector('.ph h1');
  if(h) h.remove();
  const c = page.querySelector('.crumb');
  if(c) c.remove();
}

function drawTrail(trail, parts){
  const sep = `<span class="crumb-sep" aria-hidden="true">${I.chevRight}</span>`;
  trail.innerHTML = parts.map((p, i) => {
    const now = i === parts.length - 1;
    return `<li class="crumb-i${now ? ' crumb-now' : ''}">${i ? sep : ''}${now
      ? `<span class="crumb-l" aria-current="page">${p.label}</span>`
      : p.go
        ? `<a class="crumb-l" data-go="${p.go}">${p.label}</a>`
        : `<span class="crumb-l">${p.label}</span>`}</li>`;
  }).join('');
}

function tidyPh(page){
  const ph = page.querySelector('.ph');
  if(!ph) return;
  const top = ph.querySelector('.ph-top');
  if(top && !top.firstElementChild) top.remove();
  const main = ph.querySelector('.ph-main');
  if(main && !main.firstElementChild) main.remove();
  ph.classList.toggle('ph-bare', !ph.firstElementChild);
  ph.classList.toggle('ph-backonly',
    !!ph.querySelector('.ph-back') &&
    ph.querySelectorAll('.ph-main > *, .ph > *:not(.ph-main)').length === 1 &&
    ph.querySelectorAll('.ph-top > *').length === 1);
}

function markMobHead(page){
  page.classList.remove('mobph-on');
  const old = page.querySelector(':scope > .mob-ph');
  if(old) old.remove();
  const band = page.querySelector(':scope > .modhead');
  if(!band || !band.querySelector('.ai-aura.talsum')) return;
  if(page.querySelector('.ph-you')) return;
  page.classList.add('mobph-on');
}

function placeTopbar(){
  const trail = device.querySelector('.shell .crumb-trail');
  const page  = device.querySelector('.view-col .page');
  if(!trail || !page) return;

  const parts = trailParts(page);
  stripPageHead(page);
  drawTrail(trail, parts);
  tidyPh(page);
  markMobHead(page);
}

let _pfRO = null;
function placePfStick(){
  if(_pfRO){ _pfRO.disconnect(); _pfRO = null; }
  const page = device.querySelector('.view-col .page');
  if(!page) return;
  if(!page.querySelector(':scope > .sec.pf-cs')) return;
  const band = page.querySelector(':scope > .modhead');
  const write = () => page.style.setProperty('--pf-stick', (band ? band.offsetHeight : 0) + 'px');
  write();
  if(!band || typeof ResizeObserver !== 'function') return;
  _pfRO = new ResizeObserver(write);
  _pfRO.observe(band);
}

const _baseTop = render;
render = function(){
  _baseTop();
  try { placeTopbar(); } catch(e){ console.warn('topbar', e); }
  try { placePfStick(); } catch(e){ console.warn('pfstick', e); }
};

render();
