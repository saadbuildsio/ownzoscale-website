// Runs automatically every time Netlify accepts a form submission (spam is filtered out first).
// Sends Saad a branded email through Resend. Netlify's own plain email alert keeps working as a backup.
//
// Settings (Netlify > Project configuration > Environment variables):
//   RESEND_API_KEY  required. From resend.com > API Keys.
//   NOTIFY_EMAIL    required. Where the email goes. Comma-separate for more than one.
//   NOTIFY_FROM     optional. Defaults to Resend's test sender until ownzoscale.com is verified in Resend,
//                   then set it to e.g. "OwnzoScale Website <enquiries@ownzoscale.com>".

import { buildEmailHtml, buildEmailText, buildSubject } from '../lib/email-template.mjs';

const DEFAULT_FROM = 'OwnzoScale Website <onboarding@resend.dev>';

export const buildResendRequest = (payload, env) => {
  const formName = payload.form_name || payload.data?.['form-name'] || '';
  const data = payload.data || {};
  const to = String(env.NOTIFY_EMAIL || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
  const body = {
    from: env.NOTIFY_FROM || DEFAULT_FROM,
    to,
    subject: buildSubject(formName, data),
    html: buildEmailHtml({ formName, data, createdAt: payload.created_at, siteUrl: env.URL || undefined }),
    text: buildEmailText({ formName, data, createdAt: payload.created_at }),
  };
  const email = String(data.email || '').trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) body.reply_to = email;
  return body;
};

export const handler = async (event) => {
  const env = process.env;
  if (!env.RESEND_API_KEY || !env.NOTIFY_EMAIL) {
    console.log('Branded email skipped: RESEND_API_KEY or NOTIFY_EMAIL is not set.');
    return { statusCode: 200, body: 'skipped' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}').payload || {};
  } catch {
    console.log('Branded email skipped: could not read the submission.');
    return { statusCode: 200, body: 'bad payload' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(buildResendRequest(payload, env)),
  });

  if (!res.ok) {
    // Log only the status and Resend's error text, never the visitor's details.
    console.log(`Resend refused the email: ${res.status} ${await res.text()}`);
    return { statusCode: 200, body: 'resend error' };
  }
  return { statusCode: 200, body: 'sent' };
};
