const LEADER = {n:COHORT_LEAD.n, i:'PN', img:AV.priya,
  range:COHORT_LEAD.range, since:COHORT_LEAD.since,
  email:'priya.nair@nextinleadership.org',
  bio:'Fifteen years running operations teams. I am direct, I move quickly, and I do not pad feedback — if something is not working I will say so in the first ten minutes.',
  specs:['Operations teams','First-line leadership','Delegation','Prioritisation','Stakeholder management','Coaching for growth','Remote and hybrid teams']};


const lmem = (name,ini,img,pc,avg,att,last,pts) => ({name,ini,img,pc,avg,att,last,pts,flag:null});

const lbadge = pts => BDG.filter(b => b.need && pts >= b.need).pop() || null;

const LEAD_COHORTS = [
  {id:41, level:'E3', intent:INTENTS[2], week:5, day:34, call:'Thursday 6:00 PM', callDay:'Today', callTime:'6:00 PM', callOrd:2, starts:'',
   start:'28 Aug 2026', end:'26 Nov 2026', startISO:'2026-08-28', callBaseISO:'2026-09-03', callTimeH:'18:00', completeDelay:7,
   status:'active', members:[
    lmem('Maryam Naz','MN','hana',46,84,1.3,'Today',1760),
    lmem('Aisha Bello','AB','priya',71,94,1.0,'Today',2610),
    lmem('Daniel Kerr','DK','owen',58,88,1.2,'Today',2140),
    lmem('Sofia Marchetti','SM','lena',41,79,1.0,'2d ago',1520),
    lmem('Ravi Chandran','RC','samuel',39,72,1.8,'Today',1395),
    lmem('Nora Lindqvist','NL','lena',36,81,1.1,'3d ago',1280),
    lmem('James Whitby','JW','owen',31,65,2.4,'Today',1120),
    lmem('Chloe Ferreira','CF','priya',28,77,1.0,'5d ago',1005),
    lmem('Tobias Mensah','TM','samuel',35,61,1.4,'2d ago',1240),
    lmem('Yuki Tanaka','YT','hana',9,0,0,'12d ago',285)]}
];

const LEAD_PAST = [
  {id:33, level:'E1', intent:INTENTS[0], week:11, day:76, call:'Friday 5:00 PM', callDay:'Tomorrow', callTime:'5:00 PM', callOrd:4, starts:'',
   start:'12 Jun 2026', end:'10 Sep 2026', startISO:'2026-06-12', callBaseISO:'2026-06-19', callTimeH:'17:00', completeDelay:7,
   status:'completed', members:[
    lmem('Owen Clarke','OC','owen',92,87,1.3,'Today',5240),
    lmem('Lena Fischer','LF','lena',88,90,1.0,'Yesterday',4880),
    lmem('Samuel Adeyemi','SA','samuel',84,79,1.6,'Today',4510),
    lmem('Hana Kim','HK','hana',81,83,1.2,'Yesterday',4180),
    lmem('Marco Rossi','MR','owen',80,75,1.9,'2d ago',3940),
    lmem('Grace Mwangi','GM','priya',80,88,1.0,'Today',4265),
    lmem('Ivan Petrov','IP','samuel',80,70,1.7,'3d ago',3780),
    lmem('Zoe Bennett','ZB','lena',80,66,1.6,'2d ago',3410)]}
];

const LEAD_ALL = () => LEAD_COHORTS.concat(LEAD_PAST);

const lpace = c => Math.round(c.day / 90 * 100);

function lflag(m,c){
  const d = m.pc - lpace(c);
  const idle = /(\d+)d ago/.test(m.last) ? +m.last.match(/(\d+)d/)[1] : 0;
  if(m.last === 'Never')          return {k:'bad', t:'Never signed in',        ic:'misuse'};
  if(idle >= 7)                   return {k:'bad', t:'Inactive '+idle+' days', ic:'time'};
  if(d <= -15)                    return {k:'bad', t:'At risk',                ic:'warningAlt'};
  if(m.att >= 2.0 && m.avg < 75)  return {k:'wa',  t:'Struggling',             ic:'chart'};
  if(d <= -5)                     return {k:'wa',  t:'Behind pace',            ic:'growth'};
  if(idle >= 4)                   return {k:'wa',  t:'Slowing',                ic:'time'};
  return null;
}
LEAD_ALL().forEach(c => c.members.forEach(m => m.flag = lflag(m,c)));

