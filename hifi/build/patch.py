#!/usr/bin/env python3
"""
v14 (Carbon, mobile) -> v15 (Material UI, responsive, linear).

The content layer of the surviving build is sound and hard-won, so it is
carried over rather than retyped. This script performs the structural edits
that CSS alone cannot do:

  * card constructs -> Material list rows
  * illustration banners and pictograms -> removed (a linear layout has no
    card header to hang them from; Material lists lead with an icon)
  * the three-band track graphic -> the brand's own chevron signature
  * the shell -> MUI AppBar + responsive Drawer
  * Carbon's 32px icon canvas -> Material's 24px
"""
import re, sys

js = open('views-orig.js').read()
orig_len = len(js)
applied, missed = [], []

def sub(label, pattern, repl, count=0, flags=0):
    global js
    new, n = re.subn(pattern, repl, js, count=count, flags=flags)
    if n == 0:
        missed.append(label)
    else:
        applied.append(f'{label} ({n})')
        js = new

def replace_fn(label, name, new_src):
    """Replace a whole `function name(...)` or `const name = ...;` declaration."""
    global js
    m = re.search(r'\n(?:function\s+' + re.escape(name) + r'\s*\(|const\s+' + re.escape(name) + r'\s*=)', js)
    if not m:
        missed.append(label); return
    start = m.start() + 1
    i = js.index('{', m.start()) if 'function' in m.group(0) else None
    if i is None:
        # arrow/const form: consume to the terminating semicolon at depth 0
        j = m.end(); depth = 0; instr = None
        while j < len(js):
            c = js[j]
            if instr:
                if c == '\\': j += 2; continue
                if c == instr: instr = None
            else:
                if c in '"\'`': instr = c
                elif c in '{[(': depth += 1
                elif c in '}])': depth -= 1
                elif c == ';' and depth == 0: break
            j += 1
        end = j + 1
    else:
        depth = 0; j = i; instr = None
        while j < len(js):
            c = js[j]
            if instr:
                if c == '\\': j += 2; continue
                if c == instr: instr = None
            else:
                if c in '"\'`': instr = c
                elif c == '{': depth += 1
                elif c == '}':
                    depth -= 1
                    if depth == 0: j += 1; break
            j += 1
        end = j
    js = js[:start] + new_src.strip() + js[end:]
    applied.append(label)


# ---------------------------------------------------------------- icons ---
# Carbon's icon canvas is 32; Material's is 24. Twelve call sites hardcode it.
sub('icon canvas 32->24', r'viewBox="0 0 32 32"', 'viewBox="0 0 24 24"')

# Tal's mark. Carbon had a bespoke glyph; Material has auto_awesome, which is
# the platform's own "assistive intelligence" icon. Reuse it.
sub('TALMARK', r'\$\{TALMARK\}', '${I.ai}')


# ------------------------------------------------------- illustrations ---
# The six banner illustrations and the eight pictograms both existed to sit at
# the top of a card. With no cards they have nowhere to live, and Material's
# list anatomy leads with a 24px icon instead. Removed rather than restyled.
sub('gfxLine call', r'\$\{confirmed\?\'\':gfxLine\(\'Explorer track\'\)\}', '')
sub('gfx interview banner',
    r'<span class="gfx wide" style="background:\$\{PAL\.interview\.a\}">\$\{GFX\.interview\}<span class="gfx-tag">45 minutes, recorded</span></span>',
    '<div class="tag-row mb5"><span class="tag">45 minutes</span><span class="tag">Recorded</span></div>')
sub('gfx course banner',
    r'<span class="gfx wide" style="background:\$\{PAL\.course\.a\}">\$\{GFX\.course\}<span class="gfx-tag">Explorer track · level \$\{lvl\}</span></span>',
    '<div class="tag-row mb5"><span class="tag">Explorer track</span><span class="tag acc">Level ${lvl}</span></div>')
sub('gfx cohort banner',
    r'<span class="gfx wide" style="background:\$\{PAL\.cohort\.a\}">\$\{GFX\.cohort\}<span class="gfx-tag">Weekly call · in 2 days</span></span>',
    '<div class="tag-row mb5"><span class="tag">Weekly call</span><span class="tag">In 2 days</span></div>')
sub('gfx points empty',
    r'<span class="gfx wide" style="background:\$\{PAL\.points\.a\}">\$\{GFX\.points\}</span>',
    '${I.trophy}')
sub('pict certificate', r'<span class="pict on-dark"[^>]*>\$\{PG\.certificate\}</span>',
    '<span class="cert-mark">${I.certificate}</span>')
sub('pict time (empty notif)', r'<span class="pict"[^>]*>\$\{PG\.time\}</span>', '${I.time}')


# -------------------------------------------------------------- gcard ---
# Was: a tile with a 5:2 illustration banner above a title block.
# Now:  a Material list row — leading icon, two-line text, trailing chevron.
replace_fn('gcard -> list row', 'gcard', r"""
const GC_IC = {track:'growth', course:'courseCard', interview:'video', cohort:'group',
               points:'trophy', certificate:'certificate', time:'time', community:'chat'};
const gcard = (kind,tag,title,sub,go) => `<button class="tile clk gcard" data-go="${go}">
  <span class="cardrow-ic">${I[GC_IC[kind]||'document']}</span>
  <span class="gcard-b">
    ${tag?`<span class="eyebrow">${tag}</span>`:''}
    <h3>${title}</h3><span class="sub">${sub}</span>
  </span>
  <svg class="tile-arrow" viewBox="0 0 24 24">${inner('chevRight')}</svg>
</button>`;
""")


# --------------------------------------------------------- track mark ---
# The client's own website spec settles this: "one chevron for Explorer, two
# for Builder, three for Trailblazer … the three-chevron mark is the only
# progress iconography allowed." It replaces the three coloured bands and
# gives the brand's mark its first job inside the product.
replace_fn('trackBand -> chevrons', 'trackBand', r"""
function trackBand(track){
  const T = [
    ['Explorer',    1, 'Finding the shape of what you are good at.'],
    ['Builder',     2, 'Putting it to work on something that matters.'],
    ['Trailblazer', 3, 'Setting the standard other people follow.']
  ];
  const at = T.findIndex(t => t[0] === track);
  return `<div class="chev-track">${T.map(([name,n,desc],i)=>`
    <div class="chev-row ${i===at?'on':(i<at?'past':'')}">
      <span class="chev-mark" aria-hidden="true">${Array.from({length:n},()=>
        `<svg viewBox="0 0 24 24"><path d="${CHEV}"/></svg>`).join('')}</span>
      <span class="chev-b"><span class="chev-n">${name}</span><span class="chev-d">${desc}</span></span>
      ${i===at?'<span class="chev-you">You</span>':''}
    </div>`).join('')}</div>
  <div class="bands-note">Five rungs in each track. Your rung comes from the interview, not the quiz.</div>`;
}
""")

# ladder: the markup used Carbon's f/c state names; the Material list vocabulary
# in the new stylesheet is done/on.
sub('ladder state classes',
    r"i<r-1\?'f':\(i===r-1\?'c':''\)", "i<r-1?'done':(i===r-1?'on':'')")


# --------------------------------------------------------- app shell ---
replace_fn('shell -> MUI AppBar', 'shell', r"""
function shell(){
  const f = cfg(S.stage);
  return `
  <header class="shell">
    <button class="shell-act nav-t ${S.nav?'on':''}" data-toggle="nav" aria-label="${S.nav?'Close':'Open'} navigation">${S.nav?I.close:I.menu}</button>
    <button class="shell-logo" data-go="dashboard" aria-label="TalentNext home"><img src="${LOGO_K}" alt="TalentNext"></button>
    <div class="shell-right">
      <span class="shell-name">${who(f)}</span>
      <button class="shell-act ${S.notif?'on':''}" data-toggle="notif" aria-label="Notifications">${I.notification}${unreadCount()?`<span class="shell-badge">${unreadCount()}</span>`:''}</button>
      <button class="shell-act" data-go="account" aria-label="Account"><span class="shell-avatar">MN</span></button>
    </div>
  </header>`;
}
""")

replace_fn('sidenav -> MUI Drawer', 'sidenav', r"""
function sidenav(f){
  const active = PARENT[S.view] || S.view;
  const items = NAVSETS[f.nav].map(([k,l,ic,badge]) =>
    `<button class="sn-item ${k===active?'on':''}" data-go="${k}"${k===active?' aria-current="page"':''}>${I[ic]}<span>${l}</span>${badge?`<span class="badge">${badge}</span>`:''}</button>`).join('');
  return `
  <div class="scrim ${S.nav?'on':''}" data-close="nav"></div>
  <nav class="sidenav ${S.nav?'on':''}" aria-label="Portal">
    <div class="sn-main">${items}</div>
    <div class="sn-foot">
      <button class="sn-item ${active==='account'?'on':''}" data-go="account">${I.user}<span>Profile</span></button>
      <button class="sn-item" data-go="stage:signup">${I.logout}<span>Log out</span></button>
    </div>
  </nav>`;
}
""")

# The drawer and the main region have to be siblings in a flex row for the
# permanent-drawer breakpoint to work, so render() wraps them.
# The drawer and the view have to be siblings in a flex row for the
# permanent-drawer breakpoint. Some views (Messages) return a <main> plus a
# sticky composer beside it, so the view goes inside its own column — the row
# holds two children, not three.
sub('render: wrap drawer + view column',
    r"html = shell\(\) \+ sidenav\(f\) \+ view\(f\)",
    "html = shell() + '<div class=\"shell-body\">' + sidenav(f)"
    " + '<div class=\"view-col\">' + view(f) + '</div></div>'")

# The chapter row carried its state only in the trailing icon, so a completed
# chapter looked identical to an unstarted one down the left edge. The state
# now reaches the row, which lets the accent mark what the candidate has
# finished — the one job the accent has.
sub('chapter row state class',
    r'<button class="ch \$\{state===\'locked\'\?\'locked\':\'\'\}"',
    '<button class="ch ${state}"')

# icons.js defines inner() against the path table directly, so the Carbon-era
# version that string-stripped an <svg> wrapper is dropped.
sub('drop duplicate inner()', r'const inner = \(n\) => I\[n\]\.replace[^\n]*\n', '')


# --------------------------------------------------------- Tal cards ---
# Every Tal callout becomes a target in its own right: clicking anywhere in
# it opens Tal with the question that callout is about, and each one offers
# one or two ready-made questions so the candidate does not have to phrase
# it themselves. Only .ai-aura blocks qualify — the report and the 90-day
# summary are Priya's writing and must never read as machine-assisted.
sub('Tal cards: clickable + suggestions',
    r'function render\(\)\{',
    lambda m: """const TAL_CARDS = [
  [/^Meet Tal/,             'What can you help me with?',
     ['What can you help me with?', 'How does the interview work?']],
  [/^Your next step/,       'What should I do next?',
     ['What should I do next?', 'How long does the whole thing take?']],
  [/^Getting started/,      'How should I start week 1?',
     ['How should I start week 1?', 'What gets assessed this week?']],
  [/^Where you are stuck/,  'Walk me through chapter 4',
     ['Walk me through chapter 4', 'Why is this my growth area?']],
  [/^Before your re-interview/, 'Prepare me for the re-interview',
     ['Prepare me for the re-interview', 'What will Priya assess?']],
  [/^Suggested for you/,    'How should I choose between these agents?',
     ['How should I choose between these agents?', 'What happens in the interview?']],
  [/^What to expect with/,  'What is this agent like to be interviewed by?',
     ['What are they like to be interviewed by?', 'What should I prepare?']],
  [/^Time to prepare/,      'What should I prepare for the interview?',
     ['What should I prepare?', 'What happens on the day?']],
  [/^What the 90 days/,     'What does the course actually involve?',
     ['What does the course involve?', 'How much time will it take each week?']],
  [/^Help with this chapter/, 'Explain this chapter',
     ['Explain this chapter', 'I am stuck — help me']],
  [/^What to bring/,        'What should I say on Thursday’s call?',
     ['What should I say on the call?', 'What is week 5 about?']]
];

function enhanceTalCards(){
  device.querySelectorAll('.ai-aura').forEach(card => {
    const h = card.querySelector('.ai-head h3');
    const title = h ? h.textContent.trim() : '';
    const hit = TAL_CARDS.find(([re]) => re.test(title));
    if(!card.hasAttribute('data-tal-ask')){
      card.setAttribute('data-tal-ask', hit ? hit[1] : ('Tell me about ' + (title || 'this').toLowerCase()));
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', 'Ask Tal about ' + (title || 'this'));
      card.classList.add('ai-clickable');
    }
    const want = hit ? hit[2] : [];
    if(!want.length) return;
    let foot = card.querySelector('.ai-foot');
    if(!foot){ foot = document.createElement('div'); foot.className = 'ai-foot'; card.appendChild(foot); }
    /* A card that already carries a navigation link has one job to offer, not
       three. The link keeps the footer row to itself and a single suggested
       question goes on the line below it, so the two never read as peers. */
    const hasLink = !!foot.querySelector('a[data-go],.lk,.lnk,button[data-go]');
    let rail = foot;
    if(hasLink){
      rail = card.querySelector('.ai-asks');
      if(!rail){ rail = document.createElement('div'); rail.className = 'ai-asks';
                 foot.insertAdjacentElement('afterend', rail); }
    }
    const cap = hasLink ? 1 : 2;
    const have = [...rail.querySelectorAll('[data-tal-ask]')].map(b => b.dataset.talAsk);
    for(const q of want){
      if(have.length >= cap || have.includes(q)) continue;
      rail.insertAdjacentHTML('beforeend', askChip(q, q));
      have.push(q);
    }
  });
}

function render(){""")

# a link inside a Tal card must still navigate rather than open Tal
sub('Tal card does not swallow its own links',
    r"if\(askT\)\{ e\.preventDefault\(\); S\.tal = true; ask\(askT\.dataset\.talAsk\); return; \}",
    "if(askT){\\n"
    "    const goT = t.closest('[data-go]');\\n"
    "    if(!(goT && askT.contains(goT))){\\n"
    "      e.preventDefault(); S.tal = true; ask(askT.dataset.talAsk); return;\\n"
    "    }\\n"
    "  }")

sub('run the Tal card pass after each render',
    r"const tb = device\.querySelector\('#talBody'\);",
    "enhanceTalCards();\\n  const tb = device.querySelector('#talBody');")

# a card that behaves like a button has to answer the keyboard like one
sub('keyboard on Tal cards',
    r"device\.addEventListener\('keydown', e => \{",
    "device.addEventListener('keydown', e => {\\n"
    "  const card = e.target.closest('.ai-clickable');\\n"
    "  if(card && (e.key === 'Enter' || e.key === ' ')){\\n"
    "    e.preventDefault(); S.tal = true; ask(card.dataset.talAsk); return;\\n"
    "  }")

# ------------------------------------------------------ arrows, not chevrons ---
# Navigation is expressed with arrows across the product; the chevron is the
# brand's track mark and a disclosure caret, and must not also mean "go".
sub('gcard uses an arrow', r"inner\('chevRight'\)", "inner('arrowRight')")

# ------------------------------------------------------------- sticky bar ---
sub('sticky action bar -> class',
    r'<div style="flex:none;background:var\(--layer-01\);border-top:1px solid var\(--border-subtle-01\);padding:var\(--s04\) var\(--s05\)">',
    '<div class="stickybar">')

# --------------------------------------------------------------- iOS chrome ---
# Prototype chrome, not product: a status bar and a home indicator so the
# mobile frame reads as a phone and the sticky action bar has somewhere to sit.
sub('iOS chrome',
    r"device\.innerHTML = `<div class=\"app\">\$\{html\}</div>`;",
    lambda m: 'device.innerHTML = IOS_TOP + `<div class="app">${html}</div>` + IOS_BOTTOM;')

sub('iOS chrome markup',
    r"function render\(\)\{",
    lambda m: """const IOS_TOP = `<div class="ios-top" aria-hidden="true">
  <span class="ios-time">9:41</span>
  <span class="ios-ind">
    <svg viewBox="0 0 18 12"><path d="M1 9h2v3H1zM5 6.5h2V12H5zM9 4h2v8H9zM13 1.5h2V12h-2z"/></svg>
    <svg viewBox="0 0 16 12"><path d="M8 10.2 6 8.2a2.9 2.9 0 0 1 4 0l-2 2Zm0-4.1a5.8 5.8 0 0 0-4.1 1.7L2.5 6.4a7.8 7.8 0 0 1 11 0L12.1 7.8A5.8 5.8 0 0 0 8 6.1Zm0-4A9.8 9.8 0 0 0 1.1 5L-.3 3.6a11.8 11.8 0 0 1 16.6 0L14.9 5A9.8 9.8 0 0 0 8 2Z"/></svg>
    <svg viewBox="0 0 26 12"><rect x=".5" y=".5" width="21" height="11" rx="2.5" fill="none" stroke="currentColor" opacity=".45"/><rect x="2" y="2" width="15" height="8" rx="1"/><path d="M23 4.2v3.6a2 2 0 0 0 0-3.6Z" opacity=".45"/></svg>
  </span>
</div>`;
const IOS_BOTTOM = `<div class="ios-home" aria-hidden="true"><i></i></div>`;

function render(){""")

# inline horizontal padding of 0 fights the spine; the class carries it now
sub('accordion section keeps the spine',
    r'<div class="sec flat tint" style="padding:var\(--s07\) 0">',
    '<div class="sec flat">')
sub('chapter list section keeps the spine',
    r'<div class="sec flat" style="padding:0">',
    '<div class="sec flat bleed">')

# ------------------------------------------------------- horizontal track ---
# The track reads as a path the candidate is moving along, so it runs left to
# right. Dropping the three descriptions makes room for what they actually
# want to know at this point: where they are and what sets the rung.
replace_fn('trackBand -> horizontal path', 'trackBand', r"""
function trackBand(track){
  const T = [['Explorer',1],['Builder',2],['Trailblazer',3]];
  const at = T.findIndex(t => t[0] === track);
  const chev = n => Array.from({length:n},()=>`<svg viewBox="0 0 24 24"><path d="${CHEV}"/></svg>`).join('');
  return `<div class="path" role="img" aria-label="Track ${track}, first of three">
    ${T.map(([name,n],i)=>`
      <div class="path-step ${i===at?'on':(i<at?'past':'')}">
        <span class="path-mark">${chev(n)}</span>
        <span class="path-n">${name}</span>
        ${i===at?'<span class="path-you">You are here</span>':''}
      </div>`).join('')}
  </div>
  <div class="path-facts">
    <div><span class="l">Your track</span><span class="v">${track}</span></div>
    <div><span class="l">Rungs in this track</span><span class="v">5</span></div>
    <div><span class="l">Your rung</span><span class="v">Set at the interview</span></div>
  </div>`;
}
""")

# ------------------------------------------------------- interviews page ---
# The old copy described the agents' commercial arrangement — how they set
# their fee, how they are ranked — which is the platform's business, not the
# candidate's. Replaced with what the candidate is on this page to find out:
# what the interview is, what happens in it, and what they walk away with.
sub('interviews: candidate-relevant intro',
    r"'Agents set their own price and availability\. Rank reflects how their past candidates performed over ninety days\.'",
    lambda m: "'A 45-minute conversation with a talent agent. It sets your level and gives you a report that is yours to keep.'")

sub('interviews: how it works',
    r'<div class="tile mb5" style="padding:0 0 var\(--s05\)">[\s\S]*?</div>\s*</div>\s*<button class="btn btn-p" data-go="agents">',
    lambda m: """<div class="facts">
      <div><span class="l">Length</span><span class="v">45 minutes</span></div>
      <div><span class="l">Format</span><span class="v">Video, recorded</span></div>
      <div><span class="l">Your report</span><span class="v">Within 24 hours</span></div>
      <div><span class="l">Fee</span><span class="v">From $80</span></div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>How it works</h2></div>
    <ol class="steps">
      <li><span class="s-n">1</span><span class="s-b"><b>You choose the agent</b>
        Every agent who assesses your track is listed with their next free slot. You pick who you talk to.</span></li>
      <li><span class="s-n">2</span><span class="s-b"><b>You have the conversation</b>
        Forty-five minutes by video. Your agent walks you through real situations from your own answers and asks what you did and why. There is nothing to revise and no way to fail it.</span></li>
      <li><span class="s-n">3</span><span class="s-b"><b>Your agent writes your report</b>
        Within 24 hours, signed by the person who interviewed you: your strengths, your growth areas, and the level they have confirmed you at.</span></li>
      <li><span class="s-n">4</span><span class="s-b"><b>The report is yours</b>
        It stays in your account and you decide who ever sees it. Your level opens the course built for that level.</span></li>
    </ol>
    <p class="t-helper-01 mt5">Recorded so your agent can write the report. You can ask for a recording to be deleted at any time.</p>
  </div>
  <div class="sec">
    <button class="btn btn-p" data-go="agents">""")

# --------------------------------------------------- avatar + report block ---
# A photograph for the signed-in candidate, taken from the headshot set.
sub('candidate avatar is a photograph',
    r'<span class="shell-avatar">MN</span>',
    lambda m: '<span class="shell-avatar"><img src="${AV.hana}" alt=""><i>MN</i></span>')
sub('candidate avatar in Tal', r'<span class="av">MN</span>',
    lambda m: '<span class="av"><img src="${AV.hana}" alt=""><i>MN</i></span>')

# The report summary is the most consequential thing on the page and it was
# sitting inert. It becomes a target in its own right, signed by the person
# who wrote it, with the two findings split into their own rows.
sub('report summary becomes interactive',
    r'<div class="tile bordered">\s*\n\s*<div class="ai-head"><h3>\$\{confirmed\?\'What Priya wrote\':\'What the Explorer track means\'\}</h3></div>',
    lambda m: """<div class="${confirmed?'signed clk':'tile bordered'}" ${confirmed?'role="button" tabindex="0" data-go="report"':''}>
      ${confirmed?`<div class="signed-h">
        <span class="av-ph" style="width:36px;height:36px;font-size:12px"><i>PN</i><img src="${AV.priya}" alt=""></span>
        <span class="signed-b"><b>Assessed and signed by Priya Nair</b><span>Level interview · 20 August 2026</span></span>
        <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg>
      </div>`:'<div class="ai-head"><h3>What the Explorer track means</h3></div>'}""")

# ------------------------------------------------------- inline type sizes ---
# Six inline font-size declarations sat outside the scale and produced the
# odd-one-out headings. Each becomes a role class instead.
sub('inline type -> roles', r' style="font-size:20px;line-height:26px;font-weight:400"',
    lambda m: ' class="u-h2"')
sub('inline type -> roles 2', r' style="font-size:20px;line-height:26px"',
    lambda m: ' class="u-h2"')
