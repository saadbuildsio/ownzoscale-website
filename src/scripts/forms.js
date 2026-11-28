// Enquiry and call-request forms: pre-fill from the link, friendly checks, send to Netlify Forms.
import { fieldError, tierMessage, encodeForm } from './form-utils.js';

const form = document.querySelector('.oz-form');
if (form) {
  // Pre-fill: /contact?service=ai-ads&tier=ad-pack
  const q = new URLSearchParams(location.search);
  const svc = q.get('service');
  const tier = q.get('tier');
  if (svc) form.querySelectorAll('input[name="services"]').forEach((c) => { if (c.dataset.slug === svc) c.checked = true; });
  if (tier && form.tier) {
    form.tier.value = tier;
    const d = form.querySelector('textarea[name="details"]');
    if (d && !d.value) d.value = tierMessage(tier);
  }

  const showErr = (el, msg) => {
    const box = el.closest('.field') || el;
    box.classList.add('bad');
    let m = box.querySelector('.err');
    if (!m) { m = document.createElement('p'); m.className = 'err'; m.id = 'err-' + Math.random().toString(36).slice(2); box.appendChild(m); }
    m.textContent = msg;
    if (el.matches('input,textarea,select')) { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', m.id); }
  };
  const clearErr = (box) => { box.classList.remove('bad'); box.querySelector('.err')?.remove(); box.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid')); };

  const validate = () => {
    let first = null;
    form.querySelectorAll('[required]').forEach((el) => {
      clearErr(el.closest('.field'));
      const msg = fieldError(el);
      if (msg) { showErr(el, msg); first ||= el; }
    });
    const group = form.querySelector('[data-group="services"]');
    if (group) {
      clearErr(group);
      if (!group.querySelector('input:checked')) { showErr(group, group.dataset.msg); first ||= group.querySelector('input'); }
    }
    if (first) first.focus();
    return !first;
  };
  form.addEventListener('input', (e) => { const f = e.target.closest('.field'); if (f?.classList.contains('bad')) clearErr(f); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errBox = form.querySelector('.form-error');
    errBox.hidden = true;
    if (!validate()) return;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.dataset.label = btn.innerHTML; btn.textContent = 'Sending…';
    try {
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: encodeForm(new FormData(form)) });
      if (!res.ok) throw new Error(String(res.status));
      if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { form_name: form.getAttribute('name') });
      location.href = form.getAttribute('action');
    } catch {
      errBox.hidden = false;
      btn.disabled = false; btn.innerHTML = btn.dataset.label;
    }
  });
}
