// Business details used across the whole site. Change them here once.
export const site = {
  name: 'OwnzoScale',
  url: 'https://ownzoscale.com',
  tagline: 'We build what your business actually needs.',
  email: 'hello@ownzoscale.com',
  whatsappNumber: '923110020911',
  whatsappMessage:
    "Hi OwnzoScale, I found you through your website. I'd like to discuss a project for my business. Here's what I need: ",
  location: 'Based in Pakistan',
  // Paste the Google Analytics 4 ID (looks like G-XXXXXXXXXX) here. Empty = analytics off.
  gaId: '',
  // Social links: add the full URL to show the icon in the footer. Empty = hidden.
  social: { linkedin: '', instagram: '', facebook: '', tiktok: '', youtube: '' },
};

export const whatsappLink = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(site.whatsappMessage)}`;

export const nav = [
  { label: 'Work', href: '/work' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];
