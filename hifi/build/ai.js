/* ==========================================================================
   AI LAYER — pass 1
   Everything in this file exists because the product's claim is that it is
   AI-native, and an assistant in a side panel is not that. Two things here:

   1. THE INTERVIEW BECOMES A CORPUS. TalentNext holds a 45-minute recording,
      a full transcript and six scenes marked by the person who assessed you.
      It is the most distinctive data the company owns. Until now it was a
      play button and a download link — an archive. Here it is something you
      can put questions to, and every answer points at the lines it came
      from, at the second they were said.

   2. AN ANSWER CARRIES ITS EVIDENCE. Nothing Tal generates appears as a
      plain paragraph. It is marked as generated, it says what it was drawn
      from, and the sources are clickable. That is the difference between an
      assistant and an oracle.

   This file is loaded after views.js, so it can extend V, TAL_ROUTES and the
   state object without patching the view layer.
   ========================================================================== */

/* --------------------------------------------------------------------------
   THE TRANSCRIPT
   Twenty-six lines from the level interview of 20 August. The timestamps of
   the six marked scenes match the clips already listed on the report — this
   is the same interview seen from the inside, not a second one invented for
   the page. `t` tags each line so a question can retrieve by theme rather
   than by keyword alone.
   -------------------------------------------------------------------------- */
const IVT = {
  level: {
    label: 'Level interview',
    date: '20 August 2026',
    agent: 'priya',
    len: '45:12',
    outcome: 'Confirmed Explorer &ndash; E3',
    lines: [
      ['00:42','P','Before we start — nothing here is a test you can fail. I am going to ask you what you did, and why. Tell me the real version.',[]],
      ['01:10','M','Understood. I will try not to make it sound tidier than it was.',['caution']],
      ['02:14','P','You mentioned a reorganization in your written answers. Walk me through the call you changed your mind on.',['decision']],
      ['02:31','M','We were going to split the team by product. I had the plan written. Then I sat with two of the engineers and it became obvious they were describing the same customer from different ends, and splitting them would have cut that in half. So I changed it to split by customer segment instead.',['decision','listening']],
      ['03:48','P','What made you change it? The argument, or the people?',['decision']],
      ['04:02','M','The argument. But I only heard the argument because I sat down with them. If I had sent the plan out I would have got agreement and the wrong structure.',['decision','listening']],
      ['06:15','M','I do not think of that as a big call. It was just — obviously wrong once I heard it.',['caution']],
      ['06:40','P','It was a reorganization. It is a big call.',[]],
      ['09:20','P','Tell me about something you handed over recently.',['delegation']],
      ['11:02','M','There was a vendor review. I gave it to Sam. Two days later I took it back.',['delegation']],
      ['11:20','P','Why?',['delegation']],
      ['11:26','M','It was going to land badly. The vendor is difficult and Sam had not seen that side of them, and I could see the meeting going wrong from the shape of his draft.',['delegation','risk']],
      ['12:05','P','Did you tell him that?',['delegation']],
      ['12:11','M','No. I said I would pick it up because I had capacity. Which was not true.',['delegation','risk','caution']],
      ['13:20','M','I think I treat handing something over as a risk I am carrying. If it goes wrong it is still mine, so I would rather do it.',['delegation','risk']],
      ['14:02','P','That is the most useful sentence you have said so far.',['delegation']],
      ['19:37','P','How does your week actually run?',['rhythm']],
      ['19:52','M','Friday mornings are the only fixed thing. An hour with the four leads, no agenda, we go round. It is the meeting people protect.',['rhythm']],
      ['21:10','M','Everything else moves. I have stopped pretending otherwise.',['rhythm']],
      ['24:50','P','And upwards — how do you handle your own director?',['managing-up']],
      ['25:04','M','I bring her decisions, not problems. Although — I probably bring her decisions I have already made and I am looking for cover on. That is not the same thing.',['managing-up','caution','risk']],
      ['26:30','M','I am not sure that answers it.',['caution']],
      ['31:15','P','Tell me about a disagreement with a peer.',['conflict']],
      ['31:33','M','Finance and I disagreed about headcount for two quarters. I put my case in writing every time, which I thought was rigorous. Looking back it was avoidance. We never had the conversation, we exchanged documents.',['conflict','caution']],
      ['33:40','M','It resolved when our director put us in a room. Not by anything I did.',['conflict']],
      ['41:03','P','Last one. What do you think your gap is?',['gap']],
      ['41:19','M','Letting go of work. And I know that sounds like the answer you are supposed to give in an interview, but I have got a specific example from this month, so.',['gap','delegation']],
      ['44:10','P','You have. That is what makes it worth writing down.',['gap']]
    ]
  },
  re: {
    label: 'Re-interview',
    date: '21 November 2026',
    agent: 'priya',
    len: '44:06',
    outcome: 'Promoted to Explorer &ndash; E4',
    lines: [
      ['01:05','P','Ninety days. Start with the thing you said your gap was.',['gap','delegation']],
      ['01:22','M','Letting go of work. It is better. Not fixed.',['gap','delegation']],
      ['02:40','M','The change is that I say the quiet part now. When I hand something over I tell the person what I am worried about, instead of taking it back later and pretending it was capacity.',['delegation','listening']],
      ['05:12','P','Give me the case where it worked.',['delegation']],
      ['05:30','M','Same vendor, different review. I gave it to Sam again in October. I told him the vendor is difficult and here is the sentence that usually sets them off. He ran it. It went fine, and the bit that went wrong was not the bit I was worried about.',['delegation','decision']],
      ['08:44','M','I still wanted to take it back on the Tuesday. I did not.',['delegation','risk']],
      ['15:20','P','And the peer disagreement — finance?',['conflict']],
      ['15:38','M','We have a standing half hour now. It was my idea, which is the part I am pleased about.',['conflict']],
      ['22:10','P','What is the new gap?',['gap']],
      ['22:25','M','Speed. I am careful and it costs the team time. I would rather be right in a week than roughly right on Tuesday, and I do not think that trade is mine to make any more.',['gap','caution']],
      ['38:50','P','That is an E4 answer, for what it is worth.',['gap']]
    ]
  }
};

