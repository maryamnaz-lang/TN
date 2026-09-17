/**
 * tn-loader.js — Standalone TalentNext Loading Component Helper
 * -------------------------------------------------------------
 * Usage options:
 * 1. As HTML string: `tnLoaderHtml({ size: '160px', color: '#000000' })`
 * 2. As DOM element: `document.body.appendChild(createTnLoader({ size: '200px' }))`
 * 3. As Custom Element: `<tn-loader size="180px" color="#000000"></tn-loader>`
 */

(function () {
  'use strict';

  function tnLoaderHtml(options) {
    var opts = options || {};
    var size = opts.size ? ' style="--loader-size: ' + opts.size + ';' + (opts.color ? ' --loader-color: ' + opts.color + ';' : '') + '"' : (opts.color ? ' style="--loader-color: ' + opts.color + ';"' : '');
    var cls = opts.className ? ' ' + opts.className : '';
    return '<div class="tn-loader' + cls + '"' + size + ' role="status" aria-label="' + (opts.label || 'Loading') + '">'
      + '<span class="tn-loader__blade tn-loader__blade--a"></span>'
      + '<span class="tn-loader__blade tn-loader__blade--b"></span>'
      + '<span class="tn-loader__blade tn-loader__blade--c"></span>'
      + '</div>';
  }

  function createTnLoader(options) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = tnLoaderHtml(options);
    return wrapper.firstElementChild;
  }

  // Define Web Component <tn-loader> if customElements is supported
  if (typeof window !== 'undefined' && window.customElements && !window.customElements.get('tn-loader')) {
    class TnLoaderElement extends HTMLElement {
      connectedCallback() {
        var size = this.getAttribute('size');
        var color = this.getAttribute('color');
        if (size) this.style.setProperty('--loader-size', size);
        if (color) this.style.setProperty('--loader-color', color);
        if (!this.querySelector('.tn-loader__blade')) {
          this.classList.add('tn-loader');
          this.setAttribute('role', 'status');
          if (!this.getAttribute('aria-label')) this.setAttribute('aria-label', 'Loading');
          this.innerHTML =
            '<span class="tn-loader__blade tn-loader__blade--a"></span>' +
            '<span class="tn-loader__blade tn-loader__blade--b"></span>' +
            '<span class="tn-loader__blade tn-loader__blade--c"></span>';
        }
      }
    }
    window.customElements.define('tn-loader', TnLoaderElement);
  }

  window.TnLoader = {
    html: tnLoaderHtml,
    create: createTnLoader
  };
})();
