const BK_DAYS = [['Wed','Wednesday',19],['Thu','Thursday',20],['Fri','Friday',21],
                 ['Mon','Monday',24],['Tue','Tuesday',25]];
const BK_SLOTS = ['9:00 AM','11:30 AM','2:00 PM','4:30 PM','6:30 PM','8:00 PM'];
const BK_OFF = [0,5];                    /* taken — `V.agent` disables the same two */
const BK_MONTH = ['August','Aug'];
const BK_SHORTLIST = ['priya','owen','lena'];
const BK_DAY0 = 1, BK_SLOT0 = 4;         /* Thursday 20 August, 6:30 PM ET */

S.bk = null;
S.booking = null;

function bkStart(){
  S.bk = {open:null, agent:null, day:BK_DAY0, slot:BK_SLOT0};
}

const bkRec = () => S.booking || S.bk || {day:BK_DAY0, slot:BK_SLOT0};
const bkAgent = () => AGENTS[(bkRec().agent) || S.agent || 'priya'];
const bkLong = (r) => { r = r || bkRec(); const d = BK_DAYS[r.day] || BK_DAYS[BK_DAY0];
  return `${d[1]}, ${BK_MONTH[0]} ${d[2]} at ${BK_SLOTS[r.slot] || BK_SLOTS[BK_SLOT0]} ET`; };
const bkShort = (r) => { r = r || bkRec(); const d = BK_DAYS[r.day] || BK_DAYS[BK_DAY0];
  return `${d[0]}, ${BK_MONTH[1]} ${d[2]} · ${BK_SLOTS[r.slot] || BK_SLOTS[BK_SLOT0]} ET`; };
const bkDate = (r) => { r = r || bkRec(); const d = BK_DAYS[r.day] || BK_DAYS[BK_DAY0];
  return `${d[0]}, ${BK_MONTH[1]} ${d[2]}`; };
const bkWeekday = (r) => { r = r || bkRec(); return (BK_DAYS[r.day] || BK_DAYS[BK_DAY0])[1]; };


const BKW = {
  agents: () => S.bk ? (S.bk.open ? bkProfile(S.bk.open) : bkList()) : '',
  sched:  () => S.bk ? bkSched() : ''
};

const bkHost = (k) => `<div class="bkw" data-bkw="${k}"></div>`;

const bkFrozen = (html) => `<div class="bkw">${html}</div>`;

function bkList(){
  return `<div class="bk">
    <div class="rail-wrap bk-list"><div class="rail">${BK_SHORTLIST.map(bkCard).join('')}</div></div>
  </div>`;
}

function bkCard(key){
  const a = AGENTS[key];
  const done = S.booking && S.booking.agent === key;
  return `<div class="agh draw agh-book bk-ag" role="button" tabindex="0" data-bkopen="${key}">
    <span class="bd"><i></i><i></i><i></i><i></i></span>
    ${avatar(a,72)}
    <span class="agh-n">${a.n}<span class="ag-price">${a.price}</span></span>
    <span class="agh-r">${stars(a.r)}<span class="num">${a.r.toFixed(1)}</span></span>
    <span class="agh-m">${a.range} · ${a.ivs} interviews</span>
    <span class="agh-f"><span class="agh-slot">Next: ${a.slot}</span>
      <span class="agh-act">${done
        ? `<span class="bk-flag">${I.checkFilled}Booked</span>`
        : `<button class="btn btn-p btn-sm noic" data-bkbook="${key}">Book</button>`}
      </span></span>
  </div>`;
}