sub('inline type -> roles 3', r'<small style="font-size:16px">', lambda m: '<small>')
sub('inline type -> roles 4',
    r' style="display:block;font-size:12px;line-height:16px;letter-spacing:\.32px;color:var\(--text-secondary\);margin-bottom:var\(--s03\)"',
    lambda m: ' class="u-overline mb4"')
# avatar initials are a fallback behind the photograph; one size is enough
sub('avatar initials one size',
    r' style="width:\$\{size\}px;height:\$\{size\}px;font-size:\$\{Math\.round\(size/3\)\}px"',
    lambda m: ' style="width:${size}px;height:${size}px"')

# ----------------------------------------------------------- profile page ---
# The page opened straight onto a key/value list with no sense of whose
# account it is, and the edit button did nothing. It now leads with the
# candidate's photograph (changeable) and the button opens a real editor.
sub('profile: identity header + working edit',
    r'<div class="sec">\s*\n\s*<div class="tile">\s*\n\s*<div class="kv"><span class="k">Name</span>',
    lambda m: """<div class="sec">
    <div class="idhead">
      <button class="idphoto" data-editphoto="1" aria-label="Change your photo">
        <span class="av-ph" style="width:72px;height:72px"><i>MN</i><img src="${AV.hana}" alt=""></span>
        <span class="idphoto-edit">${I.edit}</span>
      </button>
      <div class="idhead-b">
        <span class="idname">Maryam Naz</span>
        <span class="idmeta">maryam.naz@tkxel.io</span>
        <span class="tag">${f.pred ? f.track + ' track' : lvlName(f.level)}</span>
      </div>
    </div>
    <div class="tile">
      <div class="kv"><span class="k">Name</span>""")

sub('profile: edit opens the editor',
    r'<div class="mt4"><button class="btn btn-g">Edit details \$\{I\.edit\}</button></div>',
    lambda m: '<div class="mt4"><button class="btn btn-g" data-editprofile="1">Edit details ${I.edit}</button></div>')

# the editor itself, and the photo picker, reuse the dialog already in the build
sub('profile editor markup',
    r'function cardSheet\(\)\{',
    lambda m: """function profileSheet(){
  return `<div class="modal ${S.editProfile?'on':''}" data-close="editprofile">
    <div class="sheet">
      <div class="sheet-h"><h2>Edit details</h2>
        <button class="x" data-editprofile="0" aria-label="Close">${I.close}</button></div>
      <div class="sheet-b">
        <div class="idhead mb6">
          <button class="idphoto" data-editphoto="1" aria-label="Change your photo">
            <span class="av-ph" style="width:64px;height:64px"><i>MN</i><img src="${AV.hana}" alt=""></span>
            <span class="idphoto-edit">${I.edit}</span>
          </button>
          <div class="idhead-b">
            <span class="idname">Your photo</span>
            <span class="idmeta">Shown to your agent and your cohort.</span>
            <button class="lk" data-editphoto="1">Change photo</button>
          </div>
        </div>
        <div class="f"><label for="pn">Name</label><input class="inp" id="pn" value="Maryam Naz"></div>
        <div class="f"><label for="pe">Email address</label><input class="inp" id="pe" value="maryam.naz@tkxel.io"></div>
        <div class="f"><label for="pz">Time zone</label>
          <select class="inp" id="pz">
            <option>Eastern Time (ET)</option><option>Central Time (CT)</option>
            <option>Mountain Time (MT)</option><option>Pacific Time (PT)</option>
            <option>Pakistan Standard Time (PKT)</option>
          </select></div>
        <p class="t-helper-01">Your level is set by your agent and cannot be edited here.</p>
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-editprofile="0">Cancel</button>
        <button class="btn btn-p noic" data-editprofile="0">Save changes</button>
      </div>
    </div>
  </div>`;
}

function photoSheet(){
  const opts = ['hana','priya','lena','owen','samuel'];
  return `<div class="modal ${S.editPhoto?'on':''}" data-close="editphoto">
    <div class="sheet">
      <div class="sheet-h"><h2>Your photo</h2>
        <button class="x" data-editphoto="0" aria-label="Close">${I.close}</button></div>
      <div class="sheet-b">
        <div class="photogrid">
          ${opts.map((k,i)=>`<button class="photopick ${i===0?'on':''}" data-pick="${k}">
            <span class="av-ph" style="width:100%;height:100%"><img src="${AV[k]}" alt=""></span></button>`).join('')}
        </div>
        <div class="btn-row mt6">
          <button class="btn btn-s" data-editphoto="0">Upload a photo ${I.add}</button>
          <button class="btn btn-t" data-editphoto="0">Remove ${I.close}</button>
        </div>
      </div>
      <div class="sheet-f">
        <button class="btn btn-s noic" data-editphoto="0">Cancel</button>
        <button class="btn btn-p noic" data-editphoto="0">Use this photo</button>
      </div>
    </div>
  </div>`;
}

function cardSheet(){""")

sub('profile sheets are rendered on the account view',
    r"\+ \(S\.view==='billing'\?cardSheet\(\):''\);",
    lambda m: "+ (S.view==='billing'?cardSheet():'')\n         + (S.view==='account'?profileSheet()+photoSheet():'');")

sub('profile editor state',
    r"addCard:false, piOpen:\{\},",
    lambda m: "addCard:false, editProfile:false, editPhoto:false, piOpen:{},")

sub('profile editor handlers',
    r"const ac = t\.closest\('\[data-addcard\]'\);",
    lambda m: """const ep = t.closest('[data-editprofile]');
  if(ep){ S.editProfile = ep.dataset.editprofile==='1'; render(); return; }

  const eph = t.closest('[data-editphoto]');
  if(eph){ S.editPhoto = eph.dataset.editphoto==='1'; render(); return; }

  const pk = t.closest('[data-pick]');
  if(pk){ device.querySelectorAll('.photopick').forEach(x=>x.classList.remove('on'));
    pk.classList.add('on'); return; }

  const ac = t.closest('[data-addcard]');""")

# a hardcoded white fill on the cohort "Join" button — the last white surface
sub('cohort Join button is not white',
    r' style="flex:1;justify-content:center;background:var\(--on-dark\);color:var\(--surface-dark\)"',
    lambda m: ' class="btn btn-p btn-sm noic" style="flex:1;justify-content:center"')

# ------------------------------------------------------------ auth screens ---
# CREATE YOUR ACCOUNT, rebuilt to the supplied mockup.
#
# The signup views build their own page rather than going through the shell,
# so every block here is wrapped in a .sec and takes the spine like the rest
# of the product. Three sections, divided by the lattice rule: who you are,
# the password, the consents. What the mockup changed from the old screen:
#
#   - the stepper is gone. It was three lines of chrome above a form the
#     candidate can finish in thirty seconds.
#   - the email reads as a value, not an input: filled, accent-coloured,
#     no baseline rule, because there is nothing to type into it.
#   - the two section headings are stated at h2 rather than buried, so the
#     form reads as two decisions, not eight fields.
#   - "Required" tags are dropped. The button is the only way forward, so
#     the requirement is already implied.
#   - the operator line and the closing rule are gone.
CREATE_VIEW = '''create: () => `${authShell()}
<main class="main"><div class="page form-page">
  ${ph('Create your account','You are one step away from your TalentNext account. Set a password to continue.')}
  <div class="sec">
    <div class="f last"><label for="em">Your email address</label>
      <div class="inp-static" id="em">maryam.naz@tkxel.io</div>
      <div class="help">From your Next in Leadership profile. <a data-go="terms">Not you?</a></div></div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2 class="u-h2">Set a password</h2></div>
    <div class="f"><label for="pw">Password</label>
      <div class="pw-wrap"><input class="inp fill" id="pw" type="password" value="\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022">
        <button class="pw-eye" data-eye="pw" aria-label="Show password">${I.view}</button></div>
      <ul class="pw-rules">
        <li class="ok">${I.checkFilled}At least 12 characters</li>
        <li class="ok">${I.checkFilled}Upper and lower case</li>
        <li>${I.circle}One number or symbol</li>
      </ul></div>
    <div class="f last"><label for="pw2">Confirm password</label>
      <div class="pw-wrap"><input class="inp fill" id="pw2" type="password" placeholder="Re-enter password">
        <button class="pw-eye" data-eye="pw2" aria-label="Show password">${I.view}</button></div></div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2 class="u-h2">Terms and privacy policy</h2></div>
    <div class="cbx-list">
      <label class="cbx"><input type="checkbox" checked><span class="box">${I.check}</span>
        <span class="txt">I accept the <a data-go="terms">Terms of Service</a> and the <a data-go="terms">Privacy Policy</a>.</span></label>
      <label class="cbx"><input type="checkbox" checked><span class="box">${I.check}</span>
        <span class="txt">I consent to my interviews being recorded and transcribed so my agent can assess them and write my report, as set out in the <a data-go="terms">data use notice</a>.</span></label>
      <label class="cbx"><input type="checkbox"><span class="box">${I.check}</span>
        <span class="txt">Send me occasional product and course emails. You can turn this off any time.</span></label>
    </div>
    <div class="mt6"><button class="btn btn-p btn-full" data-go="verify">Create account ${I.arrowRight}</button></div>
    <p class="t-body-02 mt5" style="color:var(--text-secondary)">Already have an account? <a data-go="stage:new">Log in</a></p>
  </div>
</div></main>`,'''

# The verify screen is the second half of the same form, so it takes the same
# treatment: filled fields, one column, a full-width primary action.
sub('verify screen matches create',
    r'<main class="main"><div class="page" style="padding-bottom:var\(--s05\)">\n  <div class="ph" style="padding-bottom:var\(--s05\)">',
    lambda m: '<main class="main"><div class="page form-page" style="padding-bottom:var(--s05)">\n  <div class="ph" style="padding-bottom:var(--s05)">')
sub('verify code label is a label',
    r'<span class="lab" class="u-overline mb4">Verification code</span>',
    lambda m: '<label class="lbl" for="otp1">Verification code</label>')
sub('verify actions are full width',
    r'<button class="btn btn-p" data-go="created">Verify and continue',
    lambda m: '<button class="btn btn-p btn-full" data-go="created">Verify and continue')
sub('resend is full width',
    r'<div class="mt4"><button class="btn btn-g">Resend code in 0:42',
    lambda m: '<div class="mt4"><button class="btn btn-g btn-full">Resend code in 0:42')

_start = js.index("create: () => `${authShell()}")
_end   = js.index("terms: () => `${authShell('create')}")
js = js[:_start] + CREATE_VIEW + '\n\n' + js[_end:]
applied.append('create account rebuilt to the mockup (1)')

# ------------------------------------------------------------- LOG IN --------
# The flow had no way in for someone who already has an account: "Log in" on
# the create screen dropped straight into the app. It is the same form as
# create, one section shorter.
LOGIN_VIEW = '''login: () => `${authShell()}
<main class="main"><div class="page form-page">
  ${ph('Log in','Enter the email address and password on your TalentNext account.')}
  <div class="sec">
    <div class="f"><label for="lem">Email address</label>
      <input class="inp fill" id="lem" type="email" value="maryam.naz@tkxel.io"></div>
    <div class="f last"><label for="lpw">Password</label>
      <div class="pw-wrap"><input class="inp fill" id="lpw" type="password" value="\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022">
        <button class="pw-eye" data-eye="lpw" aria-label="Show password">${I.view}</button></div></div>
    <p class="t-body-02 aux"><a data-go="forgot">Forgotten your password?</a></p>
  </div>
  <div class="sec">
    <button class="btn btn-p btn-full" data-go="stage:new">Log in ${I.arrowRight}</button>
    <p class="t-body-02 mt5" style="color:var(--text-secondary)">Do not have an account yet? <a data-go="create">Sign up</a></p>
  </div>
</div></main>`,

forgot: () => `${authShell('login')}
<main class="main"><div class="page form-page">
  ${ph('Reset your password','Give us the email address on your account and we will send you a link to set a new password.')}
  <div class="sec">
    <div class="f last"><label for="fem">Email address</label>
      <input class="inp fill" id="fem" type="email" value="maryam.naz@tkxel.io"></div>
  </div>
  <div class="sec">
    <button class="btn btn-p btn-full" data-go="sent">Send the reset link ${I.arrowRight}</button>
    <p class="t-body-02 mt5" style="color:var(--text-secondary)">Remembered it? <a data-go="login">Back to log in</a></p>
  </div>
</div></main>`,

sent: () => `${authShell('forgot')}
<main class="main"><div class="page form-page">
  ${ph('Check your email','A reset link is on its way to maryam.naz@tkxel.io. It expires in 30 minutes and can be used once.')}
  <div class="sec">
    <div class="note"><span>${I.info}</span><div class="nb"><b>Nothing yet?</b>Give it a minute, then look in spam. The sender is hello@talentnext.com.</div></div>
  </div>
  <div class="sec">
    <button class="btn btn-p btn-full" data-go="reset">Open the link ${I.arrowRight}</button>
    <div class="mt4"><button class="btn btn-g btn-full" data-go="sent">Send it again ${I.restart}</button></div>
    <p class="t-body-02 mt5" style="color:var(--text-secondary)">Wrong address? <a data-go="forgot">Change it</a> and try again.</p>
  </div>
</div></main>`,

reset: () => `${authShell('login')}
<main class="main"><div class="page form-page">
  ${ph('Set a new password','Choose something you have not used here before. You will be logged in once it is saved.')}
  <div class="sec">
    <div class="f"><label for="rpw">New password</label>
      <div class="pw-wrap"><input class="inp fill" id="rpw" type="password" value="\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022">
        <button class="pw-eye" data-eye="rpw" aria-label="Show password">${I.view}</button></div>
      <ul class="pw-rules">
        <li class="ok">${I.checkFilled}At least 12 characters</li>
        <li class="ok">${I.checkFilled}Upper and lower case</li>
        <li>${I.circle}One number or symbol</li>
      </ul></div>
    <div class="f last"><label for="rpw2">Confirm new password</label>
      <div class="pw-wrap"><input class="inp fill" id="rpw2" type="password" placeholder="Re-enter password">
        <button class="pw-eye" data-eye="rpw2" aria-label="Show password">${I.view}</button></div></div>
  </div>
  <div class="sec">
    <button class="btn btn-p btn-full" data-go="stage:new">Save and log in ${I.arrowRight}</button>
    <p class="t-body-02 mt5" style="color:var(--text-secondary)">Changed your mind? <a data-go="login">Back to log in</a></p>
  </div>
</div></main>`,

'''
js = js.replace("create: () => `${authShell()}", LOGIN_VIEW.lstrip('\n') + "create: () => `${authShell()}", 1)
applied.append('login screen (1)')

# a target may name a stage AND the view to land on inside it
sub('go() accepts stage:name/view',
    r"if\(target\.startsWith\('stage:'\)\)\{ setStage\(target\.slice\(6\)\); return; \}",
    lambda m: "if(target.startsWith('stage:')){ const p = target.slice(6).split('/');\n"
              "    setStage(p[0]); if(p[1]){ S.view = p[1]; S.nav = false; render(); } return; }")
sub('log out lands on the login screen',
    r'data-go="stage:signup">\$\{I\.logout\}<span>Log out</span>',
    lambda m: 'data-go="stage:signup/login">${I.logout}<span>Log out</span>')
sub('profile log out lands on the login screen',
    r'<button class="btn btn-g" data-go="stage:signup">Log out',
    lambda m: '<button class="btn btn-g" data-go="stage:signup/login">Log out')
sub('create -> log in goes to the login screen',
    r'Already have an account\? <a data-go="stage:new">Log in</a>',
    lambda m: 'Already have an account? <a data-go="login">Log in</a>')

# --------------------------------------------------------- prototype chrome ---
# The stage caption above the frame described the prototype to itself. It is
# gone from the page, so the writer that fed it goes too.
sub('drop the stage caption',
    r"\n\s*cap\.innerHTML = `<b>\$\{st\[1\]\}</b>[^\n]*\n",
    lambda m: '\n')

# ============================================================== MOTION =======
# Every render replaces the frame's innerHTML, so a mount animation would
# replay on every keystroke and every toggle. render() therefore diffs the
# state it is about to draw against the state it drew last time and stamps
# the result on the app element: `data-enter` when the view or stage actually
# changed, `data-open` listing the overlays that were closed a moment ago and
# are open now. CSS keys every entrance off those two attributes, so motion
# fires when something happens and stays quiet when it does not.
sub('motion: state diff on render',
    r"  device\.innerHTML = IOS_TOP \+ `<div class=\"app\">\$\{html\}</div>` \+ IOS_BOTTOM;",
    lambda m: """  const key = S.stage + '/' + S.view;
  const entered = key !== MO.key;
  const opened = ['nav','notif','tal','editProfile','editPhoto','addCard']
    .filter(k => S[k] && !MO.open[k]);
  const grew = S.thread.length > MO.thread;
  MO.key = key;
  MO.thread = S.thread.length;
  for(const k of ['nav','notif','tal','editProfile','editPhoto','addCard']) MO.open[k] = !!S[k];
  const at = (entered ? ' data-enter' : '')
           + (opened.length ? ` data-open="${opened.join(' ')}"` : '')
           + (grew ? ' data-said' : '');
  device.innerHTML = IOS_TOP + `<div class="app"${at}>${html}</div>` + IOS_BOTTOM;""")

sub('motion: the diff store',
    r"function render\(\)\{",
    lambda m: "const MO = {key:'', thread:0, open:{}};\nfunction render(){")

# the sections cascade rather than arriving together, which needs an index
sub('motion: section index',
    r"  enhanceTalCards\(\);",
    lambda m: """  enhanceTalCards();
  /* the cascade is a per-section delay, capped so a long page never waits */
  const app = device.querySelector('.app');
  if(app && app.hasAttribute('data-enter')){
    const kids = device.querySelectorAll('.page > .sec, .page > .ph, .page > .lvl-hero, .page > .acc, .page > .tabs');
    kids.forEach((el,i) => el.style.setProperty('--i', Math.min(i,7)));
  }""")

# the auth screens have no help desk behind them yet, so the info button in
# the bar was a control that does nothing on every screen of the flow
sub('no info button on the auth screens',
    r'\s*<div class="shell-right"><button class="shell-act" aria-label="Help">\$\{I\.info\}</button></div>',
    lambda m: '')

# ------------------------------------------------------ Tal says less --------
# Tal's cards ran to four and five lines. A coach that needs a paragraph to
# make a point is not being helpful, it is being read past — and on a phone
# each of these was pushing the action it recommends below the fold. Every
# card now leads with the instruction in bold and gives one reason for it.
for _label, _old, _new in [
  ('next step',
   '<b>Book your interview.</b> Three agents who assess Explorer candidates have slots this week. Booking early usually means starting a cohort within 10 days instead of 4 weeks.',
   '<b>Book your interview.</b> Three agents have slots this week. Booking early usually means starting in 10 days rather than 4 weeks.'),
  ('meet Tal',
   'Tal knows your level, your course and where you have got to. Start with one of these.',
   'Tal knows your level and your course. Start here.'),
  ('enroll',
   '<b>Enroll on Explorer Track &ndash; E3.</b> The next cohort at your level starts within two weeks, and you keep the same cohort for all 90 days.',
   '<b>Enroll on Explorer Track &ndash; E3.</b> The next cohort starts within two weeks, and you keep it for all 90 days.'),
  ('E4 opens',
   '<b>Explorer Track &ndash; E4 opens on December 1.</b> Your growth areas from the last 90 days, delegation and coaching, are chapters 3 and 9 of it.',
   '<b>Explorer Track &ndash; E4 opens on December 1.</b> Delegation and coaching, your two growth areas, are chapters 3 and 9.'),
  ('agents intro',
   'She opens with a real situation from your own answers, then asks about the decision you made. Candidates find the delegation question hardest, so have an example ready where you handed something over and it went wrong.',
   'She opens with a situation from your own answers, then asks what you decided. Have a delegation example ready.'),
  ('prepare',
   'Your quiz flagged delegation and hard conversations. You can run a 10-minute practice session on either and get feedback on where your answer was thin.',
   'Your quiz flagged delegation and hard conversations. Ten minutes of practice on either, with feedback.'),
  ('workload',
   'About an hour a week on the chapters, plus a 60-minute cohort call. People who keep to that finish with an average above 85%.',
   'An hour a week, plus the 60-minute cohort call. People who keep to that average above 85%.'),
  ('cohort call',
   'Bring the Sam handover from your notes. It is the closest real example you have, and three others in the cohort flagged the same chapter.',
   'Bring the Sam handover from your notes — it is the closest example you have.'),
]:
    if _old in js:
        js = js.replace(_old, _new)
        applied.append('Tal is concise: ' + _label)
    else:
        missed.append('Tal is concise: ' + _label)

# the panel's suggestion rail used bare buttons while every other Tal offer
# carried the mark; they are the same offer and take the same chip
sub('panel suggestions are chips',
    r'<button data-ask="1">',
    lambda m: '<button class="chip-tal" data-ask="1"><span class="sk-mark xs"></span>')

# an inline padding on a section heading is a hand-placed gutter from before
# the spine existed; it double-pays now and no inline style can be overridden
# from the stylesheet, so it is removed at the source
sub('no inline gutter on a section heading',
    r'<div class="sec-h" style="padding:0 var\(--s05\)">',
    lambda m: '<div class="sec-h">')

# ============================================== THE DESKTOP RAIL =============
# The drawer at desktop is permanent, which meant 260px of the widest screen
# was spent on eight words that never change. It is a 72px icon rail by
# default now and expands on the toggle — and because `go()` already clears
# S.nav on every navigation, opening it, choosing a module and landing on
# the new page collapses it again without any extra bookkeeping. S.nav is
# therefore "drawer open" below 900 and "rail expanded" above it: the same
# flag, because it is the same idea at two sizes.
sub('rail state on the app element',
    r"const at = \(entered \? ' data-enter' : ''\)",
    lambda m: "const at = ` data-rail=\"${S.nav ? 'open' : 'shut'}\"`\n           + (entered ? ' data-enter' : '')")

# the toggle is no longer hidden at desktop, and it says what it will do
sub('rail toggle label',
    r'aria-label="\$\{S\.nav\?\'Close\':\'Open\'\} navigation"',
    lambda m: 'aria-label="${S.nav?\'Collapse\':\'Expand\'} navigation" title="${S.nav?\'Collapse\':\'Expand\'} navigation"')

# a collapsed rail still has to say what each icon is
sub('rail items carry a title',
    r'<button class="sn-item \$\{k===active\?\'on\':\'\'\}" data-go="\$\{k\}"',
    lambda m: '<button class="sn-item ${k===active?\'on\':\'\'}" title="${l}" data-go="${k}"')
