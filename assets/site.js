// Scroll reveal
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '-50px' });
  els.forEach(function (el) { io.observe(el); });
})();

// Mobile menu
(function () {
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  var iconMenu = document.getElementById('icon-menu');
  var iconClose = document.getElementById('icon-close');
  if (!toggle) return;
  function setOpen(open) {
    menu.classList.toggle('hidden', !open);
    menu.classList.toggle('open', open);
    iconMenu.classList.toggle('hidden', open);
    iconClose.classList.toggle('hidden', !open);
  }
  var open = false;
  toggle.addEventListener('click', function () { open = !open; setOpen(open); });
  menu.querySelectorAll('a, button').forEach(function (el) {
    el.addEventListener('click', function () { open = false; setOpen(false); });
  });
})();

// Inquiry drawer
(function () {
  var backdrop = document.getElementById('drawer-backdrop');
  var drawer = document.getElementById('drawer');
  var form = document.getElementById('inquiry-form');
  var success = document.getElementById('drawer-success');
  function open() {
    backdrop.classList.add('open');
    drawer.classList.add('open');
  }
  function close() {
    backdrop.classList.remove('open');
    drawer.classList.remove('open');
  }
  document.querySelectorAll('[data-open-drawer]').forEach(function (btn) {
    btn.addEventListener('click', open);
  });
  document.getElementById('drawer-close').addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.classList.add('hidden');
    success.classList.remove('hidden');
    setTimeout(function () {
      form.reset();
      form.classList.remove('hidden');
      success.classList.add('hidden');
      close();
    }, 2500);
  });
})();