function bkProfile(key){
  const a = AGENTS[key];
  const done = S.booking && S.booking.agent === key;
  return `<div class="bk bk-prof">
    <button class="bk-back" data-bkall="1">${I.arrowLeft}<span>All agents</span></button>
    <div class="agid">
      ${avatar(a,72)}
      <div class="agid-b">
        <div class="agid-n">${a.n}</div>
        <div class="agid-r">${stars(a.r)}<span class="num">${a.r.toFixed(1)}</span><span class="agid-iv">· ${a.ivs} interviews</span></div>
        <div class="agid-c"><span>Assesses ${a.range}</span><span class="agid-v">${I.checkFilled}Verified</span></div>
      </div>
    </div>
    ${a.bio ? `<p class="agid-bio">${a.bio}</p>` : ''}
    <div class="kv-bands">
      <div class="kv"><span class="k">Interview fee</span><span class="v">${a.price}</span></div>
      <div class="kv"><span class="k">Length</span><span class="v n">45 minutes, recorded</span></div>
      <div class="kv"><span class="k">Report turnaround</span><span class="v n">Within 24 hours</span></div>
      <div class="kv"><span class="k">Next free slot</span><span class="v n">${a.slot}</span></div>
    </div>
    <div class="bk-a">
      ${done
        ? `<span class="bk-flag">${I.checkFilled}Booked for ${bkDate()}</span>`
        : `<button class="btn btn-p btn-sm" data-bkbook="${key}">Book call with ${a.n.split(' ')[0]} ${I.arrowRight}</button>`}
    </div>
  </div>`;
}

function bkSched(){
  const a = AGENTS[S.bk.agent] || bkAgent();
  const locked = !!S.booking;
  return `<div class="bk bk-sched">
    <div class="bk-h">Pick a day<span class="bk-h-x">Times in ET</span></div>
    <div class="daystrip">
      ${BK_DAYS.map(([d,,n],i) =>
        `<button class="day ${i===S.bk.day?'on':''}" data-bkday="${i}"${locked?' disabled':''}>
          <div class="d">${d}</div><div class="n">${n}</div></button>`).join('')}
    </div>
    <div class="bk-h">Pick a time</div>
    <div class="slots">${BK_SLOTS.map((t,i) =>
      `<button class="slot ${i===S.bk.slot?'on':''}" data-bkslot="${i}"${(BK_OFF.includes(i)||locked)?' disabled':''}>${t}</button>`).join('')}</div>
    <div class="bk-when">
      <span class="bk-when-t">${bkLong(S.bk)}</span>
      <span class="bk-when-p">${a.price}</span>
    </div>
    <div class="bk-a">
      ${locked
        ? `<span class="bk-flag">${I.checkFilled}Confirmed</span>`
        : `<button class="btn btn-p btn-sm" data-bknext="1">Continue to payment ${I.arrowRight}</button>`}
    </div>
    ${locked ? '' : `<p class="bk-note">Two other candidates are looking at Thursday. Slots are held for 10 minutes once you continue.</p>`}
  </div>`;
}

function bkDone(){
  const a = AGENTS[S.booking.agent];
  const c = S.booking.card;
  return `<div class="bk bk-done">
    <div class="note succ"><span>${I.checkFilled}</span><div class="nb"><b>Interview booked</b>${bkLong()} with ${a.n}. A calendar invite and joining link are in your email.</div></div>
    <div class="tile">
      <div class="kv"><span class="k">Agent</span><span class="v">${a.n}</span></div>
      <div class="kv"><span class="k">When</span><span class="v">${bkShort()}</span></div>
      <div class="kv"><span class="k">Length</span><span class="v n">45 minutes, recorded</span></div>
      <div class="kv"><span class="k">Paid</span><span class="v n">${a.price} · ${c.brand} ending ${c.last}</span></div>
    </div>
    <div class="bk-a">
      <button class="btn btn-p btn-sm" data-bkgo="dashboard">Back to my dashboard ${I.arrowRight}</button>
      <button class="btn btn-t btn-sm noic" data-bkgo="interviews">Interviews</button>
    </div>
  </div>`;
}

function bkTurn(mine, reply){
  S.thread.push({who:'me', html:mine});
  S.typing = true;
  render();
  setTimeout(() => {
    S.thread.push({who:'tal', html:reply});
    S.typing = talQueue.length > 0;
    render();
  }, TAL_BEAT);
}

