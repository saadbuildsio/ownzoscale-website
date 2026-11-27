// Page copy for the 5 service pages (from CONTENT_DOCUMENT.md, Phase 4 approved).
type Card = { icon: string; title: string; text: string; use?: string };
type Btn = { label: string; href: string };
export type ServicePageContent = {
  slug: string;
  seoTitle: string;
  description: string;
  pill?: string;
  h1: [string, string]; // [plain part, highlighted part]
  sub: string;
  primary: Btn;
  secondary: Btn;
  formats?: string[];
  visual: { tag: { title: string; sub: string }; cards: { kind: 'edit' | 'chat' | 'bars'; title: string; sub: string }[]; label: string };
  problem: { heading: string; paras: string[] };
  compare?: { cols: [string, string]; rows: [string, string, string][] };
  aside?: { title: string; items: string[] };
  items: { heading: string; intro: string; cards: Card[] };
  examples?: { heading: string; intro: string; items: string[]; note: string };
  band?: { heading: string; paras: string[]; checks: string[] };
  steps: { heading: string; intro: string; list: [string, string][] };
  goodFor: { title: string; items: string[] };
  receive: string[];
  notes?: { heading: string; text: string }[];
  faqHeading: string;
  faqs: [string, string][];
  related: { slug: string; text: string }[];
  cta: { heading: string; text: string; primary: Btn };
};

const call: Btn = { label: 'Book a Strategy Call', href: '/book-a-call' };
const contact = (label: string, slug: string): Btn => ({ label, href: `/contact?service=${slug}` });

