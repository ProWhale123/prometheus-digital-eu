// src/components/react/PriceCalculator.jsx (EU VERSION)
import React, { useState, useEffect } from 'react';
import { webModules as W, seoOneTime as S, seoMonthlyTiers, geoServices, maintenanceTiers } from '../../data/pricing';

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
};

const geoById = (id) => geoServices.find((g) => g.id === id);
const geoOneTimeOptions = geoServices.filter((g) => !g.recurring);
const geoMonthlyOptions = geoServices.filter((g) => g.recurring);
const seoOneTimeOptions = [
    { key: 'technicalSprint', ...S.technicalSprint },
    { key: 'keywordContent', ...S.keywordContent },
    { key: 'foundation', ...S.foundation },
    { key: 'complex', ...S.complex },
];

const ACCENTS = {
    sky: { soft: 'bg-sky-500/10 text-sky-300', text: 'text-sky-300', sel: 'border-sky-500 bg-sky-500/10', checkbg: 'bg-sky-500', openBorder: 'border-sky-500/30', openBg: 'bg-sky-500/[0.04]' },
    emerald: { soft: 'bg-emerald-500/10 text-emerald-300', text: 'text-emerald-300', sel: 'border-emerald-500 bg-emerald-500/10', checkbg: 'bg-emerald-500', openBorder: 'border-emerald-500/30', openBg: 'bg-emerald-500/[0.04]' },
    cyan: { soft: 'bg-cyan-500/10 text-cyan-300', text: 'text-cyan-300', sel: 'border-cyan-500 bg-cyan-500/10', checkbg: 'bg-cyan-500', openBorder: 'border-cyan-500/30', openBg: 'bg-cyan-500/[0.04]' },
    purple: { soft: 'bg-purple-500/10 text-purple-300', text: 'text-purple-300', sel: 'border-purple-500 bg-purple-500/10', checkbg: 'bg-purple-500', openBorder: 'border-purple-500/30', openBg: 'bg-purple-500/[0.04]' },
};

const ICONS = {
    base: (<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>),
    design: <path d="M12 3C8.5 7 6.5 10 6.5 13a5.5 5.5 0 0 0 11 0c0-3-2-6-5.5-10z" />,
    content: (<><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8a3 3 0 0 1 6 0" /></>),
    integrations: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
    seo: (<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>),
    geomaint: <path d="M12 3l1.9 4.9L19 9.5l-5.1 1.6L12 16l-1.9-4.9L5 9.5l5.1-1.6L12 3z" />,
    maint: <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z" />,
};

const DEFAULT_CONFIG = {
    subPages: 0,
    salesPage: false,
    migration: false,
    premiumAnimations: false,
    darkMode: false,
    design: 'base',
    cms: 'none',
    blog: false,
    copywriting: false,
    webshop: 'none',
    analytics: { ga4: false, gsc: false, gtm: false, pixel: false },
    multilingual: 0,
    extras: { booking: false, marketing: false, newsletter: false, chatbot: false },
    seoOneTime: 'none',
    seoMonthly: 'none',
    geoOneTime: 'none',
    geoMonitoring: 'none',
    maintenance: 'none',
};

const PRESETS = [
    { id: 'intro', label: 'Starter', cfg: { subPages: 3 } },
    { id: 'business', label: 'Business + blog', cfg: { subPages: 4, cms: 'basic', blog: true, copywriting: true } },
    { id: 'shop', label: 'Webshop', cfg: { webshop: 'lite', cms: 'complex' } },
];

const Check = () => (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
);

function Row({ name, desc, price, priceNote, accent = 'sky', selected, onClick }) {
    const a = ACCENTS[accent];
    return (
        <button onClick={onClick} className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 ${selected ? a.sel : 'border-white/10 bg-gray-800/20 hover:border-white/25'}`}>
            <span className="flex-1 min-w-0">
                <span className="block text-white text-[13px] font-bold">{name}</span>
                {desc && <span className="block text-gray-500 text-[11px] mt-0.5 leading-snug">{desc}</span>}
            </span>
            {price && (
                <span className="text-right flex-shrink-0">
                    <span className={`block text-[13px] font-mono font-bold ${selected ? a.text : 'text-gray-300'}`}>{price}</span>
                    {priceNote && <span className="block text-[10px] text-gray-500 font-mono">{priceNote}</span>}
                </span>
            )}
            <span className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${selected ? a.checkbg + ' text-white' : 'border border-white/20'}`}>
                {selected && <Check />}
            </span>
        </button>
    );
}

