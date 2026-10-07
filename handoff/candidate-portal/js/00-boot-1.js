(function(){
  var SIZE = {mobile:[390,844], tablet:[744,1133], fluid:[1440,900]};
  var d = document.getElementById('device');
  d.style.visibility = 'hidden';
  var v = null;
  try { v = localStorage.getItem('tn-vp'); } catch(e){ /* storage denied */ }
  if(!SIZE[v]) return;
  d.dataset.vp = v;
  var b = document.querySelectorAll('#vp button');
  for(var i = 0; i < b.length; i++) b[i].classList.toggle('on', b[i].dataset.vp === v);
  /* The inline size too, not just the attribute: `fitFrame` writes
     `style.width` / `style.height` and the attribute alone only moves
     §01's `max-width`, so the box would still be 844 tall on a desktop
     frame until the bundle got round to it. */
  if(v === 'fluid'){
    d.style.width = '100%';
    d.style.height = Math.max(520, window.innerHeight - 160) + 'px';
  } else {
    d.style.width = SIZE[v][0] + 'px';
    d.style.height = Math.min(SIZE[v][1], Math.round(window.innerHeight * 0.82)) + 'px';
  }
})();
