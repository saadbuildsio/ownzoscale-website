// Draft prices (USD). Saad will change these. Middle tier is always "Recommended".
export type Tier = { id: string; name: string; price: string; per?: string; bestFor: string; includes: string[]; recommended?: boolean };
export type PriceSet = { service: string; label: string; tiers: Tier[]; note?: string };

export const pricing: PriceSet[] = [
  {
    service: 'ai-ads', label: 'AI Ads',
    tiers: [
      { id: 'single-ad', name: 'Single Ad', price: '$500', bestFor: 'One strong ad for a product or offer', includes: ['1 AI video ad (15–30 sec)', '1 creative concept', 'Vertical and square formats', 'Up to 2 revision rounds'] },
      { id: 'ad-pack', name: 'Ad Pack', price: '$1,500', bestFor: 'Brands running ads that need variety', recommended: true, includes: ['4 AI video ads (product commercial and UGC-style mix)', '2 opening hooks per ad', 'All main formats (9:16, 1:1, 4:5)', 'Up to 2 revision rounds per ad'] },
      { id: 'brand-campaign', name: 'Brand Campaign', price: '$3,000', bestFor: 'Launches and big brand moments', includes: ['1 cinematic brand commercial (30–60 sec)', '3 short cut-downs', '10 AI product photos', 'All formats', 'Up to 2 revision rounds'] },
    ],
  },
  {
    service: 'short-form-video-editing', label: 'Video Editing',
    tiers: [
      { id: 'starter', name: 'Starter', price: '$500', per: '/month', bestFor: 'Posting a few times a week', includes: ['10 edited short videos', 'Captions', 'Basic transitions and music', 'Formats for Reels, TikTok and Shorts'] },
      { id: 'growth', name: 'Growth', price: '$1,000', per: '/month', bestFor: 'Posting most days', recommended: true, includes: ['20 edited short videos', 'Captions and subtitles', 'Motion graphics and sound design', 'Hook-first editing', 'Formats for every platform'] },
      { id: 'pro', name: 'Pro', price: '$1,800', per: '/month', bestFor: 'Daily posting across platforms', includes: ['30 edited short videos', 'Everything in Growth', 'Thumbnail or cover for each video', 'Priority turnaround'] },
    ],
    note: 'One-off edits are available by quote.',
  },
  {
    service: 'ai-automation', label: 'Automation',
    tiers: [
      { id: 'ai-assistant', name: 'AI Assistant', price: '$750', bestFor: 'Answering common questions automatically', includes: ['WhatsApp or website assistant', 'Trained on your business info', 'Captures name and contact details', 'Sends leads to your email or sheet', 'Hands over to a person when needed'] },
      { id: 'lead-booking-system', name: 'Lead & Booking System', price: '$1,800', bestFor: 'Businesses that book appointments or calls', recommended: true, includes: ['Everything in AI Assistant', 'Asks qualifying questions', 'Books into your calendar', 'Adds leads to your CRM', 'Reminder messages'] },
      { id: 'custom-automation', name: 'Custom Automation', price: 'Custom quote', bestFor: 'Unique processes and bigger systems', includes: ['Process mapping', 'Multi-step workflows', 'Connects your existing tools', 'AI receptionist (calls) if needed', 'Testing and handover'] },
    ],
    note: 'Setup prices are one-time. Monthly software or messaging costs (if any) are paid by you directly, and we explain them before you start.',
  },
  {
    service: 'lead-generation', label: 'Lead Generation',
    tiers: [
      { id: 'starter', name: 'Starter', price: '$500', per: '/month', bestFor: 'Testing one channel', includes: ['1 platform (Meta or Google)', 'Campaign setup', 'Lead form', 'Monthly report'] },
      { id: 'growth', name: 'Growth', price: '$1,000', per: '/month', bestFor: 'Steady enquiries from Meta and Google', recommended: true, includes: ['Meta and Google', 'Lead forms and funnel', 'Lead tracking setup', 'Ongoing improvements', 'Report every 2 weeks'] },
      { id: 'scale', name: 'Scale', price: '$1,800', per: '/month', bestFor: 'Multiple services or locations', includes: ['Multiple campaigns and locations', 'Fresh ad creative plan', 'Weekly report', 'Monthly review call'] },
    ],
    note: 'Management fee only. Your ad budget is paid directly to Meta or Google.',
  },
  {
    service: 'website-development', label: 'Websites',
    tiers: [
      { id: 'landing-page', name: 'Landing Page', price: '$600', bestFor: 'One offer or ad campaign', includes: ['1 conversion-focused page', 'Mobile-first', 'Enquiry form', 'Speed and SEO basics'] },
      { id: 'business-website', name: 'Business Website', price: '$1,500', bestFor: 'Most service businesses', recommended: true, includes: ['Up to 6 pages', 'Clear service pages', 'Enquiry form', 'Speed and technical SEO', 'Google Analytics setup'] },
      { id: 'ecommerce-store', name: 'E-commerce Store', price: '$3,000', bestFor: 'Selling products online', includes: ['Store setup', 'Up to 30 products added', 'Payments and shipping setup', 'Mobile-first design', 'Speed and SEO basics'] },
    ],
  },
];
export const priceFor = (slug: string) => pricing.find((p) => p.service === slug)!;
