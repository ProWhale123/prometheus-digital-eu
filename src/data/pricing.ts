// =============================================================================
// src/data/pricing.ts — SINGLE PRICING SOURCE (2026, EU / EUR)
// -----------------------------------------------------------------------------
// All prices are NET, in EUR. This is the ONLY place to change prices.
// Consumers: pricing.astro, PriceCalculator.jsx, seo-services.astro,
//            services.astro, Pricing.astro, Services.astro, ServiceSchema.astro
// The HU site (prometheus-digital-hu) has its own HUF counterpart.
// EUR values are market-priced for the EU, kept consistent at ~€1 ≈ 333 HUF.
// =============================================================================

export const CURRENCY = "EUR";
export const VAT_LABEL = "+ VAT";

/** "€1,199" style formatting (en-IE grouping). */
export const fmtEur = (n: number): string =>
  "€" + new Intl.NumberFormat("en-IE", { maximumFractionDigits: 0 }).format(n);

/** Page-wide anchor: the price of the Core base system. */
export const ANCHOR_PRICE = 749;

// -----------------------------------------------------------------------------
// 1. WEB DEVELOPMENT MODULES (one-time fees)
// -----------------------------------------------------------------------------
export interface Module {
  label: string;
  price: number;
  unit?: string;
  from?: boolean;
  custom?: boolean;
}

export const webModules = {
  core:               { label: "Prometheus Core base system", price: 749 },
  subPage:            { label: "Content sub-page", price: 90, unit: "/ ea" },
  salesPage:          { label: "Sales Landing Page", price: 360 },
  customDesign:       { label: "Custom UI/UX design", price: 850, from: true },
  premiumAnimations:  { label: "Premium animations", price: 290 },
  darkMode:           { label: "System-wide dark mode", price: 150 },
  cmsBasic:           { label: "Basic CMS (Sanity)", price: 180 },
  cmsComplex:         { label: "Complex CMS (Sanity)", price: 450 },
  blog:               { label: "Blog / News module", price: 180 },
  webshopLite:        { label: "Webshop Lite", price: 1050 },
  webshopPro:         { label: "Webshop Pro", price: 1950, from: true },
  ga4:                { label: "Google Analytics 4", price: 105 },
  gsc:                { label: "Google Search Console", price: 60 },
  gtm:                { label: "Google Tag Manager", price: 90 },
  pixel:              { label: "Facebook Pixel (CAPI)", price: 105 },
  multilingualFirst:  { label: "Multilingual (2nd language)", price: 270 },
  multilingualNext:   { label: "Multilingual (each additional language)", price: 120, unit: "/ language" },
  booking:            { label: "Booking system", price: 195 },
  crm:                { label: "Marketing / CRM integration", price: 270 },
  newsletter:         { label: "Newsletter integration", price: 135 },
  chatbotSetup:       { label: "AI Chatbot (one-time setup)", price: 450 },
  chatbotMonthly:     { label: "AI Chatbot operation", price: 75, unit: "/ mo" },
  migration:          { label: "Migration from old site", price: 360, from: true },
  copywritingMain:    { label: "Copywriting — home / sales page", price: 150 },
  copywritingSub:     { label: "Copywriting — sub-page", price: 75 },
  // The two below display as "Custom quote / from X"; the internal handling fee is NOT shown.
  translation:        { label: "Translation (EN / DE / other)", price: 0, custom: true },
  media:              { label: "Photo / video content", price: 150, from: true, custom: true },
} satisfies Record<string, Module>;

// -----------------------------------------------------------------------------
// 2. TYPICAL CONFIGURATIONS ("pre-built" example packages)
//    priceFrom is an illustrative "from" anchor; exact price comes from the calculator.
// -----------------------------------------------------------------------------
export interface TypicalConfig {
  id: string;
  kicker: string;
  name: string;
  tagline: string;
  priceFrom: number;
  features: string[];
  featured?: boolean;
  accent: "sky" | "purple";
}

export const typicalConfigs: TypicalConfig[] = [
  {
    id: "starter",
    kicker: "Launch",
    name: "Starter",
    tagline: "A sharp online presence for a portfolio or a simple company introduction.",
    priceFrom: 1190,
    features: [
      "Prometheus Core base system",
      "3 content sub-pages",
      "Basic CMS (Sanity) — self-editable",
      "Basic technical SEO",
    ],
    accent: "sky",
  },
  {
    id: "business",
    kicker: "Growth",
    name: "Business",
    tagline: "A content-driven, SEO-ready company site for service providers and experts.",
    priceFrom: 2390,
    features: [
      "Prometheus Core + 6 content sub-pages",
      "Sanity CMS + Blog module",
      "Technical SEO Sprint (€570 value)",
      "Google Analytics 4 + Search Console",
    ],
    featured: true,
    accent: "sky",
  },
  {
    id: "scale",
    kicker: "Premium",
    name: "Scale",
    tagline: "Custom design, international reach and AI-ready features — everything for market dominance.",
    priceFrom: 5690,
    features: [
      "Custom UI/UX design + premium animations",
      "8 sub-pages, Complex CMS (Sanity) + Blog",
      "Multilingual + AI chatbot",
      "Complex SEO Setup (with GEO/AI Setup)",
    ],
    accent: "purple",
  },
];