sub('rail profile carries a title',
    r'<button class="sn-item \$\{active===\'account\'\?\'on\':\'\'\}" data-go="account">',
    lambda m: '<button class="sn-item ${active===\'account\'?\'on\':\'\'}" title="Profile" data-go="account">')
sub('rail log out carries a title',
    r'<button class="sn-item" data-go="stage:signup/login">',
    lambda m: '<button class="sn-item" title="Log out" data-go="stage:signup/login">')

# ============================================ THE DESKTOP COMPOSITION ========
# A dashboard read as one 1000px-wide column of full-width rows, which is a
# phone layout given more room rather than a desktop layout. At 1100 and up
# it splits: the things you act on stay in the main column, and the things
# you check — where you are, what has been decided, this week, your points —
# move into a narrower second column beside them. The split is stated as a
# list of headings rather than inferred from structure, so it is legible and
# so a new section defaults to the main column instead of guessing.
# The dashboard was split into two columns for a while. It is one column
# again, by request: a second column meant every row had to be paired with
# something to keep the rules level, and a page that has to invent a partner
# for each block is a page fighting its own layout. One column, full width,
# and the density comes from how each row uses that width.


# ============================================ THE SIGN-UP FLOW AT DESKTOP ====
# From the Figma frame: the auth screens are a two-part page — the brand
# graphic holding the left of the screen, and a fixed-width form column on
# the right with rules running past it on all four sides.
#
# Three things the frame is explicit about:
#   * the graphic is the logo's own chevron, extruded. It is never stretched,
#     so it is drawn from the same 24-unit path the product uses everywhere
#     else and cropped by the panel rather than fitted to it.
#   * the column is ONE width for every screen in the flow. Create, log in,
#     verify and reset all sit in the same 520px, and the content adapts to
#     it rather than the other way round.
#   * the outer rules follow the form's own height. Verify is a third the
#     height of Create, so its rules close a third of the way down — which
#     falls out for free by hanging them off the form block itself.
AUTH_ART = """const AUTH_ART = `
<div class="auth-art" aria-hidden="true"><i class="auth-img"></i></div>`;
"""
js = js.replace("const AUTH = {", AUTH_ART + "\nconst AUTH = {", 1)
applied.append('the auth graphic (1)')

# the split is assembled in render() so every screen in the flow gets it and
# the closing tags stay with the view that opened them. Terms is a document
# rather than a modal, so it keeps the full page.
sub('the auth split',
    r"    html = \(AUTH\[S\.view\]\|\|AUTH\.create\)\(\);",
    lambda m: "    const inner = (AUTH[S.view]||AUTH.create)();\n"
              "    html = S.view === 'terms' ? inner\n"
              "         : AUTH_ART + '<div class=\"auth-col\">' + inner + '</div>';")

# password and confirm are one decision, so at desktop they are one row
sub('password fields pair up',
    r'(<div class="f"><label for="pw">Password</label>)',
    lambda m: '<div class="f-row">' + m.group(1))
sub('password pair closes',
    r'(<div class="pw-wrap"><input class="inp fill" id="pw2" type="password" placeholder="Re-enter password">\n        <button class="pw-eye" data-eye="pw2" aria-label="Show password">\$\{I\.view\}</button></div></div>)',
    lambda m: m.group(1) + '</div>')
sub('new password fields pair up',
    r'(<div class="f"><label for="rpw">New password</label>)',
    lambda m: '<div class="f-row">' + m.group(1))
sub('new password pair closes',
    r'(<div class="pw-wrap"><input class="inp fill" id="rpw2" type="password" placeholder="Re-enter password">\n        <button class="pw-eye" data-eye="rpw2" aria-label="Show password">\$\{I\.view\}</button></div></div>)',
    lambda m: m.group(1) + '</div>')

# the address and the line that explains where it came from share a line
sub('the address line',
    r'<div class="inp-static" id="em">maryam\.naz@tkxel\.io</div>\n      <div class="help">From your Next in Leadership profile\. <a data-go="terms">Not you\?</a></div>',
    lambda m: '<div class="static-row"><div class="inp-static" id="em">maryam.naz@tkxel.io</div>'
              '<div class="help">From your Next in Leadership profile. <a data-go="terms">Not you?</a></div></div>')

# the action and the way out share the closing line
for _label, _btn in [('create','verify'),('login','stage:new'),('forgot','sent'),
                     ('reset','stage:new'),('verify','created')]:
    pass
sub('the closing line is one row',
    r'(<div class="mt6"><button class="btn btn-p btn-full" data-go="verify">Create account \$\{I\.arrowRight\}</button></div>)\n    (<p class="t-body-02 mt5"[^\n]*</p>)',
    lambda m: '</div>\n  <div class="sec"><div class="foot-row">' + m.group(1) + m.group(2) + '</div>')
sub('the login closing line is one row',
    r'(<button class="btn btn-p btn-full" data-go="stage:new">Log in \$\{I\.arrowRight\}</button>)\n    (<p class="t-body-02 mt5"[^\n]*</p>)',
    lambda m: '<div class="foot-row"><div>' + m.group(1) + '</div>' + m.group(2) + '</div>')

# `created` is the last screen of the flow and belongs in the same modal as
# the four before it. It was the one auth view without `form-page`, so the
# desktop rule that zeroes a page's gutter applied to it and its content ran
# to the modal's walls while every other screen kept its 20px.
sub('the created screen is a form page too',
    r"created: \(\) => `\$\{authShell\(\)\}\n<main class=\"main\"><div class=\"page\">",
    lambda m: 'created: () => `${authShell()}\n<main class="main"><div class="page form-page">')


# ==========================================================================
#  THE CHAPTER IS THE COURSE, NOT A LINK TO IT
#
#  The chapter page used to explain that the content lived somewhere else and
#  hand over a button. Candidates are not allowed above LightSpeed VT, so the
#  hand-off cannot happen: the course has to run inside the page. What
#  follows builds the player from the wireframe — the five stages of a
#  chapter down the left, the embedded frame on the right, the gate under it,
#  and notes as a state of the player rather than a second place to write.
# ==========================================================================
def lit(label, old, new, count=0):
    """A literal replacement. No regex — this markup is full of $ { } ` and
    escaping it twice is how the last four bugs got in."""
    global js
    n = js.count(old)
    if n == 0:
        missed.append(label); return
    js = js.replace(old, new) if not count else js.replace(old, new, count)
    applied.append(f'{label} ({n})')


PLAYER = """<div class="sec lsvt-sec">
    <div class="lsvt-head">
      <div class="lsvt-ttl"><b>${STAGE_L[stg][0]}</b><span class="lsvt-n">${stg+1} of ${STAGE_L.length}</span></div>
      <button class="btn btn-g btn-sm${S.notes?' on':''}" data-toggle="notes">${S.notes?'Hide notes':'Notes'} ${I.edit}</button>
    </div>
    <div class="lsvt-wrap">
      <ol class="stp-list">
        ${STAGE_L.map((s,n)=>`<li class="stp-row${n===stg?' on':''}${n<stg?' did':''}" data-stage="${n}" role="button" tabindex="0">
          <span class="stp-ic">${n<stg?I.checkFilled:(n===stg?I.play:I.circle)}</span>
          <span class="stp-b"><b>${s[0]}</b><span>${s[1]}</span></span></li>`).join('')}
      </ol>
      <div class="lsvt-frame">
        <iframe class="lsvt-if" data-lsvt="${stg}" data-ttl="${name}" title="Course content"></iframe>
      </div>
    </div>
    ${S.notes?`<div class="lsvt-notes">
      <label class="t-label-01" for="chn">Your notes on this chapter</label>
      <textarea class="inp ai-field" id="chn" placeholder="What landed, what did not">${i===3?'Handed the vendor review to Sam and took it back after two days. Did not tell him why.':''}</textarea>
      <div class="lsvt-notes-f">${askChip('Turn my note into a reflection for this chapter','Turn this into a reflection')}<span class="t-legal-01">Saved to this chapter. Only you and Tal can see it.</span></div>
    </div>`:''}
    <div class="lsvt-foot">
      <span class="t-helper-01">${stg===STAGE_L.length-1?'Finish the summary to complete this chapter.':'Time required before you can continue &middot; '+STAGE_L[stg][2]}</span>
      <button class="btn btn-p" data-stage="${Math.min(stg+1,STAGE_L.length-1)}">${stg===STAGE_L.length-1?'Complete chapter':'Continue'} ${I.arrowRight}</button>
    </div>
  </div>"""

OLD_LSVT = """<div class="sec">
    <div class="note"><span>${I.launch}</span><div class="nb"><b>Content opens in LightSpeed VT</b>You are signed in automatically. Your progress comes back here within a minute of you finishing.</div></div>
    <div class="mt5"><button class="btn btn-p">${done?'Revisit in LightSpeed VT':inprog?'Continue in LightSpeed VT':'Start in LightSpeed VT'} ${I.launch}</button></div>
  </div>"""

lit('the chapter plays in the page', OLD_LSVT, PLAYER)

# the chapter needs the stage index in scope
lit('the chapter knows which stage it is on',
    "  const inprog = S.stage==='day34' && i===3;",
    "  const inprog = S.stage==='day34' && i===3;\n  const stg = Math.min(S.stg||0, STAGE_L.length-1);")

# notes were a section of their own at the foot of the page. They are the
# player's second panel now, so the duplicate goes.
lit('notes live in the player',
    """  <div class="sec">
    <div class="sec-h"><h2>Your notes</h2></div>
    <textarea class="inp ai-field" placeholder="What landed, what did not">${i===3?'Handed the vendor review to Sam and took it back after two days. Did not tell him why.':''}</textarea>
    <div class="mt4">${askChip('Turn my note into a reflection for this chapter','Turn this into a reflection')}</div>
    
  </div>
""", '')

# the launch line under the progress bar named the wrong destination
lit('the chapter list no longer promises a hand-off',
    " minutes · opens in LightSpeed VT</div>",
    " minutes</div>")

# --------------------------------------------------------------------------
#  the stage table, the embedded document, and the two post-render passes
# --------------------------------------------------------------------------
HELPERS = """
/* The five stages of a chapter, as LightSpeed VT delivers them. The third
   value is the gate: the time that has to pass before Continue is honest. */
const STAGE_L = [
  ['Video','12 min · Sarah Kaplan','6:00 of 12:00 watched'],
  ['Reading','6 min · 3 pages','2 of 3 pages'],
  ['Workbook','10 min · 4 prompts','1 of 4 answered'],
  ['Assessment','8 questions · 70% to pass','0 of 8 answered'],
  ['Summary','3 min · what to try this week','']];

/* What the embedded course looks like from inside the frame. It is written
   into the iframe after render rather than passed as `srcdoc`, which keeps a
   whole HTML document out of an HTML attribute inside a template literal. */
const LSVT_PAGE = (stage, ttl) => {
  const body = [
    `<div class=plate><div class=play></div><div class=bar><i></i></div><div class=tc>6:00 / 12:00</div></div>
     <h1>${ttl}</h1><p class=by>Sarah Kaplan &middot; Module 3, video 1 of 1</p>
     <p>Delegation fails at the handover, not at the work. In this video Sarah walks a real handover line by line and marks the four sentences that decide whether it lands.</p>`,
    `<h1>${ttl}</h1><p class=by>Reading &middot; page 2 of 3</p>
     <p>The question is never whether someone <em>can</em> do the work. It is whether the two of you agree on what done looks like, who decides, and when you will next speak.</p>
     <p>Write those three down before you hand anything over. If you cannot, you are not delegating, you are hoping.</p>`,
    `<h1>${ttl}</h1><p class=by>Workbook &middot; prompt 2 of 4</p>
     <p>Think of the last piece of work you took back. What did you not say at the handover?</p>
     <div class=box>I did not tell Sam what I would have done differently&hellip;</div>`,
    `<h1>${ttl}</h1><p class=by>Assessment &middot; question 1 of 8</p>
     <p>A task comes back late and wrong. What is the first thing you check?</p>
     <div class=box>a &nbsp; Whether they had the authority to decide</div>
     <div class=box>b &nbsp; Whether the deadline was ever agreed</div>
     <div class=box>c &nbsp; Whether you would have done it the same way</div>`,
    `<h1>${ttl}</h1><p class=by>Summary &middot; 3 min</p>
     <p>One thing to try this week: at your next handover, say the three sentences out loud &mdash; what done looks like, who decides, when we speak next.</p>`
  ][stage] || '';
  return `<!doctype html><html><head><meta charset=utf-8><style>
    *{box-sizing:border-box}
    body{margin:0;padding:28px;background:#f3f2ee;color:#141414;
      font:400 14px/1.55 ui-sans-serif,system-ui,sans-serif}
    h1{margin:22px 0 2px;font-size:19px;line-height:1.25;font-weight:600}
    p{margin:12px 0;max-width:60ch;color:#3d3d3d}
    .by{margin-top:0;font-size:12px;color:#6f6f6f}
    .plate{position:relative;aspect-ratio:16/9;background:#141414;display:grid;place-items:center}
    .play{width:0;height:0;border-left:22px solid #fff;border-top:14px solid transparent;
      border-bottom:14px solid transparent;margin-left:6px;opacity:.92}
    .bar{position:absolute;left:0;right:0;bottom:26px;height:3px;background:rgba(255,255,255,.28)}
    .bar i{display:block;width:50%;height:100%;background:#a24bb8}
    .tc{position:absolute;left:0;bottom:6px;padding:0 10px;color:#e8e8e8;font-size:11px;
      font-variant-numeric:tabular-nums}
    .box{margin:8px 0;padding:12px 14px;background:#eceae4;color:#3d3d3d;max-width:60ch}
    em{font-style:italic}
  </style></head><body>${body}</body></html>`;
};

/* about:blank is same-origin, so the document can simply be written. */
function mountLsvt(){
  device.querySelectorAll('iframe.lsvt-if').forEach(fr => {
    const d = fr.contentDocument;
    if(!d) return;
    d.open(); d.write(LSVT_PAGE(+fr.dataset.lsvt || 0, fr.dataset.ttl || '')); d.close();
  });
}

/* ============================================================
   TAL COMES FIRST
   Wherever Tal has something to say about a page, it is the first thing on
   that page — above the panels it is talking about, on every device. The
   card is authored where it reads best in source order; this moves it.
   ============================================================ */
function talFirst(){
  device.querySelectorAll('.main > .page').forEach(page => {
    const kids = [...page.children];
    const sec = kids.find(el => el.classList.contains('sec') && el.querySelector('.ai-aura'));
    if(!sec) return;
    const anchor = page.querySelector(':scope > .ph, :scope > .lvl-hero')
                || page.querySelector(':scope > .crumb');
    if(anchor){
      if(anchor.nextElementSibling !== sec) anchor.insertAdjacentElement('afterend', sec);
    } else if(page.firstElementChild !== sec){
      page.prepend(sec);
    }
  });
}
"""

lit('the player helpers', '\nfunction render(){', HELPERS + '\nfunction render(){')

# talFirst has to run before the cascade indexes the sections, or the card
# animates in at whatever position it was authored at.
lit('tal first, then the cascade',
    "  enhanceTalCards();\n",
    "  talFirst();\n  enhanceTalCards();\n  mountLsvt();\n")

# state
lit('the player has state',
    "  addCard:false, editProfile:false, editPhoto:false, piOpen:{},",
    "  addCard:false, editProfile:false, editPhoto:false, piOpen:{}, stg:0, notes:false, iv:'level',")

# handlers
lit('the stage list is clickable',
    "  const bk = t.closest('[data-back]');",
    """  const stgT = t.closest('[data-stage]');
  if(stgT){ S.stg = +stgT.dataset.stage || 0; render(); return; }

  const ivt = t.closest('[data-iv]');
  if(ivt) S.iv = ivt.dataset.iv;

  const bk = t.closest('[data-back]');""")

# `notes` joins the set of things a [data-toggle] can flip
lit('notes is a toggle',
    "['nav','notif','tal','editProfile','editPhoto','addCard']",
    "['nav','notif','tal','editProfile','editPhoto','addCard','notes']")

# opening a chapter starts it at the first stage
lit('a chapter opens at its first stage',
    "if(target.startsWith('chapter:')){ S.ch = +target.slice(8);",
    "if(target.startsWith('chapter:')){ S.ch = +target.slice(8); S.stg = 0; S.notes = false;")

# ==========================================================================
#  TAL IS NOT A COACH
#  Tal explains, summarises and asks. The coaching is what the agents and the
#  course do, and calling the assistant a coach makes a claim about the
#  product that the product does not make.
# ==========================================================================
lit('the terms page does not call Tal a coach',
    '<span class="ttl">4. Tal, your coach</span>',
    '<span class="ttl">4. Tal, your assistant</span>')
lit('the welcome card does not call Tal a coach',
    '<h3>Meet Tal, your coach</h3>',
    '<h3>Meet Tal</h3>')
lit('the data switch does not call Tal a coach',
    '<b>Tal, your coach</b><span>Can see your course progress and notes. Never your messages.</span>',
    "<b>What Tal can see</b><span>Your course progress and your notes. Never your messages.</span>")

# ==========================================================================
#  EVERY INTERVIEW KEEPS ITS OWN RECORDING
#  An interview is not only the level it set. The recording, the transcript
#  and the marked scenes belong to it and stay available for as long as the
#  recording does — for each interview taken, not just the most recent.
# ==========================================================================
lit('the past interviews carry their identity',
    '<button class="tile clk arrow" data-go="report">\n        <div class="t-label-01" style="color:var(--text-secondary)">Re-interview &middot; Nov 21, 2026</div>'.replace('&middot;','·'),
    '<button class="tile clk arrow" data-go="report" data-iv="re">\n        <div class="t-label-01" style="color:var(--text-secondary)">Re-interview · Nov 21, 2026</div>')
lit('the level interview carries its identity',
    '<button class="tile clk arrow" data-go="report">\n        <div class="t-label-01" style="color:var(--text-secondary)">Level interview · Aug 20, 2026</div>',
    '<button class="tile clk arrow" data-go="report" data-iv="level">\n        <div class="t-label-01" style="color:var(--text-secondary)">Level interview · Aug 20, 2026</div>')

# the sub-line under each past interview says what is kept, not only what it set
lit('a past interview says what it keeps',
    'Promoted to Explorer &ndash; E4 · 45 min</div>',
    'Promoted to Explorer &ndash; E4 · 45 min</div>\n        <div class="sub">Recording, transcript and 6 scenes</div>')
lit('the first interview says what it keeps',
    'Confirmed Explorer &ndash; E3 · 45 min · report signed</div>',
    'Confirmed Explorer &ndash; E3 · 45 min · report signed</div>\n        <div class="sub">Recording, transcript and 6 scenes</div>')

MEDIA = """  <div class="sec">
    <div class="sec-h"><h2>From this interview</h2><span class="t-helper-01">Kept for 24 months</span></div>
    <div class="rec">
      <div class="rec-plate"><span class="rec-play">${I.play}</span><span class="rec-len">45:12</span></div>
      <div class="rec-b">
        <div class="t-heading-compact-01">${S.iv==='re'?'Re-interview':'Level interview'} recording</div>
        <div class="t-helper-01 mt3">${S.iv==='re'?'November 21, 2026':'August 20, 2026'} &middot; video and audio &middot; Priya Nair</div>
        <div class="btn-set mt5">
          <button class="btn btn-g btn-sm">Watch the recording ${I.play}</button>
          <button class="btn btn-t btn-sm" data-go="transcript">Read the transcript ${I.document}</button>
          <button class="btn btn-t btn-sm">Download ${I.download}</button>
        </div>
      </div>
    </div>
    <p class="t-legal-01 mt5" style="color:var(--text-helper)">You can ask for this recording to be deleted at any time. Deleting it does not reverse the level it confirmed.</p>
  </div>
"""

lit('the report carries its recording and transcript',
    '  <div class="sec">\n    <div class="sec-h"><h2>Clips for your report</h2></div>',
    MEDIA + '  <div class="sec">\n    <div class="sec-h"><h2>Scenes from this interview</h2></div>')

# the report belongs to the interview that was opened
lit('the report names the right interview',
    '<div class="eb">Confirmed August 21</div>',
    "<div class=\"eb\">${S.iv==='re'?'Re-interview · confirmed November 22':'Level interview · confirmed August 21'}</div>")

# ==========================================================================
#  A FILL RUNS RAIL TO RAIL
#  A tinted row inside a gutter reads as a floating plate. With vertical
#  rules now drawn down both sides of the column, the fill is the band
#  between them: it ignores the gutter and pays it back as padding, so its
#  text still starts on the spine.
# ==========================================================================
lit('suggested questions are bands',
    'class="tile clk" data-tal-ask="${q}" style="background:var(--layer-02);padding:var(--s04)"',
    'class="tile clk band" data-tal-ask="${q}"')
lit('the delegation asks are bands',
    'class="tile clk" data-tal-ask="Run a mock interview on delegation" style="background:var(--layer-02);padding:var(--s04)"',
    'class="tile clk band" data-tal-ask="Run a mock interview on delegation"')
lit('the example ask is a band',
    'class="tile clk" data-tal-ask="Help me find a real delegation example from my own work" style="background:var(--layer-02);padding:var(--s04)"',
    'class="tile clk band" data-tal-ask="Help me find a real delegation example from my own work"')
lit('the stage row is a band',
    'class="tile clk arrow" data-go="stage:new" style="background:var(--layer-02);padding:var(--s04)"',
    'class="tile clk arrow band" data-go="stage:new"')
lit('the payment notes are bands',
    'class="note mt5" style="background:var(--layer-02);border-left-color:var(--gray-50)"',
    'class="note mt5 band"')


# the rewards lists are content, not a panel
lit('the rewards list sits on the canvas',
    '<div class="sec" style="padding-top:var(--s05)">\n    <div class="sec-h" style="margin-bottom:var(--s04)"><span class="t-helper-01">${counts[tab]}</span>',
    '<div class="sec nofill" style="padding-top:var(--s05)">\n    <div class="sec-h" style="margin-bottom:var(--s04)"><span class="t-helper-01">${counts[tab]}</span>')


# ==========================================================================
#  THE COMPOSER IS PART OF THE PAGE
#  The suggestion chip and the message field were siblings of <main>, so they
#  sat outside the column the conversation is set in: full width of the view,
#  under the rail, ignoring both the content margin and the vertical rules.
#  They belong inside the page, pinned to its foot.
# ==========================================================================
OLD_FOOT = """  </div>
</div></main>
<div class="tal-sugg" style="padding:0 var(--s05) var(--s04);flex:none">
  ${askChip('Help me word a reply to Priya','Help me word a reply')}
</div>
<div class="composer" style="flex:none">
  <input class="inp" placeholder="Message Priya" aria-label="Message">
  <button aria-label="Send">${I.send}</button>
</div>`;"""