const lmembers  = () => LEAD_COHORTS.flatMap(c => c.members.map(m => ({m, c})));
const lallmembers = () => LEAD_ALL().flatMap(c => c.members.map(m => ({m, c})));
const lgap = x => x.m.pc - lpace(x.c);
const lattention = () => lmembers().filter(x => x.m.flag)
  .sort((a,b) => (a.m.flag.k === b.m.flag.k ? lgap(a) - lgap(b) : a.m.flag.k === 'bad' ? -1 : 1));
const lbehind = () => lmembers().filter(x => x.m.pc - lpace(x.c) <= -5);
const lavg = (c,k) => Math.round(c.members.reduce((s,m) => s + m[k], 0) / c.members.length);
const lname = c => 'Cohort ' + c.id;
const llevel = c => 'Explorer &ndash; ' + c.level;
const lintent = c => c.intent;
const lcourse = c => courseOf(c.level);

const LDR_LEVELS = ['E1', 'E2', 'E3', 'E4'];
const mlevel = m => LDR_LEVELS[[...m.name].reduce((a, ch) => a + ch.charCodeAt(0), 0) % LDR_LEVELS.length];
const mcourse = m => courseOf(mlevel(m));

const COURSE_DESC = {
  E1: 'The everyday foundations of working in a business — how teams organise, how work moves through them, and the basic tools that keep it running. The first step before the deeper courses.',
  E2: 'The software and working habits that make a modern team fast: documents, spreadsheets, planning and communication tools, and how to use them well together rather than one at a time.'
};
const courseDesc = lvl => (ENROL_COURSE[lvl] && ENROL_COURSE[lvl].desc) || COURSE_DESC[lvl] || '';

const cohortArt = c => COHORT_ART[String(c.level).toLowerCase()] || COHORT_ART.e1;

const lcall = c => ({
  id:'c' + c.id, co:c.id, ord:c.callOrd, day:c.callDay, time:c.callTime,
  when:c.callDay + ' ' + c.callTime, mins:60,
  week:c.week, level:c.level, seats:c.members.length,
  course:courseOf(c.level),
  chapter:CH[Math.min(12, c.week - 1)][0]
});
const lcalls = () => LEAD_COHORTS.map(lcall).sort((a,b) => a.ord - b.ord);
const lnext  = () => lcalls()[0];

const LEAD_RUN = [
  {co:41, week:4,  when:'Thursday 28 August', attended:9},
  {co:33, week:10, when:'Friday 22 August',   attended:7},
  {co:41, week:3,  when:'Thursday 21 August', attended:8},
  {co:33, week:9,  when:'Friday 15 August',   attended:8}
];


const leadWeek = day => Math.min(13, Math.max(1, Math.ceil(day / 7)));

const LEAD_SYNC = '29 Sep 2026, 14:30';
const LEAD_TZ   = 'London (UTC+01:00)';

const HANDLE = {'Maryam Naz':'@maryamsss'};
const handleOf = x => { const name = typeof x === 'string' ? x : x.name;
  return HANDLE[name] || '@' + name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g,''); };
const SHOW_REAL = new Set(['Maryam Naz','Aisha Bello','Daniel Kerr','Owen Clarke','Grace Mwangi','Hana Kim']);
const showReal  = m => SHOW_REAL.has(m.name);
const leadName  = m => showReal(m)
  ? `<span class="lnm"><span class="lnm-r">${m.name}</span> <span class="lnm-h">${handleOf(m)}</span></span>`
  : `<span class="lnm"><span class="lnm-h lnm-only">${handleOf(m)}</span></span>`;
const leadPlain = m => (showReal(m) ? m.name + ' ' : '') + handleOf(m);

