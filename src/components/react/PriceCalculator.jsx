// src/components/react/PriceCalculator.jsx (EU VERSION)
import React, { useState, useEffect } from 'react';
import { webModules as W, seoOneTime as S, seoMonthlyTiers, geoServices, maintenanceTiers } from '../../data/pricing';

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
};

// GEO partitioning driven by the data-level `recurring` flag
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
    sky: { text: 'text-sky-400', soft: 'text-sky-400 bg-sky-500/10', sel: 'border-sky-500 bg-sky-500/10' },
    emerald: { text: 'text-emerald-400', soft: 'text-emerald-400 bg-emerald-500/10', sel: 'border-emerald-500 bg-emerald-500/10' },
    cyan: { text: 'text-cyan-400', soft: 'text-cyan-400 bg-cyan-500/10', sel: 'border-cyan-500 bg-cyan-500/10' },
};

function AccordionPanel({ num, accent, title, subtitle, selectedLabel, isOpen, onToggle, children }) {
    const a = ACCENTS[accent];
    return (
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-gray-800/10">
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                aria-expanded={isOpen}
            >
                <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm flex-shrink-0 ${a.soft}`}>{num}</span>
                <span className="flex-grow min-w-0">
                    <span className="block text-white font-bold text-sm">{title}</span>
                    <span className="block text-xs text-gray-500 truncate">{subtitle}</span>
                </span>
                {selectedLabel && (
                    <span className={`text-[11px] font-mono px-2 py-1 rounded hidden sm:inline ${a.soft}`}>{selectedLabel}</span>
                )}
                <svg className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && <div className="p-4 md:p-5 pt-1 space-y-3">{children}</div>}
        </div>
    );
}

function OptionRow({ selected, onClick, accent, name, sub, price, priceNote }) {
    const a = ACCENTS[accent];
    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${selected ? a.sel : 'border-white/10 hover:border-white/25 bg-gray-800/20'}`}
        >
            <span className="min-w-0">
                <span className="block text-white font-bold text-sm">{name}</span>
                {sub && <span className="block text-xs text-gray-400 mt-1 leading-relaxed">{sub}</span>}
            </span>
            <span className="text-right flex-shrink-0">
                <span className={`block text-sm font-black font-mono ${selected ? a.text : 'text-white'}`}>{price}</span>
                {priceNote && <span className="block text-[10px] text-gray-500 font-mono mt-0.5">{priceNote}</span>}
            </span>
        </button>
    );
}