NEW_FOOT = """  </div>
  <div class="msg-foot">
    <div class="tal-sugg">${askChip('Help me word a reply to Priya','Help me word a reply')}</div>
    <div class="composer">
      <input class="inp" placeholder="Message Priya" aria-label="Message">
      <button aria-label="Send">${I.send}</button>
    </div>
  </div>
</div></main>`;"""

lit('the composer moves inside the page', OLD_FOOT, NEW_FOOT)

lit('the messages page is a column',
    'V.messages = (f) => `<main class="main"><div class="page" style="padding-bottom:var(--s05)">',
    'V.messages = (f) => `<main class="main"><div class="page msg-page">')



# ==========================================================================
#  THE POINTS BLOCK ON THE DASHBOARD
#  Three faults in one block: the score card was wrapped in a link, so it
#  inherited a link's blue ink and a blue underline running the width of the
#  section; the card carried its own gutter and its own bottom rule inside a
#  section that already had both, so its panel tone ran on past the rule; and
#  the panel tone was on the one block that is a readout rather than a thing
#  you do. The tone moves to This week, which is what the dashboard is for.
# ==========================================================================
lit('points is not a panel, this week is',
    '<div class="sec tint">\n      <div class="sec-h"><h2>Points</h2><a data-go="rewards">Badges and rank</a></div>',
    '<div class="sec">\n      <div class="sec-h"><h2>Points</h2><a data-go="rewards">Badges and rank</a></div>')

lit('this week is the panel',
    '<div class="sec">\n      <div class="sec-h"><h2>${f.finished?\'Your course\':\'This week\'}</h2>',
    '<div class="sec tint">\n      <div class="sec-h"><h2>${f.finished?\'Your course\':\'This week\'}</h2>')

# ==========================================================================
#  THE WEEKLY CALL
#  It was three lines of text with an arrow, which made the one appointment
#  in the week read like a list item. It gets what an appointment needs: the
#  day as a mark you can find at a glance, the time and length on one line,
#  and the face of the person running it.
# ==========================================================================
OLD_CALL = """<button class="tile clk arrow" data-go="cohort">
          <div class="t-label-01" style="color:var(--text-secondary)">Weekly call · in 2 days</div>
          <h3 class="mt3">Thursday 6:00 PM ET</h3><div class="sub">Priya Nair · 9 others · 60 minutes</div>
          <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg></button>"""

NEW_CALL = """<button class="tile clk arrow wcall" data-go="cohort">
          <span class="wcall-d"><b>Thu</b><span>6:00 PM</span></span>
          <span class="wcall-b">
            <span class="t-label-01">Weekly call &middot; in 2 days</span>
            <span class="wcall-t">Cohort 41, week ${f.week||5}</span>
            <span class="wcall-who">${avatar(AGENTS.priya,22)}<span>Priya Nair and 9 others &middot; 60 minutes</span></span>
          </span>
          <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg></button>"""

lit('the weekly call is an appointment', OLD_CALL, NEW_CALL)


# ==========================================================================
#  THE CHAPTER LIST
#  Four things: the bar above the cohort note was a progress bar for a
#  progress the page header already states, so it read as a stray rule; the
#  current chapter's number was a filled purple tile, which made the accent
#  a decoration rather than a signal; a finished chapter said nothing about
#  what you can do with it; and the one in progress hid its action in a
#  pseudo-element on the meta line.
#
#  The state now sits where you read it: a green tick beside the name of a
#  chapter you finished, and one named action at the end of the row —
#  Restart if it is done, Resume if it is open.
# ==========================================================================
lit('the coursework page has no second progress bar',
    '    <div class="pb"><div class="pb-track"><div class="pb-fill" style="width:${pct}%"></div></div></div>\n',
    '')

OLD_ROW = """  const ic = state==='done' ? `<span style="fill:var(--support-success)">${I.checkFilled}</span>`
    : state==='open' ? `<span style="fill:var(--text-primary)">${I.circleDash}</span>`
    : state==='locked' ? `<span style="fill:var(--gray-50)">${I.locked}</span>`
    : `<span style="fill:var(--gray-40)">${I.circle}</span>`;
  return `<button class="ch ${state}" data-go="chapter:${i}">
    <span class="ch-num">${String(n).padStart(2,'0')}</span>
    <span class="ch-b"><span class="ch-n">${name}</span>
      <span class="ch-m">${meta}${flag?`<span class="sep">·</span><span class="ai-inline"><span class="sk"></span>${flag}</span>`:''}</span></span>
    <span class="ch-ic">${ic}</span>
  </button>`;"""

NEW_ROW = """  const trail = state==='done'
      ? `<span class="ch-act">Restart</span>`
    : state==='open'
      ? `<span class="ch-act resume">Resume</span>`
    : state==='locked'
      ? `<span class="ch-ic"><span style="fill:var(--gray-50)">${I.locked}</span></span>`
      : `<span class="ch-ic"><span style="fill:var(--gray-40)">${I.circle}</span></span>`;
  return `<button class="ch ${state}" data-go="chapter:${i}">
    <span class="ch-num">${String(n).padStart(2,'0')}</span>
    <span class="ch-b"><span class="ch-n">${name}${state==='done'?`<span class="ch-tick">${I.checkFilled}</span>`:''}</span>
      <span class="ch-m">${meta}${flag?`<span class="sep">·</span><span class="ai-inline"><span class="sk"></span>${flag}</span>`:''}</span></span>
    ${trail}
  </button>`;"""

lit('a chapter says what you can do with it', OLD_ROW, NEW_ROW)


# ==========================================================================
#  THE CERTIFICATE IS A HORIZONTAL PLATE
#  It was a centred column: a small mark, three centred lines and two buttons
#  stretched the full width. Centred text on a dark plate reads as a splash
#  screen rather than as a record. It becomes a plate that runs the full
#  width of the column — rule to rule, no gutter — with the mark large on the
#  left, the record set against it on the left, and the two actions in the
#  bottom right corner where an action belongs.
# ==========================================================================
OLD_CERT = """    <div class="cert"><span class="cert-mark">${I.certificate}</span>
      <div class="n">Explorer Track &ndash; ${f.complete?'E3':'E2'}</div>
      <div class="m">${f.complete?'Completed November 21, 2026 · Cohort 41':'Completed May 4, 2026 · Cohort 12'}</div>
      <div class="m" style="margin-top:var(--s02)">Signed by ${f.complete?'Priya Nair':'Daniel Kerr'}</div>
      <div class="mt5" style="display:flex;gap:1px">
        <button class="btn btn-sm noic" style="flex:1;justify-content:center;background:var(--gray-80);color:#fff">Download</button>
        <button class="btn btn-sm noic" style="flex:1;justify-content:center;background:var(--gray-80);color:#fff">Share link</button>
      </div></div>"""

NEW_CERT = """    <div class="cert">
      <span class="cert-mark">${I.certificate}</span>
      <div class="cert-b">
        <div class="cert-eb">Certificate of completion</div>
        <div class="n">Explorer Track &ndash; ${f.complete?'E3':'E2'}</div>
        <div class="m">${f.complete?'Completed November 21, 2026 · Cohort 41':'Completed May 4, 2026 · Cohort 12'}</div>
        <div class="m">Signed by ${f.complete?'Priya Nair':'Daniel Kerr'}</div>
      </div>
      <div class="cert-act">
        <button class="btn btn-sm noic cert-btn">Download</button>
        <button class="btn btn-sm noic cert-btn">Share link</button>
      </div>
    </div>"""

lit('the certificate is a plate', OLD_CERT, NEW_CERT)


# ==========================================================================
#  ONE CHAPTER ROW, EVERYWHERE
#  The chapter record on the progress page was a second, unrelated rendering
#  of the same thing the coursework page lists: a key/value table with the
#  number glued to the title and the state written out in words. A chapter
#  looks like a chapter wherever it appears. It shows five and links to all
#  thirteen, which is the only difference that matters.
# ==========================================================================
OLD_REC = """    <div class="tile">
      ${CH.slice(0,5).map((c,i)=>`<div class="kv"><span class="k">${String(i+1).padStart(2,'0')} · ${c[0]}</span>
        <span class="${i<f.done?'v':'v n'}" ${i<f.done?'':'style="color:var(--text-secondary)"'}>${i<f.done?SCORE[i]+'%':(i===f.open?'In progress':'Not started')}</span></div>`).join('')}
    </div>"""

NEW_REC = """    <div class="tile-stack">${CH.slice(0,5).map((_,i)=>chRow(i,f)).join('')}</div>"""

lit('the chapter record uses the chapter row', OLD_REC, NEW_REC)


# ==========================================================================
#  THE COHORT CALL
#  The one fixed appointment in the week was a column of five stacked lines
#  with a button under them, indistinguishable from the blocks around it. It
#  becomes a filled band across the column: the day on the left, what and who
#  in the middle, the action on the right, in the same shape the dashboard
#  uses for the same appointment.
# ==========================================================================
OLD_COHORT_CALL = """  <div class="sec">
    <div class="tile" style="padding:0 0 var(--s05)">
      <div class="tag-row mb5"><span class="tag">Weekly call</span><span class="tag">In 2 days</span></div>
      <div class="t-label-01" style="padding:0 var(--s05);margin-top:var(--s05);color:var(--text-secondary)">Cohort 41</div>
      <div class="t-heading-03 mt3" style="padding:0 var(--s05)">Thursday 6:00 PM ET</div>
      <div class="t-body-01 mt3" style="padding:0 var(--s05);color:var(--text-secondary)">60 minutes · Priya Nair · 9 others</div>
      <div class="mt5" style="padding:0 var(--s05)"><button class="btn btn-p btn-sm noic" style="justify-content:center">Add to calendar</button></div>
    </div>
  </div>"""

NEW_COHORT_CALL = """  <div class="sec">
    <div class="callband">
      <div class="callband-d"><b>Thu</b><span>6:00 PM</span><span class="callband-tz">ET</span></div>
      <div class="callband-b">
        <div class="t-label-01">Weekly call &middot; in 2 days</div>
        <div class="callband-t">Cohort 41, week ${f.week}</div>
        <div class="callband-who">${avatar(AGENTS.priya,24)}<span>Led by Priya Nair &middot; 9 others &middot; 60 minutes</span></div>
      </div>
      <div class="callband-act">
        <button class="btn btn-p btn-sm noic">Add to calendar</button>
      </div>
    </div>
  </div>"""

lit('the cohort call is a band', OLD_COHORT_CALL, NEW_COHORT_CALL)


# ==========================================================================
#  THE TRACK BAND
#  Three buckets, three facts, two rows of three across the whole band. The
#  chevrons were a count dressed as an ornament — one, two and three of the
#  same mark, which reads as decoration rather than as a difference. Each
#  bucket takes an icon that says what it is: a pin for where you start, a
#  rising line for the middle, a flag for the end of the ladder.
# ==========================================================================
OLD_BAND = """  const chev = n => Array.from({length:n},()=>`<svg viewBox="0 0 24 24"><path d="${CHEV}"/></svg>`).join('');
  return `<div class="path" role="img" aria-label="Track ${track}, first of three">
    ${T.map(([name,n],i)=>`
      <div class="path-step ${i===at?'on':(i<at?'past':'')}">
        <span class="path-mark">${chev(n)}</span>
        <span class="path-n">${name}</span>
        ${i===at?'<span class="path-you">You are here</span>':''}
      </div>`).join('')}
  </div>"""

NEW_BAND = """  const PIC = [I.location, I.growth, I.flag];
  const WHAT = ['Where every candidate starts','Leading a function, not a task','The top of the ladder'];
  return `<div class="path" role="img" aria-label="Track ${track}, first of three">
    ${T.map(([name,n],i)=>`
      <div class="path-step ${i===at?'on':(i<at?'past':'')}">
        <span class="path-mark">${PIC[i]}</span>
        <span class="path-n">${name}</span>
        <span class="path-w">${WHAT[i]}</span>
        ${i===at?'<span class="path-you">You are here</span>':''}
      </div>`).join('')}
  </div>"""

lit('the track band takes icons', OLD_BAND, NEW_BAND)


# ==========================================================================
#  THE PAGE HEADER CAN CARRY AN ACTION
#  A page with one obvious next step should offer it at the top, against the
#  right edge of the column, not four hundred pixels down after the
#  explanation. `ph()` takes a third argument for it; every existing call is
#  unchanged.
# ==========================================================================
lit('the page header takes an action',
    """function ph(title,sub){
  return `<div class="ph"><div class="ph-top">${bk()}<h1>${title}</h1></div>${sub?`<p>${sub}</p>`:''}</div>`;
}""",
    """function ph(title,sub,act){
  return `<div class="ph${act?' ph-has-act':''}">
    <div class="ph-main"><div class="ph-top">${bk()}<h1>${title}</h1></div>${sub?`<p>${sub}</p>`:''}</div>
    ${act?`<div class="ph-act">${act}</div>`:''}</div>`;
}""")

# the interviews header carries Choose an agent
lit('the interviews header carries its action',
    """    : 'A 45-minute conversation with a talent agent. It sets your level and gives you a report that is yours to keep.')}""",
    """    : 'A 45-minute conversation with a talent agent. It sets your level and gives you a report that is yours to keep.',
    booked ? '' : `<button class="btn btn-p" data-go="agents">${f.reinterview?'Book your re-interview':'Choose an agent'} ${I.arrowRight}</button>`)}""")

lit('and no longer repeats it at the foot',
    """  <div class="sec">
    <button class="btn btn-p" data-go="agents">${f.reinterview?'Book your re-interview':'Choose an agent'} ${I.arrowRight}</button>
  </div>`}""",
    """`}""")


# ==========================================================================
#  THE AGENT'S IDENTITY BLOCK
#  A bigger photograph with three lines set against it: the name, the rating
#  and what they assess. The last of those was two bordered tags, which put a
#  box around a fact — the tags are gone and the facts read as a line.
#  The three interview facts underneath become a band each, rule to rule,
#  the same shape every other list of facts in the product uses.
# ==========================================================================
OLD_AGENT = """    <div class="ag" style="padding:0;background:transparent">
      ${avatar(a,56)}
      <div class="ag-b">
        <div class="ag-n" class="u-h2">${a.n}</div>
        <div class="ag-r">${stars(a.r)}<span class="num">${a.r.toFixed(1)}</span><span class="t-helper-01">· ${a.ivs} interviews</span></div>
        <div class="tag-row mt3"><span class="tag">Assesses ${a.range}</span><span class="tag green">${I.checkFilled}Verified</span></div>
      </div>
    </div>
    ${a.bio?`<p class="t-body-01 mt5" style="color:var(--text-secondary)">${a.bio}</p>`:''}
    <div class="mt5">
      <div class="kv"><span class="k">Interview fee</span><span class="v">${a.price}</span></div>
      <div class="kv"><span class="k">Length</span><span class="v n">45 minutes, recorded</span></div>
      <div class="kv"><span class="k">Report turnaround</span><span class="v n">Within 24 hours</span></div>
    </div>"""

NEW_AGENT = """    <div class="agid">
      ${avatar(a,96)}
      <div class="agid-b">
        <div class="agid-n">${a.n}</div>
        <div class="agid-r">${stars(a.r)}<span class="num">${a.r.toFixed(1)}</span><span class="agid-iv">&middot; ${a.ivs} interviews</span></div>
        <div class="agid-c"><span>Assesses ${a.range}</span><span class="agid-v">${I.checkFilled}Verified</span></div>
      </div>
    </div>
    ${a.bio?`<p class="agid-bio">${a.bio}</p>`:''}
    <div class="mt5 kv-bands">
      <div class="kv"><span class="k">Interview fee</span><span class="v">${a.price}</span></div>
      <div class="kv"><span class="k">Length</span><span class="v n">45 minutes, recorded</span></div>
      <div class="kv"><span class="k">Report turnaround</span><span class="v n">Within 24 hours</span></div>
    </div>"""

lit('the agent identity block', OLD_AGENT, NEW_AGENT)


# ==========================================================================
#  PICKING A SLOT
#  Nothing on this screen needs Tal. The candidate is choosing a time from a
#  list of times; there is no judgement to help with, and a suggestion chip
#  under a booking grid is a third thing competing with the two that matter.
#  It goes. The days and the times line up on the same left edge, and the
#  sentence about held slots sits under them as a caption, not as a rule.
# ==========================================================================
lit('no Tal under the slot picker',
    """    <p class="t-helper-01 mt4">Two other candidates are looking at Thursday. Slots are held for 10 minutes once you continue.</p>
    <div class="mt5">${askChip('What should I prepare before this interview?','Ask Tal what to prepare')}</div>""",
    """    <p class="slots-note">Two other candidates are looking at Thursday. Slots are held for 10 minutes once you continue.</p>""")

# ==========================================================================
#  THE ACTION BAR
#  What you are buying on the left, what it costs beside it, and the one
#  button at the right at the width its own label needs. It was a stacked
#  caption over a bar-width button, which reads as a banner rather than as
#  the end of a form.
# ==========================================================================
lit('the action bar is one row',
    """<div class="stickybar">
  <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:var(--s04)">
    <span class="t-body-compact-01">Thu, Aug 20 · 6:30 PM</span><span class="t-heading-02">${a.price}</span></div>
  <button class="btn btn-p" data-go="booking" style="max-width:none">Continue to payment ${I.arrowRight}</button>
</div>`;""",
    """<div class="stickybar">
  <div class="sb-b">
    <span class="sb-when">Thu, Aug 20 &middot; 6:30 PM</span>
    <span class="sb-price">${a.price}</span>
  </div>
  <button class="btn btn-p sb-go" data-go="booking">Continue to payment ${I.arrowRight}</button>
</div>`;""")


# the two actions on the verify screen are a pair, not a stack: the way back
# on the left, the way on to the right
lit('the verify actions are one row',
    """    <button class="btn btn-p btn-full" data-go="created">Verify and continue ${I.arrowRight}</button>
    <div class="mt4"><button class="btn btn-g btn-full">Resend code in 0:42 ${I.restart}</button></div>""",
    """    <div class="otp-act">
      <button class="btn btn-g">Resend code in 0:42 ${I.restart}</button>
      <button class="btn btn-p" data-go="created">Verify and continue ${I.arrowRight}</button>
    </div>""")


# the recording caveat is stated on the report and in Profile; a third copy
# under How it works is the page apologising for itself
lit('the recording caveat is not repeated here',
    """    <p class="t-helper-01 mt5">Recorded so your agent can write the report. You can ask for a recording to be deleted at any time.</p>
""", '')

# ==========================================================================
#  ALL AGENTS
#  The search was a section of its own above the list, so the heading it
#  belonged to came after it. It goes under the heading and the line that
#  says what the list is — and that line now says what the list is, rather
#  than only how it is sorted. The agents are three across, the same
#  comparison shape the shortlist uses.
# ==========================================================================
OLD_ALL = """  <div class="sec" style="padding-top:var(--s07)">
    <div class="srch" style="margin-bottom:0">
      <svg class="mag" viewBox="0 0 24 24">${inner('search')}</svg>
      <input class="inp" placeholder="Search all 24 agents" aria-label="Search agents">
    </div>
  </div>

  <div class="sec">
    <div class="sec-h"><h2>All agents</h2><span class="t-helper-01">Soonest first</span></div>
    <div class="tile-stack">${['priya','owen','lena','samuel','hana'].map(k=>agentCard(k)).join('')}</div>
  </div>"""

NEW_ALL = """  <div class="sec">
    <div class="sec-h"><h2>All agents</h2><span class="t-helper-01">Soonest first</span></div>
    <p class="all-desc">Every one of the 24 agents who can assess ${f.pred?'the Explorer track':'your level'}, with their next free slot and their fee. Search by name, by the levels they assess, or by when they are free.</p>
    <div class="srch all-srch">
      <svg class="mag" viewBox="0 0 24 24">${inner('search')}</svg>
      <input class="inp" placeholder="Search all 24 agents" aria-label="Search agents">
    </div>
  </div>

  <div class="rail-wrap">
    <div class="rail rail-all">${['priya','owen','lena','samuel','hana','priya'].map(k=>agentCardH(k)).join('')}</div>
  </div>"""

lit('all agents: search under the heading, three across', OLD_ALL, NEW_ALL)

# the saved-card list is content, not an aside — it loses the panel tone
lit('saved cards sit on the canvas',
    '  <div class="sec tint">\n    <div class="sec-h"><h2>Saved cards</h2>',
    '  <div class="sec">\n    <div class="sec-h"><h2>Saved cards</h2>')

# the default marker is a state, not a filter tag
lit('the default marker is a pill',
    """${c.def?' <span class="tag brand sm">Default</span>':''}""",
    """${c.def?' <span class="pill-def">Default</span>':''}""")


# ==========================================================================
#  A PAYMENT IS A ROW IN A LEDGER
#  Each payment was a stacked card: name, then a meta line, then an amount
#  in the corner, then a button. Four payments made four blocks. A payment
#  history is a table — what, when, how, how much, and the receipt — and it
#  is read down the columns.
# ==========================================================================
OLD_PAY = """  <div class="sec"><div class="tile-stack">
    ${rows.map(([n,d,amt,br,last])=>`<div class="tile">
      <div style="display:flex;justify-content:space-between;gap:var(--s04)">
        <div><div class="t-heading-compact-01">${n}</div>
          <div class="paymeta mt3"><span>${d}</span><span>·</span>${br?bmk(br)+`<span class="n">&bull;&bull;&bull;&bull; ${last}</span>`:''}</div></div>
        <div style="text-align:right"><div class="t-heading-02">${amt}</div><span class="tag green sm mt3">Paid</span></div>
      </div>
      <div class="mt4"><button class="btn btn-g btn-sm">Receipt ${I.download}</button></div></div>`).join('')}
  </div></div>"""

NEW_PAY = """  <div class="sec pay-sec">
    <div class="paytbl">
      <div class="payrow payhead">
        <span>What</span><span>When</span><span>Card</span>
        <span class="num">Amount</span><span></span>
      </div>
      ${rows.map(([n,d,amt,br,last])=>`<div class="payrow">
        <span class="pay-n">${n}</span>
        <span class="pay-d">${d}</span>
        <span class="pay-c">${br?bmk(br)+`<span class="n">&bull;&bull;&bull;&bull; ${last}</span>`:''}</span>
        <span class="pay-a num">${amt}</span>
        <span class="pay-r"><button class="lnk">Receipt</button></span>
      </div>`).join('')}
    </div>
  </div>"""

lit('payments are a ledger', OLD_PAY, NEW_PAY)

