// src/components/react/PriceCalculator.jsx (EU VERSION)
import React, { useState, useEffect } from 'react';

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
};

export default function PriceCalculator() {
  const BASE_PRICE = 590; // Approx 199k HUF

  const [config, setConfig] = useState({
    subPages: 0,
    salesPage: false,
    technicalPages: {
      error404: false,
      thankYou: false
    },
    animations: 'none',
    darkMode: false,
    design: 'base',
    cms: 'none',
    blog: false,
    webshop: 'none',
    analytics: {
      ga4: false,
      gtm: false,
      pixel: false,
      searchConsole: false
    },
    multilingual: 0,
    extras: {
      booking: false,
      marketing: false,
      billing: false,
      newsletter: false,
      chatbot: false
    },
    maintenance: false
  });

  const [total, setTotal] = useState(BASE_PRICE);
  const [webshopQuoteNeeded, setWebshopQuoteNeeded] = useState(false);

  useEffect(() => {
    let sum = BASE_PRICE;

    // Structure
    sum += config.subPages * 80; // ~25k HUF
    if (config.salesPage) sum += 180; // ~60k HUF
    if (config.technicalPages.error404) sum += 45; // ~15k HUF
    if (config.technicalPages.thankYou) sum += 45; // ~15k HUF

    // Design
    if (config.design === 'custom') sum += 850; // ~290k HUF
    if (config.animations === 'basic') sum += 75; // ~25k HUF
    if (config.animations === 'premium') sum += 240; // ~80k HUF
    if (config.darkMode) sum += 150; // ~50k HUF

    // CMS & Blog
    if (config.blog) {
       if (config.cms === 'none') sum += 180; // ~60k HUF
       else if (config.cms === 'basic') sum += 180;
       else if (config.cms === 'complex') sum += 360; // ~120k HUF
       sum += 180; // Blog module cost
    } else {
       if (config.cms === 'basic') sum += 180;
       if (config.cms === 'complex') sum += 360;
    }

    // Webshop
    if (config.webshop === 'lite') sum += 1050; // ~350k HUF
    if (config.webshop === 'pro') setWebshopQuoteNeeded(true);
    else setWebshopQuoteNeeded(false);

    // Analytics
    if (config.analytics.ga4) sum += 75; // ~25k HUF
    if (config.analytics.gtm) sum += 75; // ~25k HUF
    if (config.analytics.pixel) sum += 60; // ~20k HUF
    if (config.analytics.searchConsole) sum += 45; // ~15k HUF

    // Extras
    sum += config.multilingual * 270; // ~90k HUF
    if (config.extras.booking) sum += 135; // ~45k HUF
    if (config.extras.marketing) sum += 195; // ~65k HUF
    if (config.extras.billing) sum += 240; // ~80k HUF
    if (config.extras.newsletter) sum += 120; // ~40k HUF
    if (config.extras.chatbot) sum += 450; // ~150k HUF

    // Maintenance
    if (config.maintenance) sum += 120; // ~40k HUF

    setTotal(sum);
  }, [config]);

  // Enforced Logic
  useEffect(() => {
      if ((config.webshop === 'lite' || config.webshop === 'pro') && config.cms !== 'complex') {
          setConfig(prev => ({ ...prev, cms: 'complex' }));
      }
      if (config.blog && config.cms === 'none') {
          setConfig(prev => ({ ...prev, cms: 'basic' }));
      }
  }, [config.webshop, config.blog]);

  const toggleTechPage = (key) => setConfig({...config, technicalPages: {...config.technicalPages, [key]: !config.technicalPages[key]}});
  const toggleAnalytic = (key) => setConfig({...config, analytics: {...config.analytics, [key]: !config.analytics[key]}});
  const toggleExtra = (key) => setConfig({...config, extras: {...config.extras, [key]: !config.extras[key]}});

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
                  <div className="text-white font-bold text-lg">Prometheus Core System</div>
                  <div className="text-sm text-gray-400 mt-1">Astro Framework • 100/100 Performance • Technical SEO</div>
                </div>
                <div className="text-sky-400 font-bold font-mono">€590</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/20 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-gray-200 font-medium">Content Subpages</label>
                        <span className="text-sky-400 text-xs font-mono bg-sky-500/10 px-2 py-1 rounded">€80 / ea</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-4 leading-relaxed">Additional menu items (e.g., About, Services) statically implemented.</div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setConfig({...config, subPages: Math.max(0, config.subPages - 1)})} className="w-8 h-8 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-colors">-</button>
                      <span className="text-white font-mono w-6 text-center text-lg">{config.subPages}</span>
                      <button onClick={() => setConfig({...config, subPages: config.subPages + 1})} className="w-8 h-8 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-colors">+</button>
                    </div>
                  </div>

                  <label className={`cursor-pointer p-5 rounded-xl border transition-all flex items-start justify-between gap-4 ${config.salesPage ? 'border-sky-500 bg-sky-500/5' : 'border-white/10 bg-gray-800/20 hover:bg-gray-800/40'}`}>
                    <div>
                        <span className="block text-white font-medium mb-1">High-Impact Landing Page</span>
                        <span className="text-xs text-gray-400 leading-relaxed block">Conversion-optimized, custom structured marketing page (Sales Page).</span>
                        <div className="text-sky-400 text-xs font-mono mt-2">€180</div>
                    </div>
                    <input type="checkbox" checked={config.salesPage} onChange={() => setConfig({...config, salesPage: !config.salesPage})} className="accent-sky-500 w-5 h-5 mt-1" />
                  </label>
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${config.technicalPages.error404 ? 'bg-sky-500 border-sky-500' : 'border-white/20 group-hover:border-white/40'}`}>
                          {config.technicalPages.error404 && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <input type="checkbox" checked={config.technicalPages.error404} onChange={() => toggleTechPage('error404')} className="hidden" /> 
                      Branded 404 Page (+€45)
                  </label>
                  <label className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${config.technicalPages.thankYou ? 'bg-sky-500 border-sky-500' : 'border-white/20 group-hover:border-white/40'}`}>
                          {config.technicalPages.thankYou && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <input type="checkbox" checked={config.technicalPages.thankYou} onChange={() => toggleTechPage('thankYou')} className="hidden" /> 
                      Conversion Success Page (+€45)
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
            
            <div className="mb-8">
                <label className="text-gray-400 block mb-3 text-xs uppercase tracking-widest font-bold">Interaction Level</label>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 'none', label: 'Static', price: '€0', desc: 'Standard appearance' },
                        { id: 'basic', label: 'Dynamic', price: '€75', desc: 'Tailwind transitions' },
                        { id: 'premium', label: 'Cinematic', price: '€240', desc: 'GSAP, Parallax, Micro-interactions' }
                    ].map(type => (
                        <button 
                            key={type.id}
                            onClick={() => setConfig({...config, animations: type.id})}
                            className={`p-3 rounded-xl border text-left transition-all ${config.animations === type.id ? 'bg-sky-500/10 border-sky-500' : 'border-white/10 hover:border-white/20 bg-gray-800/20'}`}
                        >
                            <div className={`font-bold text-sm ${config.animations === type.id ? 'text-white' : 'text-gray-300'}`}>{type.label}</div>
                            <div className="text-[10px] text-gray-500 mt-1">{type.desc}</div>
                            {type.id !== 'none' && <div className="text-sky-400 text-xs font-mono mt-2">{type.price}</div>}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <button 
                  onClick={() => setConfig({...config, design: config.design === 'base' ? 'custom' : 'base'})}
                  className={`p-5 rounded-xl border text-left transition-all relative overflow-hidden group ${config.design === 'custom' ? 'border-sky-500 bg-sky-500/5' : 'border-white/10 bg-gray-800/20 hover:bg-gray-800/40'}`}
               >
                  <div className="relative z-10 flex justify-between items-start">
                      <div>
                        <div className="font-bold text-white mb-1">Custom UI/UX Design</div>
                        <div className="text-xs text-gray-400 leading-relaxed max-w-[200px]">Pixel-perfect design tailored to brand identity in Figma.</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${config.design === 'custom' ? 'bg-sky-500 border-sky-500' : 'border-white/20'}`}>
                          {config.design === 'custom' && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                  </div>
                  <div className="text-sky-400 text-xs font-mono mt-4 font-bold relative z-10">+ €850</div>
               </button>

               <button 
                  onClick={() => setConfig({...config, darkMode: !config.darkMode})}
                  className={`p-5 rounded-xl border text-left transition-all relative overflow-hidden ${config.darkMode ? 'border-sky-500 bg-sky-500/5' : 'border-white/10 bg-gray-800/20 hover:bg-gray-800/40'}`}
               >
                  <div className="relative z-10 flex justify-between items-start">
                      <div>
                        <div className="font-bold text-white mb-1">System Dark Mode</div>
                        <div className="text-xs text-gray-400 leading-relaxed">System-level dark mode support and toggle.</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${config.darkMode ? 'bg-sky-500 border-sky-500' : 'border-white/20'}`}>
                          {config.darkMode && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                  </div>
                  <div className="text-sky-400 text-xs font-mono mt-4 font-bold relative z-10">+ €150</div>
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
                    <label className="text-gray-400 block mb-3 text-xs uppercase tracking-widest font-bold">CMS System</label>
                    <div className="space-y-3">
                        <button onClick={() => setConfig({...config, cms: 'basic'})} className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex justify-between items-center ${config.cms === 'basic' ? 'border-sky-500 bg-sky-500/10 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                            <span>Basic CMS (Git-based)</span>
                            <span className="font-mono text-xs text-sky-400">€180</span>
                        </button>
                        <button onClick={() => setConfig({...config, cms: 'complex'})} className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex justify-between items-center ${config.cms === 'complex' ? 'border-sky-500 bg-sky-500/10 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                            <span>Enterprise CMS (Sanity)</span>
                            <span className="font-mono text-xs text-sky-400">€360</span>
                        </button>
                        <button onClick={() => setConfig({...config, cms: 'none'})} className={`w-full text-left p-4 rounded-xl border text-sm transition-all ${config.cms === 'none' ? 'border-white/30 text-white' : 'border-white/10 text-gray-600'}`}>
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
                        <input type="checkbox" checked={config.blog} onChange={() => setConfig({...config, blog: !config.blog})} className="hidden" />
                        <div>
                            <span className="block text-white text-sm font-bold">Blog / News Module</span>
                            <span className="text-xs text-gray-400 mt-1 block">Dynamic content management. (CMS required)</span>
                            <span className="text-xs text-sky-400 font-mono mt-2 block">+ €180</span>
                        </div>
                    </label>
                </div>
            </div>

            <div className="bg-gray-800/20 p-6 rounded-2xl border border-white/5">
                <label className="text-white font-bold block mb-4">Webshop Engine</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                        onClick={() => setConfig({...config, webshop: config.webshop === 'lite' ? 'none' : 'lite'})}
                        className={`p-5 rounded-xl border text-left relative transition-all ${config.webshop === 'lite' ? 'border-sky-500 bg-sky-500/10' : 'border-white/10 hover:bg-gray-800/50'}`}
                    >
                        <div className="font-bold text-white text-sm">Lite Commerce</div>
                        <div className="text-xs text-gray-400 mt-2 leading-relaxed">Integrated cart & checkout, Stripe payments. Ideal for up to 20 products.</div>
                        <div className="text-sky-400 text-xs font-mono mt-3 font-bold">€1,050</div>
                        {config.webshop === 'lite' && <span className="absolute top-3 right-3 w-2 h-2 bg-sky-500 rounded-full shadow-[0_0_10px_#38bdf8]"></span>}
                    </button>

                    <button 
                        onClick={() => setConfig({...config, webshop: config.webshop === 'pro' ? 'none' : 'pro'})}
                        className={`p-5 rounded-xl border text-left relative transition-all ${config.webshop === 'pro' ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:bg-gray-800/50'}`}
                    >
                        <div className="font-bold text-white text-sm">Pro Commerce (Headless)</div>
                        <div className="text-xs text-gray-400 mt-2 leading-relaxed">Shopify/BigCommerce backend. Scalable e-commerce.</div>
                        <div className="text-purple-400 text-xs font-mono mt-3 font-bold">Custom Quote</div>
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
                        { id: 'ga4', label: 'Google Analytics 4', price: '€75' },
                        { id: 'gtm', label: 'Google Tag Manager', price: '€75' },
                        { id: 'pixel', label: 'Meta Pixel (CAPI)', price: '€60' },
                        { id: 'searchConsole', label: 'Search Console', price: '€45' }
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
                        { id: 'booking', label: 'Booking Module', price: '€135' },
                        { id: 'marketing', label: 'CRM / Marketing Auto', price: '€195' },
                        { id: 'billing', label: 'Invoicing Integration', price: '€240' },
                        { id: 'newsletter', label: 'Newsletter API', price: '€120' },
                        { id: 'chatbot', label: 'AI Chatbot', price: '€450' }
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
                        <span className="text-xs text-gray-500">Technical implementation of extra languages.</span>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-900 rounded-lg p-1 border border-white/10">
                      <button onClick={() => setConfig({...config, multilingual: Math.max(0, config.multilingual - 1)})} className="w-7 h-7 rounded text-white hover:bg-white/10 transition-colors">-</button>
                      <span className="text-white font-mono w-4 text-center text-sm">{config.multilingual}</span>
                      <button onClick={() => setConfig({...config, multilingual: config.multilingual + 1})} className="w-7 h-7 rounded text-white hover:bg-white/10 transition-colors">+</button>
                    </div>
                 </div>
             </div>
          </section>

        </div>

        {/* RIGHT SIDE: SMART QUOTE (Sticky) */}
        <div className="lg:col-span-1 bg-[#050911] p-6 md:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 relative lg:sticky lg:top-0 h-auto lg:h-screen overflow-y-auto custom-scrollbar">
            <div>
                <h3 className="text-white font-black text-xl mb-6 uppercase tracking-wider flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                    Configuration
                </h3>
                
                <div className="space-y-1 mb-8 text-sm">
                    <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-gray-400">Core System</span>
                        <span className="text-white font-mono">{formatPrice(BASE_PRICE)}</span>
                    </div>
                    
                    {config.subPages > 0 && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">Subpages ({config.subPages})</span><span className="text-white font-mono">{formatPrice(config.subPages * 80)}</span></div>}
                    {config.salesPage && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">Sales Landing</span><span className="text-white font-mono">€180</span></div>}
                    {(config.technicalPages.error404 || config.technicalPages.thankYou) && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">Tech Pages</span><span className="text-white font-mono">{formatPrice((config.technicalPages.error404 ? 45 : 0) + (config.technicalPages.thankYou ? 45 : 0))}</span></div>}
                    
                    {config.design === 'custom' && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-sky-400">Custom UI/UX</span><span className="text-sky-400 font-mono">€850</span></div>}
                    {config.animations !== 'none' && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">Motion</span><span className="text-white font-mono">{config.animations === 'basic' ? '€75' : '€240'}</span></div>}
                    {config.darkMode && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">Dark Mode</span><span className="text-white font-mono">€150</span></div>}
                    
                    {config.cms !== 'none' && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">CMS ({config.cms})</span><span className="text-white font-mono">{formatPrice(config.cms === 'basic' ? 180 : 360)}</span></div>}
                    {config.blog && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">Blog Module</span><span className="text-white font-mono">€180</span></div>}
                    
                    {config.webshop === 'lite' && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-sky-400">Webshop Lite</span><span className="text-sky-400 font-mono">€1,050</span></div>}
                    {config.webshop === 'pro' && <div className="flex justify-between py-2 border-b border-white/5"><span className="text-purple-400">Webshop Pro</span><span className="text-purple-400 font-mono">Custom</span></div>}
                    
                    {/* Combined Extras */}
                    {(config.analytics.ga4 || config.analytics.gtm || config.analytics.pixel || config.analytics.searchConsole) && (
                        <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">Analytics Stack</span><span className="text-white font-mono">{formatPrice((config.analytics.ga4 ? 75 : 0) + (config.analytics.gtm ? 75 : 0) + (config.analytics.pixel ? 60 : 0) + (config.analytics.searchConsole ? 45 : 0))}</span></div>
                    )}
                    
                    {(config.extras.booking || config.extras.marketing || config.extras.billing || config.extras.newsletter || config.extras.chatbot || config.multilingual > 0) && (
                        <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-400">Business Logic</span><span className="text-white font-mono">{formatPrice((config.extras.booking ? 135 : 0) + (config.extras.marketing ? 195 : 0) + (config.extras.billing ? 240 : 0) + (config.extras.newsletter ? 120 : 0) + (config.extras.chatbot ? 450 : 0) + (config.multilingual * 270))}</span></div>
                    )}
                </div>
                
                <div className="mb-8 p-4 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-white/10 hover:border-green-500/30 transition-colors">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center mt-0.5 ${config.maintenance ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                             {config.maintenance && <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </div>
                        <input type="checkbox" checked={config.maintenance} onChange={() => setConfig({...config, maintenance: !config.maintenance})} className="hidden" />
                        <div>
                            <div className="text-white font-bold text-sm">System Maintenance SLA</div>
                            <div className="text-xs text-gray-500 mt-1 leading-relaxed">Hosting, Domain, SSL, 1 hr dev/mo, 8 year warranty. <span className="text-green-400 font-mono">€120 / yr</span></div>
                        </div>
                    </label>
                </div>
            </div>

            <div>
                <div className="text-gray-500 text-xs uppercase tracking-widest mb-1">Estimated Project Budget</div>
                <div className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight">
                    {webshopQuoteNeeded ? "Custom Quote" : formatPrice(total)}
                </div>
                <div className="text-gray-600 text-xs mb-6 font-mono">+ VAT</div>
                
                <a href={`/contact?package=custom&price=${webshopQuoteNeeded ? 'custom' : total}`} className="block w-full py-4 bg-white hover:bg-gray-200 text-black text-center font-bold rounded-full transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    {webshopQuoteNeeded ? "Request Consultation" : "Request Quote"}
                </a>
                <p className="text-center text-[10px] text-gray-600 mt-4 leading-tight">
                    This is a preliminary calculation. The final quote will be prepared after clarifying the specifications.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
}