const LEAD_JOINED = {'Chloe Ferreira':2, 'Tobias Mensah':3};
const memJoinWeek = m => LEAD_JOINED[m.name] || 1;

const LEAD_NOW = new Date('2026-09-29T15:00:00');
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const dPretty = iso => { const d = new Date(iso + 'T00:00:00'); return d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear(); };
const dISOadd = (iso, days) => { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + days); return d.toISOString().slice(0,10); };
const sesDT   = s => new Date(s.dISO + 'T' + (s.time || '00:00') + ':00');
const sesEnd  = s => new Date(sesDT(s).getTime() + s.dur * 60000);
const sesPast = s => sesEnd(s) < LEAD_NOW;               /* the whole session is behind us */
const sesLive = s => sesDT(s) <= LEAD_NOW && sesEnd(s) >= LEAD_NOW;
const sesJoinable = s => s.status === 'scheduled' && (sesDT(s) - LEAD_NOW) <= 5*60000 && sesEnd(s) >= LEAD_NOW;

function sesCountdown(s){
  const ms = sesDT(s) - LEAD_NOW;
  if(ms <= 0) return sesEnd(s) >= LEAD_NOW ? 'Live now' : 'Ended';
  const mins = Math.round(ms/60000);
  if(mins <= 5)  return 'Starting now';
  if(mins < 60)  return 'in ' + mins + ' minutes';
  const hrs = Math.floor(mins/60);
  if(hrs < 24)   return 'in ' + hrs + ' hour' + (hrs===1?'':'s');
  return 'in ' + Math.round(hrs/24) + ' day' + (Math.round(hrs/24)===1?'':'s');
}

function leadBuildSeries(c){
  const out = [];
  for(let w=1; w<=13; w++){
    const iso = dISOadd(c.callBaseISO, (w-1)*7);
    out.push({
      id:'s'+c.id+'w'+w, co:c.id, series:'wk'+c.id,
      title:'Cohort '+c.id+' call', chapter:CH[w-1][0],
      dISO:iso, date:dPretty(iso), time:c.callTimeH, dur:60,
      repeat:'weekly', week:w, status:'scheduled', unavail:false, adhoc:false
    });
  }
  return out;
}
const LEAD_SESSIONS = {};
LEAD_ALL().forEach(c => { LEAD_SESSIONS[c.id] = leadBuildSeries(c); });
(function(){
  const ss = LEAD_SESSIONS[41]; if(!ss) return;
  ss.push({id:'s41x1', co:41, series:null, title:'Extra Q&A before assessment', chapter:'Hard Conversations',
    dISO:'2026-09-15', date:dPretty('2026-09-15'), time:'19:00', dur:45, repeat:'none', week:leadWeek(19),
    status:'cancelled', reason:'Clashed with the LightspeedVT maintenance window. I will fold the questions into Thursday.', unavail:false, adhoc:true});
})();

const leadSessionsOf = c => (LEAD_SESSIONS[c.id] || []).slice().sort((a,b) => sesDT(a) - sesDT(b));
const leadNextSession = c => leadSessionsOf(c).find(s => s.status === 'scheduled' && sesEnd(s) >= LEAD_NOW) || null;
const leadHeld = c => leadSessionsOf(c).filter(s => s.status === 'scheduled' && sesPast(s) && !s.unavail);

function leadOverlap(c, dISO, time, dur, exceptId){
  const a0 = new Date(dISO + 'T' + time + ':00'), a1 = new Date(a0.getTime() + dur*60000);
  return leadSessionsOf(c).find(s => s.id !== exceptId && s.status === 'scheduled'
    && a0 < sesEnd(s) && a1 > sesDT(s)) || null;
}

