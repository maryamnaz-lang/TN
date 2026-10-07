function pruneStaleChips(){
  const th = device.querySelector('.ask-page .ask-thread');
  if(!th) return;

  const turns = [...th.querySelectorAll('.tal-msg:not(.me)')];
  const last = turns[turns.length - 1];

  turns.forEach(turn => {
    if(turn === last) return;
    turn.querySelectorAll('.tw-chips').forEach(n => n.remove());
    turn.querySelectorAll('.chip-tal').forEach(n => n.remove());
  });
}

const _baseChips = render;
render = function(){
  _baseChips.apply(this, arguments);
  try{ pruneStaleChips(); }
  catch(err){ console.warn('pruneStaleChips', err); }
};

render();