// -----------------------------------------------------------------------------
// 3. MAINTENANCE / OPERATION — 4-tier monthly retainer
//    Annual fee = 10 monthly fees (2 months free).
// -----------------------------------------------------------------------------
export const EXTRA_DEV_HOURLY = 60; // out-of-quota development, for maintenance clients
export const ANNUAL_MONTHS_CHARGED = 10;

export interface MaintenanceTier {
  id: string;
  name: string;
  kicker: string;
  monthly: number;
  yearly: number;
  featured?: boolean;
}

export const maintenanceTiers: MaintenanceTier[] = [
  { id: "essential", name: "Essential", kicker: "Secure base",          monthly: 30,  yearly: 300 },
  { id: "standard",  name: "Standard",  kicker: "Stable operation",      monthly: 60,  yearly: 600 },
  { id: "business",  name: "Business",  kicker: "Active care",           monthly: 120, yearly: 1200, featured: true },
  { id: "premium",   name: "Premium",   kicker: "Dedicated partnership", monthly: 240, yearly: 2400 },
];

/** Comparison table rows. `values` follows the maintenanceTiers order. */
export interface MaintenanceRow {
  label: string;
  values: (string | boolean)[];
}

export const maintenanceRows: MaintenanceRow[] = [
  { label: "Hosting + domain + SSL",        values: [true, true, true, true] },
  { label: "Backup",                        values: ["monthly", "weekly", "daily", "daily + on-demand"] },
  { label: "Bug-fix turnaround (SLA)",      values: ["5 business days", "72 hours", "24 hours", "4 hours (business hours)"] },
  { label: "Uptime monitoring",             values: [false, "daily", "continuous (5 min)", "continuous (1 min) + alerts"] },
  { label: "Security updates",              values: [false, "monthly", "bi-weekly", "weekly"] },
  { label: "Content update hours",          values: [false, "0.5 hr / mo", "1.5 hr / mo", "4 hr / mo"] },
  { label: "Speed monitoring (CWV)",        values: [false, "quarterly", "monthly", "monthly + proactive"] },
  { label: "Minor development hours",       values: [false, false, false, "2 hr / mo discounted"] },
  { label: "Report",                        values: [false, false, "quarterly", "monthly"] },
  { label: "Priority support channel",      values: [false, false, "phone / Messenger", "dedicated (phone / Viber)"] },
];

// -----------------------------------------------------------------------------
// 4. SEO — ONE-TIME PACKAGES
// -----------------------------------------------------------------------------
export interface SeoSetup {
  id: string;
  name: string;
  price: number;
  from?: boolean;
  tagline: string;
}

export const seoOneTime = {
  technicalSprint: {
    id: "technical-sprint",
    name: "Technical SEO Sprint",
    price: 570,
    tagline: "Full technical foundation: Core Web Vitals, schema/JSON-LD, sitemap, indexing, internal link structure, meta data.",
  },
  keywordContent: {
    id: "keyword-content",
    name: "Keyword & Content Strategy",
    price: 450,
    tagline: "Keyword research, search-intent map, content calendar / pillar structure and competitor gap analysis.",
  },
  foundation: {
    id: "seo-foundation",
    name: "SEO Foundation",
    price: 870,
    tagline: "The Technical SEO Sprint and Keyword & Content Strategy together, at a bundle discount — the entry point for monthly SEO.",
  },
  complex: {
    id: "complex-seo-setup",
    name: "Complex SEO Setup",
    price: 1650,
    tagline: "SEO Foundation + 5 sub-page content expansion + full GEO/AI Audit and Setup. Full transformation for existing sites not built by us.",
  },
} satisfies Record<string, SeoSetup>;

/** Extra sub-page fee above the Complex SEO Setup. */
export const COMPLEX_EXTRA_SUBPAGE = 45; // / sub-page
/** "Value" of the free SEO assessment report (anchoring). */
export const SEO_AUDIT_VALUE = 240;

// -----------------------------------------------------------------------------
// 5. SEO — MONTHLY PACKAGES (3 tiers, concrete prices)
//    Min. 6-month contract. Entry: a SEO Foundation / Technical Sprint setup first.
// -----------------------------------------------------------------------------
export interface SeoMonthlyTier {
  id: string;
  name: string;
  kicker: string;
  price: number;
  description: string;
  baseNote: string | null;
  features: string[];
  featured?: boolean;
}

