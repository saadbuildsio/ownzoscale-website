import { describe, it, expect } from 'vitest';
import { isValidEmail, tierLabel, tierMessage, fieldError, encodeForm, requiredFor } from '../../src/scripts/form-utils.js';

describe('isValidEmail', () => {
  it.each(['a@b.co', 'saad@ownzoscale.com', ' name.last+tag@mail.example.org '])('accepts %s', (e) => expect(isValidEmail(e)).toBe(true));
  it.each(['', 'abc', 'a@b', 'a b@c.com', '@b.com', 'a@.', null, undefined])('rejects %s', (e) => expect(isValidEmail(e)).toBe(false));
});

describe('tierLabel / tierMessage', () => {
  it('turns slugs into names', () => {
    expect(tierLabel('ad-pack')).toBe('Ad Pack');
    expect(tierLabel('lead-booking-system')).toBe('Lead Booking System');
    expect(tierLabel('ECOMMERCE-store')).toBe('Ecommerce Store');
  });
  it('strips anything that is not a letter, number or dash', () => {
    expect(tierLabel('<script>alert(1)</script>')).toBe('Scriptalert1script');
    expect(tierLabel('--')).toBe('');
  });
  it('builds a friendly message, or nothing for an empty tier', () => {
    expect(tierMessage('growth')).toBe("I'm interested in the Growth option.\n\n");
    expect(tierMessage('')).toBe('');
    expect(tierMessage(null)).toBe('');
  });
});

describe('fieldError', () => {
  const el = (value, type = 'text', msg = 'Please add your name.') => ({ value, type, dataset: { msg } });
  it('uses the field message when empty or only spaces', () => {
    expect(fieldError(el(''))).toBe('Please add your name.');
    expect(fieldError(el('   '))).toBe('Please add your name.');
  });
  it('falls back to a generic message', () => expect(fieldError({ value: '', type: 'text', dataset: {} })).toBe('Please fill in this field.'));
  it('checks email format', () => {
    expect(fieldError(el('nope', 'email', 'x'))).toBe('Please check your email address.');
    expect(fieldError(el('a@b.co', 'email', 'x'))).toBe('');
  });
  it('passes filled fields', () => expect(fieldError(el('Saad'))).toBe(''));
});

describe('encodeForm', () => {
  it('joins ticked services into one field and keeps the rest', () => {
    const fd = new FormData();
    fd.append('form-name', 'enquiry');
    fd.append('name', 'Ali & Sons');
    fd.append('services', 'AI Ads & Creative Production');
    fd.append('services', 'Lead Generation');
    const p = new URLSearchParams(encodeForm(fd));
    expect(p.get('form-name')).toBe('enquiry');
    expect(p.get('name')).toBe('Ali & Sons');
    expect(p.getAll('services')).toEqual(['AI Ads & Creative Production, Lead Generation']);
  });
  it('leaves services out when none are ticked', () => {
    const fd = new FormData();
    fd.append('form-name', 'call-request');
    expect(new URLSearchParams(encodeForm(fd)).has('services')).toBe(false);
  });
});

describe('requiredFor', () => {
  const list = 'WhatsApp chat,Phone call';
  it('is true for formats that need a number', () => { expect(requiredFor(list, 'Phone call')).toBe(true); expect(requiredFor(list, 'WhatsApp chat')).toBe(true); });
  it('is false for video or nothing picked', () => { expect(requiredFor(list, 'Video call')).toBe(false); expect(requiredFor(list, undefined)).toBe(false); expect(requiredFor('', 'Phone call')).toBe(false); });
});
