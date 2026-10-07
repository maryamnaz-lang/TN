function _mhIsTal(el){
  return el.classList.contains('sec')
    && (!!el.querySelector('.ai-aura, .ai-label') || el.classList.contains('ask-chips'));
}

function placeBand(){
  const main = device.querySelector('.view-col > .main') || device.querySelector('.main');
  if(!main) return;
  const page = main.querySelector('.page');
  if(!page || page.classList.contains('ask-page')) return;
  if(page.closest('.auth-card')) return;
  if(page.querySelector(':scope > .modhead')) return;

  const ph = page.querySelector(':scope > .ph');
  if(!ph) return;

  const members = [];
  const crumb = page.querySelector(':scope > .crumb');
  if(crumb && crumb.nextElementSibling === ph) members.push(crumb);
  members.push(ph);
  let n = ph.nextElementSibling, tal = false;
  while(n){
    if(n.classList.contains('no-band')) break;
    const isTal = _mhIsTal(n);
    if(isTal && tal) break;
    if(!isTal && !n.classList.contains('ask-sec') && !n.classList.contains('head-sec')) break;
    if(isTal) tal = true;
    members.push(n);
    n = n.nextElementSibling;
  }

  const band = document.createElement('div');
  band.className = 'modhead';
  page.insertBefore(band, members[0]);
  members.forEach(el => band.appendChild(el));

  const aura = band.querySelector('.ai-aura');
  if(!aura) return;
  const head = aura.querySelector(':scope > .ai-head');
  const foot = aura.querySelector(':scope > .ai-foot');
  if(!head) return;

  let doer = foot && foot.querySelector('.ai-do, .btn-p');
  if(!doer && foot){
    const link = foot.querySelector('a.lk, a.lnk, a[data-go]');
    if(link){
      const b = document.createElement('button');
      b.className = 'btn btn-p btn-sm ai-do';
      if(link.dataset.go) b.setAttribute('data-go', link.dataset.go);
      if(link.dataset.talAsk) b.setAttribute('data-tal-ask', link.dataset.talAsk);
      b.textContent = link.textContent.trim();
      link.replaceWith(b);
      doer = b;
    }
  }
  if(doer){
    head.appendChild(doer);
    aura.classList.add('ai-act-top');
  }

  const asks = aura.querySelector(':scope > .ai-asks');
  if(foot && asks && foot !== asks){
    const moving = [...foot.children].filter(c => !c.classList.contains('sp'));
    moving.reverse().forEach(c => asks.insertBefore(c, asks.firstChild));
    foot.remove();
  }
  const box = aura.querySelector(':scope > .ai-asks, :scope > .ai-foot');
  if(box){
    const sp = box.querySelector(':scope > .sp');
    if(sp) box.appendChild(sp);
    if(!box.querySelector('.btn, .chip-tal')) box.classList.add('ai-foot-bare');
  }
}

const _baseBand = render;
render = function(){
  _baseBand();
  try { placeBand(); } catch(e){ console.warn('band', e); }
};


function trimAuthBack(){
  if(S.view !== 'create') return;
  const b = device.querySelector('.auth-card .form-page .ph-back');
  if(b) b.remove();
}

const _baseAuthBack = render;
render = function(){
  _baseAuthBack();
  try { trimAuthBack(); } catch(e){ console.warn('authback', e); }
};


function placeLevelCards(){
  device.querySelectorAll('.main .lvl-hero').forEach(hero => {
    if(hero.querySelector(':scope > .lvl-foot')) return;   /* already built */

    const foot = document.createElement('div');
    foot.className = 'lvl-foot';

    const eb = hero.querySelector(':scope > .eb, :scope > .eyebrow');
    if(eb) foot.appendChild(eb);

    const acts = document.createElement('div');
    acts.className = 'lvl-foot-a';

    const inside = hero.querySelector(':scope > .lvl-split-a');
    if(inside){
      [...inside.querySelectorAll('.btn')].forEach(b => acts.appendChild(b));
      inside.remove();
    }

    const host = hero.closest('.sec');
    const next = host && host.nextElementSibling;
    if(next && next.classList.contains('sec')){
      const btns = [...next.querySelectorAll('.btn')];
      const other = next.querySelector('h2, h3, p, .tile, .sec-h, input, .kv, .ch, .ag');
      if(btns.length && !other){
        btns.forEach(b => acts.appendChild(b));
        next.remove();
      }
    }

    if(!eb && !acts.children.length) return;
    if(acts.children.length) foot.appendChild(acts);
    hero.appendChild(foot);
    hero.classList.add('lvl-foot-card');
  });
}

const DARK_CARD = '.plate, .cert, .sec.on-dark, .score.on-dark, .lead-b, .lvl-hero';

function placeDark(){
  if(device.querySelector('.page > .modhead > .head-col, .page > .head-col')) return;
  const main = device.querySelector('.view-col > .main') || device.querySelector('.main');
  if(!main) return;
  const page = main.querySelector('.page');
  if(!page || page.classList.contains('ask-page')) return;
  if(page.closest('.auth-card')) return;

  const band = page.querySelector(':scope > .modhead');
  const anchor = band || page.querySelector(':scope > .crumb');
  if(!anchor) return;

  const hosts = [];
  for(const k of page.children){
    if(k === anchor || k === band) continue;
    if(k.classList.contains('keep-place')) continue;
    if(k.matches(DARK_CARD) || k.querySelector(DARK_CARD)) hosts.push(k);
  }
  if(!hosts.length) return;

  if(band){
    hosts.forEach(h => {
      let host = h;
      if(h.matches(DARK_CARD)){
        const sec = document.createElement('div');
        sec.className = 'sec';
        h.replaceWith(sec);
        sec.appendChild(h);
        host = sec;
      }
      host.classList.add('sec-dark');
      if(band.lastElementChild !== host) band.appendChild(host);
    });
    return;
  }

  let after = anchor;
  hosts.forEach(h => {
    if(after.nextElementSibling !== h) after.insertAdjacentElement('afterend', h);
    after = h;
  });
}