# the close sits at the end of the panel header row
lit('the Tal header closes at the end of the row',
    """      <button class="shell-act" data-toggle="tal" aria-label="Close Tal" style="color:var(--icon-primary)">${I.close}</button>""",
    """      <button class="shell-act tal-x" data-toggle="tal" aria-label="Close Tal" style="color:var(--icon-primary)">${I.close}</button>""")


# ==========================================================================
#  MESSAGES IS A CONVERSATION
#  It was a list of rows: text on the left, attribution in a second column,
#  a rule between. That is a log, not a conversation — you could not tell at
#  a glance who was speaking, and nothing marked where you had read up to.
#
#  Priya on the left with her face, you on the right with yours, the day as a
#  centred marker, an unread rule that names how many, and a composer that
#  can carry a file or a voice note as well as a sentence. Tal is not in this
#  room: this is a private thread with a person, and a suggestion chip in it
#  reads as a third party listening.
# ==========================================================================
OLD_MSG = """V.messages = (f) => `<main class="main"><div class="page msg-page">
  <div class="ph" style="padding-bottom:var(--s04)"><h1>Messages</h1>
    <p>One-to-one with Priya Nair. Private, and it stays after the cohort closes.</p></div>

  <div class="msgs">
    <div class="msg"><div class="bub">Week 5 is the one people find hardest. If chapter 4 is not landing, say so on Thursday rather than pushing through it.</div><div class="mt">Priya Nair · Mon 11:04 AM</div></div>
    <div class="msg me"><div class="bub">It is not landing. I keep taking work back and I do not know how to stop doing that.</div><div class="mt">You · Mon 9:36 PM</div></div>
    <div class="msg"><div class="bub">Good. That is the actual chapter. Bring the vendor review example on Thursday and we will work through it with the group, if you are happy with that.</div><div class="mt">Priya Nair · Tue 9:12 AM</div></div>
  </div>
  <div class="msg-foot">
    <div class="tal-sugg">${askChip('Help me word a reply to Priya','Help me word a reply')}</div>
    <div class="composer">
      <input class="inp" placeholder="Message Priya" aria-label="Message">
      <button aria-label="Send">${I.send}</button>
    </div>
  </div>
</div></main>`;"""

NEW_MSG = """V.messages = (f) => {
  const her = AGENTS.priya;
  const you = {i:'MN', img: AV.hana};
  const av = a => avatar(a, 32);
  const m = (side, who, body, when) => `<div class="m ${side}">
    <span class="m-av">${av(side === 'me' ? you : her)}</span>
    <div class="m-c">
      <div class="m-b">${body}</div>
      <div class="m-w">${who} &middot; ${when}</div>
    </div>
  </div>`;
  const voice = (len) => `<span class="vn">
    <span class="vn-play">${I.play}</span>
    <span class="vn-wave">${Array.from({length:28},(_,i)=>`<i style="height:${4 + ((i*7)%11)}px"></i>`).join('')}</span>
    <span class="vn-len">${len}</span></span>`;
  const file = (n, s) => `<span class="fa">
    <span class="fa-ic">${I.document}</span>
    <span class="fa-b"><b>${n}</b><span>${s}</span></span>
    <span class="fa-dl">${I.download}</span></span>`;
  return `<main class="main"><div class="page msg-page">
  <div class="ph" style="padding-bottom:var(--s04)"><h1>Messages</h1>
    <p>One-to-one with Priya Nair. Private, and it stays after the cohort closes.</p></div>

  <div class="msgs">
    <div class="m-day"><span>Monday</span></div>
    ${m('them','Priya Nair','Week 5 is the one people find hardest. If chapter 4 is not landing, say so on Thursday rather than pushing through it.','11:04 AM')}
    ${m('me','You','It is not landing. I keep taking work back and I do not know how to stop doing that.','9:36 PM')}
    <div class="m-day"><span>Tuesday</span></div>
    ${m('them','Priya Nair','Good. That is the actual chapter. Bring the vendor review example on Thursday and we will work through it with the group, if you are happy with that.','9:12 AM')}
    ${m('me','You','Yes. I will bring the handover I took back from Sam.','9:40 AM')}
    <div class="m-unread"><span>2 unread messages</span></div>
    ${m('them','Priya Nair', voice('0:38'),'Wed 8:15 AM')}
    ${m('them','Priya Nair','Listen to that before Thursday. The one-pager below is the frame I want you to use for the handover.<br>' + file('Handover one-pager.pdf','PDF &middot; 240 KB'),'Wed 8:17 AM')}
  </div>
  <div class="msg-foot">
    <div class="composer">
      <span class="composer-star">${I.ai}</span>
      <input class="inp" placeholder="Message Priya" aria-label="Message">
      <button class="composer-act" aria-label="Attach a file">${I.attachment}</button>
      <button class="composer-act" aria-label="Record a voice message">${I.microphone}</button>
      <button class="composer-send" aria-label="Send">${I.send}</button>
    </div>
  </div>
</div></main>`;
};"""

lit('messages is a conversation', OLD_MSG, NEW_MSG)


# ==========================================================================
#  PAST INTERVIEWS COME FIRST, AND THEY ARE NOT A CARD
#  Once you have had an interview, the interview you had is the thing you
#  come to this page for; how it works is reference material you have already
#  read. So the record moves above the explanation.
#
#  And the record stops being a stack of four lines in a tinted card. It is a
#  row: who assessed you and when, what they set, and then the three things
#  the interview left behind — the recording with its length, the transcript,
#  and the scenes — each named, each with its own mark, so you can see what
#  is kept rather than read a sentence about it.
# ==========================================================================
OLD_PAST = """  ${(f.enrolled||f.complete||!f.pred)?`
  <div class="sec tint">
    <div class="sec-h"><h2>Past interviews</h2></div>
    <div class="tile-stack">
      ${f.complete?`<button class="tile clk arrow" data-go="report" data-iv="re">
        <div class="t-label-01" style="color:var(--text-secondary)">Re-interview · Nov 21, 2026</div>
        <h3 class="mt3">Priya Nair</h3><div class="sub">Promoted to Explorer &ndash; E4 · 45 min</div>
        <div class="sub">Recording, transcript and 6 scenes</div>
        <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg></button>`:''}
      <button class="tile clk arrow" data-go="report" data-iv="level">
        <div class="t-label-01" style="color:var(--text-secondary)">Level interview · Aug 20, 2026</div>
        <h3 class="mt3">Priya Nair</h3><div class="sub">Confirmed Explorer &ndash; E3 · 45 min · report signed</div>
        <div class="sub">Recording, transcript and 6 scenes</div>
        <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg></button>
    </div>
  </div>`:''}
</div></main>`;
};"""

NEW_PAST = """</div></main>`;
};"""

lit('the old past-interview block goes', OLD_PAST, NEW_PAST)

PAST = """  ${(f.enrolled||f.complete||!f.pred)?`
  <div class="sec">
    <div class="sec-h"><h2>Past interviews</h2><span class="t-helper-01">Kept for 24 months</span></div>
    <div class="ivlist">
      ${f.complete?ivRow('re','Re-interview','November 21, 2026','Promoted to Explorer &ndash; E4','44:06'):''}
      ${ivRow('level','Level interview','August 20, 2026','Confirmed Explorer &ndash; E3','45:12')}
    </div>
  </div>`:''}
"""

# it goes in above the facts band, which is the head of the reference material
lit('past interviews come first',
    """  ${booked?`
  <div class="sec">
    <div class="sec-h"><h2>Scheduled</h2></div>""",
    PAST + """  ${booked?`
  <div class="sec">
    <div class="sec-h"><h2>Scheduled</h2></div>""")

IVROW = """
/* One past interview: who set what, and the three things it left behind. */
function ivRow(kind, label, date, outcome, len){
  const a = AGENTS.priya;
  return `<div class="ivrow" role="button" tabindex="0" data-go="report" data-iv="${kind}">
    <div class="ivrow-h">
      <span class="ivrow-eb">${label} &middot; ${date}</span>
      <span class="ivrow-out">${outcome}</span>
    </div>
    <div class="ivrow-who">
      ${avatar(a,40)}
      <span class="ivrow-wb"><b>${a.n}</b><span>45 minutes &middot; report signed</span></span>
      <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg>
    </div>
    <div class="ivrow-kit">
      <span class="kit"><span class="kit-ic">${I.play}</span><span class="kit-b"><b>Recording</b><span>${len} &middot; video and audio</span></span></span>
      <span class="kit"><span class="kit-ic">${I.document}</span><span class="kit-b"><b>Transcript</b><span>Searchable, full text</span></span></span>
      <span class="kit"><span class="kit-ic">${I.video}</span><span class="kit-b"><b>6 scenes</b><span>Marked by ${a.n.split(' ')[0]}</span></span></span>
    </div>
  </div>`;
}
"""

lit('the past-interview row', '\nfunction render(){', IVROW + '\nfunction render(){')


# ==========================================================================
#  THE AWARDS HAVE FACES
#  Points, badges and ranks were drawn with the same three utility glyphs —
#  a tick, a minus, a padlock — so a Gold badge and a daily sign-in looked
#  identical. The client's own artwork replaces them: the coin stack for
#  points, the four shields for the badges, the three medallions for the
#  ranks. A mark you have not earned is the same artwork, desaturated and
#  held back, so the set still reads as one ladder.
# ==========================================================================
OLD_AW = """function awardRow({name,desc,val,state,when,pct,tone}){
  const neg = val<0;
  return `<div class="aw ${state}">
    <span class="aw-ic"${tone?` style="color:${tone}"`:''}>${state==='got'?I.checkFilled:(neg?I.subtract:I.locked)}</span>"""

NEW_AW = """function awardRow({name,desc,val,state,when,pct,tone,art}){
  const neg = val<0;
  const mark = art
    ? `<span class="aw-art"><img src="${AWARD[art]}" alt="" loading="lazy"></span>`
    : `<span class="aw-ic"${tone?` style="color:${tone}"`:''}>${state==='got'?I.checkFilled:(neg?I.subtract:I.locked)}</span>`;
  return `<div class="aw ${state}${art?' has-art':''}">
    ${mark}"""

lit('an award carries its artwork', OLD_AW, NEW_AW)

lit('points carry the coin',
    """  return [...got,...rest].map(({r,i})=>awardRow({
    name:r.n, desc:r.d, val:r.v,
    state:g.got.includes(i)?'got':'not', when:g.last[i]
  })).join('');""",
    """  return [...got,...rest].map(({r,i})=>awardRow({
    name:r.n, desc:r.d, val:r.v, art:'points',
    state:g.got.includes(i)?'got':'not', when:g.last[i]
  })).join('');""")

lit('badges carry their shields',
    """    return awardRow({name:b.n, desc:b.d, val:b.v, state:got?'got':'not', tone:got?b.c:null,
      when:'11/06/2026', pct: got?undefined:(b.need?Math.min(99,Math.round(g.pts/b.need*100)):0)});""",
    """    return awardRow({name:b.n, desc:b.d, val:b.v, state:got?'got':'not', art:BDG_ART[i],
      when:'11/06/2026', pct: got?undefined:(b.need?Math.min(99,Math.round(g.pts/b.need*100)):0)});""")

lit('ranks carry their medallions',
    """  return RANKS.map((r,i)=>awardRow({name:r.n, desc:r.d, val:r.v, tone:i<g.rank?'#b28600':null,
    state:i<g.rank?'got':'not', when:'07/23/2026', pct:i<g.rank?undefined:0})).join('');""",
    """  return RANKS.map((r,i)=>awardRow({name:r.n, desc:r.d, val:r.v, art:'rank'+(i+1),
    state:i<g.rank?'got':'not', when:'07/23/2026', pct:i<g.rank?undefined:0})).join('');""")

lit('the award artwork table',
    '\nfunction awardRow(',
    """
/* The client's own award artwork, embedded at build time. Lossless-enough
   WebP at 160px: these are read at 40-56px and never printed. */
const BDG_ART = ['bronze','silver','gold','involved'];

function awardRow(""")

# the score card's rank line takes the medallion too
lit('the score card shows the rank medallion',
    """      <div class="score-rank"><div class="n">${RANKS[g.rank-1].n}</div><div class="l">${g.badges} of 4 badges</div></div>""",
    """      <div class="score-rank"><div class="n"><img class="rank-mk" src="${AWARD['rank'+g.rank]}" alt="">${RANKS[g.rank-1].n}</div><div class="l">${g.badges} of 4 badges</div></div>""")


# ==========================================================================
#  THE COHORT DISCUSSION IS A ROOM
#  Discussion was a list of posts with reply counts — a forum. A cohort of
#  ten people who meet weekly does not write forum posts to each other; they
#  talk. It takes the same shape as Messages, with one difference that
#  matters: everybody is somebody else, so every line is on the left and the
#  face tells you who is speaking. No voice notes here — a room of ten does
#  not want ten people leaving recordings.
#
#  It is also the tab you land on. Members is a directory you consult; the
#  discussion is what is happening.
# ==========================================================================
MEMBERS = """
/* The cohort. Five photographs are available and the group is ten, so the
   faces repeat — a prototype fidelity choice, not a claim about the people. */
const COHORT = [
  ['Maryam Naz','MN','hana','Chapter 13 &middot; active today',true],
  ['Aisha Bello','AB','priya','Active today'],
  ['Daniel Kerr','DK','owen','Active today'],
  ['Sofia Marchetti','SM','lena','Active 2 days ago'],
  ['Ravi Chandran','RC','samuel','Active today'],
  ['Nora Lindqvist','NL','lena','Active 3 days ago'],
  ['James Whitby','JW','owen','Active today'],
  ['Chloe Ferreira','CF','priya','Active 5 days ago'],
  ['Tobias Mensah','TM','samuel','Active 8 days ago'],
  ['Yuki Tanaka','YT','hana','Not active recently']];

/* The room. Everyone is somebody else, so everything sits on the left. */
const ROOM = [
  ['day','Yesterday'],
  ['Daniel Kerr','owen','DK','Did anyone else find chapter 4 harder than the three before it? I have read the handover section twice.','4:12 PM'],
  ['Aisha Bello','priya','AB','Yes. It is the first one that asks you to change something at work rather than understand something.','4:31 PM'],
  ['Maryam Naz','hana','MN','I took a piece of work back off someone this week and could not explain why. That is the whole chapter, I think.','7:02 PM',true],
  ['day','Today'],
  ['Ravi Chandran','samuel','RC','Priya said on the call that the handover is where it fails, not the work. That helped me.','8:40 AM'],
  ['Sofia Marchetti','lena','SM','Bringing my example on Thursday. Mine is a vendor review that went badly and I still think I was right to take it back.','9:15 AM']];

function roomLine(name, img, ini, body, when, mine){
  return `<div class="m them">
    <span class="m-av">${avatar({i:ini, img:AV[img]}, 32)}</span>
    <div class="m-c">
      <div class="m-b">${body}</div>
      <div class="m-w">${mine ? 'You' : name} &middot; ${when}</div>
    </div>
  </div>`;
}

function discussionRoom(){
  return `<div class="msgs room">
    ${ROOM.map(r => r[0] === 'day'
      ? `<div class="m-day"><span>${r[1]}</span></div>`
      : roomLine(r[0], r[1], r[2], r[3], r[4], r[5])).join('')}
  </div>
  <div class="composer room-composer">
    <span class="composer-star">${I.ai}</span>
    <input class="inp" placeholder="Say something to Cohort 41" aria-label="Message the cohort">
    <button class="composer-act" aria-label="Attach a file">${I.attachment}</button>
    <button class="composer-send" aria-label="Send">${I.send}</button>
  </div>`;
}
"""

lit('the cohort room', '\nfunction render(){', MEMBERS + '\nfunction render(){')

# a member is a face
lit('a member is a face',
    """function mem(name,ini,meta,you){
  return `<div class="mem">
    <span class="mem-av"${you?' style="background:var(--brand-primary);color:var(--on-brand)"':''}>${ini}</span>""",
    """function mem(name,ini,meta,you,img){
  return `<div class="mem">
    <span class="mem-av mem-ph">${avatar({i:ini, img:AV[img||'priya']}, 36)}</span>""")

OLD_LIST = """    ${S.ctab==='discussion'? discussionList() : `<div class="tile-stack">
      ${mem('Maryam Naz','MN','Chapter '+(f.open+1)+' · active today',true)}
      ${mem('Aisha Bello','AB','Active today')}
      ${mem('Daniel Kerr','DK','Active today')}
      ${mem('Sofia Marchetti','SM','Active 2 days ago')}
      ${mem('Ravi Chandran','RC','Active today')}
      ${mem('Nora Lindqvist','NL','Active 3 days ago')}
      ${mem('James Whitby','JW','Active today')}
      ${mem('Chloe Ferreira','CF','Active 5 days ago')}
      ${mem('Tobias Mensah','TM','Active 8 days ago')}
      ${mem('Yuki Tanaka','YT','Not active recently')}
    </div>`}"""

NEW_LIST = """    ${S.ctab==='members'
      ? `<div class="tile-stack">${COHORT.map(([n,i,img,meta,you])=>mem(n,i,meta,you,img)).join('')}</div>`
      : discussionRoom()}"""

lit('the members list carries faces', OLD_LIST, NEW_LIST)

# discussion is the first tab, and the one you land on
lit('discussion comes first',
    """      <button class="${S.ctab!=='discussion'?'on':''}" data-ctab="members">Members</button>
      <button class="${S.ctab==='discussion'?'on':''}" data-ctab="discussion">Discussion</button>""",
    """      <button class="${S.ctab!=='members'?'on':''}" data-ctab="discussion">Discussion</button>
      <button class="${S.ctab==='members'?'on':''}" data-ctab="members">Members</button>""")

lit('discussion is the default tab',
    "rtab:'points', ctab:'members',",
    "rtab:'points', ctab:'discussion',")

# no Tal chip above the room either
lit('no Tal chip above the cohort tabs',
    """    <div class="mb5">${askChip('What should I say on Thursday&rsquo;s call?','Ask Tal about the call')}</div>
""", '')

# ==========================================================================
#  THE COHORT LEADERBOARD
#  A third tab. Ten people at the same level, ranked by what they have
#  actually done — points, badges earned, star rank — with the candidate's
#  own row marked wherever it falls. It is a standing, not a competition:
#  every row says what got that person there, so the number is explicable.
# ==========================================================================
BOARD = """
/* The cohort standing. Points, badges earned and star rank per member;
   the candidate's own row is marked wherever it lands. */
const BOARD = [
  ['Aisha Bello','AB','priya',   3420, 1, 2],
  ['Ravi Chandran','RC','samuel',2980, 1, 2],
  ['Daniel Kerr','DK','owen',    2610, 1, 1],
  ['James Whitby','JW','owen',   2240, 0, 1],
  ['Maryam Naz','MN','hana',     1095, 0, 1, true],
  ['Sofia Marchetti','SM','lena',1040, 0, 1],
  ['Chloe Ferreira','CF','priya',  920, 0, 1],
  ['Nora Lindqvist','NL','lena',   780, 0, 1],
  ['Tobias Mensah','TM','samuel',  610, 0, 1],
  ['Yuki Tanaka','YT','hana',      240, 0, 1]];

function boardList(){
  return `<div class="board">
    <div class="brow bhead">
      <span>#</span><span>Member</span><span>Earned</span><span class="num">Points</span>
    </div>
    ${BOARD.map(([n,i,img,pts,bdg,rank,mine],k)=>`<div class="brow${mine?' mine':''}">
      <span class="b-n">${k+1}</span>
      <span class="b-who">${avatar({i, img:AV[img]}, 32)}<span class="b-nm">${mine?'You':n}</span></span>
      <span class="b-earn">
        <span class="b-mk" title="${rank}-Star"><img src="${AWARD['rank'+rank]}" alt="${rank}-Star"></span>
        ${bdg?`<span class="b-mk" title="Bronze"><img src="${AWARD.bronze}" alt="Bronze"></span>`:''}
        <span class="b-earn-t">${rank}-Star${bdg?' &middot; '+bdg+' badge':''}</span>
      </span>
      <span class="b-pts num">${pts.toLocaleString()}</span>
    </div>`).join('')}
  </div>`;
}
"""

lit('the cohort board', '\nfunction render(){', BOARD + '\nfunction render(){')

lit('three tabs on the cohort page',
    """      <button class="${S.ctab!=='members'?'on':''}" data-ctab="discussion">Discussion</button>
      <button class="${S.ctab==='members'?'on':''}" data-ctab="members">Members</button>""",
    """      <button class="${(S.ctab||'discussion')==='discussion'?'on':''}" data-ctab="discussion">Discussion</button>
      <button class="${S.ctab==='ranking'?'on':''}" data-ctab="ranking">Ranking</button>
      <button class="${S.ctab==='members'?'on':''}" data-ctab="members">Members</button>""")

lit('the ranking tab renders the board',
    """    ${S.ctab==='members'
      ? `<div class="tile-stack">${COHORT.map(([n,i,img,meta,you])=>mem(n,i,meta,you,img)).join('')}</div>`
      : discussionRoom()}""",
    """    ${S.ctab==='members'
      ? `<div class="tile-stack">${COHORT.map(([n,i,img,meta,you])=>mem(n,i,meta,you,img)).join('')}</div>`
      : S.ctab==='ranking' ? boardList() : discussionRoom()}""")


# ==========================================================================
#  THE LINE IS A GRADIENT
#  A single series across thirteen chapters is a journey, and the one place
#  in the product where two brand colours can be used together without
#  competing: the accent at the start, the link blue at the end, drawn along
#  the line itself so the direction of travel is in the colour.
# ==========================================================================
lit('the line takes a gradient',
    """      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${title}">""",
    """      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${title}">
        <defs><linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="var(--dv-grad-a)"/>
          <stop offset="1" stop-color="var(--dv-grad-b)"/>
        </linearGradient></defs>""")

lit('the line is drawn in it',
    """        <path d="${path}" fill="none" stroke="var(--dv-3)" stroke-width="2\"""",
    """        <path d="${path}" fill="none" stroke="url(#g-${id})" stroke-width="2\"""")

lit('and so are its markers',
    """  const dots = pts.map((p,i)=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4"
      fill="var(--dv-3)" stroke="var(--layer-01)" stroke-width="2"/>`).join('');""",
    """  const dots = pts.map((p,i)=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4"
      fill="url(#g-${id})" stroke="var(--background)" stroke-width="2"/>`).join('');""")

# ==========================================================================
#  TAL IS REACHABLE FROM THE CONVERSATION TOO
#  Messages was in the list of views that hide the Tal button, from when the
#  page had a suggestion chip of its own. The chip is gone; the button comes
#  back. And at desktop it is not a mystery circle — it says who it is.
# ==========================================================================
lit('Tal is reachable from messages',
    "(['messages','agent','terms'].includes(S.view)?'':talFab())",
    "(['terms'].includes(S.view)?'':talFab())")