function leadHash(str){ let h=2166136261; for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = (h*16777619)>>>0; } return h; }
function memAttended(m, s){
  if(memJoinWeek(m) > s.week) return null;
  const idle = /(\d+)d ago/.test(m.last) ? +m.last.match(/(\d+)d/)[1] : 0;
  const chance = m.last === 'Never' ? 0 : idle >= 7 ? 20 : Math.min(96, 55 + Math.round(m.pc/2));
  const att = (leadHash(m.name + s.id) % 100) < chance;
  const mins = att ? Math.max(5, Math.round(s.dur * (0.55 + (leadHash(s.id + m.name) % 45)/100)))
                   : Math.round(s.dur * (leadHash('x'+m.name+s.id) % 4)/100);
  return {att:att && mins >= 5, mins};
}
function leadAttn(m, c){
  const held = leadHeld(c).filter(s => memJoinWeek(m) <= s.week);
  let att = 0; held.forEach(s => { const r = memAttended(m, s); if(r && r.att) att++; });
  return {att, held: held.length};
}
const SESSION_NOTES = {};   /* runtime session notes, keyed by session id (12.6) */
function leadRegister(c, s){
  return c.members.filter(m => memJoinWeek(m) <= s.week)
    .map(m => ({m, r: memAttended(m, s)}));
}

const ATTEND_MIN_MIN = 5;      /* minutes in the room to count as Attended */
const LEADER_GAP_MIN = 10;     /* a leader offline this long is treated as left */

const cohortEndISO = c => dISOadd(c.startISO, 89);
const sesDayOf = (c, dISO) => Math.round((new Date(dISO+'T00:00:00') - new Date(c.startISO+'T00:00:00'))/86400000) + 1;

const leadLive = () => LEAD_COHORTS[0] || null;

function leadHeaderChip(){
  const c = leadLive(); if(!c) return '';
  return `<span class="lead-hdr"><span class="lead-hdr-n">Cohort ${c.id}</span><span class="lead-hdr-w">Week ${leadWeek(c.day)} of 13</span></span>`;
}
const LEAD_SUMMARIES = [
  {id:'m1', name:'Owen Clarke',     i:'OC', img:'owen',   cohort:33, status:'pending'},
  {id:'m2', name:'Lena Fischer',    i:'LF', img:'lena',   cohort:33, status:'pending'},
  {id:'m3', name:'Samuel Adeyemi',  i:'SA', img:'samuel', cohort:33, status:'done',
   rec:'Ready to promote',
   growth:'Came in quiet and finished the 90 days running half of the Hard Conversations call himself. His answers stopped being about what the chapter said and started being about what he had tried.',
   develop:'He sits every assessment twice. Nothing in the scores says he needs to, and the next level moves faster than that.'},
  {id:'m4', name:'Hana Kim',        i:'HK', img:'hana',   cohort:33, status:'done',
   rec:'Ready to promote',
   growth:'83% on the assessments at 1.2 attempts a chapter, which is the most consistent record in the cohort. She was also the one who brought the group back to the point on the weeks it drifted.',
   develop:'She defers on anything she has not read twice. At E2 the room will expect an opinion before she is certain of it.'},
  {id:'m5', name:'Marco Rossi',     i:'MR', img:'owen',   cohort:33, status:'done',
   rec:'Hold at this level',
   why:'Finished the chapters but sat every assessment twice to clear 75%. Another cohort at E1 is the cheaper way to make that stick.',
   growth:'Attendance never slipped and Conflict and Repair clearly landed — he brought a real disagreement from work to the call and worked it through in front of the group.',
   develop:'The reading is the gap, not the effort. Another 90 days at E1 with one chapter at a time rather than three in a weekend.'},
  {id:'m6', name:'Grace Mwangi',    i:'GM', img:'priya',  cohort:33, status:'done',
   rec:'Ready to promote',
   growth:'88% first time on every assessment and 1.0 attempts a chapter — she is through the course as cleanly as anyone has been. She asks the question the rest of the room is avoiding.',
   develop:'She has not had to carry a call yet. The re-interview should ask what she does when the group goes quiet.'},
  {id:'m7', name:'Ivan Petrov',     i:'IP', img:'samuel', cohort:33, status:'done',
   rec:'Hold at this level',
   why:'70% on assessments at 1.7 attempts a chapter. He is close, and the gap is the reading rather than the effort.',
   growth:'Turned up to every call in the second half after a slow start, and the Why We Exist chapter is the one he can now argue rather than recite.',
   develop:'Assessments at 70% with almost two goes each. He is guessing where he should be checking, and one more cohort at E1 is where that becomes a habit.'},
  {id:'m8', name:'Zoe Bennett',     i:'ZB', img:'lena',   cohort:33, status:'done',
   rec:'Hold at this level',
   why:'66% is the lowest in the cohort and it did not move after week 8. Repeating E1 with the calls she missed is the honest answer.',
   growth:'She finished 80% of the course while missing four calls, which took real work on her own.',
   develop:'The calls are the half she skipped and the scores show it. Repeating E1 with the group in the room is the whole of my recommendation.'}
];

