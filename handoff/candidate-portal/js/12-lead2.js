S.ldrCo = LEAD_COHORTS[0].id;
S.ldrMem = null;
S.ldrRep = String(LEAD_COHORTS[0].id);
S.ldrChAll = false;
S.ldrBrief = null;
S.ldrNote = null;

S.ldrNotes = {
  'Yuki Tanaka':[{k:'develop', b:'Twelve days without a sign-in. Emailed the address on file and got no bounce, so it is being read. Trying the cohort board next before I escalate.', wk:5, d:'24 Sep 2026'}],
  'James Whitby':[{k:'develop', b:'Re-taking assessments rather than moving on. Told him on the call to leave three and four at 65 and come back after chapter 6 — the material builds, the score does not.', wk:4, d:'18 Sep 2026'},
                  {k:'strength', b:'Asked for the handover framework twice and put it straight to use on the delegation task. Slow to start, but he does the reading once he has the tool.', wk:3, d:'11 Sep 2026'}],
  'Owen Clarke':[{k:'strength', b:'Ran the Thursday call twice when I was out. Stepped in without being asked and kept the group on the agenda both times. The cohort listens to him.', wk:8, d:'6 Aug 2026'},
                 {k:'develop', b:'Writes the answer before the working. Strong instincts, but the report skips how he got there. Asked him to show the steps so the next reader can follow the decision.', wk:9, d:'13 Aug 2026'}],
  'Lena Fischer':[{k:'develop', b:'Quiet on calls, thorough on the board. Rarely speaks up live, but her written feedback to peers is the most detailed in the cohort. Worth drawing out in the room.', wk:7, d:'30 Jul 2026'}]
};
const LEAD_TODAY = '29 Sep 2026';
const NOTE_EDIT_MS = 24*60*60*1000;
const noteEditable = (n, c) => leadEditable(c) && !!n.at && (Date.now() - n.at) < NOTE_EDIT_MS;
const leadEditable = c => !!c && c.status === 'active';

S.ldrCTab = 'progress';  /* Candidate Progress is the first of four tabs (9 Sep 2026) */
S.ldrSesTab = 'upcoming'; /* the Sessions page's two tabs — Upcoming / Past (30 Sep 2026) */
S.ldrEvTab = 'awaiting';  /* the Evaluations page's two tabs — Awaiting / Evaluated (30 Sep 2026) */
S.ldrNoteAt = null;
S.ldrNoteK = '';   /* 12.4: neither type pre-selected */

const lcoOf   = id => LEAD_ALL().filter(c => c.id === +id)[0] || LEAD_COHORTS[0];
const lco     = () => lcoOf(S.ldrCo);
const lmemOf  = (c,name) => (c.members.filter(m => m.name === name)[0] || c.members[0]);
const lchDone = m => Math.round(m.pc / 100 * 13);
const lmins   = m => Math.round(CH.slice(0, lchDone(m)).reduce((s,ch) => s + ch[1], 0) * Math.max(1, m.att || 1));
const lhrs    = n => !n ? '&mdash;' : n < 60 ? n + 'm' : Math.floor(n/60) + 'h ' + (n%60) + 'm';
const lidle   = m => /(\d+)d ago/.test(m.last) ? +m.last.match(/(\d+)d/)[1] : 0;

const ltask = (m,c) => m.last === 'Never' ? ['none','Not started']
  : m.pc >= lpace(c) ? ['done','Done']
  : m.pc >= lpace(c) - 8 ? ['open','In progress'] : ['late','Late'];

const lnotes = name => S.ldrNotes[name] || [];

const ldrRankBoard = c => `<div class="board">
    <div class="brow bhead">
      <span>#</span><span>Member</span><span>Earned</span><span class="num">Points</span>
    </div>
    ${c.members.slice().sort((a,b) => b.pts - a.pts).map((m,k) => {
      const b = lbadge(m.pts);
      return `<div class="brow">
        <span class="b-n">${k + 1}</span>
        <span class="b-who">${avatar({i:m.ini, img:AV[m.img]}, 32)}<span class="b-nm">${m.name}</span></span>
        <span class="b-earn">
          ${b ? `<span class="b-mk" title="${b.n}"><img src="${AWARD[b.n.toLowerCase().replace(/ /g,'')]}" alt="${b.n}"></span>` : ''}
          <span class="b-earn-t">${b ? b.n + ' badge' : 'No badge yet'}</span>
        </span>
        <span class="num b-pts">${m.pts.toLocaleString()}</span>
      </div>`;
    }).join('')}
  </div>`;

const NOTE_K = {
  strength:{t:'Strength',        ink:'--support-success-ink', mix:'12%'},
  develop: {t:'Area to develop', ink:'--support-attention',   mix:'14%'}
};

const ldrNoteRow = (n, name, i, c) => {
  const k = NOTE_K[n.k] || NOTE_K.develop;
  const editable = noteEditable(n, c);
  return `<div class="note-row" data-note-i="${i}" data-note-k="${n.k || 'develop'}"
       style="--note-ink:var(${k.ink});--note-bg:color-mix(in srgb, var(${k.ink}) ${k.mix}, var(--layer-01))">
    <span class="note-b">
      <span class="note-x">${n.b}${n.edited ? ' <span class="note-edited">(edited)</span>' : ''}</span>
      <span class="note-f"><span class="note-tag">${k.t}</span><span class="note-w">Week ${n.wk} &middot; ${n.d}</span></span>
    </span>
    ${editable ? `<span class="note-a">
      <button class="ldr-chip chip-edit" data-ldrnoteedit="${name}:${i}" aria-label="Edit note" title="Edit">${I.edit}</button>
      <button class="ldr-chip chip-del" data-ldrnotedel="${name}:${i}" aria-label="Delete note" title="Delete">${I.delete}</button>
    </span>` : ''}
  </div>`;
};

const ldrNoteBox = (name, n) => { const cur = n ? n.k : S.ldrNoteK;
  return `<div class="note-box">
    <span class="note-mk note-mk-w">${I.edit}</span>
    <div class="note-form">
      <div class="note-types" role="radiogroup" aria-label="Note type">
        ${Object.keys(NOTE_K).map(k => `<button type="button" class="note-type${cur===k?' on':''}"
          role="radio" aria-checked="${cur===k}" data-ldrnotek="${k}"
          style="--note-ink:var(${NOTE_K[k].ink})"><span class="note-type-dot"></span>${NOTE_K[k].t}</button>`).join('')}
      </div>
      <div class="note-fbox">
        <textarea class="inp note-body" id="ldrNoteB" rows="3" maxlength="2000"
          placeholder="What did you observe? (1 to 2000 characters)" aria-label="Note">${n ? n.b || '' : ''}</textarea>
        <div class="note-form-a">
          <span class="note-form-b">
            <button class="btn btn-s btn-sm noic note-cancel" data-ldrnotecancel="1">Cancel</button>
            <button class="btn btn-p btn-sm noic" data-ldrnotesave="${name}">Save note</button>
          </span>
        </div>
      </div>
    </div>
  </div>`; };

function ldrNoteReadRow(n){
  const k = NOTE_K[n.k] || NOTE_K.develop;
  return `<div class="note-row note-ro" data-note-k="${n.k||'develop'}"
       style="--note-ink:var(${k.ink});--note-bg:color-mix(in srgb, var(${k.ink}) ${k.mix}, var(--layer-01))">
    <span class="note-b">
      <span class="note-x">${n.b}${n.edited?' <span class="note-edited">(edited)</span>':''}</span>
      <span class="note-f"><span class="note-w">Week ${n.wk} &middot; ${n.d}</span></span>
    </span></div>`;
}
function ldrNotesRead(name){
  const notes = lnotes(name);
  if(!notes.length) return '';
  const groups = [['strength','Strengths'],['develop','Areas to develop']];
  return groups.map(([k,label])=>{
    const rows = notes.filter(n => (n.k||'develop') === k);
    if(!rows.length) return '';
    return `<div class="note-group"><h3 class="note-group-h">${label}</h3>
      <div class="note-list">${rows.map(ldrNoteReadRow).join('')}</div></div>`;
  }).join('');
}

const ldrNotesSec = (m, c) => {
  const notes = lnotes(m.name);
  const canAdd = leadEditable(c);          /* 12.4: no new note once the cohort closes */
  const open = canAdd && S.ldrNoteAt !== null;
  const editing = S.ldrNoteAt >= 0 ? notes[S.ldrNoteAt] : null;
  return `<div class="sec">
    <div class="sec-h"><h2>Your notes on ${m.name.split(' ')[0]}</h2>
      ${(open || !canAdd) ? '' : `<button class="btn btn-g btn-sm ic-l" data-ldrnote="${m.name}">${I.edit} Add note</button>`}
    </div>
    ${!notes.length && !open
      ? `<div class="note-panel note-empty">
          <span class="note-mk note-mk-lg">${I.edit}</span>
          <h3>No notes yet</h3>
          <p>${canAdd
            ? `Write anything that helps capture ${m.name.split(' ')[0]}&rsquo;s strengths and areas to develop. These private notes are yours, and you draw on them when you write the 90-day recommendation.`
            : 'This cohort has closed, so no note can be added. Your notes stay with your past cohort record.'}</p>
          ${canAdd ? `<button class="btn btn-s noic note-first" data-ldrnote="${m.name}">${I.add} Add your first note</button>` : ''}
        </div>`
      : `<div class="note-list">
          ${open ? ldrNoteBox(m.name, editing) : ''}
          ${notes.map((n,i) => ldrNoteRow(n, m.name, i, c)).join('')}
        </div>`}
  </div>`;
};


const lflagTag = f => !f ? '' :
  `<span class="tag ${f.k === 'bad' ? 'red' : 'org'} sm">${f.t}</span>`;

const ldrMark = (label,size) => `<span class="av-ph" style="width:${size}px;height:${size}px"><i>${label}</i></span>`;

const lassess = c => {
  const on = c.members.filter(m => m.avg > 0);
  return on.length ? Math.round(on.reduce((s,m) => s + m.avg, 0) / on.length) : 0;
};

const lpaceLine = c => `${lavg(c,'pc')}% against ${lpace(c)}% expected`;
const lpaceGap  = c => lavg(c,'pc') - lpace(c);


const ccoRing = pc => pc >= 75 ? '--support-success'
                    : pc < 25  ? '--support-warning-ic'
                    : '--accent';

const CCO_PILL = {e1:'--mk-2', e2:'--mk-3', e3:'--mk-1'};

