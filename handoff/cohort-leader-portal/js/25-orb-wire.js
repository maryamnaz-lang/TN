(function () {
  'use strict';

  var orbSpeaking = false;
  var orbListening = false;

  function orbWanted() {
    if (orbListening) { return 'listening'; }
    if (orbSpeaking) { return 'speaking'; }
    if (typeof S !== 'undefined' && S && S.typing) { return 'thinking'; }
    return 'idle';
  }

  function orbSync() {
    var want = orbWanted();
    var all = document.querySelectorAll('.borb');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      var state = el.hasAttribute('data-borb-live') ? want : 'idle';
      if (el.getAttribute('data-state') !== state) {
        el.setAttribute('data-state', state);
      }
    }
  }

  function orbRefresh() {
    if (window.BorbOrb) { window.BorbOrb.mountAll(); }
    orbSync();
  }

  function orbWrap(name, after) {
    var prev = window[name];
    if (typeof prev !== 'function') { return false; }
    window[name] = function () {
      var out = prev.apply(this, arguments);
      try { after.apply(this, arguments); } catch (e) { /* never fatal */ }
      return out;
    };
    return true;
  }

  orbWrap('render', orbRefresh);
  orbWrap('obBars', function (on) { orbSpeaking = !!on; orbSync(); });
  orbWrap('askRecStart', function () { orbListening = true; orbSync(); });
  orbWrap('askRecClear', function () { orbListening = false; orbSync(); });
  orbWrap('askRecFinish', function () { orbListening = false; orbSync(); });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', orbRefresh);
  } else {
    orbRefresh();
  }

  window.BorbWire = {
    sync: orbSync,
    refresh: orbRefresh,
    hold: function (state) {
      var all = document.querySelectorAll('.borb');
      for (var i = 0; i < all.length; i++) { all[i].setAttribute('data-state', state); }
    }
  };
}());