/* The themes a question can be resolved against, in the order Tal tries
   them. Each carries the sentence Tal opens with and the tag it retrieves. */
const IVT_THEMES = [
  [/delegat|hand(ing|ed|s)? (it |the |over)|let(ting)? go|took? (it )?back|sam\b/i, 'delegation',
   'You framed delegation as a risk you were carrying, and it came up four separate times without me prompting you.'],
  [/caut|hedge|underst(ate|ated)|play(ing)? it down|modest|sure of yourself|confiden/i, 'caution',
   'Priya’s note said you talk cautiously. This is what she was hearing — you qualify your own answers as you give them.'],
  [/conflict|disagree|peer|finance|argument with/i, 'conflict',
   'One disagreement, carried for two quarters, and you named the avoidance in it yourself.'],
  [/decision|chang(ed|e) (my |your )?mind|reorgani[sz]|listen/i, 'decision',
   'You changed a structural decision after listening, and you were clear about what changed it.'],
  [/manag(e|ing) up|director|upward/i, 'managing-up',
   'You corrected yourself mid-answer here, which is the part Priya marked.'],
  [/week|friday|rhythm|routine|meeting/i, 'rhythm',
   'One fixed hour a week, and an honest account of everything else moving.'],
  [/gap|growth|weak|improve|work on/i, 'gap',
   'You named the gap before Priya did, and you brought an example to it.']
];

const IVT_MEANS = /what did (she|priya) mean|mean by|what does .*mean|cautious(ly)?\b/i;
const IVT_COMPARE = /compar|between august and november|august.*november|november.*august|chang(ed|e)d? since|difference between the two|both interviews/i;

/* --------------------------------------------------------------------------
   RETRIEVAL
   Tags first, then a word match over the text. Whatever comes back, the
   answer is the lines themselves — Tal frames them, it does not paraphrase
   them away. A quotation you can check is worth more than a summary you
   cannot.
   -------------------------------------------------------------------------- */
function ivtFind(which, tag, words){
  const src = IVT[which].lines;
  if(tag) return src.filter(l => l[3].includes(tag));
  const w = (words||'').toLowerCase().split(/\s+/).filter(x => x.length > 3);
  if(!w.length) return [];
  return src.filter(l => w.some(x => l[2].toLowerCase().includes(x)));
}

const ivtSpeaker = (s) => s === 'P' ? 'Priya' : 'You';

/* an answer is a framing sentence, the evidence, and where it came from */
function ivtAnswer(lead, hits, which){
  if(!hits.length) return null;
  const iv = IVT[which];
  return `<div class="gen">
    <div class="gen-h">${talLabel()}<span class="gen-src">From your ${iv.label.toLowerCase()}, ${iv.date}</span></div>
    <p>${lead}</p>
    <div class="quotes">${hits.slice(0,4).map(([t,s,txt]) => `
      <button class="quote" data-ivt="${which}" data-at="${t}">
        <span class="q-t">${t}</span>
        <span class="q-b"><span class="q-w">${ivtSpeaker(s)}</span><span class="q-x">&ldquo;${txt}&rdquo;</span></span>
      </button>`).join('')}</div>
    ${hits.length > 4 ? `<p class="gen-more">${hits.length - 4} more moments in the transcript.</p>` : ''}
    <div class="gen-f">
      <button class="lnk" data-go="ivt" data-iv="${which}">Open the transcript</button>
      <span class="gen-note">Quoted, not summarised. Every line above is what was said.</span>
    </div>
  </div>`;
}

