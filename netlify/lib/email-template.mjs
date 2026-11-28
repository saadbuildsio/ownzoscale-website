// Builds the branded notification email Saad receives for each form sent on the site.
// Pure functions only (no network), so they can be unit tested.

const C = {
  ink: '#0B1020',
  cobalt: '#2D5BFF',
  amber: '#FFB224',
  mist: '#F4F6FB',
  line: '#E3E7F1',
  text: '#1B2236',
  quiet: '#5B6478',
  white: '#FFFFFF',
};

const FONT = "Inter,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export const escapeHtml = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const clean = (v) => String(v ?? '').trim();

// Keeps only digits so the number works in a wa.me link. Returns '' when it is too short to be real.
export const waDigits = (phone) => {
  const d = clean(phone).replace(/\D/g, '');
  return d.length >= 8 ? d : '';
};

export const splitList = (v) =>
  (Array.isArray(v) ? v : clean(v).split(','))
    .map((x) => clean(x))
    .filter(Boolean);

const FORMS = {
  enquiry: {
    badge: 'New enquiry',
    title: 'A new project enquiry',
    subjectLead: 'New enquiry',
  },
  consultation: {
    badge: 'Consultation request',
    title: 'A new consultation request',
    subjectLead: 'Consultation request',
  },
};

export const formInfo = (formName) => FORMS[formName] || {
  badge: 'New form',
  title: 'A new message from the website',
  subjectLead: 'New message',
};

export const buildSubject = (formName, data = {}) => {
  const info = formInfo(formName);
  const who = clean(data.name) || 'Someone';
  const biz = clean(data.business);
  return `${info.subjectLead}: ${who}${biz ? ` (${biz})` : ''}`;
};

// ---------- small HTML pieces (tables + inline styles so Gmail and Outlook show them the same) ----------

const row = (label, value, opts = {}) => {
  const v = clean(value);
  if (!v) return '';
  const body = opts.html ? value : escapeHtml(v);
  return `<tr>
<td style="padding:10px 0;border-bottom:1px solid ${C.line};width:38%;vertical-align:top;font:600 13px ${FONT};color:${C.quiet};">${escapeHtml(label)}</td>
<td style="padding:10px 0;border-bottom:1px solid ${C.line};vertical-align:top;font:400 15px ${FONT};color:${C.text};">${body}</td>
</tr>`;
};

const pills = (items, color = C.cobalt) =>
  items
    .map(
      (s) =>
        `<span style="display:inline-block;margin:0 6px 6px 0;padding:5px 11px;border-radius:999px;background:${color === C.cobalt ? '#E8EEFF' : '#FFF4DC'};color:${color === C.cobalt ? C.cobalt : '#8A5A00'};font:600 12px ${FONT};">${escapeHtml(s)}</span>`
    )
    .join('');

const section = (title, inner) => {
  if (!inner.trim()) return '';
  return `<tr><td style="padding:0 32px 8px;">
<div style="font:700 12px ${FONT};letter-spacing:1.2px;text-transform:uppercase;color:${C.cobalt};padding:22px 0 6px;">${escapeHtml(title)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${inner}</table>
</td></tr>`;
};

const messageBlock = (title, text) => {
  const t = clean(text);
  if (!t) return '';
  const html = escapeHtml(t).replace(/\r?\n/g, '<br>');
  return `<tr><td style="padding:0 32px 8px;">
<div style="font:700 12px ${FONT};letter-spacing:1.2px;text-transform:uppercase;color:${C.cobalt};padding:22px 0 10px;">${escapeHtml(title)}</div>
<div style="background:${C.mist};border-left:4px solid ${C.amber};border-radius:8px;padding:16px 18px;font:400 15px/1.6 ${FONT};color:${C.text};">${html}</div>
</td></tr>`;
};

const button = (href, label, bg, fg) =>
  `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 20px;border-radius:8px;background:${bg};color:${fg};font:700 14px ${FONT};text-decoration:none;">${escapeHtml(label)}</a>`;

const formatWhen = (iso) => {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return '';
  // Saad works in Pakistan time.
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Karachi',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d) + ' (PKT)';
};

// ---------- the email ----------