export const seoMonthlyTiers: SeoMonthlyTier[] = [
  {
    id: "seo-local",
    name: "SEO Local",
    kicker: "Local / single-region SME",
    price: 450,
    description: "Continuous presence in the local market: foundational content production and technical oversight, so your site grows month over month.",
    baseNote: null,
    features: [
      "2 expert articles / month (with pillar content)",
      "Monthly on-page optimisation (article refresh or sub-page)",
      "Technical monitoring: monthly",
      "Monthly PDF report",
      "30 min monthly consultation (phone / Teams / Viber)",
    ],
  },
  {
    id: "seo-growth",
    name: "SEO Growth",
    kicker: "National provider / small webshop",
    price: 810,
    description: "Higher content cadence, link building and active competitor monitoring — to keep growing your market share.",
    baseNote: "Everything in SEO Local, plus:",
    features: [
      "4 expert articles / month (with pillar content)",
      "4 pages / month on-page optimisation",
      "Link building: 4 quality links / month",
      "Local SEO: baseline management (Google Business Profile)",
      "Technical monitoring: bi-weekly",
      "Quarterly competitor analysis",
      "60 min monthly strategy call",
    ],
    featured: true,
  },
  {
    id: "seo-dominance",
    name: "SEO Dominance",
    kicker: "Competitive market, scaling",
    price: 1350,
    description: "Maximum cadence, premium link building and full local coverage — for market dominance.",
    baseNote: "Everything in SEO Growth, plus:",
    features: [
      "6 expert articles / month (with pillar content)",
      "8 pages / month on-page optimisation",
      "Link building: 6–8 links / month + 2 PR articles",
      "Local SEO: full, multi-location management",
      "Technical monitoring: weekly + alerts",
      "Monthly competitor analysis",
      "Bi-weekly consultation",
    ],
  },
];

export const SEO_MIN_MONTHS = 6;

// -----------------------------------------------------------------------------
// 6. SEO — ADD-ONS (alongside any monthly package)
// -----------------------------------------------------------------------------
export interface AddOn {
  label: string;
  price: number;
  unit?: string;
  from?: boolean;
  custom?: boolean;
  note?: string;
}

export const seoAddons: AddOn[] = [
  { label: "Extra expert article", price: 105, unit: "/ ea" },
  { label: "Google Business Profile management (up to 3 locations)", price: 120, unit: "/ mo", note: "then +€30 / location" },
  { label: "Webshop product SEO", price: 0, custom: true },
  { label: "International SEO", price: 270, unit: "/ mo / language" },
  { label: "CRO sprint (A/B testing)", price: 450 },
  { label: "GEO/AI Fine-tuning + Monitoring", price: 270, unit: "/ mo" },
];

// -----------------------------------------------------------------------------
// 7. GEO / AEO — AI search visibility (standalone product line + SEO add-on)
//    Original naming; optimises for AI search engines (ChatGPT, Gemini,
//    Perplexity, Google AI Overview).
// -----------------------------------------------------------------------------
export interface GeoService {
  id: string;
  name: string;
  price: number;
  unit?: string;
  badge?: string;
  tagline: string;
  features: string[];
}

export const geoServices: GeoService[] = [
  {
    id: "geo-audit",
    name: "GEO/AI Visibility Audit",
    price: 290,
    tagline: "Where your brand stands in AI search today — and where it's missing from the answers.",
    features: [
      "Brand-entity check: how the models see your company",
      "Answer coverage: which expert questions you're absent from",
      "Competitor benchmark in the AI space",
      "A concrete, prioritised action plan",
    ],
  },
  {
    id: "geo-setup",
    name: "GEO/AI Setup",
    price: 600,
    tagline: "The technical and content foundation for visibility in AI search engines.",
    features: [
      "Semantic optimisation: content translated into the 'data language' LLMs understand",
      "JSON-LD schemas, entity linking, robots/meta AI-crawlability",
      "AI-friendly content structure",
      "Your company enters the AI's 'memory' and recommendation set",
    ],
  },
  {
    id: "geo-combo",
    name: "GEO/AI Audit + Setup bundle",
    price: 749,
    badge: "Bundle discount",
    tagline: "The Audit and the Setup together, at a discounted bundle price.",
    features: [
      "Full GEO/AI Visibility Audit",
      "Full GEO/AI Setup implementation",
      "One process, from assessment to delivery",
    ],
  },
  {
    id: "geo-monitoring",
    name: "GEO/AI Monthly Monitoring",
    price: 150,
    unit: "/ mo",
    tagline: "Holding the position you've won and keeping up with algorithm updates.",
    features: [
      "Continuous monitoring: monthly report on how AI answers change",
      "Answer refresh for new expert questions and trends",
      "Building citations in sources the AI trusts",
    ],
  },
  {
    id: "geo-fine-tuning",
    name: "GEO/AI Fine-tuning + Monitoring",
    price: 270,
    unit: "/ mo",
    badge: "Also a SEO add-on",
    tagline: "Intensive tier: active fine-tuning and monitoring — standalone or as a SEO add-on.",
    features: [
      "Everything in Monthly Monitoring, at higher intensity",
      "Active content and technical fine-tuning for AI visibility",
      "Available as an add-on alongside any SEO package",
    ],
  },
];
