/* TTC Ventures – schlanke Interaktion: Kopfzeile, Navigation (mobil/Tastatur), dezentes Einblenden. */
(function () {
  'use strict';
  var doc = document;
  var header = doc.querySelector('.site-header');
  var toggle = doc.querySelector('.nav-toggle');
  var nav = doc.getElementById('site-nav');
  var heroPage = doc.body.classList.contains('hero-page');
  var isEn = (doc.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var lblOpen = isEn ? 'Open menu' : 'Menü öffnen';
  var lblClose = isEn ? 'Close menu' : 'Menü schließen';

  // Kopfzeile: über dem Bild transparent, danach ruhig geblurt/fest
  function headState() {
    if (!header) { return; }
    var solid = !heroPage || window.scrollY > 40 || header.classList.contains('menu-open');
    header.classList.toggle('is-solid', solid);
  }
  headState();
  doc.body.classList.add('js-ready');
  window.addEventListener('scroll', headState, { passive: true });

  // Mobile Navigation
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? lblClose : lblOpen);
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    headState();
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) { setMenu(false); } });
  }

  // Untermenü „Projekte“ (Desktop): Maus, Tastatur, Escape
  var subs = doc.querySelectorAll('.has-sub');
  function closeSub(li, refocus) {
    li.classList.remove('open');
    var b = li.querySelector('.sub-toggle');
    if (b) { b.setAttribute('aria-expanded', 'false'); if (refocus) { b.focus(); } }
  }
  subs.forEach(function (li) {
    var b = li.querySelector('.sub-toggle');
    if (!b) { return; }
    b.addEventListener('click', function () {
      var open = !li.classList.contains('open');
      subs.forEach(function (o) { if (o !== li) { closeSub(o); } });
      li.classList.toggle('open', open);
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    li.addEventListener('focusout', function (e) {
      if (!li.contains(e.relatedTarget)) { closeSub(li); }
    });
  });
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') { return; }
    subs.forEach(function (li) { if (li.classList.contains('open')) { closeSub(li, true); } });
    if (toggle && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
  });
  doc.addEventListener('click', function (e) {
    subs.forEach(function (li) { if (!li.contains(e.target)) { closeSub(li); } });
  });


  // Dezentes Einblenden – nur wenn Bewegung erwünscht ist
  var items = doc.querySelectorAll('.reveal');
  if (!items.length) { return; }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  items.forEach(function (el) { io.observe(el); });
  window.setTimeout(function () { items.forEach(function (el) { el.classList.add('is-visible'); }); }, 7000);
})();