export default function PriceCalculator() {
    const BASE_PRICE = W.core.price;

    const [config, setConfig] = useState({
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
        analytics: {
            ga4: false,
            gsc: false,
            gtm: false,
            pixel: false
        },
        multilingual: 0,
        extras: {
            booking: false,
            marketing: false,
            newsletter: false,
            chatbot: false
        },
        // Packages (one-time + monthly)
        seoOneTime: 'none',   // 'none' | 'technicalSprint' | 'keywordContent' | 'foundation' | 'complex'
        seoMonthly: 'none',   // 'none' | seoMonthlyTiers id
        geoOneTime: 'none',   // 'none' | geo-audit | geo-setup | geo-combo
        geoMonitoring: 'none',// 'none' | geo-monitoring | geo-fine-tuning
        maintenance: 'none',  // 'none' | indulo | alap | uzleti | premium
    });

    const [oneTimeTotal, setOneTimeTotal] = useState(BASE_PRICE);
    const [monthlyTotal, setMonthlyTotal] = useState(0);
    const [webshopQuoteNeeded, setWebshopQuoteNeeded] = useState(false);
    const [openSections, setOpenSections] = useState({ seoOneTime: false, seoMonthly: false, geo: false, maintenance: false });

    const toggleSection = (key) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
    // Exclusive choice: clicking the same option clears it ('none')
    const pick = (field, value) => setConfig((c) => ({ ...c, [field]: c[field] === value ? 'none' : value }));

    // Multilingual: 2nd language at full price, each additional at a discounted per-language rate
    const multilingualCost = (n) => n > 0 ? W.multilingualFirst.price + (n - 1) * W.multilingualNext.price : 0;

    useEffect(() => {
        // --- ONE-TIME project budget ---
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

        // --- MONTHLY fees (subscription) ---
        let monthly = 0;
        if (config.maintenance !== 'none') { const m = maintenanceTiers.find((t) => t.id === config.maintenance); if (m) monthly += m.monthly; }
        if (config.seoMonthly !== 'none') { const s = seoMonthlyTiers.find((t) => t.id === config.seoMonthly); if (s) monthly += s.price; }
        if (config.geoMonitoring !== 'none') { const g = geoById(config.geoMonitoring); if (g) monthly += g.price; }
        if (config.extras.chatbot) monthly += W.chatbotMonthly.price;

        setMonthlyTotal(monthly);
    }, [config]);

    // Enforced logic
    useEffect(() => {
        if ((config.webshop === 'lite' || config.webshop === 'pro') && config.cms !== 'complex') {
            setConfig(prev => ({ ...prev, cms: 'complex' }));
        }
        if (config.blog && config.cms === 'none') {
            setConfig(prev => ({ ...prev, cms: 'basic' }));
        }
    }, [config.webshop, config.blog]);

    const toggleAnalytic = (key) => setConfig({ ...config, analytics: { ...config.analytics, [key]: !config.analytics[key] } });
    const toggleExtra = (key) => setConfig({ ...config, extras: { ...config.extras, [key]: !config.extras[key] } });

    const maintTier = config.maintenance !== 'none' ? maintenanceTiers.find((t) => t.id === config.maintenance) : null;
    const seoMonthlyTier = config.seoMonthly !== 'none' ? seoMonthlyTiers.find((t) => t.id === config.seoMonthly) : null;
    const geoMonthlySel = config.geoMonitoring !== 'none' ? geoById(config.geoMonitoring) : null;

    return (
        <div className="bg-[#0B1120] border border-white/10 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-3">

                {/* LEFT SIDE: SETTINGS */}
                <div className="lg:col-span-2 p-6 md:p-10 space-y-14">

                    {/* 1. ARCHITECTURE */}
                    <section>
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500/10 text-sky-400 font-bold text-sm">01</span>
                            <h3 className="text-white font-bold uppercase tracking-widest text-sm">Architecture & Structure</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-5 rounded-xl border border-white/5">
                                <div>
                                    <div className="text-white font-bold text-lg">Prometheus Core Base System</div>
                                    <div className="text-sm text-gray-400 mt-1">Code-based platform • Custom 404 + thank-you page • 100/100 Speed • GDPR Ready</div>
                                </div>
                                <div className="text-sky-400 font-bold font-mono">{formatPrice(BASE_PRICE)}</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-800/20 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-gray-200 font-medium">Content Subpages</label>
                                        <span className="text-sky-400 text-xs font-mono bg-sky-500/10 px-2 py-1 rounded">{formatPrice(W.subPage.price)} / ea</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-4 leading-relaxed">Additional menu items (e.g. About, Services) statically implemented.</div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setConfig({ ...config, subPages: Math.max(0, config.subPages - 1) })} className="w-8 h-8 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-colors">-</button>
                                        <span className="text-white font-mono w-6 text-center text-lg">{config.subPages}</span>
                                        <button onClick={() => setConfig({ ...config, subPages: config.subPages + 1 })} className="w-8 h-8 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-colors">+</button>
                                    </div>
                                </div>

                                <label className={`cursor-pointer p-5 rounded-xl border transition-all flex items-start justify-between gap-4 ${config.salesPage ? 'border-sky-500 bg-sky-500/5' : 'border-white/10 bg-gray-800/20 hover:bg-gray-800/40'}`}>
                                    <div>
                                        <span className="block text-white font-medium mb-1">Sales Landing Page</span>
                                        <span className="text-xs text-gray-400 leading-relaxed block">Conversion-optimized marketing page with a custom structure (Sales Page).</span>
                                        <div className="text-sky-400 text-xs font-mono mt-2">{formatPrice(W.salesPage.price)}</div>
                                    </div>
                                    <input type="checkbox" checked={config.salesPage} onChange={() => setConfig({ ...config, salesPage: !config.salesPage })} className="accent-sky-500 w-5 h-5 mt-1" />
                                </label>
                            </div>

                            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
                                <label className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${config.migration ? 'bg-sky-500 border-sky-500' : 'border-white/20 group-hover:border-white/40'}`}>
                                        {config.migration && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                    <input type="checkbox" checked={config.migration} onChange={() => setConfig({ ...config, migration: !config.migration })} className="hidden" />
                                    Migration from old site (from +{formatPrice(W.migration.price)})
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* 2. VISUAL EXPERIENCE */}
                    <section>
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500/10 text-sky-400 font-bold text-sm">02</span>
                            <h3 className="text-white font-bold uppercase tracking-widest text-sm">Visual Experience & UI/UX</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => setConfig({ ...config, design: config.design === 'base' ? 'custom' : 'base' })}
                                className={`p-5 rounded-xl border text-left transition-all relative overflow-hidden group ${config.design === 'custom' ? 'border-sky-500 bg-sky-500/5' : 'border-white/10 bg-gray-800/20 hover:bg-gray-800/40'}`}
                            >
                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-white mb-1">Custom UI/UX Design</div>
                                        <div className="text-xs text-gray-400 leading-relaxed">Pixel-perfect design tailored to your brand identity in Figma.</div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${config.design === 'custom' ? 'bg-sky-500 border-sky-500' : 'border-white/20'}`}>
                                        {config.design === 'custom' && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                </div>
                                <div className="text-sky-400 text-xs font-mono mt-4 font-bold relative z-10">+ {formatPrice(W.customDesign.price)}</div>
                            </button>

                            <button
                                onClick={() => setConfig({ ...config, premiumAnimations: !config.premiumAnimations })}
                                className={`p-5 rounded-xl border text-left transition-all relative overflow-hidden ${config.premiumAnimations ? 'border-sky-500 bg-sky-500/5' : 'border-white/10 bg-gray-800/20 hover:bg-gray-800/40'}`}
                            >
                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-white mb-1">Premium Animations</div>
                                        <div className="text-xs text-gray-400 leading-relaxed">GSAP / Framer Motion scroll- and micro-interactions.</div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${config.premiumAnimations ? 'bg-sky-500 border-sky-500' : 'border-white/20'}`}>
                                        {config.premiumAnimations && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                </div>
                                <div className="text-sky-400 text-xs font-mono mt-4 font-bold relative z-10">+ {formatPrice(W.premiumAnimations.price)}</div>
                            </button>

                            <button
                                onClick={() => setConfig({ ...config, darkMode: !config.darkMode })}
                                className={`p-5 rounded-xl border text-left transition-all relative overflow-hidden ${config.darkMode ? 'border-sky-500 bg-sky-500/5' : 'border-white/10 bg-gray-800/20 hover:bg-gray-800/40'}`}
                            >
                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-white mb-1">System-Wide Dark Mode</div>
                                        <div className="text-xs text-gray-400 leading-relaxed">Dark mode support with a manual toggle.</div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${config.darkMode ? 'bg-sky-500 border-sky-500' : 'border-white/20'}`}>
                                        {config.darkMode && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                </div>
                                <div className="text-sky-400 text-xs font-mono mt-4 font-bold relative z-10">+ {formatPrice(W.darkMode.price)}</div>
                            </button>
                        </div>
                    </section>

                    {/* 3. CONTENT & COMMERCE */}
                    <section>
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500/10 text-sky-400 font-bold text-sm">03</span>
                            <h3 className="text-white font-bold uppercase tracking-widest text-sm">Content Management & E-Commerce</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className="text-gray-400 block mb-3 text-xs uppercase tracking-widest font-bold">CMS System (Sanity)</label>
                                <div className="space-y-3">
                                    <button onClick={() => setConfig({ ...config, cms: 'basic' })} className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex justify-between items-center ${config.cms === 'basic' ? 'border-sky-500 bg-sky-500/10 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                                        <span>Basic CMS — a few sub-pages, images</span>
                                        <span className="font-mono text-xs text-sky-400">{formatPrice(W.cmsBasic.price)}</span>
                                    </button>
                                    <button onClick={() => setConfig({ ...config, cms: 'complex' })} className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex justify-between items-center ${config.cms === 'complex' ? 'border-sky-500 bg-sky-500/10 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                                        <span>Complex CMS — many sub-pages / products</span>
                                        <span className="font-mono text-xs text-sky-400">{formatPrice(W.cmsComplex.price)}</span>
                                    </button>
                                    <button onClick={() => setConfig({ ...config, cms: 'none' })} className={`w-full text-left p-4 rounded-xl border text-sm transition-all ${config.cms === 'none' ? 'border-white/30 text-white' : 'border-white/10 text-gray-600'}`}>
                                        No CMS (Static)
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-400 block mb-3 text-xs uppercase tracking-widest font-bold">Modules</label>
                                <label className={`flex items-start gap-4 p-4 rounded-xl border mb-3 cursor-pointer transition-all ${config.blog ? 'border-sky-500 bg-sky-500/10' : 'border-white/10 hover:border-white/20'}`}>
                                    <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center mt-0.5 ${config.blog ? 'bg-sky-500 border-sky-500' : 'border-white/20'}`}>
                                        {config.blog && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                    <input type="checkbox" checked={config.blog} onChange={() => setConfig({ ...config, blog: !config.blog })} className="hidden" />
                                    <div>
                                        <span className="block text-white text-sm font-bold">Blog / News Module</span>
                                        <span className="text-xs text-gray-400 mt-1 block">Dynamic content management. (CMS required)</span>
                                        <span className="text-xs text-sky-400 font-mono mt-2 block">+ {formatPrice(W.blog.price)}</span>
                                    </div>
                                </label>
                                <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${config.copywriting ? 'border-sky-500 bg-sky-500/10' : 'border-white/10 hover:border-white/20'}`}>
                                    <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center mt-0.5 ${config.copywriting ? 'bg-sky-500 border-sky-500' : 'border-white/20'}`}>
                                        {config.copywriting && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                    <input type="checkbox" checked={config.copywriting} onChange={() => setConfig({ ...config, copywriting: !config.copywriting })} className="hidden" />
                                    <div>
                                        <span className="block text-white text-sm font-bold">Copywriting (home page)</span>
                                        <span className="text-xs text-gray-400 mt-1 block">Professional marketing copy. Per sub-page: {formatPrice(W.copywritingSub.price)}.</span>
                                        <span className="text-xs text-sky-400 font-mono mt-2 block">+ {formatPrice(W.copywritingMain.price)}</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="bg-gray-800/20 p-6 rounded-2xl border border-white/5">
                            <label className="text-white font-bold block mb-4">Webshop Engine</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setConfig({ ...config, webshop: config.webshop === 'lite' ? 'none' : 'lite' })}
                                    className={`p-5 rounded-xl border text-left relative transition-all ${config.webshop === 'lite' ? 'border-sky-500 bg-sky-500/10' : 'border-white/10 hover:bg-gray-800/50'}`}
                                >
                                    <div className="font-bold text-white text-sm">Simple webshop (Lite)</div>
                                    <div className="text-xs text-gray-400 mt-2 leading-relaxed">Integrated cart & checkout, Stripe payments, invoicing integration. Ideal for up to 20 products.</div>
                                    <div className="text-sky-400 text-xs font-mono mt-3 font-bold">{formatPrice(W.webshopLite.price)}</div>
                                    {config.webshop === 'lite' && <span className="absolute top-3 right-3 w-2 h-2 bg-sky-500 rounded-full shadow-[0_0_10px_#38bdf8]"></span>}
                                </button>

                                <button
                                    onClick={() => setConfig({ ...config, webshop: config.webshop === 'pro' ? 'none' : 'pro' })}
                                    className={`p-5 rounded-xl border text-left relative transition-all ${config.webshop === 'pro' ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:bg-gray-800/50'}`}
                                >
                                    <div className="font-bold text-white text-sm">Scalable webshop (Pro)</div>
                                    <div className="text-xs text-gray-400 mt-2 leading-relaxed">User registration, order history, invoicing integration. Scalable e-commerce.</div>
                                    <div className="text-purple-400 text-xs font-mono mt-3 font-bold">from {formatPrice(W.webshopPro.price)}</div>
                                    {config.webshop === 'pro' && <span className="absolute top-3 right-3 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"></span>}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* 4. ANALYTICS & INTEGRATIONS */}
                    <section>
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500/10 text-sky-400 font-bold text-sm">04</span>
                            <h3 className="text-white font-bold uppercase tracking-widest text-sm">Data Control & Integrations</h3>
                        </div>

                        <div className="mb-8">
                            <h4 className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-4">Measurement Stack</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { id: 'ga4', label: 'Google Analytics 4', price: formatPrice(W.ga4.price) },
                                    { id: 'gsc', label: 'Google Search Console', price: formatPrice(W.gsc.price) },
                                    { id: 'gtm', label: 'Google Tag Manager', price: formatPrice(W.gtm.price) },
                                    { id: 'pixel', label: 'Facebook Pixel (CAPI)', price: formatPrice(W.pixel.price) }
                                ].map(item => (
                                    <label key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-white/5 hover:border-white/10 bg-gray-800/20 cursor-pointer transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${config.analytics[item.id] ? 'bg-sky-500 border-sky-500' : 'border-white/20'}`}>
                                                {config.analytics[item.id] && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                            </div>
                                            <span className="text-sm text-gray-300">{item.label}</span>
                                        </div>
                                        <span className="text-xs font-mono text-gray-500">{item.price}</span>
                                        <input type="checkbox" checked={config.analytics[item.id]} onChange={() => toggleAnalytic(item.id)} className="hidden" />
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-4">Business Logic</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { id: 'booking', label: 'Booking Module', price: formatPrice(W.booking.price) },
                                    { id: 'marketing', label: 'CRM / Marketing Integration', price: formatPrice(W.crm.price) },
                                    { id: 'newsletter', label: 'Newsletter Integration', price: formatPrice(W.newsletter.price) },
                                    { id: 'chatbot', label: 'AI Chatbot (+ monthly fee)', price: formatPrice(W.chatbotSetup.price) }
                                ].map(item => (
                                    <label key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-white/5 hover:border-white/10 bg-gray-800/20 cursor-pointer transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${config.extras[item.id] ? 'bg-sky-500 border-sky-500' : 'border-white/20'}`}>
                                                {config.extras[item.id] && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                            </div>
                                            <span className="text-sm text-gray-300">{item.label}</span>
                                        </div>
                                        <span className="text-xs font-mono text-gray-500">{item.price}</span>
                                        <input type="checkbox" checked={config.extras[item.id]} onChange={() => toggleExtra(item.id)} className="hidden" />
                                    </label>
                                ))}
                            </div>

                            <div className="mt-4 flex items-center justify-between bg-gray-800/30 p-4 rounded-xl border border-white/5">
                                <div>
                                    <span className="text-sm text-white font-bold block">Multilingual (i18n)</span>
                                    <span className="text-xs text-gray-500">2nd language {formatPrice(W.multilingualFirst.price)}, then {formatPrice(W.multilingualNext.price)} / language.</span>
                                </div>
                                <div className="flex items-center gap-3 bg-gray-900 rounded-lg p-1 border border-white/10">
                                    <button onClick={() => setConfig({ ...config, multilingual: Math.max(0, config.multilingual - 1) })} className="w-7 h-7 rounded text-white hover:bg-white/10 transition-colors">-</button>
                                    <span className="text-white font-mono w-4 text-center text-sm">{config.multilingual}</span>
                                    <button onClick={() => setConfig({ ...config, multilingual: config.multilingual + 1 })} className="w-7 h-7 rounded text-white hover:bg-white/10 transition-colors">+</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 5. MARKETING & RECURRING SERVICES (accordion) */}
                    <section>
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-sm">05</span>
                            <h3 className="text-white font-bold uppercase tracking-widest text-sm">SEO, GEO/AI &amp; Maintenance</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-5 -mt-2">Click a section to expand. Recurring fees are shown as a separate monthly total.</p>

                        <div className="space-y-3">
                            {/* SEO one-time */}
                            <AccordionPanel
                                num="A" accent="emerald"
                                title="SEO — One-time setup"
                                subtitle="One-time SEO setup packages"
                                selectedLabel={config.seoOneTime !== 'none' ? S[config.seoOneTime].name : ''}
                                isOpen={openSections.seoOneTime}
                                onToggle={() => toggleSection('seoOneTime')}
                            >
                                {seoOneTimeOptions.map((o) => (
                                    <OptionRow key={o.key} selected={config.seoOneTime === o.key} onClick={() => pick('seoOneTime', o.key)} accent="emerald" name={o.name} sub={o.tagline} price={formatPrice(o.price)} />
                                ))}
                            </AccordionPanel>

                            {/* Monthly SEO */}
                            <AccordionPanel
                                num="B" accent="emerald"
                                title="Monthly SEO retainer"
                                subtitle="Ongoing content + link building (monthly)"
                                selectedLabel={seoMonthlyTier ? seoMonthlyTier.name : ''}
                                isOpen={openSections.seoMonthly}
                                onToggle={() => toggleSection('seoMonthly')}
                            >
                                {seoMonthlyTiers.map((t) => (
                                    <OptionRow key={t.id} selected={config.seoMonthly === t.id} onClick={() => pick('seoMonthly', t.id)} accent="emerald" name={t.name} sub={t.kicker} price={`${formatPrice(t.price)} / mo`} />
                                ))}
                                <a href="/seo-services#packages" className="text-emerald-400 text-xs font-mono inline-block hover:underline pt-1">What's included? Full table →</a>
                            </AccordionPanel>

                            {/* GEO / AI */}
                            <AccordionPanel
                                num="C" accent="cyan"
                                title="GEO / AI visibility"
                                subtitle="Appear in ChatGPT, Gemini & Perplexity answers"
                                selectedLabel={[config.geoOneTime !== 'none' ? geoById(config.geoOneTime).name : null, geoMonthlySel ? geoMonthlySel.name : null].filter(Boolean).join(' + ')}
                                isOpen={openSections.geo}
                                onToggle={() => toggleSection('geo')}
                            >
                                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold pt-1">One-time</div>
                                {geoOneTimeOptions.map((g) => (
                                    <OptionRow key={g.id} selected={config.geoOneTime === g.id} onClick={() => pick('geoOneTime', g.id)} accent="cyan" name={g.name} sub={g.tagline} price={formatPrice(g.price)} />
                                ))}
                                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold pt-2">Monthly (subscription)</div>
                                {geoMonthlyOptions.map((g) => (
                                    <OptionRow key={g.id} selected={config.geoMonitoring === g.id} onClick={() => pick('geoMonitoring', g.id)} accent="cyan" name={g.name} sub={g.tagline} price={`${formatPrice(g.price)} / mo`} />
                                ))}
                            </AccordionPanel>

                            {/* Maintenance */}
                            <AccordionPanel
                                num="D" accent="sky"
                                title="Maintenance & Support"
                                subtitle="Hosting, domain, SSL, monitoring, bug fixes (monthly)"
                                selectedLabel={maintTier ? maintTier.name : ''}
                                isOpen={openSections.maintenance}
                                onToggle={() => toggleSection('maintenance')}
                            >
                                {maintenanceTiers.map((t) => (
                                    <OptionRow key={t.id} selected={config.maintenance === t.id} onClick={() => pick('maintenance', t.id)} accent="sky" name={t.name} sub={t.kicker} price={`${formatPrice(t.monthly)} / mo`} priceNote={`or ${formatPrice(t.yearly)} / yr`} />
                                ))}
                                <p className="text-[11px] text-gray-500 pt-1">Annual billing is charged as 10 months — 2 months free. <a href="/pricing#maintenance" className="text-sky-400 hover:underline">Full table →</a></p>
                            </AccordionPanel>
                        </div>
                    </section>

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
                                <p className="text-xs text-gray-600">No recurring service selected. Maintenance, monthly SEO and GEO monitoring can be chosen above (block 05).</p>
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