const lpending = () => LEAD_SUMMARIES.filter(s => s.status === 'pending').length;

const lcTitle  = k => 'Cohort ' + k.co + ' call';
const lcDetail = k => k.mins + ' minutes &middot; week ' + k.week + ' of 13 &middot; ' + k.chapter;



const LEAD_JUMPS = [
  {id:'lead-attention', ic:'warningAlt', l:'Attention Required'},
  {id:'lead-waiting',   ic:'edit',       l:'Awaiting Evaluations'},
  {id:'lead-calls',     ic:'video',      l:'Cohort Calls'},
  {id:'lead-cohorts',   ic:'group',      l:'Cohorts'}
];

var LEAD_NOTIF = [
  {ic:'edit',       t:'Owen Clarke is waiting on his 90-day summary',b:'Cohort 33 closes next week. Nothing goes to his next agent until you publish it.', w:'25 min ago', go:'leadEvals',    unread:1},
  {ic:'warningAlt', t:'Yuki Tanaka has not signed in for 12 days',  b:'Cohort 41, week 5. Nine per cent through the chapters.',                w:'2h ago',     go:'leadReports',  unread:1},
  {ic:'chat',       t:'3 new posts in Cohort 41',                    b:'Chapter 4 came up again on the discussion board.',                     w:'4h ago',     go:'leadMessages', unread:1},
  {ic:'calendar',   t:'Cohort 41 meets today at 6:00 PM',            b:'Week 5 of 13. Sixty minutes, ten candidates.',                         w:'Today',      go:'leadCalls',    unread:0},
  {ic:'certificate',t:'Your fourth cohort completed',                b:'Cohort 26 closed with eight of ten promoted.',                         w:'Yesterday',  go:'leadCerts',    unread:0}
];

var LEAD_TAL = {   /* `var` for the reason given above LEAD_NOTIF */
  where: {leadDash:'Dashboard', leadCalls:'Upcoming Sessions', leadEvals:'Evaluations',
          leadCohorts:'Cohorts', leadReports:'Course reports', leadMessages:'Messages',
          leadCerts:'Certifications', leadProfile:'Your profile'},
  state: () => (LEAD_COHORTS.length===1 ? 'one cohort' : LEAD_COHORTS.length + ' cohorts')
             + ', ' + lmembers().length + ' candidates, '
             + lpending() + ' summar' + (lpending()===1?'y':'ies') + ' waiting',
  ctx: {
    leadDash: ['Brief me for Thursday&rsquo;s call','Who should I worry about this week?','What is waiting on my signature?'],
    leadCalls: ['Brief me for tonight&rsquo;s call','Who missed the last one?'],
    leadEvals: ['Is Owen Clarke ready to be promoted?','What should the summary say?'],
    leadCohorts: ['Where is Cohort 41 stuck?','How is my cohort doing?'],
    leadReports: ['Who has stopped in the last week?','Which chapter is losing people?'],
    leadMessages: ['Draft a check-in to Yuki Tanaka','What came up on the board this week?'],
    leadCerts: ['What do I need for the next certification?'],
    leadProfile: ['How is my standing calculated?']
  }
};


