/** Freelance portfolio — update here if the URL changes. */
export const ONE9TECH_PORTFOLIO_URL = 'https://one9tech.online';

export const ONE9TECH = {
  name: 'One9Tech',
  tagline: 'Web & app development for startups and growing businesses',
  email: 'hello@one9tech.online',
  whatsapp: '918516064332',
  location: 'Rewa, Madhya Pradesh, India',
  services: [
    'Custom web applications',
    'SaaS & product builds',
    'Landing pages & marketing sites',
    'API integrations & dashboards',
  ],
  offerings: [
    {
      title: 'SaaS & web applications',
      description:
        'Full-stack products like ReviewQR — auth, payments, dashboards, admin panels, and scalable APIs.',
      icon: 'layers',
    },
    {
      title: 'Business websites',
      description:
        'Fast, SEO-friendly marketing sites and landing pages that convert visitors into leads.',
      icon: 'globe',
    },
    {
      title: 'E-commerce & booking',
      description:
        'Online stores, appointment systems, and customer portals with secure checkout flows.',
      icon: 'cart',
    },
    {
      title: 'Integrations & automation',
      description:
        'Payment gateways, email workflows, CRM hooks, and third-party API integrations.',
      icon: 'zap',
    },
    {
      title: 'Admin dashboards',
      description:
        'Internal tools to manage users, revenue, content, and operations — built for your team.',
      icon: 'layout',
    },
    {
      title: 'MVP for startups',
      description:
        'Ship a working product in weeks, not months — ideal for validating ideas and pitching investors.',
      icon: 'rocket',
    },
  ],
  process: [
    { step: '01', title: 'Discovery call', detail: 'Understand your goals, users, and timeline.' },
    { step: '02', title: 'Scope & quote', detail: 'Clear deliverables, milestones, and fixed or flexible pricing.' },
    { step: '03', title: 'Design & build', detail: 'Iterative development with regular demos and feedback.' },
    { step: '04', title: 'Launch & support', detail: 'Deploy, hand over docs, and optional ongoing maintenance.' },
  ],
  stack: ['React', 'Next.js', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Razorpay & payments'],
  caseStudy: {
    name: 'ReviewQR',
    description:
      'A full SaaS platform for Google Review QR codes — user auth, subscriptions (Razorpay + Lemon Squeezy), AI review suggestions, admin panel, email automation, and SEO-optimized marketing site.',
    url: 'https://www.getreviewqr.com',
  },
} as const;
