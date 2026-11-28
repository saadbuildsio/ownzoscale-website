import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PAGES, skipCookies } from './pages.js';

test.describe('every page', () => {
  for (const path of PAGES) {
    test(`${path} loads cleanly`, async ({ page }) => {
      await skipCookies(page);
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      const res = await page.goto(path);
      expect(res.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(await page.title()).toMatch(/OwnzoScale/);
      const desc = await page.locator('meta[name="description"]').getAttribute('content');
      expect(desc.length).toBeGreaterThan(20);
      const width = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(width, 'no sideways scrolling').toBeLessThanOrEqual(0);
      await expect(page.locator('footer')).toContainText('All rights reserved.');
      await expect(page.locator('footer')).not.toContainText('Based in Pakistan');
      expect(errors).toEqual([]);
    });

    test(`${path} has no serious accessibility problems`, async ({ page }) => {
      await skipCookies(page);
      await page.goto(path);
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      const serious = r.violations.filter((v) => ['serious', 'critical'].includes(v.impact)).map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
      expect(serious).toEqual([]);
    });
  }

  test('thank-you page is hidden from Google and has no floating WhatsApp', async ({ page }) => {
    await page.goto('/thank-you/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('a.wa')).toHaveCount(0);
  });

  test('old /book-a-call links are redirected in netlify.toml', async () => {
    const { readFileSync } = await import('node:fs');
    expect(readFileSync('netlify.toml', 'utf8')).toMatch(/from = "\/book-a-call"[\s\S]*?to = "\/book-a-consultation"/);
  });

  test('unknown pages show the 404 page', async ({ page }) => {
    const res = await page.goto('/this-does-not-exist');
    expect(res.status()).toBe(404);
    await expect(page.locator('h1')).toContainText("doesn't exist");
  });

  test('every internal link works', async ({ page, request }) => {
    const links = new Set();
    for (const path of PAGES) {
      await page.goto(path);
      for (const h of await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')))) links.add(h.split('#')[0].split('?')[0]);
    }
    const broken = [];
    for (const l of links) { const r = await request.get(l); if (r.status() >= 400) broken.push(`${l} ${r.status()}`); }
    expect(broken).toEqual([]);
  });

  test('sitemap and robots are correct', async ({ request }) => {
    const sm = await (await request.get('/sitemap.xml')).text();
    expect(sm).toContain('https://ownzoscale.com/services/ai-ads/');
    expect(sm).not.toContain('thank-you');
    expect((sm.match(/<loc>/g) || []).length).toBe(14);
    expect(sm).toContain('/book-a-consultation/');
    expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap: https://ownzoscale.com/sitemap.xml');
  });
});

test.describe('header and footer', () => {
  test('menu works on this screen size', async ({ page }) => {
    await skipCookies(page);
    await page.goto('/');
    const btn = page.locator('.menu-btn');
    const small = (page.viewportSize()?.width ?? 1400) < 900;
    if (small) {
      const panel = page.locator('#mobile-menu');
      await expect(btn).toBeVisible();
      await expect(panel).toBeHidden();
      await btn.click();
      await expect(btn).toHaveAttribute('aria-expanded', 'true');
      await expect(panel).toBeInViewport();
      await expect(panel.locator('.m-card')).toHaveCount(5);
      await expect(panel.getByRole('button', { name: 'Close menu' })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(panel).toBeHidden();
      await expect(btn).toHaveAttribute('aria-expanded', 'false');
      await btn.click();
      await page.locator('.m-dim').click({ position: { x: 10, y: 300 } });
      await expect(panel).toBeHidden();
      await btn.click();
      await panel.getByRole('link', { name: /Lead Generation/ }).click();
      await expect(page).toHaveURL(/\/services\/lead-generation/);
      // fully visible on a short inner page too (it used to get cut off)
      await page.locator('.menu-btn').click();
      const box = await panel.boundingBox();
      const vp = page.viewportSize();
      expect(box.y).toBeLessThanOrEqual(0);
      expect(box.y + box.height).toBeGreaterThanOrEqual(vp.height - 1);
      await expect(panel.getByRole('link', { name: /Discuss Your Project/ })).toBeInViewport();
    } else {
      await expect(btn).toBeHidden();
      await page.locator('.has-drop > a').hover();
      await page.locator('.drop').getByRole('link', { name: 'Lead Generation' }).click();
      await expect(page).toHaveURL(/\/services\/lead-generation/);
    }
  });

  test('current page is marked in the menu', async ({ page }) => {
    await page.goto('/pricing/');
    await expect(page.locator('a[aria-current="page"]', { hasText: 'Pricing' }).first()).toBeAttached();
  });

  test('WhatsApp button opens a chat with the pre-filled message', async ({ page }) => {
    await page.goto('/');
    const href = await page.locator('a.wa').getAttribute('href');
    expect(href).toContain('wa.me/923110020911');
    expect(decodeURIComponent(href)).toContain("I'd like to discuss a project");
    await expect(page.locator('a.wa')).toHaveAttribute('target', '_blank');
  });
});

test.describe('cookie banner', () => {
  test('shows on first visit, remembers Decline, and can be reopened', async ({ page }) => {
    await page.goto('/');
    const banner = page.locator('#cookie-banner');
    await expect(banner).toBeVisible();
    await banner.getByRole('button', { name: 'Decline' }).click();
    await expect(banner).toBeHidden();
    expect(await page.evaluate(() => localStorage.getItem('oz-cookie-choice'))).toBe('decline');
    await page.reload();
    await expect(banner).toBeHidden();
    await page.locator('[data-cookie-settings]').click();
    await expect(banner).toBeVisible();
  });

  test('Accept is remembered and loads no analytics while no ID is set', async ({ page }) => {
    const ga = [];
    page.on('request', (r) => r.url().includes('googletagmanager') && ga.push(r.url()));
    await page.goto('/');
    await page.locator('#cookie-banner').getByRole('button', { name: 'Accept' }).click();
    await page.reload();
    await expect(page.locator('#cookie-banner')).toBeHidden();
    expect(ga).toEqual([]);
  });
});

test.describe('page features', () => {
  test('FAQ answers open and close', async ({ page }) => {
    await skipCookies(page);
    await page.goto('/services/ai-ads/');
    const first = page.locator('.faq details').first();
    await first.locator('summary').click();
    await expect(first).toHaveAttribute('open', '');
    await first.locator('summary').click();
    await expect(first).not.toHaveAttribute('open', '');
  });

  test('pricing tabs switch, and a link can open a tab directly', async ({ page }) => {
    await skipCookies(page);
    await page.goto('/pricing/');
    await expect(page.locator('.ppanel:visible')).toHaveCount(1);
    await expect(page.locator('#ai-ads')).toBeVisible();
    await page.getByRole('tab', { name: 'Websites' }).click();
    await expect(page.locator('#website-development')).toBeVisible();
    await expect(page.locator('#ai-ads')).toBeHidden();
    await page.goto('/pricing/#lead-generation');
    await expect(page.locator('#lead-generation')).toBeVisible();
    await page.goto('/pricing/#bad-tab');
    await expect(page.locator('#ai-ads')).toBeVisible();
  });

  test('each service page shows 3 tiers with the middle one Recommended', async ({ page }) => {
    await skipCookies(page);
    for (const s of ['ai-ads', 'short-form-video-editing', 'ai-automation', 'lead-generation', 'website-development']) {
      await page.goto(`/services/${s}/`);
      const tiers = page.locator('#pricing .tier');
      await expect(tiers).toHaveCount(3);
      await expect(tiers.nth(1)).toHaveClass(/rec/);
      await expect(tiers.nth(1).locator('.badge')).toHaveText('Recommended');
      expect(await tiers.nth(0).locator('a').getAttribute('href')).toMatch(new RegExp(`^/contact\\?service=${s}&tier=`));
    }
  });

  test('"Get Started" on a tier pre-fills the contact form', async ({ page }) => {
    await skipCookies(page);
    await page.goto('/services/ai-automation/');
    await page.locator('#pricing .tier').nth(1).getByRole('link', { name: 'Get Started' }).click();
    await expect(page).toHaveURL(/service=ai-automation&tier=lead-booking-system/);
    await expect(page.locator('input[data-slug="ai-automation"]')).toBeChecked();
    await expect(page.locator('input[name="tier"]')).toHaveValue('lead-booking-system');
    await expect(page.locator('#f-details')).toHaveValue(/Lead Booking System/);
  });

  test('Work page shows the honest empty state', async ({ page }) => {
    await page.goto('/work/');
    await expect(page.getByRole('heading', { name: 'Our first projects are on their way.' })).toBeVisible();
  });

  test('How-it-works steps fill in as you scroll', async ({ page }) => {
    await skipCookies(page);
    await page.goto('/services/ai-ads/');
    await page.locator('.steps').scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 400);
    await expect(page.locator('.steps li.on').first()).toBeAttached();
  });
});

test.describe('keyboard and no-JavaScript visitors', () => {
  test('skip link jumps to the main content', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard test');
    await skipCookies(page);
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.locator('a[href="#main"]');
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });

  test('content and forms are still there without JavaScript', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/services/ai-ads/');
    await expect(page.locator('h1')).toContainText('film shoot');
    await expect(page.locator('#pricing .tier')).toHaveCount(3);
    await page.goto('/contact/');
    await expect(page.locator('form[name="enquiry"] button[type="submit"]')).toBeVisible();
    await ctx.close();
  });
});