/* the routes Tal answers interview questions on */
TAL_ROUTES.unshift(
  [IVT_COMPARE, () => {
    const a = ivtFind('level','gap'), b = ivtFind('re','gap');
    return `<div class="gen">
      <div class="gen-h">${talLabel()}<span class="gen-src">Both interviews, side by side</span></div>
      <p>You were asked the same question twice, ninety days apart. In August the gap was letting go of work. In November it is speed. That is the shape of the promotion.</p>
      <div class="ivt-cmp">
        <div class="ivt-col"><span class="ivt-col-h">August</span>${a.slice(0,2).map(([t,s,txt])=>
          `<button class="quote" data-ivt="level" data-at="${t}"><span class="q-t">${t}</span><span class="q-b"><span class="q-w">${ivtSpeaker(s)}</span><span class="q-x">&ldquo;${txt}&rdquo;</span></span></button>`).join('')}</div>
        <div class="ivt-col"><span class="ivt-col-h">November</span>${b.slice(0,2).map(([t,s,txt])=>
          `<button class="quote" data-ivt="re" data-at="${t}"><span class="q-t">${t}</span><span class="q-b"><span class="q-w">${ivtSpeaker(s)}</span><span class="q-x">&ldquo;${txt}&rdquo;</span></span></button>`).join('')}</div>
      </div>
      <div class="gen-f"><button class="lnk" data-go="ivt" data-iv="re">Open the November transcript</button></div>
    </div>`;
  }],
  [IVT_MEANS, () => ivtAnswer(
    'Priya wrote that you talk cautiously. She was not describing your manner &mdash; she was describing a habit in the answers themselves. You qualify a thing at the moment you say it.',
    ivtFind('level','caution'), 'level')],
  [/transcript|recording|what did i say|interview said|in my interview/i, () => `<div class="gen">
    <div class="gen-h">${talLabel()}<span class="gen-src">Your interviews</span></div>
    <p>Both interviews are transcribed and I can search either one. Ask me about a theme and I will bring you the lines rather than a summary.</p>
    ${twChips(['What did Priya mean by cautious?','Show me every moment I framed delegation as risk','What changed between August and November?'])}
  </div>`]
);

for(const [re, tag, lead] of IVT_THEMES){
  TAL_ROUTES.unshift([re, () => {
    const which = S.iv === 're' ? 're' : 'level';
    return ivtAnswer(lead, ivtFind(which, tag), which)
        || ivtAnswer(lead, ivtFind(which === 're' ? 'level' : 're', tag), which === 're' ? 'level' : 're');
  }]);
}

/* --------------------------------------------------------------------------
   THE TRANSCRIPT VIEW
   A corpus needs a reading surface, not only a search box: the whole thing,
   in order, with the marked scenes flagged where they fall, and a filter
   that narrows by theme rather than by string.
   -------------------------------------------------------------------------- */
const IVT_FILTERS = [
  ['all','Everything'], ['scene','Marked scenes'], ['delegation','Delegation'],
  ['caution','Caution'], ['conflict','Conflict'], ['decision','Decisions'], ['gap','The gap']
];
const SCENE_AT = ['02:14','11:02','19:37','24:50','31:15','41:03'];