function StepperRow({ name, desc, value, onDec, onInc }) {
    return (
        <div className="w-full p-3.5 rounded-xl border border-white/10 bg-gray-800/20 flex items-center gap-3">
            <span className="flex-1 min-w-0">
                <span className="block text-white text-[13px] font-bold">{name}</span>
                {desc && <span className="block text-gray-500 text-[11px] mt-0.5 leading-snug">{desc}</span>}
            </span>
            <span className="flex items-center gap-3 flex-shrink-0">
                <button onClick={onDec} className="w-7 h-7 rounded-md border border-white/20 text-white hover:bg-white hover:text-black transition-colors">-</button>
                <span className="text-white font-mono text-sm w-4 text-center">{value}</span>
                <button onClick={onInc} className="w-7 h-7 rounded-md border border-white/20 text-white hover:bg-white hover:text-black transition-colors">+</button>
            </span>
        </div>
    );
}

function SubLabel({ children }) {
    return <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold pt-1.5 pb-0.5">{children}</div>;
}

function Category({ id, openId, setOpen, icon, accent, title, summary, oneTime, monthly, children }) {
    const a = ACCENTS[accent];
    const isOpen = openId === id;
    return (
        <div className={`border rounded-2xl overflow-hidden mb-3 transition-colors ${isOpen ? a.openBorder + ' ' + a.openBg : 'border-white/10 bg-gray-800/10'}`}>
            <button onClick={() => setOpen(isOpen ? null : id)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors" aria-expanded={isOpen}>
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${a.soft}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" strokeLinecap="round" strokeLinejoin="round">{ICONS[icon]}</svg>
                </span>
                <span className="flex-1 min-w-0">
                    <span className="block text-white text-sm font-bold">{title}</span>
                    <span className="block text-gray-500 text-xs truncate">{summary}</span>
                </span>
                <span className="text-right flex-shrink-0">
                    <span className="block text-[13px] font-mono text-gray-300">{oneTime > 0 ? formatPrice(oneTime) : (monthly > 0 ? `${formatPrice(monthly)} / mo` : '—')}</span>
                    {oneTime > 0 && monthly > 0 && <span className="block text-[10px] font-mono text-gray-500">+ {formatPrice(monthly)} / mo</span>}
                </span>
                <svg className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && <div className="px-4 pb-4 pt-3 space-y-2.5 border-t border-white/5">{children}</div>}
        </div>
    );
}