lit('the Tal button says Tal',
    """const talFab = () => `<button class="tal-fab" data-toggle="tal" aria-label="Ask Tal">${I.ai}</button>`;""",
    """const talFab = () => `<button class="tal-fab" data-toggle="tal" aria-label="Ask Tal">${I.ai}<span class="tal-fab-t">Tal</span></button>`;""")


# the reading beside the plot gets a bar per row, so thirteen numbers read as
# a shape rather than as a column of digits
lit('the chart table has bars',
    """    <div class="chart-table">${data.map((v,i)=>`<div class="kv"><span class="k">${labels[i]}</span><span class="v n">${v}${unit}</span></div>`).join('')}</div>
    <div class="mt4"><button class="btn btn-g btn-sm noic" data-tbl="${id}" style="padding-left:0">View as a table</button></div>
  </div>`;
}""",
    """    <div class="chart-table ct-bars">${data.map((v,i)=>`<div class="kv" style="--p:${Math.round((v-min)/(max-min)*100)}%"><span class="k">${labels[i]}</span><span class="ct-bar"><i></i></span><span class="v n">${v}${unit}</span></div>`).join('')}</div>
    <div class="mt4"><button class="btn btn-g btn-sm noic" data-tbl="${id}" style="padding-left:0">View as a table</button></div>
  </div>`;
}""")


# ==========================================================================
#  THE STACKED CHART READS DOWN, NOT ACROSS
#  Four series over thirteen weeks does not fit a side column: the reading
#  came out as a run-on sentence per week — "Video 22 · Reading 10 · Roleplay
#  14 · Assessment 6 · 52 min" — wrapped to two lines, thirteen times. It is
#  a table with five columns, and it belongs under the plot where it has the
#  full width of the page to be one.
# ==========================================================================
lit('the stacked reading is a table',
    """    <div class="chart-table">
      ${weeks.map((t,i)=>`<div class="kv"><span class="k">Week ${i+1}</span><span class="v n">${
        segsOf(t).map((v,k)=>SERIES[k][0]+' '+v).join(' · ')} · ${t} min</span></div>`).join('')}
    </div>""",
    """    <div class="chart-table sc-table">
      <div class="sc-row sc-head">
        <span>Week</span>${SERIES.map(([nm])=>`<span class="num">${nm}</span>`).join('')}<span class="num">Total</span>
      </div>
      ${weeks.map((t,i)=>`<div class="sc-row">
        <span class="sc-w">Week ${i+1}</span>${
        segsOf(t).map(v=>`<span class="num">${v}</span>`).join('')}<span class="num sc-t">${t} min</span>
      </div>`).join('')}
    </div>""")

lit('the stacked chart stacks',
    """  return `<div class="chart" id="${id}">
    <div class="chart-head"><span class="t">${title}</span><span class="s">${sub}</span></div>
    <div class="sc-plot">""",
    """  return `<div class="chart chart-stacked" id="${id}">
    <div class="chart-head"><span class="t">${title}</span><span class="s">${sub}</span></div>
    <div class="sc-plot">""")

# ==========================================================================
#  A FULL-BLEED PLATE
#  The dark call to action is a band of the column, like the certificate: its
#  fill runs rule to rule and pays the gutter back as padding, so the words
#  inside it start exactly where every other line on the page starts.
# ==========================================================================
lit('the due-now plate is a band',
    """      <div class="tile" style="background:var(--gray-100);color:#fff;border-color:var(--gray-100)">
        <div class="t-label-01" style="color:var(--gray-40)">Due now</div>
        <div class="t-heading-03 mt3" style="color:#fff">Book your re-interview</div>
        <div class="t-body-01 mt3" style="color:var(--gray-30)">Your ninety days are complete. The re-interview decides whether you move up to E4, hold at E3, or drop back to E2.</div>
        <div class="mt5"><button class="btn btn-p btn-sm noic" data-go="agents" style="justify-content:center">Choose an agent</button></div>
      </div>""",
    """      <div class="plate">
        <div class="plate-eb">Due now</div>
        <div class="plate-t">Book your re-interview</div>
        <div class="plate-b">Your ninety days are complete. The re-interview decides whether you move up to E4, hold at E3, or drop back to E2.</div>
        <div class="plate-a"><button class="btn btn-p btn-sm noic" data-go="agents">Choose an agent ${I.arrowRight}</button></div>
      </div>""")


# ==========================================================================
#  STANDING COMES BEFORE HOUSEKEEPING
#  Points was the last thing on the dashboard, under the week's work — so the
#  one number that measures the whole ninety days was the one you had to
#  scroll for. It moves up, directly under Tal, and it stops being a single
#  bar: points, badges and rank are three separate things and they read as
#  three blocks, each with its own mark.
#
#  When the course is finished, "Your course" says only that it is finished,
#  which the header above it already says. It goes.
# ==========================================================================
OLD_PTS = """    <div class="sec">
      <div class="sec-h"><h2>Points</h2><a data-go="rewards">Badges and rank</a></div>
      <button class="score-link" data-go="rewards">${scoreCard(g)}</button>
    </div>
"""
lit('points leaves the foot of the dashboard', OLD_PTS, '')

STAND = """  ${g?`<div class="sec">
    <div class="sec-h"><h2>Where you stand</h2><a data-go="rewards">Points, badges and rank</a></div>
    ${standRow(g)}
  </div>`:''}
"""

lit('standing comes up the page',
    """    <div class="sec tint">
      <div class="sec-h"><h2>${f.finished?'Your course':'This week'}</h2><a data-go="coursework">Coursework</a></div>""",
    STAND + """    <div class="sec tint">
      <div class="sec-h"><h2>${f.finished?'Your course':'This week'}</h2><a data-go="coursework">Coursework</a></div>""")

OLD_WEEK = '    <div class="sec tint">\n      <div class="sec-h"><h2>${f.finished?\'Your course\':\'This week\'}</h2><a data-go="coursework">Coursework</a></div>\n      <div class="tile-stack">\n        ${f.finished?`<button class="tile clk arrow" data-go="coursework">\n          <div class="t-label-01" style="color:var(--text-secondary)">All 13 chapters</div>\n          <h3 class="mt3">Course complete</h3><div class="sub">87% average · 11h 40m invested</div>\n          <svg class="tile-arrow" viewBox="0 0 24 24">${inner(\'arrowRight\')}</svg></button>`:`\n        <button class="tile clk arrow" data-go="chapter:${f.open}">\n          <div class="t-label-01" style="color:var(--text-secondary)">Chapter ${f.open+1} · ${S.stage===\'week1\'?\'unlocked today\':\'in progress\'}</div>\n          <h3 class="mt3">${CH[f.open][0]}</h3>\n          <div class="pb mt4" style="margin-bottom:0"><div class="pb-track sm"><div class="pb-fill" style="width:${stalling?17:0}%"></div></div></div>\n          <div class="sub mt3">${stalling?\'12 of 70\':\'0 of \'+CH[f.open][1]} minutes</div>\n          <svg class="tile-arrow" viewBox="0 0 24 24">${inner(\'arrowRight\')}</svg></button>`}\n        ${f.finished?\'\':`<button class="tile clk arrow wcall" data-go="cohort">\n          <span class="wcall-d"><b>Thu</b><span>6:00 PM</span></span>\n          <span class="wcall-b">\n            <span class="t-label-01">Weekly call &middot; in 2 days</span>\n            <span class="wcall-t">Cohort 41, week ${f.week||5}</span>\n            <span class="wcall-who">${avatar(AGENTS.priya,22)}<span>Priya Nair and 9 others &middot; 60 minutes</span></span>\n          </span>\n          <svg class="tile-arrow" viewBox="0 0 24 24">${inner(\'arrowRight\')}</svg></button>`}\n      </div>\n    </div>\n'
NEW_WEEK = '    ${f.finished?\'\':`<div class="sec tint">\n      <div class="sec-h"><h2>${f.finished?\'Your course\':\'This week\'}</h2><a data-go="coursework">Coursework</a></div>\n      <div class="tile-stack">\n        ${f.finished?`<button class="tile clk arrow" data-go="coursework">\n          <div class="t-label-01" style="color:var(--text-secondary)">All 13 chapters</div>\n          <h3 class="mt3">Course complete</h3><div class="sub">87% average · 11h 40m invested</div>\n          <svg class="tile-arrow" viewBox="0 0 24 24">${inner(\'arrowRight\')}</svg></button>`:`\n        <button class="tile clk arrow" data-go="chapter:${f.open}">\n          <div class="t-label-01" style="color:var(--text-secondary)">Chapter ${f.open+1} · ${S.stage===\'week1\'?\'unlocked today\':\'in progress\'}</div>\n          <h3 class="mt3">${CH[f.open][0]}</h3>\n          <div class="pb mt4" style="margin-bottom:0"><div class="pb-track sm"><div class="pb-fill" style="width:${stalling?17:0}%"></div></div></div>\n          <div class="sub mt3">${stalling?\'12 of 70\':\'0 of \'+CH[f.open][1]} minutes</div>\n          <svg class="tile-arrow" viewBox="0 0 24 24">${inner(\'arrowRight\')}</svg></button>`}\n        ${f.finished?\'\':`<button class="tile clk arrow wcall" data-go="cohort">\n          <span class="wcall-d"><b>Thu</b><span>6:00 PM</span></span>\n          <span class="wcall-b">\n            <span class="t-label-01">Weekly call &middot; in 2 days</span>\n            <span class="wcall-t">Cohort 41, week ${f.week||5}</span>\n            <span class="wcall-who">${avatar(AGENTS.priya,22)}<span>Priya Nair and 9 others &middot; 60 minutes</span></span>\n          </span>\n          <svg class="tile-arrow" viewBox="0 0 24 24">${inner(\'arrowRight\')}</svg></button>`}\n      </div>\n    </div>`}\n'
lit('a finished course has no week block', OLD_WEEK, NEW_WEEK)

STANDROW = """
/* Three standings, three marks. Points is a number moving toward a target,
   badges are a count out of four, rank is where those two put you. */
function standRow(g){
  const nb = nextBadge(g.pts);
  const prev = [0,2500,5000,10000].filter(x=>x<=g.pts).pop();
  const pct = nb ? Math.round((g.pts-prev)/(nb.need-prev)*100) : 100;
  const bdgArt = ['bronze','silver','gold','involved'][Math.max(0, Math.min(3, g.badges-1))];
  return `<div class="stand">
    <button class="stand-c" data-go="rewards">
      <span class="stand-mk"><img src="${AWARD.points}" alt=""></span>
      <span class="stand-b">
        <span class="stand-l">Points</span>
        <span class="stand-v">${g.pts.toLocaleString()}</span>
        <span class="stand-d">${nb ? (nb.need-g.pts).toLocaleString()+' to '+nb.n : 'Every badge earned'}</span>
        <span class="stand-bar"><i style="width:${pct}%"></i></span>
      </span>
    </button>
    <button class="stand-c" data-go="rewards">
      <span class="stand-mk${g.badges?'':' none'}"><img src="${AWARD[bdgArt]}" alt=""></span>
      <span class="stand-b">
        <span class="stand-l">Badges</span>
        <span class="stand-v">${g.badges} <small>of 4</small></span>
        <span class="stand-d">${g.badges ? BDG[g.badges-1].n+' earned' : 'Bronze at 2,500 points'}</span>
      </span>
    </button>
    <button class="stand-c" data-go="rewards">
      <span class="stand-mk"><img src="${AWARD['rank'+g.rank]}" alt=""></span>
      <span class="stand-b">
        <span class="stand-l">Rank</span>
        <span class="stand-v">${RANKS[g.rank-1].n}</span>
        <span class="stand-d">${g.rank<3 ? RANKS[g.rank].d : 'The top of the ladder'}</span>
      </span>
    </button>
  </div>`;
}
"""

lit('the standing row', '\nfunction render(){', STANDROW + '\nfunction render(){')


# ==========================================================================
#  NO SINGLE FAILURE BLANKS THE PAGE
#  render() runs three post-passes over the DOM. If any of them throws — and
#  writing into an iframe is exactly the kind of thing a browser can refuse
#  under a file:// origin — the exception escapes render() and the app stops
#  mid-paint with nothing on screen. A prototype that has to open by
#  double-click on somebody else's machine cannot have that failure mode:
#  each pass is isolated, and a pass that fails costs only its own feature.
# ==========================================================================
lit('the post-render passes are isolated',
    "  talFirst();\n  enhanceTalCards();\n  mountLsvt();\n",
    "  for(const pass of [talFirst, enhanceTalCards, mountLsvt]){\n"
    "    try { pass(); } catch(e) { console.warn('pass failed:', e); }\n"
    "  }\n")


# the interview transcript is a destination of its own
lit('the transcript view is reachable',
    "'chapter','terms','rewards']",
    "'chapter','terms','rewards','ivt']")

# and the report's transcript button goes to the interview, not the course record
lit('read the transcript opens the interview',
    """<button class="btn btn-t btn-sm" data-go="transcript">Read the transcript ${I.document}</button>""",
    """<button class="btn btn-t btn-sm" data-go="ivt" data-iv="${S.iv}">Read the transcript ${I.document}</button>""")

lit('the kit cells open what they name',
    """      <span class="kit"><span class="kit-ic">${I.document}</span><span class="kit-b"><b>Transcript</b><span>Searchable, full text</span></span></span>""",
    """      <button class="kit kit-go" data-ivt="${kind}"><span class="kit-ic">${I.document}</span><span class="kit-b"><b>Transcript</b><span>Searchable, full text</span></span></button>""")


# what Tal knows is a destination, and it belongs in Profile beside the
# other switches that govern what the product may do with you
lit('the memory view is reachable',
    "'chapter','terms','rewards','ivt']",
    "'chapter','terms','rewards','ivt','mem']")

lit('profile links to what Tal knows',
    """    <label class="tg"><div class="tb"><b>What Tal can see</b><span>Your course progress and your notes. Never your messages.</span></div><input type="checkbox" checked><span class="sw"></span></label>""",
    """    <label class="tg"><div class="tb"><b>What Tal can see</b><span>Your course progress and your notes. Never your messages.</span></div><input type="checkbox" checked><span class="sw"></span></label>
""")


# practice is a destination
lit('practice is reachable',
    "'chapter','terms','rewards','ivt','mem']",
    "'chapter','terms','rewards','ivt','mem','rp']")

# and the chapter's Roleplay stage is the practice room, not a line in a table
lit('the roleplay stage opens the practice room',
    """      <div class="kv"><span class="k">Roleplay</span><span class="v n">${done?'Complete':'Not started'}</span></div>""",
    """      <div class="kv"><span class="k">Roleplay</span><span class="v n"><button class="lnk" data-go="rp">${done?'Complete &middot; run it again':'Practice with Tal'}</button></span></div>""")


# ==========================================================================
#  NEXT UP IS A PLATE
#  Same construction as the certificate and the due-now block: the fill runs
#  rule to rule, the content sits on the left with the person's face against
#  it, and the actions close the bottom right. The Join button takes the
#  accent — it is the one thing on a dark plate that has to be found.
# ==========================================================================
OLD_NEXT = """      <div class="tile" style="background:var(--surface-dark);color:var(--on-dark);border-color:var(--surface-dark)">
        <div class="t-label-01" style="color:var(--on-dark-2)">Next up</div>
        <div class="t-heading-03 mt3" style="color:var(--on-dark)">Interview with Priya Nair</div>
        <div class="t-body-01 mt3" style="color:var(--on-dark-2)">Thursday, August 20 at 6:30 PM ET · 45 minutes, recorded</div>
        <div class="mt5" style="display:flex;gap:1px">
          <button class="btn btn-sm noic" class="btn btn-p btn-sm noic" style="flex:1;justify-content:center">Join</button>
          <button class="btn btn-sm noic" data-go="interviews" style="flex:1;justify-content:center;background:var(--surface-dark-2);color:var(--on-dark)">Reschedule</button>
        </div>
      </div>"""

NEW_NEXT = """      <div class="plate">
        <div class="plate-who">${avatar(AGENTS.priya,56)}
          <span class="plate-wb"><b>Priya Nair</b><span>Talent agent &middot; assesses Explorer</span></span>
        </div>
        <div class="plate-eb">Next up</div>
        <div class="plate-t">Your level interview</div>
        <div class="plate-b">Thursday, August 20 at 6:30 PM ET &middot; 45 minutes, recorded</div>
        <div class="plate-a">
          <button class="btn btn-p btn-sm noic">Join ${I.video}</button>
          <button class="btn btn-sm noic plate-b2" data-go="interviews">Reschedule</button>
        </div>
      </div>"""

lit('next up is a plate', OLD_NEXT, NEW_NEXT)


# ==========================================================================
#  YOU ARE HERE SITS ON THE LINE IT BELONGS TO
#  It was pushed to the bottom of a stretched cell, which gave the whole
#  first row of the track band a band of empty black under it. It belongs on
#  the same baseline as the description it is qualifying — the cell is then
#  as tall as its content and nothing else.
# ==========================================================================
lit('you are here shares the description line',
    """        <span class="path-n">${name}</span>
        <span class="path-w">${WHAT[i]}</span>
        ${i===at?'<span class="path-you">You are here</span>':''}""",
    """        <span class="path-n">${name}</span>
        <span class="path-l"><span class="path-w">${WHAT[i]}</span>${i===at?'<span class="path-you">You are here</span>':''}</span>""")


# ==========================================================================
#  THE DASHBOARD IS ORDERED BY WHAT YOU DO WITH IT
#  Tal, then the one thing you tell it, then the appointment, then where you
#  stand, then the week's work — and the charts after all of that, because a
#  reading is something you consult rather than something you act on. The
#  overdue note goes: it repeated what the Tal card at the top already says,
#  in a colour that made a late reflection look like an outage.
# ==========================================================================
def _reorder_dashboard():
    global js
    try:
        i = js.index('  ${g?`<div class="sec">\n    <div class="sec-h"><h2>Where you stand</h2>')
        j = js.index("`:''}\n", i) + len("`:''}\n")
        stand = js[i:j]
        k = js.index('    ${f.finished?\'\':`<div class="sec tint">')
        l = js.index('    </div>`}\n', k) + len('    </div>`}\n')
        week = js[k:l]
        m2 = js.index('    ${stalling?`<div class="sec"><div class="note warn">')
        n2 = js.index('</div></div>`:\'\'}\n', m2) + len('</div></div>`:\'\'}\n')
    except ValueError:
        missed.append('dashboard order'); return
    call = """    ${f.finished?'':`<div class="sec">
      <div class="callband">
        <div class="callband-d"><b>Thu</b><span>6:00 PM</span><span class="callband-tz">ET</span></div>
        <div class="callband-b">
          <div class="t-label-01">Weekly call &middot; in 2 days</div>
          <div class="callband-t">Cohort 41, week ${f.week||5}</div>
          <div class="callband-who">${avatar(AGENTS.priya,24)}<span>Led by Priya Nair &middot; 9 others &middot; 60 minutes</span></div>
        </div>
        <div class="callband-act"><button class="btn btn-p btn-sm noic" data-go="cohort">Open the cohort ${I.arrowRight}</button></div>
      </div>
    </div>`}
"""
    anchor = '    <div class="sec" style="padding-bottom:var(--s06)">${progressStrip(f)}</div>\n'
    out = js[:m2] + js[n2:]
    out = out.replace(week, '').replace(stand, '')
    out = out.replace(anchor, call + stand + week + anchor)
    out = out.replace('<a data-go="rewards">Points, badges and rank</a>',
                      '<a data-go="rewards">View more</a>')
    js = out
    applied.append('dashboard order (1)')

_reorder_dashboard()


# the weekly call now sits at the top of the dashboard, so This week carries
# the week's course work and nothing else
def _week_is_coursework():
    global js
    try:
        i = js.index('<button class="tile clk arrow wcall" data-go="cohort">')
        start = js.rindex('${', 0, i)
        end = js.index('</svg></button>`}', i) + len('</svg></button>`}')
    except ValueError:
        missed.append('week is coursework'); return
    js = js[:start] + js[end:]
    applied.append('week is coursework (1)')

_week_is_coursework()

# all agents: a heading, one sentence telling you what to do, then the search
lit('all agents drops the sort caption',
    '<div class="sec-h"><h2>All agents</h2><span class="t-helper-01">Soonest first</span></div>',
    '<div class="sec-h"><h2>All agents</h2></div>')
lit('all agents says what to do',
    """<p class="all-desc">Every one of the 24 agents who can assess ${f.pred?'the Explorer track':'your level'}, with their next free slot and their fee. Search by name, by the levels they assess, or by when they are free.</p>""",
    '<p class="all-desc">Select an agent from whom you want to be interviewed.</p>')


# the one action on Saved cards sits in its heading row, in black, at the end
lit('add a card joins the heading row',
    '<div class="sec-h"><h2>Saved cards</h2><span class="t-helper-01">${S.cards.length} of 3</span></div>',
    '<div class="sec-h"><h2>Saved cards</h2><span class="t-helper-01">${S.cards.length} of 3</span>${S.cards.length<3?`<button class="btn btn-p btn-sm noic sec-h-act" data-addcard="1">Add a card ${I.add}</button>`:\'\'}</div>')
lit('and leaves the foot of the list',
    """    ${S.cards.length<3?`<div class="mt5"><button class="btn btn-t" data-addcard="1">Add a card ${I.add}</button></div>`
      :`<p class="t-helper-01 mt4">Three cards is the maximum. Remove one to add another.</p>`}
""",
    """    ${S.cards.length<3?\'\':`<p class="t-helper-01 mt4">Three cards is the maximum. Remove one to add another.</p>`}
""")

# the address is not editable, so the editor does not pretend it is
lit('the editor does not offer the address',
    '        <div class="f"><label for="pe">Email address</label><input class="inp" id="pe" value="maryam.naz@tkxel.io"></div>\n',
    '')


# ==========================================================================
#  CLOSING THE ACCOUNT, AND OPENING A DOOR
#  "Withdraw consent" was a euphemism: what the button did was close the
#  account, and the note underneath had to explain that. It says what it
#  does. It asks first, because it cannot be undone — and logging out sits
#  under it, where the smaller of the two exits belongs.
#
#  And the thing the wireframe had that the product did not: a candidate can
#  volunteer to lead a cohort below their own level. It is the one place the
#  product asks something of the person rather than the other way round.
# ==========================================================================
OLD_END = """    <div class="note err"><span>${I.warning}</span><div class="nb"><b>Withdrawing consent closes your account</b>Interviews cannot be assessed without a recording. Your certificates stay valid and downloadable.</div></div>
    <div class="btn-set mt5">
      <button class="btn btn-t">Withdraw consent ${I.misuse}</button>
      <button class="btn btn-g" data-go="stage:signup/login">Log out ${I.logout}</button>
    </div>
  </div>
</div></main>`;"""