const cohortCard = c => {
  const bad  = c.members.filter(m => m.flag && m.flag.k === 'bad').length;
  const wa   = c.members.filter(m => m.flag && m.flag.k === 'wa').length;
  const pc   = lavg(c,'pc');
  const pace = lpace(c);
  const row = (mk,ic,label,val) => `<span class="cco-r" style="--mk:var(${mk})">
      <span class="cco-ic">${ic}</span>
      <span class="cco-l">${label}</span>
      <span class="cco-v">${val}</span>
    </span>`;
  return `<button class="cco clk" data-go="leadCohort" data-ldrco="${c.id}">
    ${''/* NO IMAGE PLACEHOLDER AND NO COHORT-NUMBER DISC (Client 9 Sep: "remove
          the course images from cohorts", then Maryam 9 Sep: "remove the image
          placeholder as well where the number is right now"). The `.cco-art`
          9:5 block held a course cover, then the cohort's own number over a grey
          ground; it is gone, and the card opens on its own head block. */}
    <span class="cco-b">
      <span class="cco-hd">
        <span class="cco-hb">
          <span class="cco-n">${lname(c)}</span>
          ${''/* THE DETAIL LINE SHOWS THE LEVEL (Maryam, 9 Sep 2026: 'change the
                 "Develop for ownership · Week 5 of 13" content to "Level E3 ·
                 Week 5 of 13" means show the level in each card'). It was the
                 intent (`lintent`); the level is the fact a leader scans by. */}
          <span class="cco-d">Level ${c.level} &middot; Week ${c.week} of 13</span>
          ${''/* THE CANDIDATE COUNT IS PLAIN DESC TEXT, NOT A CHIP (Maryam, 9 Sep
                 2026: first moved off the cover's corner into a pill under the
                 level line, then "remove the candidate count from chips and just
                 show them as the desc text like above text"). A second `.cco-d`
                 line, same grey as the level line above it. */}
          <span class="cco-d">${c.members.length} candidates</span>
        </span>
        ${''/* THE "of 38%" CAPTION IS GONE (Maryam, 2 Sep 2026: "remove the
               'of n%' from the bottom of each progress circle"). It was the
               second half of the row this ring replaced — "39% of 38%" — and
               what it bought is worth naming so nobody re-derives it by
               accident: without it a card states progress and not progress
               AGAINST PACE, so cohort 47's 6% reads as a cohort that has
               stopped rather than one that is four days old and ahead. Two
               things still carry the comparison and neither is on this card:
               Tal's summary at the head of the page names the widest gap by
               cohort, and Course Reports is built on it per candidate. The
               ring's `aria-label` keeps both figures, so a screen reader is
               told what a sighted reader is now trusted to know from the week
               beside the name. */}
        <span class="cco-ring" style="--ring-ink:var(${ccoRing(pc)})">
          ${ring(pc, `${pc}% of ${pace}% expected`)}
        </span>
      </span>
      ${''/* TOTAL COURSES, NOT ASSESSMENT (Maryam, 9 Sep 2026: "in place of
             assessments show 'Total Courses' and the count against"). Follows
             from candidates taking different courses (`mcourse`): the count is
             the distinct courses running across this cohort's members. The
             cohort's assessment average still lives on the cohort detail page's
             figure band. */}
      ${row('--mk-3', I.book, 'Total Courses', new Set(c.members.map(mcourse)).size)}
      ${row('--support-attention', I.warningAlt, 'Flagged',
            bad || wa
              ? `<span class="cco-tags">${bad ? `<span class="tag red sm">${bad} at risk</span>` : ''}${wa ? `<span class="tag org sm">${wa} watch</span>` : ''}</span>`
              : '<span class="t-helper-01">none</span>')}
      ${row('--mk-4', I.calendar, 'Next call',
            `${c.callDay} <small>${c.callTime.toLowerCase()}</small>`)}
      ${''/* THE CORNER ARROW IS GONE (Maryam, 2 Sep 2026: "remove the bottom
             arrows from each card"), and with it §92.5's whole argument for
             drawing a box round it. The card is still the button — that has not
             changed and is what makes the arrow subtractable: §64's rule is
             that on a product made of hairlines a drawn rectangle is one more
             edge than the page has, and this was the last one on the card.
             `.cco-f` / `.cco-go` are deleted rather than hidden, which takes
             `margin-top:auto` with them: the cards are stretched to the tallest
             by the grid and now simply end after their last row. */}
    </span>
  </button>`;
};
const pastCohortCard = c => `<button class="cco clk" data-go="leadCohort" data-ldrco="${c.id}">
    <span class="cco-b">
      <span class="cco-hd">
        <span class="cco-hb">
          <span class="cco-n">${lname(c)}</span>
          <span class="cco-d">Level ${c.level} &middot; Completed</span>
          <span class="cco-d">${c.members.length} candidates</span>
        </span>
      </span>
      ${''/* one row, the fact a past card is for: how many it led. No ring,
             no flag tags, no next-call — the reasons are in the note above. */}
      <span class="cco-r" style="--mk:var(--support-success)">
        <span class="cco-ic">${I.checkFilled}</span>
        <span class="cco-l">Outcome</span>
        <span class="cco-v">Led to completion</span>
      </span>
    </span>
  </button>`;


const mAv = (m, size) => avatar({i:m.ini, img:AV[m.img]}, size);

const LVL_ORDER = ['E1','E2','E3','E4','E5','B1','B2','B3','B4','B5','T1','T2','T3','T4','T5'];
const levelsPresent = c => [...new Set(c.members.map(mlevel))].sort((a,b)=>LVL_ORDER.indexOf(a)-LVL_ORDER.indexOf(b));
const levelsLabel = c => { const l = levelsPresent(c); return l.length===1 ? l[0] : l[0]+'–'+l[l.length-1]; };

const lTimeFull = mins => !mins ? 'None' : mins<60 ? mins+' min' : Math.floor(mins/60)+' h '+(mins%60)+' min';
const lretaken  = m => Math.max(0, Math.round((Math.min(2, m.att||0) - 1) * lchDone(m)));

function ldrSortKey(c, k){
  return ({
    name:  m => handleOf(m).toLowerCase(),
    level: m => LVL_ORDER.indexOf(mlevel(m)),
    ch:    m => m.pc,
    assess:m => m.avg,
    att:   m => (m.att||0),
    time:  m => lmins(m),
    atd:   m => { const a = leadAttn(m,c); return a.held ? a.att/a.held : -1; },
    last:  m => m.last==='Never' ? 99999 : (m.last==='Today') ? 0 : (m.last==='Yesterday') ? 1 : lidle(m)
  }[k]) || (m => handleOf(m).toLowerCase());
}
function leadRoster(c){
  let rows = c.members.slice();
  const lvl = (S.ddVal && S.ddVal.ldrlvl) || 'All levels';
  if(lvl !== 'All levels') rows = rows.filter(m => mlevel(m) === lvl);
  const q = (S.ldrRosterQ || '').trim().toLowerCase();
  if(q) rows = rows.filter(m => leadPlain(m).toLowerCase().includes(q));
  const so = S.ldrSort || {k:'name', dir:1};
  const key = ldrSortKey(c, so.k);
  rows.sort((a,b)=>{ const x=key(a), y=key(b); return (x<y?-1:x>y?1:0) * so.dir; });
  return rows;
}
function ldrRerender(){ const m = device.querySelector('.main'); S.ldrKeepScroll = m ? m.scrollTop : null; render(); }
function ldrRosterSearch(inp){ S.ldrRosterQ = inp.value; S.ldrPage = 0; S.ldrRosterFocus = inp.selectionStart; ldrRerender(); }
function ldrLevelFdd(c){
  const cur = (S.ddVal && S.ddVal.ldrlvl) || 'All levels';
  const opts = ['All levels'].concat(levelsPresent(c));
  const open = S.ldrLvlOpen;
  return `<div class="fdd${open ? ' on' : ''}">
    <button class="fdd-t" data-ldrlvltoggle="1" aria-haspopup="listbox" aria-expanded="${open ? 'true' : 'false'}">Level: ${cur === 'All levels' ? 'All' : cur}<svg class="fdd-cx" viewBox="0 0 24 24" aria-hidden="true">${inner('chevDown')}</svg></button>
    <div class="fdd-menu" role="listbox">${opts.map(o =>
      `<button class="fdd-opt${o === cur ? ' on' : ''}" role="option" aria-selected="${o === cur ? 'true' : 'false'}" data-ldrlvlset="${o}">${o}</button>`).join('')}</div>
  </div>`;
}
function ldrRosterTools(c){
  const q = S.ldrRosterQ || '';
  return `<div class="lst-tools">
    <div class="srch${q ? ' srch-has' : ''}">
      <svg class="mag" viewBox="0 0 24 24">${inner('search')}</svg>
      <input class="inp" id="ldrRosterInp" value="${q.replace(/"/g,'&quot;')}" placeholder="Search by handle or name" aria-label="Search by handle or name" autocomplete="off" oninput="ldrRosterSearch(this)">
      ${q ? `<button type="button" class="srch-x" data-ldrsrchclear="1" aria-label="Clear search">${I.close}</button>` : ''}
    </div>
    <div class="lst-filters">${ldrLevelFdd(c)}</div>
  </div>`;
}
function leadRestoreRosterFocus(){
  if(S.ldrRosterFocus == null) return;
  const inp = device.querySelector('#ldrRosterInp'); const pos = S.ldrRosterFocus; S.ldrRosterFocus = null;
  if(inp){ try{ inp.focus({preventScroll:true}); }catch(e){ inp.focus(); } try{ inp.setSelectionRange(pos, pos); }catch(e){} }
}
function leadApplyRosterSearch(){}

