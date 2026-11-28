// Pure helpers for the forms. Kept separate so they can be unit tested.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isValidEmail = (v) => EMAIL_RE.test(String(v || '').trim());

// "ad-pack" -> "Ad Pack". Only letters, numbers and dashes are kept, so a link can't inject odd text.
export const tierLabel = (tier) =>
  String(tier || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .split('-')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

export const tierMessage = (tier) => {
  const label = tierLabel(tier);
  return label ? `I'm interested in the ${label} option.\n\n` : '';
};

// Message for one required field, or '' if it's fine.
export const fieldError = (el) => {
  const v = String(el.value || '').trim();
  if (!v) return el.dataset?.msg || 'Please fill in this field.';
  if (el.type === 'email' && !isValidEmail(v)) return 'Please check your email address.';
  return '';
};

// Turns FormData into the URL-encoded body Netlify Forms expects, joining ticked services into one line.
export const encodeForm = (data) => {
  const out = new URLSearchParams();
  const picked = data.getAll('services');
  for (const [k, v] of data.entries()) if (k !== 'services') out.append(k, v);
  if (picked.length) out.append('services', picked.join(', '));
  return out.toString();
};

// "WhatsApp chat,Phone call" + "Phone call" -> true
export const requiredFor = (list, picked) => !!picked && String(list || '').split(',').map((x) => x.trim()).includes(picked);