NEW_END = """    <div class="lead-b">
      <div class="lead-eb">Give back &amp; grow</div>
      <div class="lead-t">Become a cohort leader</div>
      <div class="lead-x">Volunteer to guide a cohort through the ninety days. It is unpaid &mdash; what you get back is a recognised cohort-leader certification, and the growth that comes from teaching what you have already learned. You can only lead cohorts at a level below your own, so you are always a step ahead of the people you are mentoring.</div>
      <div class="lead-tags"><span>Volunteer role</span><span>Earns a certification</span><span>Teaches below ${lvlName(f.level)}</span></div>
      <div class="lead-a">${S.ledApplied
        ? `<button class="btn btn-p btn-sm noic" disabled>Request sent ${I.checkFilled}</button>`
        : `<button class="btn btn-p btn-sm noic" data-leadapply="1">Apply to lead a cohort ${I.arrowRight}</button>`}</div>
      ${S.ledApplied?`<div class="lead-ok">${I.checkFilled}<span>Your request is with the TalentNext team. They review applications weekly and will email you either way.</span></div>`:''}
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>Closing your account</h2></div>
    <p class="t-body-01" style="color:var(--text-secondary);max-width:68ch">Deleting your account removes your profile, your notes and your interview recordings. Certificates you have already earned stay valid and stay downloadable.</p>
    <div class="btn-set mt5">
      <button class="btn btn-t danger" data-del="1">Delete my account ${I.misuse}</button>
    </div>
    <div class="mt5"><button class="btn btn-g" data-go="stage:signup/login">Log out ${I.logout}</button></div>
  </div>
</div></main>
${S.delAsk?`<div class="modal" data-del="0">
  <div class="sheet sheet-c" role="dialog" aria-modal="true" aria-label="Delete your account">
    <div class="sheet-h"><h2>Delete your account?</h2><button class="x" data-del="0" aria-label="Close">${I.close}</button></div>
    <div class="sheet-b">
      <div class="note err"><span>${I.warning}</span><div class="nb"><b>This cannot be undone</b>Your profile, your notes and every interview recording are deleted. Your certificates stay valid and downloadable from the link in your email.</div></div>
      <div class="f mt5"><label for="delc">Type DELETE to confirm</label><input class="inp" id="delc" placeholder="DELETE" autocomplete="off"></div>
    </div>
    <div class="sheet-f">
      <button class="btn btn-s noic" data-del="0">Keep my account</button>
      <button class="btn btn-p noic danger" data-delgo="1">Delete everything</button>
    </div>
  </div>
</div>`:''}`;"""

lit('closing the account, and leading a cohort', OLD_END, NEW_END)


lit('a wired tab is not swallowed by the strip handler',
    "  const cs = t.closest('.cs button');   if(cs){ cs.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('on')); cs.classList.add('on'); return; }",
    "  /* A tab that carries data-ctab / data-rtab changes what is RENDERED, so it\n     must not be intercepted by the generic strip handler below it — that one\n     only moves the `.on` class and returns, which is why the cohort tabs\n     highlighted but never switched. It handles unwired strips only. */\n  const cs = t.closest('.cs button:not([data-ctab]):not([data-rtab])');\n  if(cs){ cs.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('on')); cs.classList.add('on'); return; }")


# ==========================================================================
#  THE FRONT DOOR, FROM THE FILE
#  Figma: TalentNext / Create your account (255:7673) and Verify Your Email
#  Address (257:7784). The desktop composition stops being an app shell with
#  a graphic bolted to one side and becomes one card: the brand on the left,
#  the single thing you have to do on the right, a hairline between them.
#
#  The markup below is the card's anatomy. Everything that positions it is
#  in 17-auth.css; what changes here is what is IN the two columns and in
#  what order, because that is what the file states.
# ==========================================================================

# --- 1. the left column is content now, not an image ----------------------
lit('the brand column replaces the graphic',
    """const AUTH_ART = `
<div class="auth-art" aria-hidden="true"><i class="auth-img"></i></div>`;""",
    """const AUTH_ART = `
<div class="auth-brand">
  <span class="auth-logo"><img src="${LOGO_K}" alt="TalentNext"></span>
  <div class="auth-intro">
    <h2 class="t-heading-01">Welcome to TALENTnext</h2>
    <p class="t-body-02">TalentNext is the AI-native leadership platform that assesses you in real conversation, compounds every interview, chapter and call into a live picture of where you stand, then moves you up the ladder a rung at a time.</p>
    <p class="t-body-02">From here, growth stops being guesswork.</p>
    <p class="t-body-02 auth-begin">Let&rsquo;s begin.</p>
  </div>
  <p class="t-helper-01 auth-foot">&copy; 2026 TALENTnext Limited</p>
</div>
<i class="auth-mark" aria-hidden="true"></i>`;""")

# --- 2. the card is the thing the two columns sit in ----------------------
#  `.auth-col` keeps its name and its contents; what is new is the object
#  around it. Below 900 the card is `display:contents`, so the phone column
#  is the same column it was.
lit('the card wraps the two columns',
    """    html = S.view === 'terms' ? inner
         : AUTH_ART + '<div class="auth-col">' + inner + '</div>';""",
    """    html = S.view === 'terms' ? inner
         : '<div class="auth-card">' + AUTH_ART
           + '<div class="auth-col">' + inner + '</div></div>';""")

# --- 3. create ------------------------------------------------------------
#  Same five blocks the file has, in its order: title, address, password,
#  consents, closing line. The consents lose their heading — in the file
#  they are three lines under the password block, not a section of their
#  own — and the section classes name what each block pays.
OLD_CREATE = r"""create: () => `${authShell()}
<main class="main"><div class="page form-page">
  ${ph('Create your account','You are one step away from your TalentNext account. Set a password to continue.')}
  <div class="sec">
    <div class="f last"><label for="em">Your email address</label>
      <div class="static-row"><div class="inp-static" id="em">maryam.naz@tkxel.io</div><div class="help">From your Next in Leadership profile. <a data-go="terms">Not you?</a></div></div></div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2 class="u-h2">Set a password</h2></div>
    <div class="f-row"><div class="f"><label for="pw">Password</label>
      <div class="pw-wrap"><input class="inp fill" id="pw" type="password" value="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022">
        <button class="pw-eye" data-eye="pw" aria-label="Show password">${I.view}</button></div>
      <ul class="pw-rules">
        <li class="ok">${I.checkFilled}At least 12 characters</li>
        <li class="ok">${I.checkFilled}Upper and lower case</li>
        <li>${I.circle}One number or symbol</li>
      </ul></div>
    <div class="f last"><label for="pw2">Confirm password</label>
      <div class="pw-wrap"><input class="inp fill" id="pw2" type="password" placeholder="Re-enter password">
        <button class="pw-eye" data-eye="pw2" aria-label="Show password">${I.view}</button></div></div></div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2 class="u-h2">Terms and privacy policy</h2></div>
    <div class="cbx-list">
      <label class="cbx"><input type="checkbox" checked><span class="box">${I.check}</span>
        <span class="txt">I accept the <a data-go="terms">Terms of Service</a> and the <a data-go="terms">Privacy Policy</a>.</span></label>
      <label class="cbx"><input type="checkbox" checked><span class="box">${I.check}</span>
        <span class="txt">I consent to my interviews being recorded and transcribed so my agent can assess them and write my report, as set out in the <a data-go="terms">data use notice</a>.</span></label>
      <label class="cbx"><input type="checkbox"><span class="box">${I.check}</span>
        <span class="txt">Send me occasional product and course emails. You can turn this off any time.</span></label>
    </div>
    </div>
  <div class="sec"><div class="foot-row"><div class="mt6"><button class="btn btn-p btn-full" data-go="verify">Create account ${I.arrowRight}</button></div><p class="t-body-02 mt5" style="color:var(--text-secondary)">Already have an account? <a data-go="login">Log in</a></p></div>
  </div>
</div></main>`,"""

NEW_CREATE = r"""create: () => `${authShell()}
<main class="main"><div class="page form-page">
  ${ph('Create your account','You&rsquo;re one step away. Create your password to continue.')}
  <div class="sec sec-id">
    <div class="f last"><label for="em">Your Email Address</label>
      <div class="static-row"><div class="inp-static" id="em">maryam.naz@tkxel.io</div><div class="help">From your NIL profile. <a data-go="terms">Not you?</a></div></div></div>
  </div>
  <div class="sec sec-rule">
    <div class="sec-h"><h2 class="u-h2">Set a Password</h2></div>
    <div class="f-row"><div class="f"><label for="pw">Password</label>
      <div class="pw-wrap"><input class="inp fill" id="pw" type="password" value="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022">
        <button class="pw-eye" data-eye="pw" aria-label="Show password">${I.view}</button></div>
      <ul class="pw-rules">
        <li class="ok">${I.checkFilled}At least 12 characters</li>
        <li class="ok">${I.checkFilled}Upper and lower case</li>
        <li>${I.circle}One number or symbol</li>
      </ul></div>
    <div class="f last"><label for="pw2">Confirm Password</label>
      <div class="pw-wrap"><input class="inp fill" id="pw2" type="password" placeholder="Re-enter password">
        <button class="pw-eye" data-eye="pw2" aria-label="Show password">${I.view}</button></div></div></div>
  </div>
  <div class="sec sec-cbx">
    <div class="cbx-list">
      <label class="cbx"><input type="checkbox" checked><span class="box">${I.check}</span>
        <span class="txt">I accept the <a data-go="terms">Terms of Service</a> and <a data-go="terms">Privacy Policy</a>.</span></label>
      <label class="cbx"><input type="checkbox" checked><span class="box">${I.check}</span>
        <span class="txt">I consent to my interviews being recorded and transcribed.</span></label>
      <label class="cbx"><input type="checkbox"><span class="box">${I.check}</span>
        <span class="txt">Send me occasional product and course emails.</span></label>
    </div>
    </div>
  <div class="sec sec-act"><div class="foot-row"><div class="mt6"><button class="btn btn-p btn-full" data-go="verify">Create Account ${I.arrowRight}</button></div><p class="t-body-02 mt5" style="color:var(--text-secondary)">Already have an account? <a data-go="login">Log in</a></p></div>
  </div>
</div></main>`,"""

lit('create account, to the file', OLD_CREATE, NEW_CREATE)

# --- 4. verify ------------------------------------------------------------
#  The file's version is shorter than the one it replaces: the back control
#  moves inline with the title, the address becomes a labelled block of its
#  own rather than a clause in the description, and the two actions close
#  the card on the same line create's do. The helper about pasting and the
#  "wrong address?" line go: the back arrow is the way back.
OLD_VERIFY = r"""verify: () => `${authShell('create')}
<main class="main"><div class="page form-page" style="padding-bottom:var(--s05)">
  <div class="ph" style="padding-bottom:var(--s05)">
    <h1>Verify your email</h1>
    <p>Six-digit code sent to <b>maryam.naz@tkxel.io</b>. It expires in 10 minutes.</p>
  </div>
  <div class="sec" style="padding-bottom:var(--s05)">
    <label class="lbl" for="otp1">Verification code</label>
    <div class="otp">${[4,9,2,7,1,6].map((d,i)=>`<input value="${d}" size="1" inputmode="numeric" maxlength="1" aria-label="Digit ${i+1}">`).join('')}</div>
    <div class="help" style="margin-top:var(--s03)">Paste the whole code and it will fill itself in.</div>
  </div>
  <div class="sec">
    <div class="otp-act">
      <button class="btn btn-g">Resend code in 0:42 ${I.restart}</button>
      <button class="btn btn-p" data-go="created">Verify and continue ${I.arrowRight}</button>
    </div>
    <p class="t-helper-01 mt4">Wrong address? <a data-go="create">Change it</a> before you verify.</p>
  </div>
</div></main>`,"""

NEW_VERIFY = r"""verify: () => `${authShell('create')}
<main class="main"><div class="page form-page">
  <div class="ph"><div class="ph-main">
    <div class="ph-top"><button class="ph-back" data-go="create" aria-label="Back">${I.arrowLeft}</button><h1>Verify Your Email Address</h1></div>
    <p>Enter the 6 digits code sent to your email address.</p>
  </div></div>
  <div class="sec sec-id">
    <div class="f last"><label for="vem">Sent on</label>
      <div class="static-row"><div class="inp-static" id="vem">maryam.naz@tkxel.io</div></div></div>
  </div>
  <div class="sec sec-rule">
    <div class="sec-h"><h2 class="u-h2">Verification Code</h2></div>
    <div class="otp">${[7,5,2,8,9,1].map((d,i)=>`<input value="${d}" size="1" inputmode="numeric" maxlength="1" aria-label="Digit ${i+1}">`).join('')}</div>
  </div>
  <div class="sec sec-act"><div class="foot-row">
    <div class="mt6"><button class="btn btn-p btn-full" data-go="created">Verify &amp; Continue ${I.arrowRight}</button></div>
    <button class="btn btn-g btn-lead noic">${I.restart}<span>Resend Code in 0:40</span></button>
  </div></div>
</div></main>`,"""

lit('verify your email address, to the file', OLD_VERIFY, NEW_VERIFY)

# --- 5. log in ------------------------------------------------------------
#  The file only draws two of the four screens, but all four are the same
#  object at four moments — so log in takes the same block classes and the
#  same closing line rather than keeping a layout the card no longer has.
lit('log in takes the card blocks',
    """  ${ph('Log in','Enter the email address and password on your TalentNext account.')}
  <div class="sec">
    <div class="f"><label for="lem">Email address</label>""",
    """  ${ph('Log in','Enter the email address and password on your TalentNext account.')}
  <div class="sec sec-rule">
    <div class="f"><label for="lem">Email address</label>""")

lit('log in closes on the same line',
    """  <div class="sec">
    <div class="foot-row"><div><button class="btn btn-p btn-full" data-go="stage:new">Log in ${I.arrowRight}</button></div>""",
    """  <div class="sec sec-act">
    <div class="foot-row"><div><button class="btn btn-p btn-full" data-go="stage:new">Log in ${I.arrowRight}</button></div>""")


lit('log in offers the shorter way out',
    "Do not have an account yet? <a data-go=\"create\">Sign up</a>",
    "Don&rsquo;t have an account? <a data-go=\"create\">Sign up</a>")


# ==========================================================================
#  A CANDIDATE WHO HAS JUST JOINED IS CHOOSING AN AGENT
#  The dashboard's one action was a black button that said "Book your
#  interview" and led to a page of twenty-four strangers. But the decision in
#  front of a new candidate is not WHETHER to book, it is WHO with — and Tal
#  already knows the answer, because it says so one block above: three agents
#  assess at this level and have a slot this week.
#
#  So the button goes and the three agents come to the page. It is the same
#  card the choose-an-agent screen uses, so picking one here and picking one
#  there are the same act, and the section says who ordered them and why.
# ==========================================================================
lit('the top three agents, not a button',
    """    <div class="sec"><button class="btn btn-p" data-go="agents">Book your interview ${I.calendar}</button></div>
    <div class="sec tint">
      <div class="sec-h"><h2>Where you are</h2></div>""",
    """    <div class="sec">
      <div class="sec-h"><h2>Book your interview</h2><a data-go="agents">All 24 agents</a></div>
      <p class="all-desc">Three agents assess Explorer candidates and have a slot inside seven days. Tal ordered them by how their past candidates progressed.</p>
    </div>
    <div class="rail-wrap">
      <div class="rail">${['priya','owen','lena'].map(k=>agentCardH(k)).join('')}</div>
    </div>
    <div class="sec tint">
      <div class="sec-h"><h2>Where you are</h2></div>""")



# ==========================================================================
#  THE DASHBOARD, TIGHTENED
# ==========================================================================

# --- 1. the Tal card stops repeating itself ------------------------------
#  "See the 3 agents" pointed at a page that is now on this page, two blocks
#  down. A link to something already visible is a link to nowhere.
lit('the Tal card no longer links to what is below it',
    """        <div class="ai-foot"><a data-go="agents" class="lk">See the 3 agents</a>
          <span class="sp"><button class="ic" aria-label="Helpful">${I.thumbsUp}</button><button class="ic" aria-label="More">${I.overflow}</button></span></div>""",
    """        <div class="ai-foot noline">
          <button class="btn btn-p btn-sm noic ai-do" data-go="agents">Book an Interview</button>
          <span class="sp"><button class="ic" aria-label="Helpful">${I.thumbsUp}</button><button class="ic" aria-label="More">${I.overflow}</button></span></div>""")

# --- 2. all agents is a control, not a link ------------------------------
lit('view all agents is a button',
    """      <div class="sec-h"><h2>Book your interview</h2><a data-go="agents">All 24 agents</a></div>""",
    """      <div class="sec-h"><h2>Book your interview</h2><button class="btn btn-g btn-sm noic" data-go="agents">View All Agents</button></div>""")

# --- 3. the agent card closes with a decision ----------------------------
#  The fee was sitting at the foot next to a chevron, which made the row read
#  as "price, and something else". It belongs beside the name — it is a fact
#  about the agent — and the foot belongs to the two things you can actually
#  do: ask about them, or book them.
lit('an agent card closes with Book',
    """function agentCardH(key){
  const a=AGENTS[key];
  return `<div class="agh draw" role="button" tabindex="0" data-go="agent:${key}">
    <span class="bd"><i></i><i></i><i></i><i></i></span>
    ${talStar('What is '+a.n.split(' ')[0]+' like to be interviewed by?')}
    ${avatar(a,56)}
    <span class="agh-n">${a.n}</span>
    <span class="agh-r">${stars(a.r)}<span class="num">${a.r.toFixed(1)}</span></span>
    <span class="agh-m">${a.range} · ${a.ivs} interviews</span>
    <span class="agh-f"><span class="agh-slot">${a.slot}</span><span class="ag-price">${a.price}</span></span>
    <svg class="card-go" viewBox="0 0 24 24">${inner('arrowRight')}</svg>
  </div>`;
}""",
    """function agentCardH(key){
  const a=AGENTS[key];
  return `<div class="agh draw agh-book">
    <span class="bd"><i></i><i></i><i></i><i></i></span>
    ${avatar(a,56)}
    <span class="agh-n">${a.n}<span class="ag-price">${a.price}</span></span>
    <span class="agh-r">${stars(a.r)}<span class="num">${a.r.toFixed(1)}</span></span>
    <span class="agh-m">${a.range} · ${a.ivs} interviews</span>
    <span class="agh-f"><span class="agh-slot">${a.slot}</span>
      <span class="agh-act">
        ${talStar('What is '+a.n.split(' ')[0]+' like to be interviewed by?')}
        <button class="btn btn-p btn-sm noic" data-go="agent:${key}">Book</button>
      </span></span>
  </div>`;
}""")

# --- 4. the ask is the same sentence everywhere --------------------------
#  It named the module, which made it read as a per-page feature rather than
#  as the one place you talk to Tal. One sentence, every screen.
# (the ask line moved to ai4.js, where askBar() lives — the edit is applied
#  at source there rather than patched into views.js)

# --- 5. the stepper carries its own heading ------------------------------
#  The meter was a full-width bar under a heading, which gave a four-step
#  progress indicator the visual weight of a chart. It is a glance, not a
#  reading: it sits on the heading's own line, at the width it needs, with
#  the count beside it.
lit('the stepper takes a title',
    """function stepper(id, steps, flush){""",
    """function stepper(id, steps, flush, title){""")

lit('and puts its meter on the heading line',
    """  return `<div class="stp${flush?' flush':''}${open?' open':''}">
    <div class="stp-rail" role="img" aria-label="Step ${i+1} of ${steps.length}">
      ${steps.map(x=>`<i class="${x.st}"></i>`).join('')}
    </div>
    <div class="stp-h">
      <span class="stp-c">Step ${i+1} of ${steps.length}</span>
      <button class="stp-t" data-stp="${id}" aria-expanded="${open}">${open?'Hide steps':'All steps'}${I.chevDown}</button>
    </div>""",
    """  const meter = `<span class="stp-meter">
      <span class="stp-rail" role="img" aria-label="Step ${i+1} of ${steps.length}">
        ${steps.map(x=>`<i class="${x.st}"></i>`).join('')}
      </span>
      <span class="stp-c">Step ${i+1} of ${steps.length}</span>
    </span>`;
  const toggle = `<button class="stp-t" data-stp="${id}" aria-expanded="${open}">${open?'Hide steps':'All steps'}${I.chevDown}</button>`;
  return `<div class="stp${flush?' flush':''}${open?' open':''}${title?' stp-titled':''}">
    ${title
      ? `<div class="stp-top"><h2 class="u-h3">${title}</h2>${meter}${toggle}</div>`
      : `${meter}<div class="stp-h">${toggle}</div>`}""")

# and the two dashboards hand their heading over to it
lit('where you are, on one line (new)',
    """    <div class="sec tint">
      <div class="sec-h"><h2>Where you are</h2></div>
      ${stepper('whereNew',[""",
    """    <div class="sec tint sec-stp">
      ${stepper('whereNew',[""")
lit('where you are, closes with the title (new)',
    """        {st:'',    lab:'Your level and report',sec:'Within 48 hours of the interview'},
        {st:'',    lab:'Enroll and start your 90 days'}
      ],1)}""",
    """        {st:'',    lab:'Your level and report',sec:'Within 48 hours of the interview'},
        {st:'',    lab:'Enroll and start your 90 days'}
      ],1,'Where you are')}""")

lit('where you are, on one line (booked)',
    """    <div class="sec tint">
      <div class="sec-h"><h2>Where you are</h2></div>
      ${stepper('whereBooked',[""",
    """    <div class="sec tint sec-stp">
      ${stepper('whereBooked',[""")

lit('where you are, closes with the title (booked)',
    """        {st:'on',  lab:'Your level and report',sec:'Within 48 hours of the interview'},
        {st:'',    lab:'Enroll and start your 90 days'}
      ],1)}""",
    """        {st:'on',  lab:'Your level and report',sec:'Within 48 hours of the interview'},
        {st:'',    lab:'Enroll and start your 90 days'}
      ],1,'Where you are')}""")


# --- 6. the level link is a control too ----------------------------------
lit('view my level is a button',
    """      <div class="sec-h"><h2>Decided so far</h2><a data-go="level">My Level</a></div>""",
    """      <div class="sec-h"><h2>Decided so far</h2><button class="btn btn-g btn-sm noic" data-go="level">View My Level</button></div>""")