const LDR_PAGE_SIZES = [5, 10, 25, 50], LDR_PAGE_DEFAULT = 5;
function ldrPageWindow(page, pages){
  if(pages <= 7) return Array.from({length: pages}, (_, i) => i);
  const out = [0], start = Math.max(1, page - 1), end = Math.min(pages - 2, page + 1);
  if(start > 1) out.push('…');
  for(let i = start; i <= end; i++) out.push(i);
  if(end < pages - 2) out.push('…');
  out.push(pages - 1);
  return out;
}
function ldrPagination(total, page, size, pages){
  const from = page * size + 1, to = Math.min(total, (page + 1) * size);
  const open = S.ldrPgOpen;
  const sizeDd = `<div class="pgn-dd${open ? ' on' : ''}">
    <button class="pgn-dd-t" data-ldrpgdd="1" aria-haspopup="listbox" aria-expanded="${open ? 'true' : 'false'}">${size}<svg class="pgn-dd-cx" viewBox="0 0 24 24" aria-hidden="true">${inner('chevDown')}</svg></button>
    <div class="pgn-dd-menu" role="listbox">${LDR_PAGE_SIZES.map(s =>
      `<button class="pgn-dd-opt${s === size ? ' on' : ''}" role="option" aria-selected="${s === size ? 'true' : 'false'}" data-ldrpgsize="${s}">${s}</button>`).join('')}</div>
  </div>`;
  const nums = ldrPageWindow(page, pages).map(n => n === '…'
    ? `<span class="pgn-gap">…</span>`
    : `<button class="btn btn-sm noic ${n === page ? 'btn-p' : 'btn-g'}" data-ldrpg="${n}"${n === page ? ' aria-current="page"' : ''}>${n + 1}</button>`).join('');
  return `<div class="pgn">
    <div class="pgn-size"><span class="pgn-lbl">Rows per page</span>${sizeDd}</div>
    <div class="pgn-info">${from}&ndash;${to} of ${total}</div>
    <div class="pgn-nav">
      <button class="btn btn-g btn-sm pgn-arrow" data-ldrpg="prev"${page === 0 ? ' disabled' : ''} aria-label="Previous page">${I.chevLeft}</button>
      <div class="pgn-nums">${nums}</div>
      <button class="btn btn-g btn-sm pgn-arrow" data-ldrpg="next"${page >= pages - 1 ? ' disabled' : ''} aria-label="Next page">${I.chevRight}</button>
    </div>
  </div>`;
}
let LDR_RM_SEQ = 0;
function ldrRowMenu(acts){
  const id = 'lrm' + (LDR_RM_SEQ++);
  const open = S.ldrRowMenu === id;
  const items = acts.map(([icon, label, attr]) =>
    `<button class="rowmenu-i" role="menuitem" ${attr}><span class="rowmenu-ic">${I[icon]}</span>${label}</button>`).join('');
  return `<div class="rowmenu">
    <button class="btn btn-g btn-sm rowmenu-t" data-ldrrm="${id}" aria-haspopup="menu" aria-expanded="${open ? 'true' : 'false'}" title="Actions" aria-label="Actions">${I.overflow}</button>
    <div class="rowmenu-list${open ? ' on' : ''}" role="menu" data-lrmlist="${id}">${items}</div>
  </div>`;
}
function placeLeadRowMenu(){
  if(!S.ldrRowMenu) return;
  const main = device.querySelector('.main');
  const trig = device.querySelector(`.rowmenu-t[data-ldrrm="${S.ldrRowMenu}"]`);
  const list = device.querySelector(`.rowmenu-list[data-lrmlist="${S.ldrRowMenu}"]`);
  if(!main || !trig || !list) return;
  const mr = main.getBoundingClientRect();
  const scale = mr.width / main.clientWidth || 1;
  const tr = trig.getBoundingClientRect();
  const triRight = (tr.right - mr.left) / scale + main.scrollLeft;
  const triTop = (tr.top - mr.top) / scale + main.scrollTop;
  const triBottom = (tr.bottom - mr.top) / scale + main.scrollTop;
  main.style.position = 'relative';
  main.appendChild(list);
  const menuW = list.offsetWidth || 190, menuH = list.offsetHeight || 0;
  const gap = 6, edge = 8, contentW = main.clientWidth, frameH = main.clientHeight;
  let left = triRight - menuW;
  left = Math.max(edge, Math.min(left, contentW - menuW - edge));
  const dock = device.querySelector('.askdock');
  let viewBottom = main.scrollTop + frameH;
  if(dock){ const dr2 = dock.getBoundingClientRect(); viewBottom = Math.min(viewBottom, (dr2.top - mr.top) / scale + main.scrollTop - gap); }
  const openUp = (triBottom + gap + menuH > viewBottom) && (triTop - gap - menuH >= main.scrollTop);
  list.style.left = left + 'px'; list.style.right = 'auto';
  list.style.top = (openUp ? triTop - gap - menuH : triBottom + gap) + 'px'; list.style.bottom = 'auto';
}
function ldrSortTh(k, label, extra){
  const so = S.ldrSort || {k:'name', dir:1};
  const on = so.k === k;
  const ar = on ? `<svg viewBox="0 0 24 24" class="srt-a${so.dir<0?' srt-dn':''}">${inner('arrowUp')}</svg>` : '';
  return `<th class="srt${on?' on':''}${extra||''}" data-ldrsort="${k}"><span class="srt-b">${label}${ar}</span></th>`;
}
function leadRosterTable(c){
  LDR_RM_SEQ = 0;                          /* stable kebab ids across renders */
  const all = leadRoster(c);
  const size = S.ldrPageSize || LDR_PAGE_DEFAULT;
  const pages = Math.max(1, Math.ceil(all.length / size));
  const page = Math.min(Math.max(0, S.ldrPage || 0), pages - 1);   /* clamp when a filter shrinks the list */
  const rows = all.slice(page * size, page * size + size);
  const table = `<div class="tbl-wrap"><table class="tbl lead-roster">
    <tr>
      ${ldrSortTh('name','Candidate')}
      ${ldrSortTh('level','Level')}
      ${ldrSortTh('ch','Chapters',' num')}
      ${ldrSortTh('assess','Assessment',' num')}
      ${ldrSortTh('att','Attempts',' num')}
      ${ldrSortTh('time','Time on course',' num')}
      ${ldrSortTh('atd','Attendance',' num')}
      ${ldrSortTh('last','Last active')}
      <th class="lead-roster-act">Actions</th>
    </tr>
    ${rows.length ? rows.map(m=>{
      const a = leadAttn(m,c), done = lchDone(m), mins = lmins(m), rt = lretaken(m);
      const low = m.avg>0 && m.avg<75;
      return `<tr data-rname="${leadPlain(m).toLowerCase()}">
        <td><span class="rname">${mAv(m,32)}${leadName(m)}</span></td>
        <td>${mlevel(m)}</td>
        <td class="num">${done} <span class="t-helper-01">of 13</span><span class="cell-sub">${m.pc}%</span></td>
        <td class="num${low?' cell-low':''}">${m.avg?m.avg+'%':'<span class="t-helper-01">&mdash;</span>'}</td>
        <td class="num">${rt?rt+' retaken':'<span class="t-helper-01">0</span>'}<span class="cell-sub">avg ${(m.att||0).toFixed(1)}</span></td>
        <td class="num">${mins?lTimeFull(mins):'None'}${mins?`<span class="cell-sub">${Math.round(mins/Math.max(1,done))} min a chapter</span>`:''}</td>
        <td class="num">${a.held?a.att+' of '+a.held:'<span class="t-helper-01">&mdash;</span>'}</td>
        <td>${m.last==='Never'?'Never':m.last}</td>
        <td class="tbl-act lead-roster-act">${ldrRowMenu([
          ['chart','View Progress', `data-go="leadMember" data-ldrmem="${m.name}" data-ldrco="${c.id}"`],
          ['chat','Contact', `data-ldrdm="${m.name}"`]
        ])}</td>
      </tr>`;
    }).join('') : `<tr><td colspan="9" class="lead-roster-empty">No candidate matches your search.</td></tr>`}
  </table></div>`;
  return table + (all.length > LDR_PAGE_SIZES[0] ? ldrPagination(all.length, page, size, pages) : '');
}

function leadCohortHead(c){
  return `<div class="sec sec-noline"><div class="lead-cohd">
    <div class="lead-cohd-id">
      ${''/* the course name below the cohort title is removed (Maryam 30 Sep 2026:
             "remove the course name below the cohort name"); the day/week/date line
             below carries what the reader needs, and the course is on every card. */}
      <h2 class="lead-cohd-n">${lname(c)}</h2>
    </div>
    ${''/* the large "Day N of 90" read-out is removed (Maryam 30 Sep 2026); the
          app bar already carries "Week N of 13" and the reader does not need the
          day number shouted here. What stays — the week line and the date span —
          reads at one size and colour (Maryam 30 Sep 2026: "Week 5 of 13 /
          28 Aug 2026 – 26 Nov 2026 should be in same text size and color"). */}
    <div class="lead-cohd-day">
      <span class="lead-cohd-dw">Week ${leadWeek(c.day)} of 13</span>
      <span class="lead-cohd-dates">${c.start} &ndash; ${c.end}</span>
    </div>
    ${''/* THE FACT CELLS MOVED DOWN, below the call card (Maryam, 30 Sep 2026:
          "take the Candidates / Average progress / Next session cards below the
          call card"). Candidates and Average progress became two of the four
          "Cohort at a glance" cells (`leadCounters`); Next session is dropped —
          the black call card and the Day/Week line above already carry it. The
          header now holds the identity and the day line only. */}
  </div></div>`;
}

function leadCounters(c){
  const below = c.members.filter(m => m.avg>0 && m.avg<75).length;
  const never = c.members.filter(m => m.last==='Never').length;
  return `<div class="sec">
    <div class="sec-h"><h2>Cohort at a glance</h2></div>
    <div class="facts pf-facts lead-counts">
      ${pfFact(I.group,  '--mk-3', 'Candidates', String(c.members.length))}
      ${pfFact(I.growth, '--mk-4', 'Average progress', lavg(c,'pc') + '%')}
      ${pfFact(I.chart,  '--mk-1', 'Below pass mark', String(below))}
      ${pfFact(I.misuse, '--mk-2', 'Never signed in', String(never))}
    </div>
  </div>`;
}

const leadRecsWritten = c => LEAD_SUMMARIES.filter(s => s.cohort === c.id && s.status === 'done').length;
function leadPastSection(){
  if(!LEAD_PAST.length) return '';
  return `<div class="sec" id="lead-past">
    <div class="sec-h"><h2>Past cohorts</h2></div>
    <div class="tile-stack">
      ${LEAD_PAST.map(c=>{
        const cancelled = c.status === 'cancelled';
        return `<button class="cardrow lead-past-row clk" data-go="leadCohort" data-ldrco="${c.id}">
          <span class="cardrow-b">
            <span class="cardrow-t">${lname(c)}${cancelled?' <span class="tag sm">Cancelled</span>':''}</span>
            <span class="cardrow-s">${lcourse(c)} &middot; ${c.start} &ndash; ${c.end} &middot; ${c.members.length} candidates &middot; ${leadRecsWritten(c)} recommendations written</span>
          </span>
          ${''/* a real, SIZED trailing arrow so the row reads as clickable (Maryam
                30 Sep 2026). It was `.cardrow-go` — a class with no CSS, so the
                chevron rendered unsized/invisible; `.tile-arrow` is the sized 18px
                arrow every other leader row uses. */}
          <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg>
        </button>`;
      }).join('')}
    </div>
  </div>`;
}