export default function PriceCalculator() {
    const BASE_PRICE = W.core.price;

    const [config, setConfig] = useState(() => ({ ...DEFAULT_CONFIG, analytics: { ...DEFAULT_CONFIG.analytics }, extras: { ...DEFAULT_CONFIG.extras } }));
    const [openId, setOpenId] = useState('base');
    const [oneTimeTotal, setOneTimeTotal] = useState(BASE_PRICE);
    const [monthlyTotal, setMonthlyTotal] = useState(0);
    const [webshopQuoteNeeded, setWebshopQuoteNeeded] = useState(false);

    const multilingualCost = (n) => n > 0 ? W.multilingualFirst.price + (n - 1) * W.multilingualNext.price : 0;
    const pick = (field, value) => setConfig((c) => ({ ...c, [field]: c[field] === value ? 'none' : value }));
    const toggleAnalytic = (key) => setConfig((c) => ({ ...c, analytics: { ...c.analytics, [key]: !c.analytics[key] } }));
    const toggleExtra = (key) => setConfig((c) => ({ ...c, extras: { ...c.extras, [key]: !c.extras[key] } }));
    const applyPreset = (cfg) => { setConfig({ ...DEFAULT_CONFIG, analytics: { ...DEFAULT_CONFIG.analytics }, extras: { ...DEFAULT_CONFIG.extras }, ...cfg }); setOpenId('base'); };

    useEffect(() => {
        let oneTime = BASE_PRICE;
        oneTime += config.subPages * W.subPage.price;
        if (config.salesPage) oneTime += W.salesPage.price;
        if (config.migration) oneTime += W.migration.price;
        if (config.design === 'custom') oneTime += W.customDesign.price;
        if (config.premiumAnimations) oneTime += W.premiumAnimations.price;
        if (config.darkMode) oneTime += W.darkMode.price;
        if (config.blog) {
            if (config.cms === 'none' || config.cms === 'basic') oneTime += W.cmsBasic.price;
            else if (config.cms === 'complex') oneTime += W.cmsComplex.price;
            oneTime += W.blog.price;
        } else {
            if (config.cms === 'basic') oneTime += W.cmsBasic.price;
            if (config.cms === 'complex') oneTime += W.cmsComplex.price;
        }
        if (config.copywriting) oneTime += W.copywritingMain.price;
        if (config.webshop === 'lite') oneTime += W.webshopLite.price;
        if (config.webshop === 'pro') { oneTime += W.webshopPro.price; setWebshopQuoteNeeded(true); }
        else setWebshopQuoteNeeded(false);
        if (config.analytics.ga4) oneTime += W.ga4.price;
        if (config.analytics.gsc) oneTime += W.gsc.price;
        if (config.analytics.gtm) oneTime += W.gtm.price;
        if (config.analytics.pixel) oneTime += W.pixel.price;
        oneTime += multilingualCost(config.multilingual);
        if (config.extras.booking) oneTime += W.booking.price;
        if (config.extras.marketing) oneTime += W.crm.price;
        if (config.extras.newsletter) oneTime += W.newsletter.price;
        if (config.extras.chatbot) oneTime += W.chatbotSetup.price;
        if (config.seoOneTime !== 'none') oneTime += S[config.seoOneTime].price;
        if (config.geoOneTime !== 'none') { const g = geoById(config.geoOneTime); if (g) oneTime += g.price; }
        setOneTimeTotal(oneTime);

        let monthly = 0;
        if (config.maintenance !== 'none') { const m = maintenanceTiers.find((t) => t.id === config.maintenance); if (m) monthly += m.monthly; }
        if (config.seoMonthly !== 'none') { const s = seoMonthlyTiers.find((t) => t.id === config.seoMonthly); if (s) monthly += s.price; }
        if (config.geoMonitoring !== 'none') { const g = geoById(config.geoMonitoring); if (g) monthly += g.price; }
        if (config.extras.chatbot) monthly += W.chatbotMonthly.price;
        setMonthlyTotal(monthly);
    }, [config]);

    useEffect(() => {
        if ((config.webshop === 'lite' || config.webshop === 'pro') && config.cms !== 'complex') {
            setConfig(prev => ({ ...prev, cms: 'complex' }));
        }
        if (config.blog && config.cms === 'none') {
            setConfig(prev => ({ ...prev, cms: 'basic' }));
        }
    }, [config.webshop, config.blog]);

    const partBase = BASE_PRICE + config.subPages * W.subPage.price + (config.salesPage ? W.salesPage.price : 0) + (config.migration ? W.migration.price : 0);
    const partDesign = (config.design === 'custom' ? W.customDesign.price : 0) + (config.premiumAnimations ? W.premiumAnimations.price : 0) + (config.darkMode ? W.darkMode.price : 0);
    let partContent = 0;
    if (config.blog) { partContent += (config.cms === 'none' || config.cms === 'basic') ? W.cmsBasic.price : (config.cms === 'complex' ? W.cmsComplex.price : 0); partContent += W.blog.price; }
    else { if (config.cms === 'basic') partContent += W.cmsBasic.price; if (config.cms === 'complex') partContent += W.cmsComplex.price; }
    if (config.copywriting) partContent += W.copywritingMain.price;
    if (config.webshop === 'lite') partContent += W.webshopLite.price;
    if (config.webshop === 'pro') partContent += W.webshopPro.price;
    const partIntegOneTime = (config.analytics.ga4 ? W.ga4.price : 0) + (config.analytics.gsc ? W.gsc.price : 0) + (config.analytics.gtm ? W.gtm.price : 0) + (config.analytics.pixel ? W.pixel.price : 0) + (config.extras.booking ? W.booking.price : 0) + (config.extras.marketing ? W.crm.price : 0) + (config.extras.newsletter ? W.newsletter.price : 0) + (config.extras.chatbot ? W.chatbotSetup.price : 0) + multilingualCost(config.multilingual);
    const partIntegMonthly = config.extras.chatbot ? W.chatbotMonthly.price : 0;
    const seoMonthlyTier = config.seoMonthly !== 'none' ? seoMonthlyTiers.find((t) => t.id === config.seoMonthly) : null;
    const geoMonthlySel = config.geoMonitoring !== 'none' ? geoById(config.geoMonitoring) : null;
    const maintTier = config.maintenance !== 'none' ? maintenanceTiers.find((t) => t.id === config.maintenance) : null;
    const partSeoOneTime = config.seoOneTime !== 'none' ? S[config.seoOneTime].price : 0;
    const partSeoMonthly = seoMonthlyTier ? seoMonthlyTier.price : 0;
    const partGeoOneTime = config.geoOneTime !== 'none' ? (geoById(config.geoOneTime)?.price || 0) : 0;
    const partGeoMonthly = geoMonthlySel ? geoMonthlySel.price : 0;
    const partMaintMonthly = maintTier ? maintTier.monthly : 0;

    const sumBase = `Prometheus Core${config.subPages ? ` · ${config.subPages} pages` : ''}${config.salesPage ? ' · Sales page' : ''}${config.migration ? ' · migration' : ''}`;
    const designExtras = [config.premiumAnimations && 'animations', config.darkMode && 'dark mode'].filter(Boolean);
    const sumDesign = `${config.design === 'custom' ? 'Custom design' : 'Standard design'}${designExtras.length ? ' · ' + designExtras.join(' · ') : ''}`;
    const contentParts = [config.cms !== 'none' && (config.cms === 'basic' ? 'Basic CMS' : 'Complex CMS'), config.blog && 'blog', config.copywriting && 'copywriting', config.webshop === 'lite' && 'webshop Lite', config.webshop === 'pro' && 'webshop Pro'].filter(Boolean);
    const sumContent = contentParts.length ? contentParts.join(' · ') : 'Nothing selected';
    const integCount = [config.analytics.ga4, config.analytics.gsc, config.analytics.gtm, config.analytics.pixel, config.extras.booking, config.extras.marketing, config.extras.newsletter, config.extras.chatbot].filter(Boolean).length + (config.multilingual > 0 ? 1 : 0);
    const sumInteg = integCount ? `${integCount} selected` : 'Nothing selected';
    const seoParts = [config.seoOneTime !== 'none' && S[config.seoOneTime].name, seoMonthlyTier && seoMonthlyTier.name].filter(Boolean);
    const sumSeo = seoParts.length ? seoParts.join(' · ') : 'One-time + monthly packages';
    const geoParts = [config.geoOneTime !== 'none' && geoById(config.geoOneTime).name, geoMonthlySel && geoMonthlySel.name].filter(Boolean);
    const sumGeo = geoParts.length ? geoParts.join(' · ') : 'Appear in AI search answers';
    const sumMaint = maintTier ? `${maintTier.name} — ${maintTier.kicker}` : 'Nothing selected';

    const analyticsItems = [
        { id: 'ga4', label: 'Google Analytics 4', price: W.ga4.price },
        { id: 'gsc', label: 'Google Search Console', price: W.gsc.price },
        { id: 'gtm', label: 'Google Tag Manager', price: W.gtm.price },
        { id: 'pixel', label: 'Facebook Pixel (CAPI)', price: W.pixel.price },
    ];
    const extraItems = [
        { id: 'booking', label: 'Booking module', price: W.booking.price },
        { id: 'marketing', label: 'CRM / Marketing integration', price: W.crm.price },
        { id: 'newsletter', label: 'Newsletter integration', price: W.newsletter.price },
        { id: 'chatbot', label: 'AI Chatbot', price: W.chatbotSetup.price, note: `+ ${formatPrice(W.chatbotMonthly.price)} / mo` },
    ];

    return (
        <div className="bg-[#0B1120] border border-white/10 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-3">

                {/* LEFT SIDE: CONFIGURATOR */}
                <div className="lg:col-span-2 p-6 md:p-8">

                    {/* Quick-start presets */}
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <span className="text-gray-400 text-xs">Quick start:</span>
                        {PRESETS.map((p) => (
                            <button key={p.id} onClick={() => applyPreset(p.cfg)} className="px-3.5 py-1.5 rounded-full border border-white/15 text-gray-300 text-xs hover:border-sky-500/50 hover:text-sky-300 transition-colors">
                                {p.label}
                            </button>
                        ))}
                        <span className="text-gray-600 text-xs">or configure it yourself ↓</span>
                    </div>

                    {/* 1. CORE PACKAGE & PAGES */}
                    <Category id="base" openId={openId} setOpen={setOpenId} icon="base" accent="sky" title="Core package & pages" summary={sumBase} oneTime={partBase} monthly={0}>
                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-sky-500/40 bg-sky-500/[0.07]">
                            <div className="min-w-0">
                                <div className="text-white text-[13px] font-bold">Prometheus Core base system</div>
                                <div className="text-gray-500 text-[11px] mt-0.5">Mandatory base · 100/100 Speed · GDPR · 404 + thank-you page</div>
                            </div>
                            <div className="text-sky-300 text-[13px] font-mono font-bold flex-shrink-0 ml-3">{formatPrice(BASE_PRICE)}</div>
                        </div>
                        <StepperRow name="Content subpages" desc={`${formatPrice(W.subPage.price)} / ea — e.g. About, Services`} value={config.subPages} onDec={() => setConfig({ ...config, subPages: Math.max(0, config.subPages - 1) })} onInc={() => setConfig({ ...config, subPages: config.subPages + 1 })} />
                        <Row name="Sales landing page" desc="Conversion-optimized marketing page" price={formatPrice(W.salesPage.price)} selected={config.salesPage} onClick={() => setConfig({ ...config, salesPage: !config.salesPage })} />
                        <Row name="Migration from old site" desc="Moving content & structure" price={`from ${formatPrice(W.migration.price)}`} selected={config.migration} onClick={() => setConfig({ ...config, migration: !config.migration })} />
                    </Category>

                    {/* 2. DESIGN */}
                    <Category id="design" openId={openId} setOpen={setOpenId} icon="design" accent="sky" title="Design" summary={sumDesign} oneTime={partDesign} monthly={0}>
                        <Row name="Custom UI/UX design" desc="Pixel-perfect, brand-tailored design in Figma (otherwise premium standard)" price={`+ ${formatPrice(W.customDesign.price)}`} selected={config.design === 'custom'} onClick={() => setConfig({ ...config, design: config.design === 'custom' ? 'base' : 'custom' })} />
                        <Row name="Premium animations" desc="GSAP / Framer Motion scroll & micro-interactions" price={`+ ${formatPrice(W.premiumAnimations.price)}`} selected={config.premiumAnimations} onClick={() => setConfig({ ...config, premiumAnimations: !config.premiumAnimations })} />
                        <Row name="System-wide dark mode" desc="Dark mode support with a manual toggle" price={`+ ${formatPrice(W.darkMode.price)}`} selected={config.darkMode} onClick={() => setConfig({ ...config, darkMode: !config.darkMode })} />
                    </Category>

                    {/* 3. CONTENT & WEBSHOP */}
                    <Category id="content" openId={openId} setOpen={setOpenId} icon="content" accent="sky" title="Content & webshop" summary={sumContent} oneTime={partContent} monthly={0}>
                        <SubLabel>CMS system (Sanity)</SubLabel>
                        <Row name="No CMS (static)" selected={config.cms === 'none'} onClick={() => setConfig({ ...config, cms: 'none' })} />
                        <Row name="Basic CMS" desc="a few sub-pages, images" price={formatPrice(W.cmsBasic.price)} selected={config.cms === 'basic'} onClick={() => setConfig({ ...config, cms: 'basic' })} />
                        <Row name="Complex CMS" desc="many sub-pages / products" price={formatPrice(W.cmsComplex.price)} selected={config.cms === 'complex'} onClick={() => setConfig({ ...config, cms: 'complex' })} />
                        <SubLabel>Modules</SubLabel>
                        <Row name="Blog / News module" desc="Dynamic content management (CMS required)" price={`+ ${formatPrice(W.blog.price)}`} selected={config.blog} onClick={() => setConfig({ ...config, blog: !config.blog })} />
                        <Row name="Copywriting (home page)" desc={`Professional marketing copy · per sub-page ${formatPrice(W.copywritingSub.price)}`} price={`+ ${formatPrice(W.copywritingMain.price)}`} selected={config.copywriting} onClick={() => setConfig({ ...config, copywriting: !config.copywriting })} />
                        <SubLabel>Webshop engine</SubLabel>
                        <Row name="Simple webshop (Lite)" desc="Cart & checkout, Stripe, invoicing. Up to 20 products" price={formatPrice(W.webshopLite.price)} selected={config.webshop === 'lite'} onClick={() => setConfig({ ...config, webshop: config.webshop === 'lite' ? 'none' : 'lite' })} />
                        <Row name="Scalable webshop (Pro)" desc="Registration, order history, scalable e-commerce" price={`from ${formatPrice(W.webshopPro.price)}`} accent="purple" selected={config.webshop === 'pro'} onClick={() => setConfig({ ...config, webshop: config.webshop === 'pro' ? 'none' : 'pro' })} />
                    </Category>

                    {/* 4. INTEGRATIONS & ANALYTICS */}
                    <Category id="integrations" openId={openId} setOpen={setOpenId} icon="integrations" accent="sky" title="Integrations & analytics" summary={sumInteg} oneTime={partIntegOneTime} monthly={partIntegMonthly}>
                        <SubLabel>Measurement stack</SubLabel>
                        {analyticsItems.map((item) => (
                            <Row key={item.id} name={item.label} price={formatPrice(item.price)} selected={config.analytics[item.id]} onClick={() => toggleAnalytic(item.id)} />
                        ))}
                        <SubLabel>Business logic</SubLabel>
                        {extraItems.map((item) => (
                            <Row key={item.id} name={item.label} desc={item.note} price={formatPrice(item.price)} selected={config.extras[item.id]} onClick={() => toggleExtra(item.id)} />
                        ))}
                        <SubLabel>Multilingual</SubLabel>
                        <StepperRow name="Additional languages (i18n)" desc={`2nd language ${formatPrice(W.multilingualFirst.price)}, then ${formatPrice(W.multilingualNext.price)} / language`} value={config.multilingual} onDec={() => setConfig({ ...config, multilingual: Math.max(0, config.multilingual - 1) })} onInc={() => setConfig({ ...config, multilingual: config.multilingual + 1 })} />
                    </Category>

                    {/* 5. SEO */}
                    <Category id="seo" openId={openId} setOpen={setOpenId} icon="seo" accent="emerald" title="SEO" summary={sumSeo} oneTime={partSeoOneTime} monthly={partSeoMonthly}>
                        <SubLabel>One-time setup</SubLabel>
                        {seoOneTimeOptions.map((o) => (
                            <Row key={o.key} name={o.name} desc={o.tagline} price={formatPrice(o.price)} accent="emerald" selected={config.seoOneTime === o.key} onClick={() => pick('seoOneTime', o.key)} />
                        ))}
                        <SubLabel>Monthly retainer</SubLabel>
                        {seoMonthlyTiers.map((t) => (
                            <Row key={t.id} name={t.name} desc={t.kicker} price={`${formatPrice(t.price)} / mo`} accent="emerald" selected={config.seoMonthly === t.id} onClick={() => pick('seoMonthly', t.id)} />
                        ))}
                        <a href="/seo-services#packages" className="text-emerald-400 text-xs font-mono inline-block hover:underline pt-1">What's included? Full table →</a>
                    </Category>

                    {/* 6. GEO / AI VISIBILITY */}
                    <Category id="geo" openId={openId} setOpen={setOpenId} icon="geomaint" accent="cyan" title="GEO / AI visibility" summary={sumGeo} oneTime={partGeoOneTime} monthly={partGeoMonthly}>
                        <p className="text-[11px] text-gray-400 leading-snug pb-1">Be there in ChatGPT, Gemini, Perplexity and Google AI Overview answers — standalone or alongside SEO.</p>
                        <SubLabel>One-time</SubLabel>
                        {geoOneTimeOptions.map((g) => (
                            <Row key={g.id} name={g.name} desc={g.tagline} price={formatPrice(g.price)} accent="cyan" selected={config.geoOneTime === g.id} onClick={() => pick('geoOneTime', g.id)} />
                        ))}
                        <SubLabel>Monthly (subscription)</SubLabel>
                        {geoMonthlyOptions.map((g) => (
                            <Row key={g.id} name={g.name} desc={g.tagline} price={`${formatPrice(g.price)} / mo`} accent="cyan" selected={config.geoMonitoring === g.id} onClick={() => pick('geoMonitoring', g.id)} />
                        ))}
                    </Category>

                    {/* 7. MAINTENANCE & SUPPORT */}
                    <Category id="maint" openId={openId} setOpen={setOpenId} icon="maint" accent="sky" title="Maintenance & support" summary={sumMaint} oneTime={0} monthly={partMaintMonthly}>
                        {maintenanceTiers.map((t) => (
                            <Row key={t.id} name={t.name} desc={t.kicker} price={`${formatPrice(t.monthly)} / mo`} priceNote={`or ${formatPrice(t.yearly)} / yr`} accent="sky" selected={config.maintenance === t.id} onClick={() => pick('maintenance', t.id)} />
                        ))}
                        <p className="text-[11px] text-gray-500 pt-1">Annual billing is charged as 10 months — 2 months free. <a href="/pricing#maintenance" className="text-sky-400 hover:underline">Full table →</a></p>
                    </Category>

                </div>

                {/* RIGHT SIDE: SMART QUOTE (Sticky) */}
                <div className="lg:col-span-1 bg-[#050911] p-6 md:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 relative lg:sticky lg:top-24 h-auto lg:max-h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">
                    <div>
                        <h3 className="text-white font-black text-xl mb-6 uppercase tracking-wider flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                            Configuration
                        </h3>

                        {/* ONE-TIME items */}
                        <div className="space-y-1 mb-6 text-sm">
                            <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-gray-400">Prometheus Core</span>
                                <span className="text-white font-mono">{formatPrice(BASE_PRICE)}</span>
                            </div>

                            {config.subPages > 0 && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">Subpages ({config.subPages})</span><span className="text-white font-mono">{formatPrice(config.subPages * W.subPage.price)}</span></div>}
                            {config.salesPage && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">Sales Landing</span><span className="text-white font-mono">{formatPrice(W.salesPage.price)}</span></div>}
                            {config.migration && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">Migration</span><span className="text-white font-mono">from {formatPrice(W.migration.price)}</span></div>}

                            {config.design === 'custom' && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-sky-400">Custom UI/UX</span><span className="text-sky-400 font-mono">{formatPrice(W.customDesign.price)}</span></div>}
                            {config.premiumAnimations && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">Premium Animations</span><span className="text-white font-mono">{formatPrice(W.premiumAnimations.price)}</span></div>}
                            {config.darkMode && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">Dark Mode</span><span className="text-white font-mono">{formatPrice(W.darkMode.price)}</span></div>}

                            {config.cms !== 'none' && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">CMS ({config.cms === 'basic' ? 'Basic' : 'Complex'})</span><span className="text-white font-mono">{formatPrice(config.cms === 'basic' ? W.cmsBasic.price : W.cmsComplex.price)}</span></div>}
                            {config.blog && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">Blog Module</span><span className="text-white font-mono">{formatPrice(W.blog.price)}</span></div>}
                            {config.copywriting && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">Copywriting</span><span className="text-white font-mono">{formatPrice(W.copywritingMain.price)}</span></div>}

                            {config.webshop === 'lite' && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-sky-400">Webshop Lite</span><span className="text-sky-400 font-mono">{formatPrice(W.webshopLite.price)}</span></div>}
                            {config.webshop === 'pro' && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-purple-400">Webshop Pro</span><span className="text-purple-400 font-mono">from {formatPrice(W.webshopPro.price)}</span></div>}

                            {(config.analytics.ga4 || config.analytics.gsc || config.analytics.gtm || config.analytics.pixel) && (
                                <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">Measurement Stack</span><span className="text-white font-mono">{formatPrice((config.analytics.ga4 ? W.ga4.price : 0) + (config.analytics.gsc ? W.gsc.price : 0) + (config.analytics.gtm ? W.gtm.price : 0) + (config.analytics.pixel ? W.pixel.price : 0))}</span></div>
                            )}

                            {(config.extras.booking || config.extras.marketing || config.extras.newsletter || config.extras.chatbot || config.multilingual > 0) && (
                                <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">Business Logic & Extras</span><span className="text-white font-mono">{formatPrice((config.extras.booking ? W.booking.price : 0) + (config.extras.marketing ? W.crm.price : 0) + (config.extras.newsletter ? W.newsletter.price : 0) + (config.extras.chatbot ? W.chatbotSetup.price : 0) + multilingualCost(config.multilingual))}</span></div>
                            )}

                            {config.seoOneTime !== 'none' && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-emerald-400">{S[config.seoOneTime].name}</span><span className="text-emerald-400 font-mono">{formatPrice(S[config.seoOneTime].price)}</span></div>}
                            {config.geoOneTime !== 'none' && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-cyan-400">{geoById(config.geoOneTime).name}</span><span className="text-cyan-400 font-mono">{formatPrice(geoById(config.geoOneTime).price)}</span></div>}
                        </div>

                        {/* ONE-TIME TOTAL */}
                        <div className="mb-6">
                            <div className="text-gray-500 text-xs uppercase tracking-widest mb-1">One-time project budget</div>
                            <div className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                {(webshopQuoteNeeded || config.migration) ? "from " : ""}{formatPrice(oneTimeTotal)}
                            </div>
                            <div className="text-gray-600 text-xs font-mono">+ VAT</div>
                        </div>

                        {/* MONTHLY FEES */}
                        <div className="pt-5 border-t border-white/10">
                            <div className="text-gray-500 text-xs uppercase tracking-widest mb-3">Monthly fees (subscription)</div>
                            {monthlyTotal > 0 ? (
                                <>
                                    <div className="space-y-1 text-sm mb-3">
                                        {maintTier && <div className="flex justify-between py-1.5"><span className="text-sky-400">Maintenance ({maintTier.name})</span><span className="text-sky-400 font-mono">{formatPrice(maintTier.monthly)} / mo</span></div>}
                                        {seoMonthlyTier && <div className="flex justify-between py-1.5"><span className="text-emerald-400">Monthly SEO ({seoMonthlyTier.name})</span><span className="text-emerald-400 font-mono">{formatPrice(seoMonthlyTier.price)} / mo</span></div>}
                                        {geoMonthlySel && <div className="flex justify-between py-1.5"><span className="text-cyan-400">{geoMonthlySel.name}</span><span className="text-cyan-400 font-mono">{formatPrice(geoMonthlySel.price)} / mo</span></div>}
                                        {config.extras.chatbot && <div className="flex justify-between py-1.5"><span className="text-gray-400">AI Chatbot operation</span><span className="text-white font-mono">{formatPrice(W.chatbotMonthly.price)} / mo</span></div>}
                                    </div>
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-2xl md:text-3xl font-black text-white tracking-tight">{formatPrice(monthlyTotal)} / mo</span>
                                        <span className="text-gray-600 text-xs font-mono">+ VAT</span>
                                    </div>
                                </>
                            ) : (
                                <p className="text-xs text-gray-600">No recurring service selected. Maintenance, monthly SEO and GEO monitoring can be chosen in the blocks below.</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-8">
                        <a href={`/contact?package=custom&price=${oneTimeTotal}&monthly=${monthlyTotal}`} className="block w-full py-4 bg-white hover:bg-gray-200 text-black text-center font-bold rounded-full transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            Request Quote
                        </a>
                        <div className="flex flex-col items-center gap-1 text-[11px] text-gray-400 mt-4">
                            <span>✓ 50% deposit, 50% on delivery</span>
                            <span>✓ Start within 2-3 weeks</span>
                            <span>✓ Personal quote within 24 hours</span>
                        </div>
                        <p className="text-center text-[10px] text-gray-600 mt-3 leading-tight">
                            This is a preliminary calculation. The final quote will be prepared after clarifying the specifications.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