const leadCall = (k, second) => ({
  who:{n:'Cohort ' + k.co},
  cover:false,
  role:`${k.seats} candidates at Explorer &ndash; ${k.level} &middot; ${k.course}`,
  x:lcDetail(k),
  xl:'',            /* the line is the appointment, not the cohort */
  v:false,          /* a cohort is not an identity, checked or otherwise */
  when:k.when, mins:k.mins,
  second:second === undefined
    ? {go:'leadCalls', ic:I.calendar, t:'View all sessions'}
    : second
});

const leadCallCard = (k, o) => `<div class="sec dark-card crow-dark">
    <div class="dc-hd">
      ${''/* THE HEADER IS "Upcoming Cohort Session", NOT "Cohort 41 call" (Maryam,
             9 Sep 2026: "in black cohort call cards, change the 'Cohort 41 call'
             title to 'Upcoming Cohort Session'"). The crow below still names the
             cohort ("Cohort 41" + the detail), so the header can be the generic
             kind of appointment. `lcTitle` is untouched — the dashboard's
             upcoming-calls cards still title themselves "Cohort N call". */}
      ${''/* THE TITLE IS "Week N Cohort Session" (Maryam 30 Sep 2026: "change black
             card session name format to the one we are using Week (n) Cohort
             Session"), matching the dashboard call card. The week is the record's
             own (`k.week`). Was "Upcoming Cohort Session". */}
      <div class="dc-hd-r"><h2 class="dc-t">Week ${k.week} Cohort Session</h2>
        <span class="dc-when">${I.time}${k.when}</span></div>
    </div>
    ${''/* THE ACTION IS A GATED JOIN, NOT "GENERATE THE BRIEF" (Maryam, 9 Sep 2026:
           "instead of generate brief show Join Call button but disabled"). The
           card now draws `crow`'s primary Join and no secondary (`second:false`);
           §81/§119 gate it, so it is the disabled grey Join while the call is more
           than a minute away — which is the state a leader reads it in. The `o`
           param (the caller's brief action) is no longer used by this card. */}
    ${crow(leadCall(k, false), {when:false, second:false})}
  </div>`;

const lcalCard = (k, lead, opts) => {
  const o = opts || {};
  const act = lead
    ? `<button class="btn btn-p btn-sm noic" data-call="cohort" data-joinwhen="${k.when}" data-joinmins="${k.mins}"${
        joinLive(k.when, k.mins) ? '' : ` disabled title="${joinShut(k.when)}"`}>Join call ${I.arrowRight}</button>`
    : `<svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg>`;
  if(lead){
    const till = (typeof joinClock === 'function') ? joinClock(k.when) : null;
    const co = (typeof LEAD_COHORTS !== 'undefined') ? LEAD_COHORTS.find(c => c.id === k.co) : null;
    const faces = co ? co.members.slice(0, 2).map(m => avatar({i:m.ini, img:AV[m.img]}, 22)).join('') : '';
    const moreFaces = Math.max(0, k.seats - 2);
    return `<div class="lcal lcal-next dark-card">
    <span class="lcal-slot">
      <span class="lcal-slot-ic">${I.calendar}</span>
      <span class="lcal-slot-day t-desc">${k.day}</span>
      <span class="lcal-slot-tm t-h3">${k.time}</span>
    </span>
    <span class="lcal-body">
      <span class="lcal-h">
        ${''/* THE TITLE IS "Week N Cohort Session" (Maryam 30 Sep 2026), the
               week off the cohort record; `lcTitle`'s "Cohort N call" stays on the
               other call surfaces. */}
        <span class="lcal-t t-h3">Week ${k.week} Cohort Session</span>
        ${''/* A STATIC COUNTDOWN LABEL in the HH:MM form, "In 02:40" (Maryam 2 Oct
               2026: "the black card time count should be In 02:40" — the dashboard
               now matches the Sessions page). No `data-calltill`, so `callTimerArm`
               leaves it alone — the demo card reads the call as still ahead, which
               also keeps the Join in its accent-disabled state. Callers may still
               override it. */}
        <span class="lcal-timerbox">${I.time}<span class="lcal-timer t-h4">${o.countdown || 'In 02:40'}</span></span>
      </span>
      <span class="lcal-seatsrow">
        ${faces ? `<span class="lcal-faces">${faces}${moreFaces ? `<span class="lcal-face-more">+${moreFaces}</span>` : ''}</span>` : ''}
        <span class="lcal-seats t-desc">${k.seats} candidates</span>
      </span>
      <span class="lcal-f">
        ${''/* "N minutes session" (Maryam 30 Sep 2026), the black dashboard card only. */}
        <span class="lcal-m t-desc">${k.mins} minutes session</span>
        ${act}
      </span>
    </span>
  </div>`;
  }
  return `<button class="lcal" data-go="leadCohort" data-ldrco="${k.co}">
    ${''/* THE TITLE LEADS THE HEADER ROW, AND THE COHORT-NUMBER COVER IS GONE
           (Maryam, 9 Sep 2026: "remove the cohort number from the all cards top
           left"). The date stays the word-over-figure block (`.lcal-when`) at the
           right end. This light path is unchanged; the black card is above. */}
    <span class="lcal-h">
      <span class="lcal-t t-h3">${lcTitle(k)}</span>
      <span class="lcal-when">
        <span class="lcal-day t-desc">${k.day}</span>
        <span class="lcal-tm t-h4">${k.time}</span>
      </span>
    </span>
    <span class="lcal-f">
      <span class="lcal-m t-desc">${k.mins} minutes</span>
      ${act}
    </span>
  </button>`;
};