V.leadDash = () => {
  const c = leadLive();

  if(!c) return `<main class="main"><div class="page">
    ${ph('My Cohort')}
    <div class="sec"><div class="empty" style="border:0">${I.group}
      <h3>You are not leading a cohort at the moment.</h3>
      <p>Your past cohorts stay readable below, including your recommendations and notes.</p></div></div>
    ${leadPastSection()}
  </div></main>`;

  const pend = lpending();
  const s0 = LEAD_SUMMARIES.filter(s => s.status === 'pending');
  const next = leadNextSession(c);
  const talRead = pend
    ? {h:`${pend === 1 ? 'One recommendation is' : 'Two recommendations are'} waiting on you`,
       p:`${s0.map(s => `<b>${s.name}</b>`).join(' and ')} finished the 90 days in Cohort ${s0[0].cohort}. Nothing reaches their next agent until you send what you saw.`,
       a:'leadEvals', ab:'Open evaluations'}
    : next
    ? {h:`Cohort ${c.id} is ${sesCountdown(next).toLowerCase()==='live now'?'live now':'meeting '+sesCountdown(next)}`,
       p:`Week ${leadWeek(c.day)} of 13, ${c.members.length} candidates, averaging ${lavg(c,'pc')}%. ${c.members.filter(m=>m.flag&&m.flag.k==='bad').length} need a look before ${next.chapter}.`,
       a:'leadSessions', ab:'Open sessions'}
    : {h:`Cohort ${c.id} at week ${leadWeek(c.day)}`,
       p:`${c.members.length} candidates, averaging ${lavg(c,'pc')}%. No session is on the schedule, so the next thing is to put one there.`,
       a:'leadSessions', ab:'Open sessions'};

  return `<main class="main"><div class="page">
  ${ph('My Cohort')}
  <div class="sec">
    <div class="ai-aura tile">
      <div class="ai-head">${talLabel()}<h3>${talRead.h}</h3></div>
      <div class="ai-body"><p>${talRead.p}</p></div>
      <div class="ai-foot noline">
        <button class="btn btn-p btn-sm ic-l ai-do" data-go="${talRead.a}">${I.arrowRight}${talRead.ab}</button>
        <span class="sp"><button class="ic" aria-label="Helpful">${I.thumbsUp}</button><button class="ic" aria-label="More">${I.overflow}</button></span></div>
      <div class="ai-asks">
        ${askChip('Who should I worry about this week?','Who should I worry about?')}
        ${askChip('Brief me for the next session','Brief me for the next session')}
      </div>
    </div>
  </div>
  ${leadCohortHead(c)}
  ${''/* THE BLACK CALL CARD IS BACK, under the cohort header (Maryam, 30 Sep
        2026), and it is the CARD ALONE — no "Your upcoming calls" heading and no
        "View all sessions" link (Maryam, 30 Sep 2026: "remove the heading row
        with Your upcoming calls View all sessions"). It is the §113 `.lcal-next`
        black card (square slot, live countdown, roster faces, gated accent
        Join). With one live cohort `lcalls()` is one call, so `.lcal-row` holds
        the one card. The section is a BARE BLOCK ROW (`.lcal-row` first child, no
        heading) so §10/§138 close it with 32px of air and NO divider (Maryam,
        30 Sep 2026: "remove the divider after the black card") — that is why the
        headed `leadCallsSec` is not used here. Header, this card and the counters
        then sit 32px apart, all three sections (Maryam, 30 Sep 2026). */}
  <div class="sec lead-callsec"><div class="lcal-row">${lcalls().map((k, i) => lcalCard(k, i === 0)).join('')}</div></div>
  ${leadCounters(c)}
  <div class="sec" id="lead-roster">
    <div class="sec-h"><h2>Candidates</h2></div>
    ${''/* THE ADMIN LIST-TABLE CHROME (Maryam, 30 Sep 2026: "follow the search
          field, filter ui, and the table header divider ui ... from super admin
          table"). `.lst-tools` + `.srch` + `.fdd` are the design system's own
          list-table classes (§128/§120) — the same component the Super Admin
          uses — wired to the leader's roster state; no checkboxes. */}
    ${ldrRosterTools(c)}
    ${leadRosterTable(c)}
  </div>
  ${leadPastSection()}
</div></main>`;
};

