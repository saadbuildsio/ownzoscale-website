// Enquiry and call-request forms: pre-fill from the link, friendly checks, send to Netlify Forms.
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
    const nice = tier.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
    if (d && !d.value) d.value = `I'm interested in the ${nice} option.\n\n`;
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
      const v = el.value.trim();
      const bad = !v || (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      if (bad) { showErr(el, el.type === 'email' && v ? 'Please check your email address.' : el.dataset.msg); first ||= el; }
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
    const data = new FormData(form);
    // Join ticked services into one line so the email shows all of them.
    const picked = data.getAll('services');
    if (picked.length) { data.delete('services'); data.append('services', picked.join(', ')); }
    try {
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data).toString() });
      if (!res.ok) throw new Error(String(res.status));
      if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { form_name: form.getAttribute('name') });
      location.href = form.getAttribute('action');
    } catch {
      errBox.hidden = false;
      btn.disabled = false; btn.innerHTML = btn.dataset.label;
    }
  });
}