export function buildEmailHtml({ formName, data = {}, createdAt, siteUrl = 'https://ownzoscale.netlify.app' }) {
  const info = formInfo(formName);
  const name = clean(data.name) || 'Someone';
  const email = clean(data.email);
  const phone = clean(data.phone);
  const wa = waDigits(phone);
  const firstName = name.split(/\s+/)[0];

  const replySubject = `Re: your ${formName === 'consultation' ? 'consultation request' : 'enquiry'} with OwnzoScale`;
  const buttons = [
    email && button(`mailto:${email}?subject=${encodeURIComponent(replySubject)}`, 'Reply by email', C.amber, C.ink),
    wa && button(`https://wa.me/${wa}?text=${encodeURIComponent(`Hi ${firstName}, this is Saad from OwnzoScale. Thanks for reaching out!`)}`, 'Message on WhatsApp', '#25D366', C.white),
    phone && formName === 'consultation' && clean(data.format) === 'Phone call' && button(`tel:${phone.replace(/[^\d+]/g, '')}`, 'Call now', C.cobalt, C.white),
  ].filter(Boolean).join('');

  const website = clean(data.website);
  const websiteHref = website && (/^https?:\/\//i.test(website) ? website : `https://${website}`);

  const contact = [
    row('Name', name),
    row('Email', email ? `<a href="mailto:${escapeHtml(email)}" style="color:${C.cobalt};text-decoration:none;">${escapeHtml(email)}</a>` : '', { html: true }),
    row('Phone / WhatsApp', phone),
    row('Business', data.business),
    row('Website or social', websiteHref ? `<a href="${escapeHtml(websiteHref)}" style="color:${C.cobalt};text-decoration:none;">${escapeHtml(website)}</a>` : '', { html: true }),
  ].join('');

  let details = '';
  let message = '';
  if (formName === 'consultation') {
    details = [
      row('Format', clean(data.format) ? pills([clean(data.format)], C.amber) : '', { html: true }),
      row('Best days and times', data.best_times),
      row('Time zone', data.time_zone),
    ].join('');
    message = messageBlock('What they want to discuss', data.topic);
  } else {
    const services = splitList(data.services);
    details = [
      row('Services', services.length ? pills(services) : '', { html: true }),
      row('Package', data.tier),
      row('Budget', data.budget),
      row('Prefers', data.contact_preference),
    ].join('');
    message = messageBlock('Project details', data.details);
  }

  const when = formatWhen(createdAt);
  const preheader = `${name}${clean(data.business) ? ` from ${clean(data.business)}` : ''} sent a ${formName === 'consultation' ? 'consultation request' : 'project enquiry'}.`;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(buildSubject(formName, data))}</title></head>
<body style="margin:0;padding:0;background:${C.mist};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.mist};"><tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.white};border-radius:14px;overflow:hidden;border:1px solid ${C.line};">

<tr><td style="background:${C.ink};padding:26px 32px 30px;">
<div style="font:800 20px ${FONT};color:${C.white};letter-spacing:-0.3px;">Ownzo<span style="color:#8CA6FF;">Scale</span><span style="color:${C.amber};">.</span></div>
<div style="margin-top:22px;"><span style="display:inline-block;padding:5px 12px;border-radius:999px;background:${C.amber};color:${C.ink};font:700 11px ${FONT};letter-spacing:1px;text-transform:uppercase;">${escapeHtml(info.badge)}</span></div>
<div style="margin-top:12px;font:700 24px/1.3 ${FONT};color:${C.white};">${escapeHtml(info.title)}</div>
<div style="margin-top:6px;font:400 15px ${FONT};color:#B9C3DD;">from <b style="color:${C.white};">${escapeHtml(name)}</b>${clean(data.business) ? ` at <b style="color:${C.white};">${escapeHtml(clean(data.business))}</b>` : ''}</div>
</td></tr>

${buttons ? `<tr><td style="padding:24px 32px 4px;">${buttons}</td></tr>` : ''}
${section('Contact', contact)}
${section(formName === 'consultation' ? 'Consultation' : 'Project', details)}
${message}

<tr><td style="padding:26px 32px 28px;">
<div style="border-top:1px solid ${C.line};padding-top:16px;font:400 12px/1.6 ${FONT};color:${C.quiet};">
${when ? `Sent ${escapeHtml(when)}<br>` : ''}All submissions are also saved in Netlify under Forms. Replying to this email goes straight to ${escapeHtml(firstName)}.<br>
<a href="${escapeHtml(siteUrl)}" style="color:${C.cobalt};text-decoration:none;">${escapeHtml(siteUrl.replace(/^https?:\/\//, ''))}</a>
</div>
</td></tr>

</table>
</td></tr></table>
</body></html>`;
}

// Plain-text copy for email apps that don't show HTML (also helps the email avoid spam folders).
export function buildEmailText({ formName, data = {}, createdAt }) {
  const info = formInfo(formName);
  const lines = [`${info.title.toUpperCase()}`, ''];
  const add = (label, v) => { const x = Array.isArray(v) ? v.join(', ') : clean(v); if (x) lines.push(`${label}: ${x}`); };
  add('Name', data.name);
  add('Email', data.email);
  add('Phone / WhatsApp', data.phone);
  add('Business', data.business);
  add('Website or social', data.website);
  if (formName === 'consultation') {
    add('Format', data.format);
    add('Best days and times', data.best_times);
    add('Time zone', data.time_zone);
    lines.push('', 'What they want to discuss:', clean(data.topic));
  } else {
    add('Services', splitList(data.services));
    add('Package', data.tier);
    add('Budget', data.budget);
    add('Prefers', data.contact_preference);
    lines.push('', 'Project details:', clean(data.details));
  }
  const when = formatWhen(createdAt);
  if (when) lines.push('', `Sent ${when}`);
  return lines.join('\n');
}