V.leadCohorts = () => {
  const flagged = lmembers().filter(x => x.m.flag);
  const severe = flagged.filter(x => x.m.flag.k === 'bad');
  const next = LEAD_COHORTS.slice().sort((a,b) => a.callOrd - b.callOrd)[0];

  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Cohorts')}
  ${''/* Tal's summary opened with "Three cohorts, 28 candidates" — this
        line with the numbers spelt instead of set, which also meant the page
        showed the same count in two notations. The spine keeps the figures in
        one notation and Tal keeps the finding. */}
  ${ph('Cohorts',`${LEAD_COHORTS.length===1?'one active cohort':LEAD_COHORTS.length+' active cohorts'}${LEAD_PAST.length?` &middot; ${LEAD_PAST.length} completed`:''} &middot; ${lmembers().length} candidates &middot; all Explorer`)}
  ${''/* ONE SECTION, ONE HEADING (Maryam, 2 Sep 2026: "take the All cohorts
         heading above the 4 cards row", and "remove the grey background of the
         3 cards section"). The figure band and the three cards were two
         sections and the second one carried the heading, so the page opened on
         four unlabelled figures and then named itself half way down. They are
         one block and always were: the band is the three cohorts added up and
         the cards are the three cohorts, so "All cohorts" heads both and the
         helper line that defines expected pace now sits above the first figure
         it applies to rather than below it.
         THE TINT GOES WITH THE MERGE and would have had to anyway: §12 steps a
         `.stats` band down onto a panel by re-pointing its cells to the panel's
         own colour and drawing the hairlines as the grid's gaps, so a band and
         a row of white cards on one grey ground is two different treatments of
         "a thing lying on a panel" in one section. On white the band draws its
         own rules and the cards their own border. */}
  <div class="sec">
    ${''/* THE HELPER LINE IS GONE (Maryam, 2 Sep 2026: "remove the Expected
           pace is day of 90, evenly spread text"). It defined what the Progress
           COLUMN was measured against, and that column left with the table: the
           comparison now sits on each card as "of 38%" under its own ring,
           where the figure it qualifies is 20px away rather than 400. The
           heading row holds the heading alone. */}
    <div class="sec-h"><h2>${LEAD_COHORTS.length===1?'Current cohort':'Current cohorts'}</h2></div>
    <div class="stats">
      ${statCell(I.group,  'Cohorts',   LEAD_COHORTS.length, `${lmembers().length} candidates`)}
      ${statCell(I.growth, 'On pace',   LEAD_COHORTS.filter(c => lpaceGap(c) >= 0).length + ` <small>of ${LEAD_COHORTS.length}</small>`, 'against expected progress')}
      ${statCell(I.warningAlt, 'Flagged', flagged.length, `${severe.length} severe`)}
      ${''/* THE FOURTH CELL OPENS THE CALLS MODULE (Maryam, 2 Sep 2026: "the 4
             card of the next call should be clickable and should take me to the
             calls module"). It is the one cell of the four whose subject lives
             on another page — the other three are counts OF this page — and it
             is also the route the closing "This week's calls" button used to
             carry, so the way there is back on the page in the place the figure
             already names it. `statCell`'s sixth argument is a raw attribute
             and the capture-phase router does the rest. */}
      ${statCell(I.calendar, 'Next call', next.callDay, `${lname(next)} &middot; ${next.callTime.toLowerCase()}`, null, 'data-go="leadCalls"')}
    </div>
    <div class="cco-grid">
      ${LEAD_COHORTS.map(cohortCard).join('')}
    </div>
  </div>
  ${''/* PAST COHORTS — the previous led cohorts, kept (Maryam, 14 Sep 2026).
         A candidate-leader runs one at a time, so a finished cohort moves here
         rather than out of existence: the roster, the reports and the 90-day
         summaries it holds are all still reachable, but it is not a live cohort
         and does not sit in the current band's counts. Drawn only when there is
         one, so a first-time leader with nothing behind them sees just their
         current cohort. */}
  ${LEAD_PAST.length ? `<div class="sec">
    <div class="sec-h"><h2>Past cohorts</h2></div>
    <div class="cco-grid">
      ${LEAD_PAST.map(pastCohortCard).join('')}
    </div>
  </div>` : ''}
  ${''/* "THIS WEEK'S CALLS" IS OFF THIS PAGE ENTIRELY, IN TWO STEPS.
         The LIST went to `V.leadCalls` on 1 Sep 2026 — three `.bk-row`s with a
         date chip and a Brief button, which is exactly the list the Calls page
         opens with, and two pages drawing one list is the "route to the same
         content" this portal keeps deleting. What was left behind was a
         `.btn-set` at the foot carrying the way there, on the rule that "a list
         handed to another page needs a route to it, or the subtraction is a
         dead end rather than a move".
         THE BUTTON IS GONE TOO (Maryam, 2 Sep 2026: "remove the bottom This
         week's calls row"), and the rule it was answering is satisfied a
         different way: Calls is a RAIL MODULE, one slot above Cohorts, so the
         way there is permanent and one click from anywhere. A button at the
         foot of a page repeating a rail item is the third copy of a route
         rather than the only one — which is the same test the list itself
         failed. The page now ends on the three cards, which is what it is
         about.
         NOTHING ABOUT THE CALLS IS LOST HERE EITHER: the figure band's fourth
         cell is "Next call" with the cohort and the hour in its note, and every
         card carries a "Next call" row of its own. */}
</div></main>`;
};

V.leadCohort = () => {
  const c = lco();
  const flagged = c.members.filter(m => m.flag);
  const severe = flagged.filter(m => m.flag.k === 'bad');
  const weakest = c.members.filter(m => m.avg > 0).slice().sort((a,b) => a.avg - b.avg)[0];
  const chapter = CH[Math.min(12, c.week - 1)];

  return `<main class="main"><div class="page">
  ${crumb(['Cohorts','leadCohorts'], lname(c))}
  ${ph(lname(c), `${c.members.length} candidates at ${llevel(c)} &middot; week ${c.week} of 13 &middot; day ${c.day} of 90`)}
  ${''/* THE WEEKLY CALL IS `leadCallCard`, AND THIS PAGE IS THE THIRD SURFACE
         TO MAKE THE SAME MOVE (Maryam, 2 Sep 2026: "you know well about our
         other pages layout, please position and update the design of this page
         accordingly"). It was a `.plate`, and §81 records what that costs and
         why the dashboard stopped doing it on 1 Sep — word for word the
         arrangement this page still had:

           `.plate` IS IN ai5's `DARK_CARD`, so `placeDark` hoists it into the
           head band. §56 then makes the band two columns, and the LEFT column
           on this page holds one sentence — Tal's summary, two lines — against
           a 370px card. The result is the band's own note describing a page
           that does not exist: 200px of empty cream beside a black box.
           `.dark-card` is in no pass's list, so the gate stops matching, the
           band falls to one `minmax(0,1fr)` column and the summary takes the
           width back with nothing restated. That is §81's sentence exactly:
           "out of the top" and "full width" are one change, not two.

         AND THE `ph()` ACTION SLOT EMPTIES WITH IT. "Generate the brief" was a
         `.btn-p` in that slot, which sits ABOVE Tal's summary — the placement
         both this file and lead3 record emptying for exactly that reason, twice.
         It is the card's own secondary now, which is where the Calls page
         already puts it: the brief is per-CALL, so it belongs on the card that
         names the call rather than on the page that happens to contain it.

         ONE DRAWING, THREE PAGES. The dashboard, the Calls page and now this one
         all call `leadCallCard(lcall(c))`, so the same appointment cannot be
         described three ways — the `bkStamp` rule, one portal over. What this
         caller states is only its own secondary.

         ONLY FOR AN ACTIVE COHORT (Maryam, 30 Sep 2026: "why we are showing a
         call card in the past cohort detail page?"). A completed/cancelled
         cohort has no upcoming session, so the "Upcoming Cohort Session" Join
         card is drawn only while `c.status === 'active'`. A past cohort opens
         straight on its figure band. */}
  ${c.status === 'active' ? leadCallCard(lcall(c), {second:{at:`data-ldrbrief="${c.id}"`, ic:I.edit, t:'Generate the brief'}}) : ''}
  <div class="sec">
    <div class="stats">
      ${''/* THE SUB IS ALWAYS "Of all candidates", never "+N/-N against pace"
             (Maryam, 30 Sep 2026). The pace gap read as a judgement on the
             cohort's standing on a plain average figure; it stays the sort key
             for the attention queue (`lpaceGap`), just off this cell. */}
      ${statCell(I.growth, 'Average progress', lavg(c,'pc') + '<small>%</small>', 'Of all candidates')}
      ${statCell(I.time,   'Expected pace',    lpace(c) + '<small>%</small>', `day ${c.day} of 90`)}
      ${''/* SUB IS "lowest N%" ONLY — the "· N of N assessed" count is dropped
             (Maryam, 30 Sep 2026: "remove 8 of 8 assessed"). */}
      ${statCell(I.chart,  'Assessment average', lassess(c) ? lassess(c) + '<small>%</small>' : '<small>Not yet</small>', weakest ? `Lowest ${weakest.avg}%` : 'Nothing assessed yet')}
      ${statCell(I.warningAlt, 'Flagged', flagged.length + `<small> of ${c.members.length}</small>`, `${severe.length} severe`)}
    </div>
  </div>
  ${''/* THE CANDIDATE PROGRESS TABLE MOVED INTO THE TABS BELOW (Maryam, 9 Sep
         2026) — it was a `.sec tint` table here, above the strip. */}
  ${''/* AND THE COHORT'S OWN THREE TABS, WHICH ARE THE CANDIDATE'S. The
         candidate's Cohort page has drawn Discussion / Ranking / Members since
         it existed, and this is the leader's view of the same cohort — so it is
         the same strip, the same components and, for Cohort 41, the same board:
         `ROOM` and `COHORT` ARE Cohort 41, which is the decision lead.js records
         ("post on the leader side and it is there on the candidate side").

         `S.ldrCTab` IS ITS OWN KEY, not the candidate's `S.ctab` — §65's
         two-disclosures lesson, and here the two really can be open at once
         because the portal switch resets neither.

         RANKING AND MEMBERS ARE DERIVED FROM THE COHORT, so all three cohorts
         have them: `c.members` carries the names, the faces and `pts`, and
         `lbadge` turns the points into the badge. That is why this is
         `ldrRankBoard(c)` rather than a call to `boardList()`, which reads the
         CANDIDATE's own `BOARD`.

         DISCUSSION IS COHORT 41'S ONLY, AND THE OTHER TWO SAY SO. There is one
         board in this build. Drawing it under Cohort 33 would be ten posts by
         people who are not in it — the invented data §74 rules out — so 33 and
         47 get the empty state and the composer, which is what a board with
         nothing on it is. */}
  ${''/* CANDIDATE PROGRESS IS THE FIRST OF FOUR TABS NOW (Maryam, 9 Sep 2026:
         "make candidate progress part of the tabs below, means there will be 4
         tabs, first Candidate Progress, then discussions, ranking and members").
         It was a standalone `.sec tint` table above the strip; it is the strip's
         default tab now, so `S.ldrCTab` defaults to `progress`. The table gained
         a Course column and rounds Attempts to a whole number, same as Course
         Reports (§ N/O this day). */}
  <div class="sec sec-cs">
    <div class="cs">
      <button class="${(S.ldrCTab || 'progress') === 'progress' ? 'on' : ''}" data-ldrctab="progress">Candidates Progress</button>
      <button class="${S.ldrCTab === 'discussion' ? 'on' : ''}" data-ldrctab="discussion">Discussion</button>
      <button class="${S.ldrCTab === 'ranking' ? 'on' : ''}" data-ldrctab="ranking">Ranking</button>
      <button class="${S.ldrCTab === 'members' ? 'on' : ''}" data-ldrctab="members">Members</button>
    </div>
    ${(() => {
      const tab = S.ldrCTab || 'progress';
      if(tab === 'members') return `<div class="tile-stack">${c.members.map(m => mem(m.name, m.ini, `${llevel(c)} &middot; ${m.pc}% of the course`, false, m.img)).join('')}</div>`;
      if(tab === 'ranking') return ldrRankBoard(c);
      if(tab === 'discussion') return c.id === 41 ? discussionRoom()
        : `<div class="empty" style="border:0">${I.chat}
          <h3>Nothing posted yet</h3>
          <p>${lname(c)}&rsquo;s board is empty. Anything you post here, all ${c.members.length} of them read.</p>
        </div>`;
      return `<div class="tbl-wrap">
        <table class="tbl ldr-tbl tbl-flag">
          <tr><th>Candidate</th><th>Course</th><th class="num">Chapters</th><th class="num">Assessment</th>
              <th class="num">Attempts</th><th class="num">Time</th><th>Last active</th><th>Flag</th><th></th></tr>
          ${c.members.slice().sort((a,b) => (a.pc - lpace(c)) - (b.pc - lpace(c))).map(m => `
            <tr class="ldr-tr${m.flag ? (m.flag.k === 'bad' ? ' sev' : ' mod') : ''}" data-ldrco="${c.id}" data-ldrmem="${m.name}" data-go="leadMember" tabindex="0" role="button">
              <td><span class="ldr-who">
                <span class="mem-av mem-ph">${avatar({i:m.ini, img:AV[m.img]}, 24)}</span>
                <span class="ldr-who-n">${m.name}</span>
              </span></td>
              <td>${mcourse(m)}</td>
              <td class="num">${lchDone(m)} <span class="t-helper-01">of 13</span></td>
              <td class="num">${m.avg ? `${m.avg}%` : '<span class="t-helper-01">&mdash;</span>'}</td>
              <td class="num">${m.att ? Math.round(m.att) : '<span class="t-helper-01">&mdash;</span>'}</td>
              <td class="num">${lmins(m) ? lhrs(lmins(m)) : '<span class="t-helper-01">&mdash;</span>'}</td>
              <td>${m.last.toLowerCase()}</td>
              <td>${m.flag ? `<span class="flag-t">${I[m.flag.ic]}${m.flag.t}</span>` : '<span class="t-helper-01">&mdash;</span>'}</td>
              <td class="ldr-go"><span class="ldr-view">View Progress ${I.arrowRight}</span></td>
            </tr>`).join('')}
        </table>
      </div>`;
    })()}
  </div>
  ${''/* THE "ATTEMPTS" NOTE IS DELETED (Maryam, 2 Sep 2026: "remove the bottom
         Attempts section"). It defined the column — how many times a candidate
         went back through the same content, and that over 2.0 with assessments
         under 75% is the clearest struggle signal the data gives. The
         definition is not lost so much as made unnecessary: `lflag` applies
         exactly that test and prints its answer as "Struggling" in the Flag
         column, on the row it is about. A footnote explaining a column the
         table already interprets is the third copy of a reading. */}
  ${''/* THE CLOSING BUTTON ROW IS GONE (Maryam, 2 Sep 2026: "remove the bottom
         Post to the cohort board / Course reports texts"). Both were routes to
         somewhere else and both stopped being the only one on the same day:
         the Discussion tab 200px above now carries the board's OWN composer, so
         "Post to the cohort board" was a link to a field already on the screen,
         and Course Reports is a rail module one click from anywhere. The page
         ends on the cohort, which is what it is about — the same subtraction
         `V.leadCohorts` made when its "This week's calls" button came off. */}
</div></main>`;
};

function ldrRead(m,c){
  const d = m.pc - lpace(c);
  const first = m.name.split(' ')[0];
  const done = lchDone(m);
  if(m.last === 'Never')
    return `${first} has never signed in: no chapter opened, no assessment, no time on the course at all. Act on this before any of the behind-pace names: a cohort place is being held open.`;
  if(lidle(m) >= 7)
    return `${first} stopped ${lidle(m)} days ago at ${m.pc}%: ${done} of 13 chapters, then nothing. Worth a direct message rather than a mention on the call; people who stop mid-course rarely restart unasked.`;
  if(m.att >= 2.0 && m.avg < 75)
    return `${first} is trying, not absorbing: ${m.att.toFixed(1)} attempts on average against a ${m.avg}% assessment score. The material is landing badly rather than the effort being missing. This is the pattern that gets worse if you push harder.`;
  if(d <= -15)
    return `${first} is well behind pace at ${m.pc}% against ${lpace(c)}% expected on day ${c.day}. Assessments hold up at ${m.avg}%, so this is time rather than comprehension, worth direct outreach before the next call.`;
  if(d <= -5)
    return `${first} is ${Math.abs(d)} points behind pace, ${m.pc}% against ${lpace(c)}% expected, with assessments at ${m.avg}%. A gap this size usually recovers on its own, worth watching rather than intervening.`;
  return `Nothing alarming in ${first}&rsquo;s numbers: ${m.pc}% against ${lpace(c)}% expected, assessments at ${m.avg}%, ${done} of 13 chapters. ${m.att <= 1.2 ? 'First-time passes on almost everything.' : 'A second pass on some, which at this score is thoroughness.'}`;
}

const ldrChRow = (i, m, done) => {
  const [name, mins] = CH[i];
  const complete = i < done, open = i === done;
  const sc = (complete && m.avg > 0)
    ? Math.max(60, Math.min(100, m.avg + ((i % 3) - 1) * 7)) : null;
  const meta = complete ? `${mins} min &middot; ${sc ? sc + '% assessment' : 'not assessed'}`
             : open     ? `Started &middot; ${mins} min`
             :            `Not started &middot; ${mins} min`;
  return `<div class="ch ${complete ? 'done' : open ? 'open' : ''}">
    ${''/* THE NUMBER TILE IS REMOVED HERE TOO (Maryam, 3 Sep 2026: "remove the
           left side count blocks from all chapters rows"), and this is the
           half that is easy to miss. The ask was made against Course
           Progress; this row is the LEADER's copy of the same component and
           the note above says why that matters — "every class here is §15's,
           so the two portals draw one component". A `.ch-num` left on the
           leader's member page would be one portal drawing a chapter row two
           ways, which is the drift the shared component exists to prevent.
           `chRow` in views.js carries the whole argument, including why
           `.ch-num`'s rules are kept. `i + 1` is no longer read. */}
    <span class="ch-b">
      <span class="ch-n">${name}</span>
      <span class="ch-m">${meta}</span>
    </span>
    ${''/* THE STATUS MARK IS ON THE RIGHT FOR EVERY ROW — Maryam, 9 Sep 2026:
           "take the completed tick icon on the right side just like the circle
           icons we have on the other chapter rows." The finished chapter's tick
           used to sit inline after the name (`.ch-tick`) while the unfinished
           rows carried a ring in the trailing `.ch-ic`; now the tick joins them
           there, so the whole column reads down as one status track — a green
           `checkFilled` for done, a grey ring for the rest (coloured in §15). */}
    <span class="ch-ic">${complete ? I.checkFilled : I.circle}</span>
  </div>`;
};

const ldrSceneCard = (sc, m, i) => `<button class="scene" type="button" aria-label="${sc[0]}, ${sc[3]}">
    <span class="scene-still" style="background-image:url('${AV[m.img]}');--still-y:${STILL_Y[i % 6]}">
      <span class="scene-play">${I.play}</span>
      <span class="scene-len">${sc[3]}</span>
    </span>
    <span class="scene-b"><span class="scene-t">${sc[0]}</span></span>
  </button>`;

const ldrScene = (title,note,stamp,len) => `<div class="clip">
    <span class="thumb">${I.play}<span class="t">${len}</span></span>
    <span class="cb"><span class="ct">${title}</span><span class="cq">${note} &middot; from ${stamp}</span></span>
  </div>`;

const LDR_SCENES = [
  ['Handing over a project that was going wrong','Delegation','minute 14','1:12'],
  ['Holding a line under pressure from a peer','Composure','minute 22','0:48'],
  ['Explaining a decision they later regretted','Decisiveness','minute 31','1:35'],
  ['Coaching a struggling team member','Coaching','minute 38','1:04'],
  ['Naming a problem before it became visible','Directness','minute 44','0:52'],
  ['Re-planning the week after a setback','Composure','minute 51','1:18']
];

V.leadMember = () => {
  const c = lco();
  const m = lmemOf(c, S.ldrMem);
  const done = lchDone(m);
  const first = m.name.split(' ')[0];
  const low = m.avg>0 && m.avg<75;
  const att = leadAttn(m, c);
  const joinWk = memJoinWeek(m);
  const past = leadSessionsOf(c).filter(s => s.status==='scheduled' && sesPast(s) && joinWk <= s.week);

  return `<main class="main"><div class="page">
  ${crumb(['My Cohort','leadDash'], m.name)}
  ${ph(m.name)}
  <div class="sec">
    <div class="idhead">
      <span class="av-ph" style="width:72px;height:72px"><i>${m.ini}</i><img src="${AV[m.img]}" alt=""></span>
      <div class="idhead-b">
        <span class="idname">${leadName(m)}</span>
        <span class="idmeta">${mlevel(m)} &middot; Day ${c.day} of 90 &middot; Week ${leadWeek(c.day)} of 13${joinWk>1?` &middot; joined week ${joinWk}`:''}</span>
        ${m.flag ? lflagTag(m.flag) : '<span class="tag green sm">On track</span>'}
      </div>
      <div class="idhead-a">
        <button class="ldr-chip chip-msg" data-ldrdm="${m.name}">${I.chat} Contact Candidate</button>
      </div>
    </div>
  </div>
  <div class="sec">
    <div class="stats">
      ${statCell(I.growth, 'Chapters',   done + '<small> of 13</small>', m.pc + '% complete')}
      ${statCell(I.chart,  'Assessment', m.avg ? `<span class="${low?'stat-low':''}">${m.avg}<small>%</small></span>` : '<small>Not yet</small>', m.avg ? (low?'below the 75% pass mark':'course average') : 'not assessed yet')}
      ${statCell(I.renew,  'Attempts',   lretaken(m) ? lretaken(m) : '<small>0</small>', (m.att||0).toFixed(1) + ' on average')}
      ${statCell(I.time,   'Time on course', lmins(m) ? lTimeFull(lmins(m)) : '<small>None</small>', done ? Math.round(lmins(m)/done) + ' min a chapter' : 'not started')}
    </div>
    <p class="lead-sync">Course figures last read from LightspeedVT ${LEAD_SYNC} (${LEAD_TZ}).</p>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Course</h2></div>
    <div class="tile crs-card">
      <h3 class="t-h3 crs-name">${mcourse(m)}</h3>
      <p class="t-desc crs-desc">${courseDesc(mlevel(m))}</p>
      ${''/* Open in LightspeedVT (12.3): the deep link into this candidate's course.
             A prototype link — the real hand-off uses the provider's SSO. */}
      <a class="btn btn-g btn-sm ic-l crs-lsvt" href="https://www.lightspeedvt.com/" target="_blank" rel="noopener">${I.launch} Open in LightspeedVT</a>
    </div>
  </div>
  <div class="sec tint">
    <div class="sec-h"><h2>Progress by Chapter</h2><span class="t-helper-01">From LightspeedVT</span></div>
    ${done ? `<div class="tile-stack">
      ${(S.ldrChAll ? CH : CH.slice(0,5)).map((_,i) => ldrChRow(i, m, done)).join('')}
    </div>
    <div class="mt4"><button class="btn btn-g" data-ldrchall="1">${S.ldrChAll ? `Show the first five ${I.chevUp}` : `Show all 13 ${I.chevDown}`}</button></div>`
    : `<div class="empty" style="border:0">${I.book}
      <h3>Nothing on the record</h3>
      <p>${first} has not opened a chapter, so LightspeedVT has sent nothing back. The record fills in the moment they start.</p>
    </div>`}
  </div>
  ${''/* ATTENDANCE (12.3): every session held since the candidate joined, each with
         the mark and, where the leader wrote one, the session note. This is the one
         figure not from LightspeedVT — the platform works it out from the room. */}
  <div class="sec">
    <div class="sec-h"><h2>Attendance</h2><span class="t-helper-01">${att.held ? att.att + ' of ' + att.held + ' since they joined' : 'no sessions yet'}</span></div>
    ${past.length ? `<div class="tile-stack">
      ${past.map(s=>{ const r = s.unavail ? null : memAttended(m, s); const note = SESSION_NOTES[s.id];
        return `<div class="atd-row">
          <span class="atd-b"><span class="atd-t">${s.title} &middot; ${s.chapter}</span>
            <span class="atd-w">${s.date}${note?` &middot; <span class="atd-note">${note}</span>`:''}</span></span>
          <span class="atd-mark ${s.unavail?'atd-na':r&&r.att?'atd-yes':'atd-no'}">${s.unavail?'Attendance unavailable':r&&r.att?`Attended &middot; ${r.mins} min`:'Did not attend'}</span>
        </div>`; }).join('')}
    </div>` : `<div class="empty" style="border:0">${I.calendar}<h3>No sessions held yet</h3><p>Attendance fills in as this cohort's sessions run.</p></div>`}
  </div>
  ${ldrNotesSec(m, c)}
</div></main>`;
};

const ldrAtt = rows => {
  const rank = x => x.m.flag ? (x.m.flag.k === 'bad' ? 0 : 1) : 2;
  const idle = m => /(\d+)d ago/.test(m.last) ? +m.last.match(/(\d+)d/)[1]
             : m.last === 'Never' ? 99 : 0;
  return rows.filter(x => x.m.flag).slice().sort((a,b) =>
    rank(a) - rank(b)
    || idle(b.m) - idle(a.m)
    || (a.m.pc - lpace(a.c)) - (b.m.pc - lpace(b.c)))[0];
};

const ldrAttention = x => {
  if(!x) return '';
  const m = x.m, c = x.c;
  const last = m.last === 'Never' ? 'Never signed in' : 'Last active ' + m.last.toLowerCase();
  return `${''/* THE CLASS GOES ON THE `.sec`, NOT ON A DIV INSIDE IT. §75 is
                written `.app .sec.dark-card` — the ground, the haze, the 32px
                frame and the `--pad-x` inset are the SECTION's, and the layer's
                seam rules turn that section's own `::after` off. Wrapped in a
                plain `.sec` the card matched nothing and rendered as a
                transparent block with white ink on white paper: every rule
                missing at once, and no warning. This is the whole of what
                "convert a section to a black card" means literally. */}
  <div class="sec dark-card att">
      ${''/* THE ACTION IS IN THE HEADING ROW (Maryam, 2 Sep 2026: "take the
             contact candidate button to the top right of the card aligned with
             the heading"), which is `.dc-act` — the slot §75 documents on
             `.dc-hd-r` and `talRec` already uses for "View all agents". It is
             the same button with the same handler; what changes is that §75
             gives it the row's baseline, the auto margin and the borderless
             white ink for free, so the card's own footer row is deleted rather
             than restyled.
             THE SLOT IS ONE-OR-THE-OTHER: `.dc-act` (a control) or `.dc-when`
             (a time). Both carry `margin-left:auto`, so a card wanting both
             needs a group rather than a second auto margin — §77's note. */}
      <div class="dc-hd"><div class="dc-hd-r"><h2 class="dc-t">Needs your attention</h2>
        <button class="btn btn-s btn-sm noic dc-act" data-ldrdm="${m.name}">${I.chat} Contact Candidate</button>
      </div></div>
      <div class="att-b">
        <span class="att-av">${avatar({i:m.ini, img:AV[m.img]}, 56)}</span>
        <span class="att-who">
          <span class="ttl">${m.name}</span>
          <span class="sub">${lname(c)} &middot; ${llevel(c)} &middot; week ${c.week} of 13</span>
          <span class="att-fl">
            <span class="flag-t">${I[m.flag.ic]}${m.flag.t}</span>
            <span class="sub">${last}</span>
          </span>
        </span>
        <span class="att-ring">${ring(m.pc, `${m.pc}% of ${lpace(c)}% expected`)}</span>
      </div>
  </div>`;
};

V.leadReports = () => {
  const sel = S.ldrRep;
  const all = lallmembers();
  const rows = all.filter(x => x.c.id === +sel);
  const behind = rows.filter(x => x.m.pc - lpace(x.c) <= -5);
  const weak = rows.filter(x => x.m.avg > 0 && x.m.avg < 75);
  const never = rows.filter(x => x.m.last === 'Never');
  const avg = rows.length ? Math.round(rows.reduce((s,x) => s + x.m.pc, 0) / rows.length) : 0;

  return `<main class="main"><div class="page">
  ${crumb(['Dashboard','leadDash'],'Course Reports')}
  ${''/* Shortened, not dropped: WHERE this data comes from is the one fact
        about this page that is not visible on it, and the `.note` below makes
        the argument at length. Tal now opens on the finding instead of on a
        description of the sort order. */}
  ${ph('Course Reports','From the course platform &middot; chapters, scores, attempts, attendance')}
  ${''/* THE STRIP IS THE RECORD AND NOTHING ELSE (Maryam, 2 Sep 2026: "remove
         all cohorts tab just show the other three"). "All cohorts" was the
         first tab and the default, and it was the one tab that was not a
         cohort: 28 candidates from three courses at three different weeks, sorted
         into one list by a gap to a pace that means something different in each
         of them. The four figures above it read "across all three cohorts" for
         the same reason and were the same average of three unlike things.
         WHAT IT COSTS, STATED RATHER THAN HIDDEN: there is no longer one list
         of everybody on this page. The dashboard's Attention Required queue is
         the cross-cohort view — it is the only reading of all 28 that is a
         comparison of like with like ("who has stopped"), and it is already
         drawn. `lmembers()` keeps two readers here, the strip's own counts and
         the figure band's denominators. */}
  <div class="sec sec-cs">
    <div class="cs">
      ${LEAD_ALL().map(c => `<button class="${sel === String(c.id) ? 'on' : ''}" data-ldrrep="${c.id}">${lname(c)}${c.status==='completed'?' <small>(completed)</small>':''}<span class="lf-n">${c.members.length}</span></button>`).join('')}
    </div>
  </div>
  ${ldrAttention(ldrAtt(rows))}
  ${''/* THE FIGURE BAND PAYS A HALF FRAME (Maryam, 2 Sep 2026: "reduce the
         space above and below the 4 cards row"). `.sec-band` is the marker and
         §92.7 is the rule; §10's own `--s06` is what it steps down from, so the
         page's other sections keep the 48px rhythm the 1 Sep instruction set.
         It is a marker class rather than a `:has(> .stats)` selector for §55's
         reason: whether a band is tight is an editorial call about one page,
         and every other `.stats` in both portals wants the standard frame. */}
  <div class="sec sec-band">
    <div class="stats">
      ${statCell(I.growth, 'Average progress', avg + '<small>%</small>', 'in this cohort')}
      ${statCell(I.warningAlt, 'Behind pace', behind.length, 'five points or more')}
      ${statCell(I.chart, 'Below pass mark', weak.length, 'assessments under 75%')}
      ${statCell(I.misuse, 'Never signed in', never.length, never.length ? 'no activity at all' : 'everyone has started')}
    </div>
  </div>
  ${''/* THE TABLE IS WHITE AND HAS NOTHING DRAWN ABOVE IT — Maryam, 31 Aug 2026:
        "remove the grey bg color of the 4 tables against all 4 tabs. also remove
        the top border of the table that is dividing it from the upper blocks.
        also remove the 'Ordered by the gap to expected pace' text."

        ONE SECTION, FOUR STATES. "The 4 tables" are this block under each of the
        four tabs — the filter re-renders rather than hiding rows (the note at
        the head of this view is the argument), so there is one place to change
        and the change lands on all four by construction.

        `.sec-rep` IS A NAME, NOT A STYLE. With `tint` gone the grey goes, and
        the hairline above it is then the only thing left dividing the table from
        the figure band — which is what the second half of the instruction takes
        off. That line belongs to the section ABOVE (§18.129), and at desktop it
        is drawn by §14's (0,12,0) re-enabler, which per trap 4 can only be
        answered from inside its own `:not()` list. So the section says what it
        IS and two rules name it: §14's list and §84's phone tier. The marker
        idiom is §20's own — `.sec-cs`, `.sec-out`, `.cap-sec`, `.lead-bar`.

        THE SORT ORDER IS NO LONGER STATED IN WORDS, and that is the third half
        of the instruction. It was already the weakest line on the page: the
        `.tag` on every row ("32 behind") states the gap this is sorted by, the
        first row IS the worst, and the sentence under the table names them. Tal
        says the same thing at the top — the note above `ph()` in this view
        records the earlier round of exactly this subtraction. */}
  ${''/* IT IS DRAWN LIKE THE DASHBOARD'S ATTENTION QUEUE (Maryam, 2 Sep 2026:
         "i want this tab structure to be like the Attention Required section
         table on the dashboard, the spacing, colors, implementation should be
         like that"), and the implementation is the same CLASS rather than the
         same rules written twice. `.tbl-flag` carries five decisions §31 made
         for that queue on 1 Sep — no rule between rows, one light-grey rule
         under the heads instead of §10's `#111`, the first row standing 24px
         off it, cells centred rather than top-aligned, and the rounded flag
         chip — and every one of them is about a SHORT table of people rather
         than about flags. So the class now has two writers and §31's note says
         so; nothing about the queue moved.
         `.ldr-tbl` STAYS ON IT: that class carries §36's own four rules (the
         row cursor, the chevron cell, the focus ring) which this table needs
         and the dashboard's queue does not have, because its rows are not
         links. The two classes answer two different questions. */}
  <div class="sec sec-rep">
    <div class="sec-h"><h2>Candidates Progress</h2></div>
    <div class="tbl-wrap">
      <table class="tbl ldr-tbl tbl-flag">
        <tr><th>Candidate</th><th>Course</th><th class="num">Chapters</th>
            <th class="num">Assessment</th><th class="num">Attempts</th><th class="num">Time</th><th>Last active</th><th></th></tr>
        ${rows.slice().sort((a,b) => (a.m.pc - lpace(a.c)) - (b.m.pc - lpace(b.c))).map(x => {
          const m = x.m;
          return `<tr class="ldr-tr${m.flag ? (m.flag.k === 'bad' ? ' sev' : ' mod') : ''}" data-ldrco="${x.c.id}" data-ldrmem="${m.name}" data-go="leadMember" tabindex="0" role="button">
            ${/* A FACE IN THE FIRST CELL, the same argument `faceRow` makes in
                  lead.js: every row on this portal is a PERSON, and twenty-eight
                  rows of name-and-figures is the page where that is hardest to
                  hold. The mark is `mem-av mem-ph` at 24px — the roster's own
                  slot, one step down for a table row — so the reports table and
                  the roster draw the same candidate the same way. */''}
            ${/* THE "n BEHIND" CHIP IS GONE (Maryam, 2 Sep 2026: "i do not know
                  what does the 29 behind tag means, if it is stupid then remove
                  these tags"). It was the gap in PERCENTAGE POINTS between a
                  candidate's chapter progress and the pace expected on the day
                  — so "29 behind" was 9% against 38% — and a figure that has to
                  be explained on a row that also prints "1 of 13" is a figure
                  the row does not need. Nothing is lost: the table is SORTED by
                  that gap so the worst is still the first row, the figure band
                  above counts everyone five points or more back, and the line
                  under the table names the furthest behind and states both
                  numbers in full. `d` goes with it. */''}
            <td><span class="ldr-who">
              <span class="mem-av mem-ph">${avatar({i:m.ini, img:AV[m.img]}, 24)}</span>
              <span class="ldr-who-n">${m.name}</span>
            </span></td>
            ${''/* COURSE COLUMN, PER CANDIDATE (Maryam, 9 Sep 2026: add a Course
                   column, then "the candidates could be taking different courses
                   so please show different course names"). `mcourse(m)` reads the
                   candidate rather than the cohort, so the column varies down the
                   table instead of repeating the cohort's one course. */}
            <td>${mcourse(m)}</td>
            <td class="num">${lchDone(m)} <span class="t-helper-01">of 13</span></td>
            <td class="num">${m.avg ? `${m.avg}%` : '<span class="t-helper-01">&mdash;</span>'}</td>
            ${''/* ATTEMPTS AS A WHOLE NUMBER (Maryam, 9 Sep 2026: "the attempts
                   cant be in points, they will be either 1 or 2 or a proper
                   number not 1.1 etc"). `m.att` is the per-chapter average; the
                   column reads it as the count a leader means by "attempts", so
                   it rounds to the nearest whole. */}
            <td class="num">${m.att ? Math.round(m.att) : '<span class="t-helper-01">&mdash;</span>'}</td>
            <td class="num">${lmins(m) ? lhrs(lmins(m)) : '<span class="t-helper-01">&mdash;</span>'}</td>
            <td>${m.last.toLowerCase()}</td>
            ${''/* THE LAST CELL IS A NAMED LINK, NOT A CHEVRON (Maryam, 2 Sep
                  2026: "instead of a chevron at the end we should have View
                  Progress blue text with a blue arrow next to it"). The chevron
                  said "this row opens" and left what it opens to be guessed;
                  the words say it. It is NOT a `<button>` — the whole row is
                  the target (`role=button`, `tabindex=0`, `data-go`), and a
                  control inside a control is two targets for one action. The
                  arrow is `I.arrowRight` rather than §64's `mask-image`, which
                  only reaches a `.btn`. */}
            <td class="ldr-go"><span class="ldr-view">View Progress ${I.arrowRight}</span></td>
          </tr>`;
        }).join('')}
      </table>
    </div>
    ${''/* THE CLOSING LINE IS GONE (Maryam, 2 Sep 2026: "remove the bottom
           text Yuki Tanaka is furthest behind — 9% against 38% expected in
           cohort 41"). It named the worst candidate and printed the gap, and
           by the time it was written the page said that twice above it: Tal's
           summary at the head names the same person and the same figure, and
           the black card 200px below the tabs draws them with their photograph
           on it. The table is sorted worst first, so the first row is the third
           statement of it. `worst` goes with the line rather than being left
           computed and unread. */}
  </div>
  ${''/* "ACTIVITY, NOT QUALITY" IS DELETED (Maryam, 2 Sep 2026: "remove the
         bottom Activity, not quality section"). It was a `.note` closing the
         page: chapters, scores, attempts and timing are all the course platform
         can report, and none of them says how well somebody is THINKING.
         THE ARGUMENT IS KEPT BECAUSE IT IS STILL TRUE AND IS STILL SAID — the
         `ph()` line at the head of this page names the source in the same
         breath as the columns ("From the course platform · chapters, scores,
         attempts, attendance"), which is the fact the note existed to carry.
         What the note added on top of that was a caution about what the numbers
         do not mean, at the foot of a page nobody scrolls to twice. If it comes
         back it belongs beside the figures, not under them. */}
</div></main>`;
};

function ldrBriefSheet(){
  const c = S.ldrBrief ? lcoOf(S.ldrBrief) : null;
  if(!c) return `<div class="modal" data-ldrclose="brief"></div>`;
  const att = c.members.filter(m => m.flag);
  const severe = att.filter(m => m.flag.k === 'bad');
  const weakest = c.members.filter(m => m.avg > 0).slice().sort((a,b) => a.avg - b.avg)[0];
  const chapter = CH[Math.min(12, c.week - 1)];
  const behind = c.members.filter(m => m.pc < lpace(c) - 5).length;

  return `<div class="modal on" data-ldrclose="brief">
    <div class="sheet">
      <div class="sheet-h"><h2>Week ${c.week} brief</h2>
        <button class="x" data-ldrclose="brief" aria-label="Close">${I.close}</button></div>
      <div class="sheet-b">
        <div class="ai-aura tile mb6">
          <div class="ai-head">${talLabel()}<h3>Run the call like this</h3></div>
          <div class="ai-body"><p>${lname(c)} is ${lpaceGap(c) >= 0 ? 'on pace' : Math.abs(lpaceGap(c)) + ' points behind'} at week ${c.week} of 13, and this is drawn from where they actually are rather than from the syllabus.</p></div>
        </div>
        <ol class="steps mb6">
          <li><span class="s-n">1</span><span class="s-b"><b>Open on ${chapter[0]}</b>
            It is this week's chapter and the one carrying the cohort's lowest scores${weakest ? `, ${weakest.name.split(' ')[0]} is at ${weakest.avg}%` : ''}.</span></li>
          <li><span class="s-n">2</span><span class="s-b"><b>Skip what is already landing</b>
            Anything with near-universal completion and scores above 85% does not need the hour. ${lassess(c) ? `${lassess(c)}% is the cohort average` : 'nothing is assessed yet'}.</span></li>
          <li><span class="s-n">3</span><span class="s-b"><b>Ask for a real example, not a hypothetical</b>
            ${behind} of ${c.members.length} are behind pace, which is usually time rather than comprehension. A concrete example from their own week gets further than more material.</span></li>
          <li><span class="s-n">4</span><span class="s-b"><b>Raise ${severe.length ? 'the ' + severe.length + ' at risk privately' : 'nothing privately this week'}</b>
            ${severe.length ? 'Never in the group. ' + severe.slice(0,2).map(m => m.name).join(' and ') + (severe.length > 2 ? ' and others' : '') + '.' : 'Nobody in this cohort is flagged severely.'}</span></li>
        </ol>
        ${/* `.kv` ROWS, NOT A `.facts` BAND. `.facts` is an auto-fit grid sized
              for a page; inside a 520px sheet it fits three across and the
              fourth cell lands alone on a second row, where §10 stretches it
              the full width with its own fill. Four rows in a tile are four
              rows at any width, which is what a sheet needs. */''}
        <div class="tile mb6">
          <div class="kv"><span class="k">Average progress</span><span class="v">${lavg(c,'pc')}%</span></div>
          <div class="kv"><span class="k">Expected by now</span><span class="v n">${lpace(c)}%</span></div>
          <div class="kv"><span class="k">Assessment average</span><span class="v n">${lassess(c) ? lassess(c) + '%' : 'nothing assessed yet'}</span></div>
          <div class="kv"><span class="k">Behind pace</span><span class="v n">${behind} of ${c.members.length}</span></div>
        </div>
        ${att.length ? `<h3 class="ldr-sh">Bring these ${att.length} up privately</h3>
        <div class="tile-stack">
          ${att.slice(0,4).map(m => `<div class="cardrow">
            <span class="mem-av mem-ph">${avatar({i:m.ini, img:AV[m.img]}, 36)}</span>
            <span class="cardrow-b">
              <span class="cardrow-t">${m.name} ${lflagTag(m.flag)}</span>
              <span class="cardrow-d">${m.pc}% at day ${c.day} &middot; last active ${m.last.toLowerCase()}</span>
            </span>
          </div>`).join('')}
        </div>` : ''}
        <p class="t-helper-01 mt5">Everything above is computed from course activity: progress, scores, attempts and timing. Nothing in it reads their written answers, so it cannot tell you how well they are thinking.</p>
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-ldrclose="brief">Close</button>
        <button class="btn btn-p noic" data-ldrclose="brief">Print for the call</button>
      </div>
    </div>
  </div>`;
}

const LDR_SHEETS = [ldrBriefSheet];

function placeLdrSheets(){
  const app = device.querySelector('.app');
  if(!app) return;
  let host = app.querySelector(':scope > .ldr-sheets');
  if(!isLead()){ if(host) host.remove(); return; }
  if(!host){
    host = document.createElement('div');
    host.className = 'ldr-sheets';
    app.appendChild(host);
  }
  host.innerHTML = LDR_SHEETS.map(f => { try { return f(); } catch(e){ return ''; } }).join('');
}

device.addEventListener('click', e => {
  const co = e.target.closest('[data-ldrco]');
  if(co) S.ldrCo = +co.dataset.ldrco;
  const mem = e.target.closest('[data-ldrmem]');
  if(mem) S.ldrMem = mem.dataset.ldrmem;
  const ses = e.target.closest('[data-ldrses]');   /* EPIC 12.6 — the attendance record */
  if(ses) S.ldrSes = ses.dataset.ldrses;
}, true);

device.addEventListener('keydown', e => {
  if(e.key !== 'Enter' && e.key !== ' ') return;
  const row = e.target.closest && e.target.closest('tr.ldr-tr[data-go]');
  if(!row) return;
  e.preventDefault();
  row.click();
});

device.addEventListener('change', e => { if(e.target.id === 'ldrNoteK') S.ldrNoteK = e.target.value; });
device.addEventListener('click', e => {
  const inRm = e.target.closest('.rowmenu, .rowmenu-list');
  const inPg = e.target.closest('.pgn-dd');
  const inFd = e.target.closest('.fdd');
  if(S.ldrRowMenu && !inRm){ S.ldrRowMenu = null; ldrRerender(); }
  if(S.ldrPgOpen && !inPg){ S.ldrPgOpen = null; ldrRerender(); }
  if(S.ldrLvlOpen && !inFd){ S.ldrLvlOpen = null; ldrRerender(); }

  const rmT = e.target.closest('[data-ldrrm]');
  if(rmT){ S.ldrRowMenu = S.ldrRowMenu === rmT.dataset.ldrrm ? null : rmT.dataset.ldrrm; ldrRerender(); return; }
  if(e.target.closest('.rowmenu-list')) S.ldrRowMenu = null;   /* a menu item press */

  const pgdd = e.target.closest('[data-ldrpgdd]');
  if(pgdd){ S.ldrPgOpen = !S.ldrPgOpen; ldrRerender(); return; }
  const pgsz = e.target.closest('[data-ldrpgsize]');
  if(pgsz){ S.ldrPageSize = +pgsz.dataset.ldrpgsize; S.ldrPage = 0; S.ldrPgOpen = null; ldrRerender(); return; }
  const pg = e.target.closest('[data-ldrpg]');
  if(pg){ const act = pg.dataset.ldrpg; let p = S.ldrPage || 0;
    p = act === 'prev' ? p - 1 : act === 'next' ? p + 1 : +act;
    S.ldrPage = Math.max(0, p); ldrRerender(); return; }

  const lvT = e.target.closest('[data-ldrlvltoggle]');
  if(lvT){ S.ldrLvlOpen = !S.ldrLvlOpen; ldrRerender(); return; }
  const lvS = e.target.closest('[data-ldrlvlset]');
  if(lvS){ S.ddVal = S.ddVal || {}; S.ddVal.ldrlvl = lvS.dataset.ldrlvlset; S.ldrLvlOpen = null; S.ldrPage = 0; ldrRerender(); return; }
  const scx = e.target.closest('[data-ldrsrchclear]');
  if(scx){ S.ldrRosterQ = ''; S.ldrPage = 0; S.ldrRosterFocus = 0; ldrRerender(); return; }

  const rep = e.target.closest('[data-ldrrep]');
  if(rep){ S.ldrRep = rep.dataset.ldrrep; render(); return; }

  const ctb = e.target.closest('[data-ldrctab]');
  if(ctb){ S.ldrCTab = ctb.dataset.ldrctab; render(); return; }

  const stb = e.target.closest('[data-ldrsestab]');
  if(stb){ S.ldrSesTab = stb.dataset.ldrsestab; render(); return; }

  const evb = e.target.closest('[data-ldrevtab]');
  if(evb){ S.ldrEvTab = evb.dataset.ldrevtab; render(); return; }

  const srt = e.target.closest('[data-ldrsort]');
  if(srt){ const k = srt.dataset.ldrsort, cur = S.ldrSort || {k:'name', dir:1};
    S.ldrSort = {k, dir: cur.k === k ? -cur.dir : 1}; ldrRerender(); return; }

  if(e.target.closest('[data-ldrchall]')){ S.ldrChAll = !S.ldrChAll; render(); return; }

  const br = e.target.closest('[data-ldrbrief]');
  if(br){ S.ldrBrief = +br.dataset.ldrbrief; render(); return; }

  const nt = e.target.closest('[data-ldrnote]');
  if(nt){ S.ldrNoteAt = -1; S.ldrNoteK = ''; render(); return; }

  const ed = e.target.closest('[data-ldrnoteedit]');
  if(ed){
    const raw = ed.dataset.ldrnoteedit, cut = raw.lastIndexOf(':');
    S.ldrNoteAt = +raw.slice(cut + 1);
    S.ldrNoteK = (S.ldrNotes[raw.slice(0,cut)] || [])[+raw.slice(cut+1)]?.k || '';
    render();
    return;
  }

  const nk = e.target.closest('[data-ldrnotek]');
  if(nk){ S.ldrNoteK = nk.dataset.ldrnotek; render(); return; }

  if(e.target.closest('[data-ldrnotecancel]')){ S.ldrNoteAt = null; S.ldrNoteK = ''; render(); return; }

  const sv = e.target.closest('[data-ldrnotesave]');
  if(sv){
    const name = sv.dataset.ldrnotesave;
    const bb = device.querySelector('#ldrNoteB');
    const b = bb ? bb.value.trim() : '';
    const k = S.ldrNoteK;
    if(!k){ const t0 = device.querySelector('.note-type'); if(t0) t0.focus(); return; }
    if(!b){ if(bb) bb.focus(); return; }
    const c = lco();
    S.ldrNotes[name] = S.ldrNotes[name] || [];
    if(S.ldrNoteAt >= 0){ const old = S.ldrNotes[name][S.ldrNoteAt];
      S.ldrNotes[name][S.ldrNoteAt] = {k, b, wk:old.wk, d:old.d, at:old.at, edited:true}; }
    else S.ldrNotes[name].unshift({k, b, wk:leadWeek(c.day), d:LEAD_TODAY, at:Date.now()});
    S.ldrNoteAt = null; S.ldrNoteK = '';
    render();
    return;
  }

  const del = e.target.closest('[data-ldrnotedel]');
  if(del){
    const raw = del.dataset.ldrnotedel;
    const cut = raw.lastIndexOf(':');
    const name = raw.slice(0, cut), i = +raw.slice(cut + 1);
    if(S.ldrNotes[name]) S.ldrNotes[name].splice(i, 1);
    render();
    return;
  }

  const cl = e.target.closest('[data-ldrclose]');
  if(cl){
    if(cl.classList.contains('modal') && e.target !== cl) return;
    if(cl.dataset.ldrclose === 'brief') S.ldrBrief = null;
    if(cl.dataset.ldrclose === 'note') S.ldrNote = null;
    render();
    return;
  }
});

const _baseLdr = render;
render = function(){
  _baseLdr();
  try { placeLdrSheets(); } catch(e){ console.warn('ldr sheets', e); }
};

render();