const leadCallsSec = () => {
  const up = lcalls();
  return `<div class="sec" id="lead-calls">
    ${''/* NO DESCRIPTION (Maryam, 9 Sep 2026: "remove the desc of this"). The
           section title and the cards say what this is; the one-line lede came
           off the same way §72/§73 took the repeated ledes off the candidate
           dashboard. */}
    ${aiHead({title:'Your upcoming calls',
      act:up.length ? `<button class="btn btn-g btn-sm noic" data-go="leadCalls">View all sessions</button>` : ''})}
    ${up.length
      ? `<div class="lcal-row">${up.map((k, i) => lcalCard(k, i === 0)).join('')}</div>`
      : `<div class="empty" style="border:0">${I.calendar}<h3>Nothing this week</h3><p>Every cohort you lead has a weekly call, and they all show up here.</p></div>`}
  </div>`;
};

function faceRow(p, detail, go, at, cta){
  return `<button class="tile clk gcard face-row" data-go="${go}"${at ? ' ' + at : ''}>
    <span class="mem-av mem-ph">${avatar({i:p.i, img:AV[p.img]}, 36)}</span>
    <span class="gcard-b"><h3>${p.name}</h3><span class="sub">${detail}</span></span>
    ${cta ? `<span class="row-cta">${cta}</span>` : ''}
    <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg>
  </button>`;
}

const leadCertBanner = () => `<div class="sec">
  <div class="certban">
    <span class="certban-mk"><img src="${CERT_ART.explorer}" alt=""></span>
    <span class="certban-b">
      <span class="certban-t">Certified Cohort Leader</span>
      <span class="certban-m">Verified by TalentNext &middot; Volunteer cohort leader</span>
    </span>
    <span class="certban-a">
      <button class="btn btn-p btn-sm noic" data-go="leadProfile">View</button>
    </span>
  </div>
</div>`;



Object.assign(ASK_WHERE, LEAD_TAL.where);

const _baseLead = render;
render = function(){
  _baseLead();
  try {
    const app = device.querySelector('.app');
    if(app) app.dataset.portal = S.portal || 'candidate';
    if(S.ldrKeepScroll != null){ const m = device.querySelector('.main'); if(m){ void m.scrollHeight; /* force layout so scrollTop is not clamped to 0 before the new content measures */
      m.style.scrollBehavior = 'auto'; m.scrollTop = S.ldrKeepScroll; m.style.scrollBehavior = ''; } S.ldrKeepScroll = null; }
    if(typeof leadRestoreRosterFocus === 'function') leadRestoreRosterFocus();
    if(typeof placeLeadRowMenu === 'function') placeLeadRowMenu();
  } catch(e){ console.warn('portal stamp', e); }
};

render();
