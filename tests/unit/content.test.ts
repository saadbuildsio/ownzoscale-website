import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { services } from '../../src/data/services';
import { pricing } from '../../src/data/pricing';
import { servicePages } from '../../src/data/serviceContent';
import { site, whatsappLink, terms } from '../../src/data/site';
import icons from '../../src/data/icons.json';

describe('services', () => {
  it('are the 5 approved services in the approved order', () => {
    expect(services.map((s) => s.slug)).toEqual(['ai-ads', 'short-form-video-editing', 'ai-automation', 'lead-generation', 'website-development']);
  });
  it('only AI Ads is flagship', () => expect(services.filter((s) => s.flagship).map((s) => s.slug)).toEqual(['ai-ads']));
  it('every icon exists', () => services.forEach((s) => expect(icons).toHaveProperty(s.icon)));
});

describe('pricing', () => {
  it('has a price set for every service', () => expect(pricing.map((p) => p.service).sort()).toEqual(services.map((s) => s.slug).sort()));
  it.each(pricing.map((p) => [p.service, p]))('%s has 3 tiers with only the middle one Recommended', (_, p: any) => {
    expect(p.tiers).toHaveLength(3);
    expect(p.tiers.map((t: any) => !!t.recommended)).toEqual([false, true, false]);
  });
  it('tier ids are unique within a service and URL-safe', () => {
    for (const p of pricing) {
      const ids = p.tiers.map((t) => t.id);
      expect(new Set(ids).size).toBe(ids.length);
      ids.forEach((id) => expect(id).toMatch(/^[a-z0-9-]+$/));
    }
  });
  it('prices are in USD or a custom quote', () => {
    for (const p of pricing) for (const t of p.tiers) expect(t.price).toMatch(/^\$\d{1,3}(,\d{3})*$|^Custom quote$/);
  });
  it('prices go up from tier 1 to tier 3', () => {
    for (const p of pricing) {
      const n = p.tiers.map((t) => Number(t.price.replace(/[$,]/g, ''))).filter((x) => !Number.isNaN(x));
      expect([...n].sort((a, b) => a - b)).toEqual(n);
    }
  });
});

describe('service pages', () => {
  it('exist for every service, with unique titles', () => {
    expect(servicePages.map((p) => p.slug)).toEqual(services.map((s) => s.slug));
    expect(new Set(servicePages.map((p) => p.seoTitle)).size).toBe(5);
  });
  it.each(servicePages.map((p) => [p.slug, p]))('%s has SEO text in good length and complete sections', (_, p: any) => {
    expect(p.seoTitle.length).toBeLessThanOrEqual(75);
    expect(p.description.length).toBeGreaterThan(70);
    expect(p.description.length).toBeLessThanOrEqual(170);
    expect(p.steps.list.length).toBe(5);
    expect(p.faqs.length).toBeGreaterThanOrEqual(5);
    p.related.forEach((r: any) => expect(services.map((s) => s.slug)).toContain(r.slug));
    p.items.cards.forEach((c: any) => expect(icons).toHaveProperty(c.icon));
  });
});

describe('site details', () => {
  it('WhatsApp link uses the right number and pre-filled message', () => {
    expect(whatsappLink.startsWith('https://wa.me/923110020911?text=')).toBe(true);
    expect(decodeURIComponent(whatsappLink.split('text=')[1])).toBe(site.whatsappMessage);
  });
  it('analytics stays off until an ID is added', () => expect(site.gaId === '' || /^G-[A-Z0-9]+$/.test(site.gaId)).toBe(true));
  it('terms are filled in', () => Object.values(terms).forEach((v) => expect(v.length).toBeGreaterThan(5)));
});

// Brand rules from Saad: never mention internal tools or freelancers, never call one ad a "test",
// no invented proof, no placeholder notes left in the copy.
const files = (dir: string): string[] => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? files(p) : [p]; });
const source = files('src').filter((f) => /\.(astro|ts|js)$/.test(f)).map((f) => [f, readFileSync(f, 'utf8')] as const);

describe('brand rules in the copy', () => {
  const banned: [RegExp, string][] = [
    [/heygen|hyperframes/i, 'internal video tools'],
    [/\bclaude\b/i, 'internal tools'],
    [/freelancer(?!s who never talk)/i, 'freelancers (only allowed in the About story)'],
    [/\[confirm|\[later|lorem ipsum|TODO/i, 'placeholder notes'],
    [/testimonial|case stud|\b\d+\+? (happy )?clients\b|trusted by/i, 'invented proof'],
    [/one ad to test|test (an|one|a single) ad/i, 'single ad framed as a test'],
    [/US and Pakistan/i, 'old market wording'],
    [/strategy call/i, 'old "strategy call" wording (now Book a Consultation)'],
  ];
  it.each(banned)('no %s (%s)', (re) => {
    const hits = source.filter(([, s]) => re.test(s)).map(([f]) => f);
    expect(hits).toEqual([]);
  });
});