V.ivt = (f) => {
  const which = S.iv === 're' ? 're' : 'level';
  const iv = IVT[which];
  const filt = S.ivf || 'all';
  const q = (S.ivq || '').trim().toLowerCase();
  const lines = iv.lines.filter(([t,s,txt,tags]) => {
    if(filt === 'scene' && !SCENE_AT.includes(t)) return false;
    if(filt !== 'all' && filt !== 'scene' && !tags.includes(filt)) return false;
    if(q && !txt.toLowerCase().includes(q)) return false;
    return true;
  });
  const hi = (txt) => q ? txt.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')','ig'), '<mark>$1</mark>') : txt;
  const other = which === 're' ? 'level' : 're';
  return `<main class="main"><div class="page">
  ${crumb(['Interviews','interviews'],['Report','report'],'Transcript')}
  ${ph(iv.label + ' transcript', `${iv.date} &middot; ${iv.len} with Priya Nair &middot; ${iv.outcome}`,
    `<button class="btn btn-g" data-go="ivt" data-iv="${other}">${IVT[other].label} ${I.renew}</button>`)}

  <div class="sec">
    <div class="askbar">
      <span class="askbar-mk">${I.ai}</span>
      <input class="inp" id="ivtAsk" placeholder="Ask this interview a question" aria-label="Ask this interview a question"
        value="${S.ivAsk||''}">
      <button class="composer-send" data-ivt-ask="1" aria-label="Ask">${I.arrowRight}</button>
    </div>
    <div class="askbar-sugg">
      ${['What did Priya mean by cautious?','Show me every moment I framed delegation as risk','What changed between August and November?']
        .map(x=>askChip(x,x)).join('')}
    </div>
  </div>

  <div class="sec">
    <div class="sec-h"><h2>The transcript</h2><span class="t-helper-01">${lines.length} of ${iv.lines.length} lines</span></div>
    <div class="srch ivt-srch">
      <svg class="mag" viewBox="0 0 24 24">${inner('search')}</svg>
      <input class="inp" id="ivtQ" placeholder="Find a word in the transcript" aria-label="Search the transcript" value="${S.ivq||''}">
    </div>
    <div class="ivt-filters">
      ${IVT_FILTERS.map(([k,n])=>`<button class="ivt-f${filt===k?' on':''}" data-ivf="${k}">${n}</button>`).join('')}
    </div>
    <div class="ivt-lines">
      ${lines.length ? lines.map(([t,s,txt,tags])=>`
        <div class="tq${s==='P'?' them':' me'}${SCENE_AT.includes(t)?' scene':''}" id="at-${t.replace(':','')}">
          <span class="tq-t">${t}</span>
          <span class="tq-b">
            <span class="tq-w">${ivtSpeaker(s)}${SCENE_AT.includes(t)?`<span class="tq-scene">${I.video} Marked scene</span>`:''}</span>
            <span class="tq-x">${hi(txt)}</span>
          </span>
        </div>`).join('')
      : `<div class="empty" style="border:0">${I.search}<h3>Nothing matches</h3><p>Try another word, or clear the filter.</p></div>`}
    </div>
  </div>
</div></main>`;
};

/* --------------------------------------------------------------------------
   HANDLERS
   The search filters as you type; the filter chips narrow by theme; a quote
   in an answer opens the transcript at the second it was said.
   -------------------------------------------------------------------------- */
device.addEventListener('click', e => {
  const f = e.target.closest('[data-ivf]');
  if(f){ S.ivf = f.dataset.ivf; render(); return; }

  const qb = e.target.closest('[data-ivt]');
  if(qb){
    S.iv = qb.dataset.ivt;
    S.ivAt = qb.dataset.at || null;
    S.tal = false;
    if(S.view !== 'ivt'){ S.hist.push(S.view); S.view = 'ivt'; }
    render();
    return;
  }

  /* THE TRANSCRIPT'S OWN FIELD OPENS THE ONE TAL SURFACE.
     It used to set `S.tal` and answer in the side panel, which is off
     (§27.9): the answer arrives in the docked thread now, with the
     transcript as the page it came from, so "back" returns here. */
  if(e.target.closest('[data-ivt-ask]')){
    const el = document.getElementById('ivtAsk');
    const v = el && el.value.trim();
    if(v){ S.ivAsk = ''; askOpen(v); }
    return;
  }
});

device.addEventListener('input', e => {
  if(e.target.id === 'ivtQ'){
    S.ivq = e.target.value;
    const at = e.target.selectionStart;
    render();
    const again = document.getElementById('ivtQ');
    if(again){ again.focus(); again.setSelectionRange(at, at); }
  }
});

device.addEventListener('keydown', e => {
  if(e.target.id === 'ivtAsk' && e.key === 'Enter'){
    const v = e.target.value.trim();
    if(v){ S.ivAsk = ''; askOpen(v); }
  }
});

/* after a render that carried a timestamp, scroll it into view and mark it */
const _ivtScroll = () => {
  if(!S.ivAt) return;
  const el = document.getElementById('at-' + S.ivAt.replace(':',''));
  if(el){
    el.classList.add('at');
    el.scrollIntoView({block:'center', behavior:'smooth'});
  }
  S.ivAt = null;
};
const _renderBase = render;
render = function(){ _renderBase(); try { _ivtScroll(); } catch(e){} };

S.ivf = 'all'; S.ivq = ''; S.ivAsk = ''; S.ivAt = null;
render();