const PLATE_IC = [
  [/\$|\bfee\b|paid|price/i,                        'wallet'],
  [/assessment|average|\bscore/i,                   'chart'],
  [/chapter|module|course|curriculum/i,             'book'],
  [/\d{1,2}:\d{2}|[ap]\.?m\.?|\bET\b|\bPT\b/i,     'time'],
  [/minute|hour|\bmin\b|long/i,                     'hourglass'],
  [/monday|tuesday|wednesday|thursday|friday|saturday|sunday|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|today|tomorrow/i, 'calendar'],
  [/\bcalls?\b|recorded|video/i,                    'video'],
  [/situation|conversation|question|asks|hypothetical/i,'chat'],
  [/others|people|cohort|candidates|members|one to one|1:1/i,'group'],
  [/online|link|remote/i,                           'launch'],
  [/report|signed|level/i,                          'certificate']
];
function plateIcon(t){
  const s = String(t || '').replace(/<[^>]*>/g, ' ');
  for(const [re,k] of PLATE_IC) if(re.test(s)) return I[k];
  return I.circle;
}
const PLATE_FIG = /^([\s\S]*?)\s*<b>([\s\S]*?)<\/b>\s*$/;
function plateRow(t, bare){
  const m = t.match(PLATE_FIG);
  const lab = m ? m[1].trim() : t;
  return `<span class="plate-bi">${bare ? '' : plateIcon(t)}` +
    (lab ? `<span>${lab}</span>` : '') +
    (m ? `<b class="plate-v">${m[2]}</b>` : '') + `</span>`;
}
function splitPlateBody(plate){
  const b = plate.querySelector(':scope > .plate-b');
  if(!b || b.querySelector(':scope > .plate-bi')) return;
  const parts = b.innerHTML.split(/\s*(?:&middot;|·)\s*/).map(s => s.trim()).filter(Boolean);
  if(parts.length < 2) return;
  const tab = parts.every(p => PLATE_FIG.test(p));
  b.classList.add('plate-lines');
  if(tab) b.classList.add('plate-tab');
  b.innerHTML = parts.map(p => plateRow(p, tab)).join('');
}

function plateUrgent(plate, when, label){
  const flag = plate.dataset.urgent;
  if(flag === '1' || flag === 'true')  return true;
  if(flag === '0' || flag === 'false') return false;
  return PLATE_SOON.test(when || '') || PLATE_SOON.test(label || '');
}

function placePlates(){
  device.querySelectorAll('.plate').forEach(plate => {
    if(plate.querySelector(':scope > .plate-h')) return;   /* already arranged */
    splitPlateBody(plate);

    const eb   = plate.querySelector(':scope > .plate-eb');
    const t    = plate.querySelector(':scope > .plate-t');
    const d    = plate.querySelector(':scope > .plate-d');
    const b    = plate.querySelector(':scope > .plate-b');
    const n    = plate.querySelector(':scope > .plate-n');
    const a    = plate.querySelector(':scope > .plate-a');
    const who  = plate.querySelector(':scope > .plate-who');
    const x    = plate.querySelector(':scope > .plate-x');
    if(!eb && !t) return;

    const head = document.createElement('div');
    head.className = 'plate-h';

    let when = plate.dataset.when || '';
    if(eb){
      const cut = eb.textContent.indexOf('·');
      if(cut > -1){
        when = eb.textContent.slice(cut + 1).trim();
        eb.textContent = eb.textContent.slice(0, cut).trim();
      }
      if(eb.textContent) head.appendChild(eb);
    }

    if(!plateUrgent(plate, when, eb ? eb.textContent : ''))
      plate.classList.add('plate-quiet');

    const bare = !head.childElementCount && !!t;
    if(bare) head.classList.add('plate-h-bare');


    if(when){
      const w = document.createElement('span');
      w.className = 'plate-when';
      w.innerHTML = I.time + '<b>' + when + '</b>';
      head.appendChild(w);
    }

    if(bare) head.appendChild(t);

    const glow = plate.querySelector(':scope > .dark-glow');
    if(glow) plate.insertBefore(head, glow.nextSibling);
    else plate.insertBefore(head, plate.firstChild);

    [t, d, b, n, a, who, x].forEach(el => {
      if(el && el.parentElement !== head) plate.appendChild(el);
    });
  });
}

const _basePlate = render;
render = function(){
  _basePlate();
  try { placePlates(); } catch(e){ console.warn('plate', e); }
};

const _baseLvl = render;
render = function(){
  _baseLvl();
  try { placeLevelCards(); } catch(e){ console.warn('lvlcard', e); }
};

const _baseDark = render;
render = function(){
  _baseDark();
  try { placeDark(); } catch(e){ console.warn('dark', e); }
};


function stampView(){
  const app = device.querySelector('.app');
  if(app) app.dataset.view = S.view || '';
}

const _baseStamp = render;
render = function(){
  _baseStamp();
  try { stampView(); } catch(e){ console.warn('stamp', e); }
};

render();
