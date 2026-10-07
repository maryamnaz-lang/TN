const TMP_ACCENT_ON = [
  [RED_DEMO, '*'],   // "Red Accent Demo" — every page of it
];

const _baseTmpAccent = render;
render = function(){
  _baseTmpAccent();
  try {
    const app = device.querySelector('.app');
    if(!app) return;
    const on = !S.call && TMP_ACCENT_ON.some(([st, vw]) =>
      S.stage === st && (vw === '*' || S.view === vw));
    app.classList.toggle('tmp-accent', on);

    if(on){
      app.querySelectorAll('.prog-figs .prog-ic').forEach(ic => {
        if(/Zm56 328/.test(ic.innerHTML)) ic.innerHTML = I.check;
      });
    }
  } catch(e){ console.warn('tmp accent', e); }
};

render();
