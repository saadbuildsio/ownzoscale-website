import { test, expect } from '@playwright/test';
import { skipCookies } from './pages.js';

// Netlify receives the real POST only on the live site, so here we catch it and check what would be sent.
const catchPost = async (page, status = 200) => {
  const sent = [];
  await page.route('**/', (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    sent.push(new URLSearchParams(route.request().postData()));
    return route.fulfill({ status, body: 'ok' });
  });
  return sent;
};

test.describe('enquiry form', () => {
  test.beforeEach(async ({ page }) => skipCookies(page));

  test('is set up for Netlify Forms with spam protection', async ({ page }) => {
    await page.goto('/contact/');
    const form = page.locator('form[name="enquiry"]');
    await expect(form).toHaveAttribute('data-netlify', 'true');
    await expect(form).toHaveAttribute('netlify-honeypot', 'bot-field');
    await expect(form).toHaveAttribute('action', '/thank-you');
    await expect(form.locator('input[name="form-name"]')).toHaveValue('enquiry');
    await expect(form.locator('input[name="bot-field"]')).toBeHidden();
  });

  test('shows friendly messages for missing fields and does not send', async ({ page }) => {
    const sent = await catchPost(page);
    await page.goto('/contact/');
    await page.getByRole('button', { name: 'Send My Enquiry' }).click();
    for (const msg of ['Please add your name.', 'Please add your email so we can reply.', 'Please add your business name.', 'Please pick at least one option, or choose Not sure yet.', 'Please tell us a little about your project.']) {
      await expect(page.getByText(msg)).toBeVisible();
    }
    await expect(page.locator('#f-name')).toBeFocused();
    await expect(page.locator('#f-name')).toHaveAttribute('aria-invalid', 'true');
    expect(sent).toHaveLength(0);
  });

  test('catches a wrong email and clears the message once fixed', async ({ page }) => {
    await page.goto('/contact/');
    await page.fill('#f-email', 'saad@gmail');
    await page.getByRole('button', { name: 'Send My Enquiry' }).click();
    await expect(page.getByText('Please check your email address.')).toBeVisible();
    await page.fill('#f-email', 'saad@gmail.com');
    await expect(page.getByText('Please check your email address.')).toHaveCount(0);
  });

  test('sends everything and goes to the thank-you page', async ({ page }) => {
    const sent = await catchPost(page);
    await page.goto('/contact/');
    await page.fill('#f-name', 'Test Person');
    await page.fill('#f-email', 'test@example.com');
    await page.fill('#f-biz', 'Test & Co');
    await page.fill('#f-web', 'example.com');
    const form = page.locator('form[name="enquiry"]');
    await form.getByText('AI Ads & Creative Production').click();
    await form.getByText('Lead Generation', { exact: true }).click();
    await page.selectOption('#f-budget', '$1,000–$2,500');
    await form.getByText('WhatsApp', { exact: true }).click();
    await page.fill('#f-details', 'We sell skincare and need ads.');
    await page.getByRole('button', { name: 'Send My Enquiry' }).click();
    await expect(page).toHaveURL(/\/thank-you/);
    expect(sent).toHaveLength(1);
    const d = sent[0];
    expect(d.get('form-name')).toBe('enquiry');
    expect(d.get('name')).toBe('Test Person');
    expect(d.get('email')).toBe('test@example.com');
    expect(d.get('business')).toBe('Test & Co');
    expect(d.get('services')).toBe('AI Ads & Creative Production, Lead Generation');
    expect(d.get('budget')).toBe('$1,000–$2,500');
    expect(d.get('contact_preference')).toBe('WhatsApp');
    expect(d.get('bot-field')).toBe('');
    expect(d.get('subject')).toContain('New enquiry');
  });

  test('shows the error message with WhatsApp if sending fails, and keeps what was typed', async ({ page }) => {
    await catchPost(page, 500);
    await page.goto('/contact/?service=not-sure');
    await page.fill('#f-name', 'A');
    await page.fill('#f-email', 'a@b.co');
    await page.fill('#f-biz', 'B');
    await page.fill('#f-details', 'C');
    await page.getByRole('button', { name: 'Send My Enquiry' }).click();
    const err = page.locator('.form-error');
    await expect(err).toBeVisible();
    await expect(err.getByRole('link', { name: 'message us on WhatsApp' })).toHaveAttribute('href', /wa\.me/);
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.locator('#f-name')).toHaveValue('A');
    await expect(page.getByRole('button', { name: 'Send My Enquiry' })).toBeEnabled();
  });

  test('a strange link does not break the form', async ({ page }) => {
    await page.goto('/contact/?service=hack&tier=%3Cb%3Ehi%3C/b%3E');
    await expect(page.locator('input[name="services"]:checked')).toHaveCount(0);
    await expect(page.locator('#f-details')).toHaveValue("I'm interested in the Bhib option.\n\n");
  });
});

test.describe('consultation form', () => {
  test.beforeEach(async ({ page }) => skipCookies(page));

  const fillBasics = async (page) => {
    await page.fill('#c-name', 'Test');
    await page.fill('#c-email', 'test@example.com');
    await page.fill('#c-biz', 'Biz');
    await page.fill('#c-times', 'Tue afternoon');
    await page.fill('#c-tz', 'London');
    await page.fill('#c-topic', 'Automation');
  };

  test('asks how they want to talk, and validates', async ({ page }) => {
    const sent = await catchPost(page);
    await page.goto('/book-a-consultation/');
    await expect(page.locator('form[name="consultation"]')).toHaveAttribute('data-netlify', 'true');
    await page.getByRole('button', { name: 'Book My Consultation' }).click();
    await expect(page.getByText("Please choose how you'd like to talk.")).toBeVisible();
    await expect(page.getByText('Please tell us when suits you.')).toBeVisible();
    expect(sent).toHaveLength(0);
  });

  test('needs a number for WhatsApp or phone, not for video', async ({ page }) => {
    const sent = await catchPost(page);
    await page.goto('/book-a-consultation/');
    await fillBasics(page);
    await page.locator('label.fmt-opt', { hasText: 'Phone call' }).click();
    await expect(page.locator('[data-phone-note]')).toHaveText('(needed for this option)');
    await page.getByRole('button', { name: 'Book My Consultation' }).click();
    await expect(page.getByText('Please add your number so we can reach you.')).toBeVisible();
    expect(sent).toHaveLength(0);
    await page.locator('label.fmt-opt', { hasText: 'Video call' }).click();
    await expect(page.locator('[data-phone-note]')).toHaveText('(optional)');
    await page.getByRole('button', { name: 'Book My Consultation' }).click();
    await expect(page).toHaveURL(/\/thank-you/);
    expect(sent[0].get('form-name')).toBe('consultation');
    expect(sent[0].get('format')).toBe('Video call');
  });

  test('sends WhatsApp chat requests with the number', async ({ page }) => {
    const sent = await catchPost(page);
    await page.goto('/book-a-consultation/');
    await fillBasics(page);
    await page.locator('label.fmt-opt', { hasText: 'WhatsApp chat' }).click();
    await page.fill('#c-phone', '+44 7700 900123');
    await page.getByRole('button', { name: 'Book My Consultation' }).click();
    await expect(page).toHaveURL(/\/thank-you/);
    expect(sent[0].get('format')).toBe('WhatsApp chat');
    expect(sent[0].get('phone')).toBe('+44 7700 900123');
    expect(sent[0].get('time_zone')).toBe('London');
  });
});