const BK_ASK = /\b(book|booking|reserve|arrange|schedule)\b[^.?!]{0,40}\b(interview|agent|slot|session|call with)\b|\b(interview|slot)\b[^.?!]{0,30}\b(book|booking)\b|\b(top|best|good|suggested|recommend\w*)\b[^.?!]{0,25}\bagents?\b|\b(suggest|show|list|find|compare|pick|choose|which)\b[^.?!]{0,30}\bagents?\b|\bagents?\b[^.?!]{0,25}\b(suggest|available|free|recommend\w*)\b|\bi want to (be interviewed|get interviewed)\b/i;

TAL_ROUTES.unshift([BK_ASK, () => {
  S.booking = null;
  bkStart();
  return `Here are the top profile agents you should consider.`
    + bkHost('agents');
}]);

const BK_CHIP = 'Book an interview with a top agent';
for(const v of ['interviews','agents']){
  if(TALCTX[v] && TALCTX[v][0] !== BK_CHIP) TALCTX[v].unshift(BK_CHIP);
}

device.addEventListener('click', e => {
  const t = e.target;

  const bb = t.closest('[data-bkbook]');
  if(bb){
    if(!S.bk) bkStart();
    if(S.booking) return;                        /* already booked, see bkCard */
    const k = bb.dataset.bkbook;
    S.bk.agent = k; S.bk.open = null;
    S.agent = k;                                 /* the agent pages agree with the chat */
    const a = AGENTS[k];
    bkTurn(`Book an interview with ${a.n}`,
      `Pick a day and a time that suits you.`
      + bkHost('sched'));
    return;
  }

  const bo = t.closest('[data-bkopen]');
  if(bo){ if(!S.bk) bkStart(); S.bk.open = bo.dataset.bkopen; render(); return; }

  const ba = t.closest('[data-bkall]');
  if(ba){ if(!S.bk) bkStart(); S.bk.open = null; render(); return; }

  const bd = t.closest('[data-bkday]');
  if(bd && !bd.disabled){ if(!S.bk) bkStart(); S.bk.day = +bd.dataset.bkday; render(); return; }

  const bs = t.closest('[data-bkslot]');
  if(bs && !bs.disabled){ if(!S.bk) bkStart(); S.bk.slot = +bs.dataset.bkslot; render(); return; }

  const bn = t.closest('[data-bknext]');
  if(bn){
    if(!S.bk || S.booking) return;
    bkBooked();
    return;
  }

  const bg = t.closest('[data-bkgo]');
  if(bg){
    S.askFrom = bg.dataset.bkgo;
    S.view = bg.dataset.bkgo;
    S.hist = [];
    askClose();
    return;
  }
});

const BK_PRE = ['nil','signup','consult','new'];
function bkBooked(){
  const saved = (S.cards || []).find(c => c.def) || (S.cards || [])[0]
             || {brand:'Visa', last:'4242'};
  S.booking = {agent:S.bk.agent, day:S.bk.day, slot:S.bk.slot,
               card:{brand:saved.brand, last:saved.last}};
  if(BK_PRE.includes(S.stage)) S.stage = 'booked';
  S.askFrom = 'dashboard';
  S.view = 'dashboard';
  S.hist = [];
  bkTurn(bkLong(),
    `Done. Your interview is booked.`
    + bkFrozen(bkDone()));
}

const _bkReset = talReset;
talReset = function(){ _bkReset(); S.bk = null; };

function placeBook(){
  device.querySelectorAll('[data-bkw]').forEach(host => {
    const build = BKW[host.dataset.bkw];
    if(!build) return;
    try { host.innerHTML = build() || ''; }
    catch(err){ console.warn('bkw', host.dataset.bkw, err); }
  });
  try { bkStamp(); } catch(err){ console.warn('bkstamp', err); }
}