export const servicePages: ServicePageContent[] = [
  {
    slug: 'ai-ads',
    seoTitle: 'AI Video Ads & Product Commercials | OwnzoScale',
    description: 'AI product commercials, UGC-style video ads, cinematic brand films and AI product photography. Professional ads without the cost of a film shoot.',
    pill: 'Flagship service',
    h1: ['Professional ads without the cost of a', 'film shoot.'],
    sub: 'We create video ads and product visuals with AI that look polished, feel real and are ready for Meta, TikTok, YouTube and your website.',
    primary: contact('Discuss Your Ad Project', 'ai-ads'),
    secondary: call,
    formats: ['9:16 Reels & TikTok', '1:1 Feed', '4:5 Feed', '16:9 YouTube'],
    visual: { tag: { title: 'AI Product Commercial', sub: '15 sec · 9:16' }, cards: [{ kind: 'edit', title: 'Concept approved', sub: 'Script · Storyboard' }, { kind: 'chat', title: 'Ready to upload', sub: '9:16 · 1:1 · 4:5' }], label: 'Illustration of an AI product ad on a phone' },
    problem: { heading: "Great ads shouldn't take a studio and six weeks.", paras: ["A traditional shoot means booking a crew, actors, a location and an editor. It's slow, it's expensive, and by the time it's done you need fresh ads again, because people stop noticing the same ad after a few weeks.", 'AI production changes that. You get the polished look of a professional shoot, in less time and for less money, so you can try more ideas and keep your ads fresh.'] },
    compare: { cols: ['Traditional shoot', 'OwnzoScale AI production'], rows: [['Crew, actors, location', 'Needed', 'Not needed'], ['Time to first ad', 'Weeks', 'Much faster'], ['New versions and hooks', 'New shoot or costly edits', 'Easy to create'], ['Product looks like the real thing', 'Yes', 'Yes, made from your product images'], ['Revisions', 'Limited', 'Up to 2 rounds per ad']] },
    items: { heading: 'What we make', intro: 'Four formats, one goal: ads people stop scrolling for.', cards: [
      { icon: 'ads', title: 'AI Product Commercials', text: 'Short, high-quality ads that show your product at its best: the details, the use, the feeling.', use: 'Launches, offers, always-on ads' },
      { icon: 'edit', title: 'AI UGC-Style Video Ads', text: 'Ads in the style of a real customer talking to camera: reviews, demos, unboxings. This format feels natural in a social feed and builds trust fast.', use: 'Building trust on Meta and TikTok' },
      { icon: 'grow', title: 'Cinematic Brand Commercials', text: 'A bigger, story-led film for your brand, with the look of a high-end TV ad.', use: 'Brand launches, websites, hero campaigns' },
      { icon: 'plan', title: 'AI Product Photography', text: 'Studio-quality product photos in any setting you want, without a studio, photographer or props.', use: 'Ads, online stores, social media' },
    ] },
    band: { heading: 'Does AI content look fake?', paras: ["Bad AI content does. That's why every ad we make goes through a human creative process: a real concept, a script, careful production and a review before you see it.", "If something isn't right, you get up to 2 rounds of revisions."], checks: ['Faces and hands look natural', 'Your product matches the real thing', 'Text and logos are sharp and correct', 'Movement is smooth, with no glitches', 'Sound, music and captions fit the brand'] },
    steps: { heading: 'How it works', intro: 'Clear steps. You approve before anything is final.', list: [['Brief', 'You tell us about the product, audience and where the ad will run.'], ['Concept & script', 'We write the idea and the script, and share it for your approval.'], ['Production', 'We create the ad and add music, captions and sound.'], ['Review', 'You watch it and request changes (up to 2 revision rounds).'], ['Final files', 'You get every format you need, ready to upload.']] },
    goodFor: { title: 'Good for', items: ['Launching a new product or offer', 'Refreshing ads that have stopped performing', 'Trying several ad ideas without paying for several shoots', 'Product brands without a big video budget', 'Agencies that need extra creative capacity'] },
    receive: ['Final videos in 9:16 (Reels, TikTok, Stories), 1:1 and 4:5 (feed), and 16:9 if needed', 'Versions with and without captions', 'High-resolution product images (for photography projects)', 'Full rights to use the content in your marketing'],
    faqHeading: 'Questions about AI ads',
    faqs: [
      ['What do you need from me to start?', 'Your product details, photos of the product if you have them, your audience, and where the ad will run. A short form covers all of it.'],
      ['How long does an ad take?', 'It depends on the type and number of ads. We give you a clear timeline before we start.'],
      ['How many revisions do I get?', 'Up to 2 rounds of revisions on every ad.'],
      ['Can you use my real product?', 'Yes. We use your actual product images so the product in the ad matches what customers receive.'],
      ['Who owns the ads?', 'You do. Once paid for, you can use them anywhere: ads, website, social media.'],
      ['Do you also run the ads?', 'We can. Our Lead Generation service runs Meta and Google campaigns. You can also run them yourself.'],
    ],
    related: [{ slug: 'short-form-video-editing', text: 'Turn your own footage into Reels and Shorts too.' }, { slug: 'lead-generation', text: 'Put your new ads in front of the right people.' }],
    cta: { heading: 'Have a product or offer that needs a great ad?', text: "Tell us what you're selling and where you want to advertise. We'll suggest the best format for your goal.", primary: contact('Discuss Your Ad Project', 'ai-ads') },
  },
  {
    slug: 'short-form-video-editing',
    seoTitle: 'Short-Form Video Editing for Reels, TikTok & Shorts | OwnzoScale',
    description: 'Send us your raw footage and get back polished Reels, TikToks and YouTube Shorts with captions, motion graphics and sound design.',
    h1: ['Send us your raw footage. Get back videos', 'people actually watch.'],
    sub: 'We edit your clips into professional Reels, TikToks and YouTube Shorts with captions, motion graphics, clean transitions and sound, ready to post.',
    primary: contact('Discuss Your Editing Project', 'short-form-video-editing'),
    secondary: call,
    formats: ['9:16 Reels', 'TikTok', 'YouTube Shorts', 'Facebook'],
    visual: { tag: { title: 'Edited Reel', sub: '30 sec · 9:16' }, cards: [{ kind: 'edit', title: 'Your clips, edited', sub: 'Captions · Sound · Cuts' }, { kind: 'chat', title: 'Ready to post', sub: 'Reels · TikTok · Shorts' }], label: 'Illustration of an edited vertical video on a phone' },
    problem: { heading: "You've got the footage. You just don't have the time.", paras: ['Filming is the easy part. Editing is where hours disappear: cutting the boring bits, adding captions, finding music, resizing for each app. So the clips sit in your phone and you post less than you planned.', 'We take that whole job off your plate. You film, we edit, you post.'] },
    aside: { title: 'What editing usually takes', items: ['Cutting the slow parts and mistakes', 'Writing and timing captions', 'Finding music that is safe to use', 'Resizing for every app', 'Keeping a consistent style'] },
    items: { heading: "What's included", intro: 'Everything a short video needs before it goes live.', cards: [
      { icon: 'edit', title: 'Reels, TikToks & YouTube Shorts', text: 'Vertical videos made for how people scroll, with a strong first 3 seconds.' },
      { icon: 'build', title: 'Raw Footage to Polished Videos', text: 'We cut, trim, colour-correct and tidy up your clips so they look professional.' },
      { icon: 'talk', title: 'Captions, Subtitles & Motion Graphics', text: 'Easy-to-read captions (most people watch on mute), plus text and graphics that highlight key points.' },
      { icon: 'grow', title: 'Smooth Transitions & Sound Design', text: 'Clean cuts, music and sound effects that keep people watching.' },
      { icon: 'auto', title: 'AI-Assisted Editing & Enhancements', text: 'We use AI tools to clean up audio, improve quality and speed up editing, so you get more videos, faster.' },
      { icon: 'web', title: 'Platform-Optimized Formats', text: 'The right size, length and style for Instagram, TikTok, YouTube and Facebook.' },
    ] },
    steps: { heading: 'How it works', intro: 'Set up once, then a steady flow of videos.', list: [['Share your footage', 'Upload your clips to a shared folder.'], ['Agree the style', 'Fonts, colours, pace and music, set once and kept consistent.'], ['We edit', 'Your videos are edited and checked.'], ['You review', 'Request changes if anything needs adjusting.'], ['Ready to post', 'Final files delivered in every format you need.']] },
    goodFor: { title: "Who it's for", items: ['Business owners filming their own content', 'Coaches and consultants', 'Creators and personal brands', 'Product brands with behind-the-scenes footage', 'Agencies that need a reliable editing partner'] },
    receive: ['Edited vertical videos (9:16) ready for Reels, TikTok and Shorts', 'Burned-in captions (and caption-free versions on request)', 'Consistent branded style across all videos', 'Cover images on the Pro plan'],
    faqHeading: 'Questions about video editing',
    faqs: [
      ['What footage do I need to send?', "Any clear footage from your phone or camera works. We'll give you simple filming tips if you'd like them."],
      ['Can you match my brand style?', 'Yes. We agree fonts, colours and style at the start and keep every video consistent.'],
      ['How fast will I get my videos?', 'We agree a delivery schedule with you before we start, so you know when to expect each batch.'],
      ['Do you use copyrighted music?', "We use music that is safe to use on each platform, so your videos aren't muted or taken down."],
      ['Can I order just a few videos?', 'Yes. Monthly plans give the best value, but one-off projects are available on request.'],
    ],
    related: [{ slug: 'ai-ads', text: 'Need ads made from scratch? We create them with AI.' }, { slug: 'lead-generation', text: 'Turn your best videos into lead campaigns.' }],
    cta: { heading: 'Stop letting good footage sit in your phone.', text: "Tell us what you film and how often you want to post. We'll suggest the right plan.", primary: contact('Discuss Your Editing Project', 'short-form-video-editing') },
  },
  {
    slug: 'ai-automation',
    seoTitle: 'AI Receptionist, WhatsApp Assistant & Business Automation | OwnzoScale',
    description: 'AI assistants that answer enquiries on WhatsApp and your website, qualify leads and book appointments, plus CRM and workflow automation that saves your team time.',
    h1: ['Never leave an enquiry', 'waiting again.'],
    sub: 'We set up AI assistants that reply to your customers in seconds, ask the right questions and book appointments, plus automations that take repetitive admin off your team.',
    primary: { label: 'Book a Strategy Call', href: '/book-a-call' },
    secondary: { label: 'Discuss Your Project', href: '/contact?service=ai-automation' },
    visual: { tag: { title: 'WhatsApp assistant', sub: 'Example conversation' }, cards: [{ kind: 'chat', title: 'Consultation booked', sub: 'Tue · 11:00 AM' }, { kind: 'edit', title: 'Lead added to CRM', sub: 'Name · Phone · Budget' }], label: 'Illustration of an AI assistant replying to an enquiry and booking an appointment' },
    problem: { heading: 'Every slow reply is a customer who might go elsewhere.', paras: ["Messages come in while you're with a client, driving, or asleep. By the time you reply, some people have already booked with someone else. And your team spends hours copying details between apps, sending reminders and answering the same questions.", 'Automation handles the repetitive part, so you and your team can focus on the work that needs a person.'] },
    aside: { title: 'What automation can take off your plate', items: ['Replying to common questions', 'Collecting names and contact details', 'Booking calls and appointments', 'Adding leads to your CRM or sheet', 'Sending follow-ups and reminders'] },
    items: { heading: 'What we set up', intro: 'Pick one, or combine them into one system.', cards: [
      { icon: 'talk', title: 'AI Receptionists', text: 'Answer calls or messages, share information and take details, so no enquiry is missed.' },
      { icon: 'auto', title: 'WhatsApp & Website AI Assistants', text: 'Answer common questions about your services, prices, hours and location, any time of day, in a friendly, on-brand way.' },
      { icon: 'lead', title: 'Lead Qualification & Booking', text: 'Ask a few simple questions to see if a lead is a good fit, then book them straight into your calendar.' },
      { icon: 'build', title: 'CRM & Workflow Automation', text: 'New leads go into your CRM or spreadsheet automatically, and follow-ups and reminders go out without anyone remembering to send them.' },
      { icon: 'plan', title: 'Custom AI Automations', text: 'Have a process that eats your time? We map it and automate the repetitive steps.' },
    ] },
    examples: { heading: 'What this looks like in real life', intro: 'A few simple examples.', items: ["A clinic's WhatsApp assistant answers questions about treatments and books consultations at 11 PM.", "A real estate agent's website assistant asks buyers about budget and area, then sends qualified leads to the agent.", 'A service business gets every new form lead added to its CRM, with an instant reply and a reminder the next day.'], note: "These are illustrations of what's possible, not client results." },
    band: { heading: 'Smart, but not on its own.', paras: ['Your assistant only answers using the information you approve. When a question is too specific, sensitive or unusual, it passes the conversation to you or your team.', "You can see the conversations, and we adjust the setup as we learn what customers ask. Automation saves time; it doesn't replace good judgement."], checks: ['Answers only from information you approve', 'Hands over to a person when unsure', 'You can see every conversation', 'Tested with real questions before launch', 'Accounts set up in your name'] },
    steps: { heading: 'How setup works', intro: 'Nothing goes live until we have tested it together.', list: [['Map your process', 'We learn how enquiries and bookings work in your business today.'], ['Plan the system', 'We show you what will be automated and what stays with your team.'], ['Build and train', 'We set it up using your real business information.'], ['Test together', 'We test real conversations before anything goes live.'], ['Launch and adjust', 'We launch, watch the first conversations and fine-tune.']] },
    goodFor: { title: 'Good for', items: ['Clinics, salons and studios that take bookings', 'Real estate agents and consultants', 'Home service companies', 'Online stores answering the same questions daily', 'Any team buried in repetitive admin'] },
    receive: ['A working assistant or automation, connected to your channels', 'Clear handover notes showing how it works and how to update it', 'A list of any monthly software costs, explained upfront', 'Accounts set up in your name'],
    faqHeading: 'Questions about automation',
    faqs: [
      ['Will the AI say something wrong to my customers?', "It only answers from information you've approved, and it hands over to a person when it isn't sure. We test it before launch and keep improving it."],
      ['Do I need technical knowledge?', 'No. We set everything up and show you how it works in plain language.'],
      ['Which apps can it connect to?', "WhatsApp, website chat, calendars, email, spreadsheets and most popular CRMs. Tell us what you use and we'll confirm."],
      ['Are there monthly costs after setup?', 'Some tools charge a small monthly fee (for example, messaging or AI usage). We tell you exactly what they are before you start.'],
      ['Is my customer data safe?', 'We use trusted platforms, set accounts up in your name, and only collect the information the system needs.'],
    ],
    related: [{ slug: 'lead-generation', text: 'Bring in more enquiries for your assistant to answer.' }, { slug: 'website-development', text: 'Add an assistant to a fast, clear website.' }],
    cta: { heading: 'How many enquiries are waiting for a reply right now?', text: "Book a call and we'll show you what could be automated in your business, and what's better left to a person.", primary: { label: 'Book a Strategy Call', href: '/book-a-call' } },
  },
  {
    slug: 'lead-generation',
    seoTitle: 'Lead Generation with Meta & Google Ads | OwnzoScale',
    description: 'Meta and Google ad campaigns built to bring your business calls, enquiries and booked clients, with lead forms, funnels, tracking and simple reports.',
    h1: ['Ad campaigns built to bring you', 'enquiries, not just clicks.'],
    sub: 'We plan, launch and manage Meta and Google campaigns that turn the right people into calls, enquiries and booked clients, and we show you exactly where every lead came from.',
    primary: contact('Discuss Your Project', 'lead-generation'),
    secondary: call,
    visual: { tag: { title: 'Lead form ad', sub: 'Meta · Instagram' }, cards: [{ kind: 'bars', title: 'Enquiries this month', sub: 'Example report' }, { kind: 'chat', title: 'New lead received', sub: 'Sent to your CRM' }], label: 'Illustration of a lead ad on a phone with an example lead report' },
    problem: { heading: 'Spent money on ads before and got nothing back?', paras: ["It's common. Ads get boosted with no clear target, people click and leave, and nobody tracks which lead came from where. So you never know what's working.", 'Good lead generation is a system: the right audience, the right ad, a page or form that makes it easy to enquire, and tracking that shows you the real results.'] },
    aside: { title: 'How the system works', items: ['Targeting the right people', 'An ad worth stopping for', 'A landing page or form that is easy to fill', 'Every lead captured', 'Tracked and reported, so nothing leaks'] },
    items: { heading: "What's included", intro: 'Everything needed to turn ad spend into enquiries.', cards: [
      { icon: 'ads', title: 'Meta Ads Lead Campaigns', text: 'Facebook and Instagram campaigns aimed at people likely to need your service, with instant lead forms or landing pages.' },
      { icon: 'lead', title: 'Google Search Ads', text: 'Show up when people search for what you offer, at the moment they are ready to buy.' },
      { icon: 'talk', title: 'Local Business Lead Generation', text: 'Campaigns focused on the areas you serve, so you only pay to reach people who can become customers.' },
      { icon: 'web', title: 'Lead Forms & Funnels', text: 'Simple forms and pages that make it easy to enquire, and ask the right questions so you get better leads.' },
      { icon: 'grow', title: 'Lead Tracking & Simple Reports', text: 'See how many leads you got, what they cost and where they came from, in a report you can read in two minutes.' },
    ] },
    band: { heading: 'Getting leads is half the job. Replying fast is the other half.', paras: ["Leads go cold quickly. We make sure every lead lands where you'll see it: email, sheet or CRM.", 'If you want, our AI Automation service can reply to new leads instantly and book them in.'], checks: ['Campaigns run in your own ad account', 'Every lead sent where you will see it', 'Clear numbers: leads, cost, source', 'Changes made based on real results', 'A straight answer to "is this working?"'] },
    steps: { heading: 'Our approach', intro: 'Careful setup first, then steady improvement.', list: [['Plan', 'We learn your services, ideal customer, areas and budget.'], ['Build', 'Campaigns, ads, forms and tracking are set up and checked.'], ['Launch', 'Campaigns go live with your approval.'], ['Improve', "We watch results, cut what isn't working and put more into what is."], ['Report', 'You get clear reports and a straight answer to "is this working?".']] },
    goodFor: { title: 'Good for', items: ['Local service businesses', 'Clinics, real estate and home services', 'Coaches and consultants', 'B2B companies that sell through calls', 'Businesses that want steady enquiries, not one-off spikes'] },
    receive: ['Campaigns set up in your own ad account', 'Lead forms or landing pages', 'Lead tracking so you know where each lead came from', 'Simple, regular reports'],
    notes: [
      { heading: 'An honest note', text: "No one can honestly guarantee a set number of leads or sales. Results depend on your offer, market, budget and how quickly leads are followed up. What we promise is a careful setup, constant improvement and clear reporting, so you always know what your money is doing." },
      { heading: 'Ad budget vs management fee', text: "Your ad budget is paid directly to Meta or Google from your own ad account. Our fee covers planning, setup, management and reporting. We'll recommend a starting budget based on your goals." },
    ],
    faqHeading: 'Questions about lead generation',
    faqs: [
      ['How much should I spend on ads?', "It depends on your area, competition and goals. We'll recommend a realistic starting budget on our first call."],
      ['Whose ad account is used?', 'Yours. Campaigns run in your own ad account, so you keep the history and the data.'],
      ['How soon will I see leads?', "Campaigns can start bringing enquiries soon after launch, but the first weeks are about learning what works. We'll set clear expectations upfront."],
      ['Do you create the ads too?', 'Yes. We can use your existing ads or create new ones through our AI Ads service.'],
      ['Is this the same as social media management?', "No. We run paid ad campaigns aimed at enquiries. We don't manage your regular posting."],
    ],
    related: [{ slug: 'ai-ads', text: 'Fresh ad creative for your campaigns.' }, { slug: 'ai-automation', text: 'Reply to every new lead in seconds.' }],
    cta: { heading: 'Want a steadier flow of enquiries?', text: "Tell us what you offer and where your customers are. We'll tell you honestly whether ads are the right move.", primary: contact('Discuss Your Project', 'lead-generation') },
  },
  {
    slug: 'website-development',
    seoTitle: 'Website Development, Landing Pages & E-commerce Stores | OwnzoScale',
    description: 'Fast, SEO-friendly business websites, landing pages and online stores that explain what you do and make it easy for customers to contact you or buy.',
    h1: ['A website that explains what you do and', 'gets people to contact you.'],
    sub: 'We build fast, clear websites, landing pages and online stores that look professional on every screen and make the next step obvious.',
    primary: contact('Discuss Your Website Project', 'website-development'),
    secondary: call,
    visual: { tag: { title: 'Mobile-first website', sub: 'Fast · Clear · SEO-ready' }, cards: [{ kind: 'chat', title: 'New enquiry received', sub: 'Website form' }, { kind: 'edit', title: 'Page speed checked', sub: 'Phone · Tablet · Desktop' }], label: 'Illustration of a mobile website with an enquiry notification' },
    problem: { heading: 'Your website might be costing you customers.', paras: ["If your site is slow, confusing or looks outdated, people leave in seconds, often straight to a competitor. And if it's hard to find the contact button, they won't look for it.", 'A good website does one job well: it helps the right person understand what you offer and take the next step.'] },
    aside: { title: 'Built to convert', items: ['Clear headlines that say what you do', 'Obvious contact buttons', 'Fast loading', 'Designed for phones first', 'Set up so Google can read it'] },
    items: { heading: 'What we build', intro: 'The right type of site for what you need it to do.', cards: [
      { icon: 'web', title: 'Business Websites', text: 'A clear, professional site that explains your services, builds trust and brings in enquiries.' },
      { icon: 'lead', title: 'Landing Pages & Funnels', text: 'Single, focused pages for an offer or ad campaign, with one message and one clear action.' },
      { icon: 'price', title: 'E-commerce Stores', text: 'Online stores that are easy to browse, easy to buy from, and simple for you to manage.' },
      { icon: 'grow', title: 'Speed & Technical SEO', text: 'Fast loading, mobile-friendly, and set up properly so Google can read and index your site.' },
    ] },
    steps: { heading: 'How we plan and build', intro: 'You see the design before we build it.', list: [['Goals & structure', 'What the site should achieve, for whom, and which pages it needs.'], ['Content', 'Clear words that explain your business (we can write them).'], ['Design', 'A clean design that fits your brand, shown to you before building.'], ['Build and test', 'We build, test on phones and computers, and check speed.'], ['Launch', 'We connect your domain, go live and hand everything over.']] },
    goodFor: { title: 'Good for', items: ['Businesses with an outdated or slow website', 'New businesses that need a professional start', 'Ad campaigns that need a focused landing page', 'Brands ready to sell products online', 'Anyone who wants more enquiries from their site'] },
    receive: ['A live, mobile-friendly website on your own domain', 'Enquiry forms that send to your email', 'Basic SEO setup and Google Analytics (if wanted)', 'Full ownership of the site and all its content', 'A short guide on how to make simple updates'],
    notes: [{ heading: 'An honest note on SEO', text: "We set up your site the right way for search engines: speed, structure, titles and mobile-friendliness. No one can guarantee a Google ranking, and we won't pretend to. Rankings also depend on your content, competition and time." }],
    faqHeading: 'Questions about websites',
    faqs: [
      ['Do I own the website?', 'Yes. The website, domain and content are yours.'],
      ['Can you write the content too?', 'Yes. We can write clear website copy for you, or polish what you already have.'],
      ['Will my website show up on Google?', "We build it so Google can find and read it properly. Rankings take time and depend on many factors, so we don't promise positions."],
      ['Can I update the website myself?', "Yes. We can set it up so you can edit text and images easily, and we'll show you how."],
      ['Can you add an AI assistant to my website?', 'Yes, through our AI Automation service. It can answer questions and capture leads on your site.'],
    ],
    related: [{ slug: 'lead-generation', text: 'Send the right visitors to your new site.' }, { slug: 'ai-automation', text: 'Add an assistant that answers visitors any time.' }],
    cta: { heading: 'Ready for a website that works as hard as you do?', text: 'Tell us about your business and what you need the website to do. We\'ll recommend the right type of site.', primary: contact('Discuss Your Website Project', 'website-development') },
  },
];
