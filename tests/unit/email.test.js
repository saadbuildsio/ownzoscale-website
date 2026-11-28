import { describe, it, expect, vi, afterEach } from 'vitest';
import { escapeHtml, waDigits, splitList, buildSubject, buildEmailHtml, buildEmailText } from '../../netlify/lib/email-template.mjs';
import { buildResendRequest, handler } from '../../netlify/functions/submission-created.mjs';

const enquiry = {
  name: 'Ayesha Khan',
  email: 'ayesha@example.com',
  business: 'Bloom Bakery',
  website: 'bloombakery.com',
  services: 'AI Ads & Creative Production, Website Development & Landing Pages',
  tier: 'Growth',
  budget: '$1,000–$2,500',
  contact_preference: 'WhatsApp',
  details: 'We need ads for our new cakes.\nLaunch is next month.',
};
const consultation = {
  format: 'Phone call',
  name: 'John Smith',
  email: 'john@example.com',
  phone: '+1 (415) 555-0100',
  business: 'Smith Plumbing',
  best_times: 'Tue afternoon',
  time_zone: 'New York',
  topic: 'Getting more local leads',
};

describe('email helpers', () => {
  it('escapes HTML so a visitor cannot inject markup', () => {
    expect(escapeHtml('<script>"x"&\'y\'</script>')).toBe('&lt;script&gt;&quot;x&quot;&amp;&#39;y&#39;&lt;/script&gt;');
  });
  it('turns a phone number into WhatsApp digits', () => {
    expect(waDigits('+92 311 0020911')).toBe('923110020911');
    expect(waDigits('123')).toBe('');
    expect(waDigits('')).toBe('');
  });
  it('splits the services list', () => {
    expect(splitList('A, B ,, C')).toEqual(['A', 'B', 'C']);
    expect(splitList(['A', ' '])).toEqual(['A']);
  });
  it('writes a clear subject line', () => {
    expect(buildSubject('enquiry', enquiry)).toBe('New enquiry: Ayesha Khan (Bloom Bakery)');
    expect(buildSubject('consultation', { name: 'John' })).toBe('Consultation request: John');
    expect(buildSubject('other', {})).toBe('New message: Someone');
  });
});

describe('enquiry email', () => {
  const html = buildEmailHtml({ formName: 'enquiry', data: enquiry, createdAt: '2026-11-28T07:30:00Z' });
  it('shows the brand header, badge and every answer', () => {
    expect(html).toContain('New enquiry');
    expect(html).toContain('#0B1020');
    for (const v of ['Ayesha Khan', 'Bloom Bakery', 'Growth', 'WhatsApp']) expect(html).toContain(v);
    expect(html).toContain('AI Ads &amp; Creative Production');
    expect(html).toContain('Website Development &amp; Landing Pages');
  });
  it('keeps line breaks in the message', () => {
    expect(html).toContain('cakes.<br>Launch');
  });
  it('has a reply button and links the website', () => {
    expect(html).toContain('mailto:ayesha@example.com?subject=');
    expect(html).toContain('href="https://bloombakery.com"');
  });
  it('shows the time in Pakistan time', () => {
    expect(html).toContain('12:30 pm (PKT)');
  });
  it('leaves out empty fields', () => {
    const h = buildEmailHtml({ formName: 'enquiry', data: { name: 'A', email: 'a@b.co', details: 'x' } });
    expect(h).not.toContain('Budget');
    expect(h).not.toContain('Website or social');
    expect(h).not.toContain('wa.me');
  });
  it('never mentions the tools behind the work', () => {
    expect(html).not.toMatch(/claude|heygen|hyperframes|resend/i);
  });
});

describe('consultation email', () => {
  const html = buildEmailHtml({ formName: 'consultation', data: consultation });
  it('shows format, times and topic', () => {
    for (const v of ['Consultation request', 'Phone call', 'Tue afternoon', 'New York', 'Getting more local leads']) expect(html).toContain(v);
  });
  it('offers WhatsApp and call buttons when a number is given', () => {
    expect(html).toContain('https://wa.me/14155550100');
    expect(html).toContain('tel:+14155550100');
  });
  it('has a plain-text version', () => {
    const t = buildEmailText({ formName: 'consultation', data: consultation });
    expect(t).toContain('Format: Phone call');
    expect(t).toContain('Getting more local leads');
  });
});

describe('Resend sender', () => {
  const env = { RESEND_API_KEY: 'k', NOTIFY_EMAIL: 'a@x.com, b@x.com' };
  it('builds the request with reply-to the visitor', () => {
    const r = buildResendRequest({ form_name: 'enquiry', data: enquiry }, env);
    expect(r.to).toEqual(['a@x.com', 'b@x.com']);
    expect(r.reply_to).toBe('ayesha@example.com');
    expect(r.from).toContain('onboarding@resend.dev');
    expect(r.subject).toBe('New enquiry: Ayesha Khan (Bloom Bakery)');
  });
  it('uses the custom sender once set and skips a bad reply-to', () => {
    const r = buildResendRequest({ form_name: 'enquiry', data: { email: 'nope' } }, { ...env, NOTIFY_FROM: 'OwnzoScale <hi@ownzoscale.com>' });
    expect(r.from).toBe('OwnzoScale <hi@ownzoscale.com>');
    expect(r.reply_to).toBeUndefined();
  });

  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

  it('does nothing when not set up yet', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    const res = await handler({ body: JSON.stringify({ payload: { form_name: 'enquiry', data: enquiry } }) });
    expect(res.body).toBe('skipped');
    expect(f).not.toHaveBeenCalled();
  });
  it('sends to Resend when set up', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    vi.stubEnv('NOTIFY_EMAIL', 'owner@x.com');
    const f = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', f);
    const res = await handler({ body: JSON.stringify({ payload: { form_name: 'consultation', data: consultation } }) });
    expect(res.body).toBe('sent');
    const [url, opts] = f.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(opts.headers.Authorization).toBe('Bearer test-key');
    expect(JSON.parse(opts.body).to).toEqual(['owner@x.com']);
  });
  it('does not crash the form when Resend refuses', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    vi.stubEnv('NOTIFY_EMAIL', 'owner@x.com');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403, text: async () => 'domain not verified' }));
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const res = await handler({ body: JSON.stringify({ payload: { form_name: 'enquiry', data: enquiry } }) });
    expect(res.statusCode).toBe(200);
    expect(log.mock.calls[0][0]).not.toContain('ayesha');
    log.mockRestore();
  });
});
