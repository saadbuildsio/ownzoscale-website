// Small site-wide scripts: mobile menu, button ripple, card corners, step line, checklist, tracking.
const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile menu (side panel)
const menuBtn = document.querySelector('.menu-btn');
const panel = document.getElementById('mobile-menu');
const dim = document.querySelector('.m-dim');
if (menuBtn && panel) {
  let closeTimer;
  const setOpen = (open) => {
    clearTimeout(closeTimer);
    if (open) {
      panel.hidden = dim.hidden = false;
      requestAnimationFrame(() => document.body.classList.add('menu-open'));
      panel.querySelector('.m-close').focus();
    } else {
      document.body.classList.remove('menu-open');
      closeTimer = setTimeout(() => { panel.hidden = dim.hidden = true; }, reduce ? 0 : 280);
      menuBtn.focus();
    }
    menuBtn.setAttribute('aria-expanded', String(open));
  };
  const isOpen = () => menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.addEventListener('click', () => setOpen(!isOpen()));
  document.querySelectorAll('[data-menu-close]').forEach((el) => el.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'Tab') { // keep keyboard focus inside the panel
      const f = panel.querySelectorAll('a,button');
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  matchMedia('(min-width: 901px)').addEventListener('change', (m) => { if (m.matches && isOpen()) setOpen(false); });
}

// Click ripple on buttons
document.querySelectorAll('.btn').forEach((b) => {
  b.addEventListener('pointerdown', (e) => {
    if (reduce) return;
    const r = b.getBoundingClientRect();
    const d = Math.max(r.width, r.height);
    const s = document.createElement('span');
    s.className = 'rp';
    s.style.width = s.style.height = d + 'px';
    s.style.left = e.clientX - r.left - d / 2 + 'px';
    s.style.top = e.clientY - r.top - d / 2 + 'px';
    b.appendChild(s);
    setTimeout(() => s.remove(), 700);
  });
});

// Tap on phones shows the card corner lines
document.querySelectorAll('.cc').forEach((c) => {
  c.addEventListener('touchstart', () => {
    document.querySelectorAll('.cc.touch').forEach((o) => o !== c && o.classList.remove('touch'));
    c.classList.add('touch');
  }, { passive: true });
});

// "How it works" line fills as you scroll
document.querySelectorAll('.steps').forEach((steps) => {
  const items = steps.querySelectorAll('li');
  const tick = () => {
    const r = steps.getBoundingClientRect();
    const vh = window.innerHeight;
    let p = (vh * 0.85 - r.top) / (r.height + vh * 0.45);
    p = Math.max(0, Math.min(1, p));
    const total = reduce ? items.length : p * items.length;
    items.forEach((li, i) => {
      const f = Math.max(0, Math.min(1, total - i));
      li.style.setProperty('--f', f.toFixed(3));
      li.classList.toggle('on', f > 0.15);
    });
  };
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick);
  tick();
});

// Checklist ticks pop when seen
document.querySelectorAll('.chk').forEach((chk) => {
  if (!('IntersectionObserver' in window)) return;
  new IntersectionObserver((es, o) => {
    es.forEach((e) => { if (e.isIntersecting) { chk.classList.add('go'); o.disconnect(); } });
  }, { threshold: 0.4 }).observe(chk);
});

// Analytics events (only fire if the visitor accepted cookies and GA is loaded)
const track = (name, params = {}) => { if (typeof window.gtag === 'function') window.gtag('event', name, params); };
document.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;
  const href = a.getAttribute('href') || '';
  if (href.includes('wa.me')) track('whatsapp_click');
  else if (href.startsWith('/book-a-consultation')) track('book_consultation_click');
  else if (href.startsWith('/contact')) track('discuss_project_click', { from: location.pathname });
});
