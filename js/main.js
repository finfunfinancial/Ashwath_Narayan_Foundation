(function () {
  document.documentElement.classList.add('js');

  // Mobile navigation
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Header shadow once scrolled
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Show a labelled placeholder for photos that haven't been added yet
  document.querySelectorAll('.photo img').forEach(function (img) {
    function markMissing() { img.parentElement.classList.add('is-missing'); }
    if (img.complete && img.naturalWidth === 0) markMissing();
    else img.addEventListener('error', markMissing);
  });

  // Highlight the nav item for the section in view
  var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav ul a'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function markCurrent(id) {
    links.forEach(function (a) {
      if (a.getAttribute('href') === id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  // The footer never reaches mid-screen, so mark Contact once at the bottom
  function atBottom() {
    return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  }
  window.addEventListener('scroll', function () {
    if (atBottom()) markCurrent('#contact');
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !atBottom()) markCurrent('#' + entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navObserver.observe(s); });

    // Gentle reveal for section content
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.section-head, .about-grid > *, .focus-card, .course-card, .learn-steps, .courses-more, .initiative-grid > *, .impact-item, .gallery .photo, .cta-inner')
      .forEach(function (el) { el.classList.add('reveal'); revealObserver.observe(el); });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