# ==========================================================================
#  THE ICON LEADS
#  A button that says "Book your interview" with a calendar mark pushed to
#  the far right reads as two things sharing a box: the label on one side,
#  a decoration on the other, and the wider the button the further apart
#  they drift. The mark belongs to the verb — it is what "book" means — so
#  it goes in front of the word and travels with it.
# ==========================================================================
lit('book your interview leads with the calendar (my level)',
    """    <div class="note quiet"><span>${I.info}</span><div class="nb"><b>A quiz cannot set your level</b>It only tells you your track. An interview with an agent sets the level, and your report follows within 48 hours.</div></div>
    <div class="mt5"><button class="btn btn-p" data-go="agents">Book your interview ${I.calendar}</button></div>""",
    """    <div class="note quiet note-act"><span>${I.info}</span><div class="nb"><b>A quiz cannot set your level</b>It only tells you your track. An interview with an agent sets the level, and your report follows within 48 hours.</div><button class="btn btn-p ic-l note-cta" data-go="agents">${I.calendar}Book your interview</button></div>""")

lit('book an interview leads with the calendar (dashboard)',
    """          <button class="btn btn-p btn-sm noic ai-do" data-go="agents">Book an Interview</button>""",
    """          <button class="btn btn-p btn-sm ic-l ai-do" data-go="agents">${I.calendar}Book an Interview</button>""")

# ==========================================================================
#  THE SEARCH SITS BESIDE WHAT IT SEARCHES
#  Full width and stacked under the description, the field read as the next
#  step in a form — type here, then something happens. It is not a step, it
#  is a filter on the list below, and a filter belongs on the same line as
#  the heading of the thing it filters, sized to what you type into it
#  rather than to the page.
# ==========================================================================
lit('all agents: the search moves onto the heading row',
    """    <div class="sec-h"><h2>All agents</h2></div>
    <p class="all-desc">Select an agent from whom you want to be interviewed.</p>
    <div class="srch all-srch">
      <svg class="mag" viewBox="0 0 24 24">${inner('search')}</svg>
      <input class="inp" placeholder="Search all 24 agents" aria-label="Search agents">
    </div>""",
    """    <div class="hd-srch">
      <div class="hd-srch-t">
        <div class="sec-h"><h2>All agents</h2></div>
        <p class="all-desc">Select an agent from whom you want to be interviewed.</p>
      </div>
      <div class="srch all-srch">
        <svg class="mag" viewBox="0 0 24 24">${inner('search')}</svg>
        <input class="inp" placeholder="Search all 24 agents" aria-label="Search agents">
      </div>
    </div>""")



# ==========================================================================
#  THE LEVEL IS THE NEWS, SO IT GETS THE CARD
#  A confirmed level arrived as a green alert strip — the same component the
#  product uses for "your payment went through". It is not that kind of news.
#  It is the one fact the whole assessment exists to produce, and the product
#  already has a shape that says so: the black card, which is where a level
#  lives everywhere else (the completed cohort, My Level).
#
#  So the strip and the loose pair of buttons below it become one card, laid
#  out the way the black cards are laid out: the fact on the left at full
#  display size with the rung under it, the two things you can do about it on
#  the right, bottom-aligned to the ladder.
# ==========================================================================
lit('the confirmed level is a black card',
    """    <div class="sec">
      <div class="note succ"><span>${I.checkFilled}</span><div class="nb"><b>Explorer &ndash; E3 confirmed</b>Priya signed your report on August 21. That is rung 3 of the Explorer track.</div></div>
    </div>""",
    """    <div class="sec">
      <div class="lvl-hero on-dark lvl-split" style="margin:0">
        <div class="lvl-split-t">
          <div class="eb"><span class="eb-ok">${I.checkFilled}</span>Confirmed &middot; signed by Priya Nair, 21 August</div>
          <div class="big">Explorer &ndash; E3</div>
          <div class="sub">Rung 3 of 15 on the Explorer track</div>
          ${ladder('E3')}
        </div>
        <div class="lvl-split-a">
          <button class="btn btn-p" data-go="enrol">Enroll on Explorer Track &ndash; E3 ${I.arrowRight}</button>
          <button class="btn btn-s" data-go="report">Read my report ${I.document}</button>
        </div>
      </div>
    </div>""")

lit('and the loose button pair goes with it',
    """    <div class="sec"><div class="btn-set">
      <button class="btn btn-p" data-go="enrol">Enroll on Explorer Track &ndash; E3 ${I.arrowRight}</button>
      <button class="btn btn-t" data-go="report">Read my report ${I.document}</button>
    </div></div>
    <div class="sec">
      <div class="sec-h"><h2>Decided so far</h2>""",
    """    <div class="sec">
      <div class="sec-h"><h2>Decided so far</h2>""")



# ==========================================================================
#  THE ENROLL PAGE PUTS THE PRICE WHERE THE DECISION IS
#  Two tags sat above the title saying "Explorer track" and "Level E3" — the
#  title one line below says "Explorer Track — E3". A label that repeats the
#  heading it labels is not a label, it is a second heading, and it pushed
#  the real one down the page.
#
#  And the money was at the bottom, under thirteen chapter rows. What you are
#  deciding here is whether to spend $595, so the figure and the button that
#  acts on it come up to sit directly under what you get for it — before the
#  syllabus, which is detail you read once you are interested, not before.
# ==========================================================================
lit('enroll: the tags above the title go',
    """  <div class="sec" style="padding-top:var(--s05);padding-bottom:var(--s05)">
    <div class="tag-row mb5"><span class="tag">Explorer track</span><span class="tag acc">Level ${lvl}</span></div>
  </div>
  <div class="ph" style="padding-top:0">""",
    """  <div class="ph">""")

lit('enroll: the price comes up the page',
    """  <div class="sec">
    <div class="sec-h"><h2>What the 90 days cover</h2><a data-go="coursework">All 13</a></div>
    <div class="tile-stack">${[0,1,2,3].map(i=>chRow(i,{done:0,open:-1,week:99,enrolled:false})).join('')}</div>
  </div>
  <div class="sec">
    <div class="tile">
      <div class="kv"><span class="k">Course fee</span><span class="v">$690</span></div>
      <div class="kv"><span class="k">${next?'Returning candidate credit':'Interview already paid'}</span><span class="v n">&minus;$95</span></div>
      <div class="kv"><span class="k">Due today</span><span class="v">$595</span></div>
    </div>
    <p class="t-helper-01 mt4">One payment. Nothing recurs, and the re-interview at the end is included.</p>
    <div class="mt5">${askChip('What happens on the weekly cohort call?','Ask Tal about the calls')}</div>
    <div class="mt5"><button class="btn btn-p" data-go="payment">Continue to payment ${I.arrowRight}</button></div>
  </div>""",
    """  <div class="sec">
    <div class="tile">
      <div class="kv"><span class="k">Course fee</span><span class="v">$690</span></div>
      <div class="kv"><span class="k">${next?'Returning candidate credit':'Interview already paid'}</span><span class="v n">&minus;$95</span></div>
      <div class="kv kv-due"><span class="k">Due today</span><span class="v">$595</span></div>
    </div>
    <p class="t-helper-01 mt4">One payment. Nothing recurs, and the re-interview at the end is included.</p>
    <div class="pay-act mt5">
      <button class="btn btn-p" data-go="payment">Continue to payment ${I.arrowRight}</button>
      ${askChip('What happens on the weekly cohort call?','Ask Tal about the calls')}
    </div>
  </div>
  <div class="sec">
    <div class="sec-h"><h2>What the 90 days cover</h2><a data-go="coursework">All 13</a></div>
    <div class="tile-stack">${[0,1,2,3].map(i=>chRow(i,{done:0,open:-1,week:99,enrolled:false})).join('')}</div>
  </div>""")



# ==========================================================================
#  A FIGURE CELL IS A CARD, AND A CARD LEADS WITH ITS MARK
#  The interview kit — recording, transcript, scenes — puts a mark in a box
#  on the left and the two lines beside it, and it is the clearest row in
#  the product: you know what a cell is before you read it. The stats band
#  next to it was the same shape with the mark missing, so four figures in
#  a row read as a table rather than as four things.
# ==========================================================================
lit('enroll stats lead with their mark',
    """      <div class="stat"><div class="l">Chapters</div><div class="n">13</div><div class="d">one a week</div></div>
      <div class="stat"><div class="l">Live calls</div><div class="n">13</div><div class="d">60 min, weekly</div></div>
      <div class="stat"><div class="l">Cohort size</div><div class="n">10</div><div class="d">max, all at ${lvl}</div></div>
      <div class="stat"><div class="l">Re-interview</div><div class="n">Day 91</div><div class="d">then you move</div></div>""",
    """      <div class="stat"><span class="stat-ic">${I.book}</span><div class="l">Chapters</div><div class="n">13</div><div class="d">one a week</div></div>
      <div class="stat"><span class="stat-ic">${I.video}</span><div class="l">Live calls</div><div class="n">13</div><div class="d">60 min, weekly</div></div>
      <div class="stat"><span class="stat-ic">${I.group}</span><div class="l">Cohort size</div><div class="n">10</div><div class="d">max, all at ${lvl}</div></div>
      <div class="stat"><span class="stat-ic">${I.calendar}</span><div class="l">Re-interview</div><div class="n">Day 91</div><div class="d">then you move</div></div>""")

lit('transcript stats lead with their mark',
    """      <div class="stat"><div class="l">Chapters done</div>""",
    """      <div class="stat"><span class="stat-ic">${I.book}</span><div class="l">Chapters done</div>""")
lit('transcript stats: average',
    """      <div class="stat"><div class="l">Assessment average</div>""",
    """      <div class="stat"><span class="stat-ic">${I.chart}</span><div class="l">Assessment average</div>""")
lit('transcript stats: time',
    """      <div class="stat"><div class="l">Time invested</div>""",
    """      <div class="stat"><span class="stat-ic">${I.time}</span><div class="l">Time invested</div>""")
lit('transcript stats: tasks',
    """      <div class="stat"><div class="l">Tasks on time</div>""",
    """      <div class="stat"><span class="stat-ic">${I.flag}</span><div class="l">Tasks on time</div>""")



# ==========================================================================
#  THE OPENING SUGGESTIONS ARE AN OPENING
#  Tal's panel kept a strip of starter questions pinned above the composer
#  for the whole conversation. They are there to answer "what can I even ask
#  this thing" — a question you only have before you have asked anything.
#  Once the thread has started they are three stale buttons between you and
#  the field, and the answers carry their own follow-ups anyway. The ask page
#  already drops them at the first message; the panel now does the same.
# ==========================================================================
lit('the panel drops its starter chips once you have spoken',
    """    <div class="tal-sugg">${ctx.map(s=>`<button class="chip-tal" data-ask="1"><span class="sk-mark xs"></span>${s}</button>`).join('')}</div>""",
    """    ${S.thread.length?'':`<div class="tal-sugg">${ctx.map(s=>`<button class="chip-tal" data-ask="1"><span class="sk-mark xs"></span>${s}</button>`).join('')}</div>`}""")


# ==========================================================================
#  THE HEADSHOT AT THE FILE'S SIZE
#  Figma 292:276 crops the photograph at a zoom 1.24x the zoom every other
#  piece of the card is cropped at — see the derivation at the head of
#  26-agent.css. 56 x 1.24 is 69.5, and 72 is the avatar step the product
#  already uses, so the card takes it rather than a number of its own.
#  The list row keeps 48: it is a row, not a card, and the frame is about
#  the card.
# ==========================================================================
lit('the agent card headshot is 72',
    """    <span class="bd"><i></i><i></i><i></i><i></i></span>
    ${avatar(a,56)}
    <span class="agh-n">${a.n}<span class="ag-price">${a.price}</span></span>""",
    """    <span class="bd"><i></i><i></i><i></i><i></i></span>
    ${avatar(a,72)}
    <span class="agh-n">${a.n}<span class="ag-price">${a.price}</span></span>""")


# ==========================================================================
#  TAL'S PANEL, TO THE TWO FRAMES
#  Figma 291:202 and 292:737. Four changes, all of them structural, so they
#  are markup rather than CSS.
# ==========================================================================

#  1. THE HEADER IS THE MARK AND THE NAME. The line under it named the page
#     you were already looking at and the level you already know.
lit('tal: the header is the mark and the name',
    """    <div class="tal-h">
      <span class="av"><span class="sk-mark xs"></span></span>
      <span class="nm"><b>Tal</b><span>${where} · ${state}</span></span>""",
    """    <div class="tal-h">
      <span class="tal-mk"></span>
      <span class="nm"><b>Tal</b></span>""")

#  2. THE SPEAKER IS NAMED ABOVE WHAT THEY SAID. Beside it, the name is a
#     column every bubble has to leave room for; above it, the bubble gets
#     the whole width and the label costs one line. Both frames draw it so.
lit('tal: the speaker is named above the bubble',
    """  const bubble = (who,html) => who==='me'
    ? `<div class="tal-msg me"><span class="av"><img src="${AV.hana}" alt=""><i>MN</i></span><div class="bb">${html}</div></div>`
    : `<div class="tal-msg"><span class="av"><span class="sk-mark xs"></span></span><div class="bb">${html}</div></div>`;""",
    """  const bubble = (who,html) => who==='me'
    ? `<div class="tal-msg me"><span class="tal-who"><span class="tal-who-n">You</span><span class="av"><img src="${AV.hana}" alt=""><i>MN</i></span></span><div class="bb">${html}</div></div>`
    : `<div class="tal-msg"><span class="tal-who"><span class="tal-mk sm"></span><span class="tal-who-n">Tal</span></span><div class="bb">${html}</div></div>`;""")

#  3. NOTHING SAID YET IS AN INTRODUCTION, NOT A BUBBLE. The panel opened
#     with Tal telling you which page you were on. 291:202 opens with Tal
#     saying who it is, on the panel's centre line, under the mark at 81.
lit('tal: the empty state introduces Tal',
    """  const thread = bubble('tal',opener)
    + S.thread.map(m=>bubble(m.who,m.html)).join('')""",
    """  const hero = `<div class="tal-hero">
      <span class="tal-mk lg"></span>
      <h2>Hello <b>Maryam</b>, I am Tal &#128075;</h2>
      <p>I am here to assist you with anything you need help with. What&rsquo;s going on?</p>
    </div>`;
  const thread = (S.thread.length ? '' : hero)
    + S.thread.map(m=>bubble(m.who,m.html)).join('')""")

#  4. THE COMPOSER CARRIES THE MARK AND CLOSES ON A BLACK SEND.
lit('tal: the composer carries the mark',
    """    <div class="composer">
      <input class="inp ai-field" placeholder="Ask Tal" aria-label="Ask Tal">""",
    """    <div class="composer">
      <span class="tal-mk sm composer-mk"></span>
      <input class="inp ai-field" placeholder="Ask Tal anything" aria-label="Ask Tal">""")


# ==========================================================================
#  THE CONFIRMED LEVEL TAKES THE MY LEVEL CARD'S STRUCTURE
#  It was a two-COLUMN card: everything about the level on the left, the two
#  buttons stacked in a column on the right. My Level draws the same fact as
#  two rows — who you are on the left, where that is on the track on the
#  right — and the dashboard should not have a second drawing of it.
#
#  So the card becomes that card, and the two things this one has and My
#  Level does not go into a row of their own underneath: who signed it and
#  when on the left, the two actions side by side on the right. A row rather
#  than a column, because the card is 1400 wide and stacking two buttons in
#  it makes the right-hand third of a black band into a list.
# ==========================================================================
lit('the confirmed level is the My Level card, plus a foot',
    """      <div class="lvl-hero on-dark lvl-split" style="margin:0">
        <div class="lvl-split-t">
          <div class="eb"><span class="eb-ok">${I.checkFilled}</span>Confirmed &middot; signed by Priya Nair, 21 August</div>
          <div class="big">Explorer &ndash; E3</div>
          <div class="sub">Rung 3 of 15 on the Explorer track</div>
          ${ladder('E3')}
        </div>
        <div class="lvl-split-a">
          <button class="btn btn-p" data-go="enrol">Enroll on Explorer Track &ndash; E3 ${I.arrowRight}</button>
          <button class="btn btn-s" data-go="report">Read my report ${I.document}</button>
        </div>
      </div>""",
    """      <div class="lvl-hero on-dark lvl-foot-card" style="margin:0">
        <div class="big">Explorer &ndash; E3</div>
        <div class="sub">Rung 3 of 15 on the Explorer track</div>
        ${ladder('E3')}
        <div class="lvl-foot">
          <div class="eb"><span class="eb-ok">${I.checkFilled}</span>Confirmed &middot; signed by Priya Nair, 21 August</div>
          <div class="lvl-foot-a">
            <button class="btn btn-p" data-go="enrol">Enroll on Explorer Track &ndash; E3 ${I.arrowRight}</button>
            <button class="btn btn-s" data-go="report">Read my report ${I.document}</button>
          </div>
        </div>
      </div>""")


# ==========================================================================
#  THE COHORT CALL IS THE SAME OBJECT AS THE INTERVIEW
#  Both are "a person, at a time, that you join". The interview got the black
#  plate — a face, who they are, what the thing is, when it is, and the
#  actions on the closing line. The weekly call got an orange date tile and a
#  grey band, which is a third drawing of an appointment and the only place
#  in the product where a date is a coloured square.
#
#  Same component. The content differs because the facts differ; the
#  structure does not.
# ==========================================================================
lit('the cohort call takes the interview plate',
    """      <div class="callband">
        <div class="callband-d"><b>Thu</b><span>6:00 PM</span><span class="callband-tz">ET</span></div>
        <div class="callband-b">
          <div class="t-label-01">Weekly call &middot; in 2 days</div>
          <div class="callband-t">Cohort 41, week ${f.week||5}</div>
          <div class="callband-who">${avatar(AGENTS.priya,24)}<span>Led by Priya Nair &middot; 9 others &middot; 60 minutes</span></div>
        </div>
        <div class="callband-act"><button class="btn btn-p btn-sm noic" data-go="cohort">Open the cohort ${I.arrowRight}</button></div>""",
    """      <div class="plate">
        <div class="plate-who">${avatar(AGENTS.priya,56)}
          <span class="plate-wb"><b>Priya Nair</b><span>Cohort leader &middot; leads Cohort 41</span></span>
        </div>
        <div class="plate-eb">Weekly call &middot; in 2 days</div>
        <div class="plate-t">Cohort 41, week ${f.week||5}</div>
        <div class="plate-b">Thursday at 6:00 PM ET &middot; 9 others &middot; 60 minutes</div>
        <div class="plate-a">
          <button class="btn btn-p btn-sm noic" data-go="cohort">Open the cohort ${I.arrowRight}</button>
        </div>""")


# ==========================================================================
#  LEVELLED, NOT ENROLLED: WHAT THE 90 DAYS COVER
#  "Decided so far" restated the black card immediately above it — the same
#  level, the same rung, the same signature, as a tile you could click to
#  read the report the card already links to. The question on this screen is
#  not what has been decided, it is what you are about to buy, so the
#  enrolment page's chapter list comes up onto the dashboard.
#
#  It LISTS, it does not open: nothing here is unlocked yet, and a row that
#  looks clickable and is not is worse than a row that does not. Thirteen of
#  them in one column is most of a screen, so they run in two columns —
#  no headers, because two columns of the same thing do not have two names.
# ==========================================================================
lit('levelled, not enrolled: what the 90 days cover',
    """    <div class="sec">
      <div class="sec-h"><h2>Decided so far</h2><button class="btn btn-g btn-sm noic" data-go="level">View My Level</button></div>
      <div class="tile-stack">
        <button class="tile clk arrow" data-go="report">
          <div class="t-label-01" style="color:var(--text-secondary)">Confirmed level</div>
          <h3 class="mt3">Explorer &ndash; E3</h3><div class="sub">Rung 3 of 15 · signed by Priya Nair, 21 Aug</div>
          <svg class="tile-arrow" viewBox="0 0 24 24">${inner('arrowRight')}</svg></button>
      </div>
    </div>`;""",
    """    <div class="sec">
      <div class="sec-h"><h2>What the 90 days cover</h2><button class="btn btn-g btn-sm noic" data-go="enrol">See the full course</button></div>
      <p class="all-desc">Thirteen chapters, one a week, with a live cohort call alongside each. Everything opens on enrolment.</p>
      <div class="ch-two">${CH.map((c,i)=>`
        <div class="ch ch-flat">
          <span class="ch-num">${String(i+1).padStart(2,'0')}</span>
          <span class="ch-b"><span class="ch-t">${c[0]}</span><span class="ch-s">${c[1]} min</span></span>
        </div>`).join('')}</div>
    </div>`;""")


# ==========================================================================
#  VERIFYING YOUR EMAIL PUTS YOU IN THE PRODUCT
#  The onboarding flow ended on a "You are in" screen: a green tick, a
#  welcome, the track the quiz already gave you, an introduction to Tal, and
#  a button to the dashboard. Every one of those things is on the dashboard
#  itself — the track is in the header, Tal is the first thing on the page,
#  and the welcome is the greeting. It was a page whose only content was a
#  promise of the next page.
#
#  Verify now lands on the dashboard. `AUTH.created` stays in the file
#  because nothing else costs anything to keep and the copy may be wanted on
#  an email, but nothing routes to it.
# ==========================================================================
lit('verifying lands in the product, not on a welcome screen',
    """<button class="btn btn-p btn-full" data-go="created">Verify &amp; Continue ${I.arrowRight}</button>""",
    """<button class="btn btn-p btn-full" data-go="stage:new">Verify &amp; Continue ${I.arrowRight}</button>""")


# ==========================================================================
#  SETTINGS DROPS THE TAL DATA BLOCK
#  Maryam asked for it out on every device. The two switches and the three
#  data actions live in the data-use page, which the account page already
#  links to; having them here as well made the same controls answerable in
#  two places.
# ==========================================================================
import re as _re
_m = _re.search(r'\n    <div class="sec-h"><h2>Tal and your data</h2></div>', js)
if _m:
    _start = js.rfind('<div class="sec', 0, _m.start())
    _depth = 0; _i = _start
    while _i < len(js):
        if js.startswith('<div', _i): _depth += 1
        elif js.startswith('</div>', _i):
            _depth -= 1
            if _depth == 0: _i += 6; break
        _i += 1
    js = js[:_start] + js[_i:]
    applied.append('settings drops the Tal data block (1)')
else:
    missed.append('settings drops the Tal data block')


open('views.js','w').write(js)
print(f'views.js  {orig_len} -> {len(js)} chars')
print('applied :', ', '.join(applied))
if missed:
    print('MISSED  :', ', '.join(missed), file=sys.stderr)
    sys.exit(1)