function bkStamp(){
  if(!S.booking || !isBooked(S.stage)) return;
  const a = AGENTS[S.booking.agent];
  const c = S.booking.card;
  const page = device.querySelector('.view-col .page');
  if(!page || page.classList.contains('ask-page')) return;

  const plate = page.querySelector('.plate');
  if(plate){
    const ph = plate.querySelector('.plate-who .av-ph');
    if(ph){
      const im = ph.querySelector('img'); if(im) im.src = a.img;
      const ini = ph.querySelector('i');  if(ini) ini.textContent = a.i;
    }
    const nm = plate.querySelector('.plate-wb b');
    if(nm) nm.textContent = a.n;
    const sub = nm && nm.nextElementSibling;
    if(sub) sub.textContent = 'Talent agent · assesses ' + a.range;
    const when = plate.querySelector('.plate-b');
    if(when){
      when.textContent = bkLong() + ' · 45 minutes, recorded';
      splitPlateBody(plate);
    }
  }

  page.querySelectorAll('.stps-i .pi-lab, .pi-step .pi-lab').forEach(lab => {
    if(!/^Interview (and level|booked)$/.test(lab.textContent.trim())) return;
    const sec = lab.parentElement && lab.parentElement.querySelector('.pi-sec');
    if(sec) sec.textContent = a.n + ' · ' + bkDate();
  });

  page.querySelectorAll('.kv').forEach(kv => {
    const k = kv.querySelector('.k'), v = kv.querySelector('.v');
    if(!k || !v) return;
    const key = k.textContent.trim();
    if(key === 'Agent')     v.textContent = a.n;
    else if(key === 'When') v.textContent = bkShort();
    else if(key === 'Paid') v.textContent = a.price + ' · ' + c.brand + ' ending ' + c.last;
  });

  page.querySelectorAll('.note.succ .nb').forEach(nb => {
    const b = nb.querySelector('b');
    if(!b || b.textContent.trim() !== 'Interview booked') return;
    b.nextSibling && nb.removeChild(b.nextSibling);
    b.insertAdjacentText('afterend',
      bkLong() + ' with ' + a.n + '. A calendar invite and joining link are in your email.');
  });

  page.querySelectorAll('.payrow .pay-n').forEach(n => {
    if(!/^Interview · /.test(n.textContent)) return;
    n.textContent = 'Interview · ' + a.n;
    const row = n.parentElement;
    const amt = row.querySelector('.pay-a'); if(amt) amt.textContent = a.price;
    const last = row.querySelector('.pay-c .n');
    if(last) last.textContent = '•••• ' + c.last;
    const mk = row.querySelector('.pay-c .bmk');
    if(mk) mk.innerHTML = BMK[c.brand] || BMK.card;
  });
}

PAGESUM.dashboard.booked = () => {
  const a = AGENTS[(S.booking || {}).agent || 'priya'];
  return `Welcome back, Maryam! Your <b data-sum="interview">levelling interview with ${a.n}</b> `
    + `is confirmed for ${bkLong()} (45 minutes, video-recorded). My analysis of `
    + `${a.n.split(' ')[0]}&rsquo;s historical evaluation patterns shows a heavy emphasis on `
    + `delegation frameworks. Since your initial quiz score placed you on the `
    + `<b data-sum="track">Explorer track</b>, spending just `
    + `<b data-sum="prep">10 minutes practising your delegation talking points</b> before `
    + `${bkWeekday()} is your best strategy to secure an optimal levelling outcome.`;
};
PAGESUM.dashboard[RESCHED] = PAGESUM.dashboard.booked;

const _bkSum = pageSummary;
pageSummary = function(){
  let text = _bkSum();
  if(!text || !S.booking || !isBooked(S.stage)) return text;
  const a = AGENTS[S.booking.agent];
  if(!a || S.booking.agent === 'priya') return text;
  return text.split('Priya Nair').join(a.n).split('Priya').join(a.n.split(' ')[0]);
};

let BK_AT = {n:-1, top:0};
const _baseBook = render;
render = function(){
  const before = device.querySelector('#askThread');
  const held = (before && before.querySelector('.bkw') && S.thread.length === BK_AT.n)
    ? before.scrollTop : null;
  _baseBook();
  try { placeBook(); } catch(e){ console.warn('book', e); }
  const th = device.querySelector('#askThread');
  if(th && th.querySelector('.bkw')){
    th.scrollTop = held === null ? th.scrollHeight : held;
  }
  BK_AT.n = S.thread.length;
};
render();
