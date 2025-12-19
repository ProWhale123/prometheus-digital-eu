// src/components/react/PriceCalculator.jsx (ENGLISH / EUR)
import React, { useState, useEffect } from 'react';

export default function PriceCalculator() {
  // Default values
  const [pages, setPages] = useState(5); // Starter package has 1-5 pages
  const [features, setFeatures] = useState({
    blog: false,
    multilang: false,
    seo: false,
    cms: false,
    webshop: false,
    design: false
  });

  const [packageLevel, setPackageLevel] = useState('Starter');

  // --- PRICING LOGIC (EUR) ---
  
  // 1. Base Price (Starter Package): €750
  // Includes basic tech, hosting setup, max 5 pages.
  const BASE_PRICE = 750;
  
  // Extra page price (above 5 pages)
  const EXTRA_PAGE_PRICE = 40;

  // Feature Prices
  const PRICES = {
    blog: 70,       // Blog engine
    multilang: 70,  // Multi-language
    seo: 70,        // Advanced SEO
    
    cms: 250,        // CMS Integration
    webshop: 800,    // Webshop system
    design: 150      // Premium/Custom UI/UX elements
  };

  const toggleFeature = (key) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Dynamic Price Calculation
  const calculateTotal = () => {
    let total = BASE_PRICE;

    // Only charge extra for pages above 5
    if (pages > 5) {
      total += (pages - 5) * EXTRA_PAGE_PRICE;
    }

    if (features.blog) total += PRICES.blog;
    if (features.multilang) total += PRICES.multilang;
    if (features.seo) total += PRICES.seo;
    if (features.cms) total += PRICES.cms;
    if (features.webshop) total += PRICES.webshop;
    if (features.design) total += PRICES.design;

    return total;
  };

  const total = calculateTotal();

  // Determine Package Level based on total
  useEffect(() => {
    if (total >= 1800) setPackageLevel('Premium');
    else if (total >= 1000) setPackageLevel('Growth');
    else setPackageLevel('Starter');
  }, [total]);

  // Helper for formatting currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
  }

  return (
    <div className="bg-gray-900/80 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-sm max-w-3xl mx-auto my-12 reveal">
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Smart Price Calculator</h3>
        <p className="text-gray-400">Configure your needs and see which package fits you best!</p>
      </div>

      <div className="space-y-8">
        
        {/* --- 1. NUMBER OF PAGES --- */}
        <div>
          <div className="flex justify-between text-white mb-4 font-semibold items-end">
            <label className="text-lg">Website Size (Subpages)</label>
            <div className="text-right">
              <span className="text-sky-400 text-2xl font-bold">{pages}</span>
              <span className="text-gray-500 text-sm ml-1">pages</span>
            </div>
          </div>
          <input 
            type="range" min="1" max="20" value={pages} 
            onChange={(e) => setPages(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-sky-500 hover:accent-sky-400 transition-all"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>1 page (Landing)</span>
            <span>5 pages (Starter limit)</span>
            <span>20+ pages</span>
          </div>
        </div>

        {/* --- 2. FEATURES --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Growth Package Elements */}
          <FeatureToggle 
            label="Professional Blog Engine" 
            price={PRICES.blog} 
            active={features.blog} 
            onClick={() => toggleFeature('blog')} 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />}
          />
          <FeatureToggle 
            label="Multi-language Support" 
            price={PRICES.multilang} 
            active={features.multilang} 
            onClick={() => toggleFeature('multilang')} 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />}
          />
          <FeatureToggle 
            label="Advanced SEO Settings" 
            price={PRICES.seo} 
            active={features.seo} 
            onClick={() => toggleFeature('seo')} 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />}
          />

          {/* Premium Package Elements */}
          <FeatureToggle 
            label="CMS (Content Management)" 
            price={PRICES.cms} 
            active={features.cms} 
            onClick={() => toggleFeature('cms')} 
            highlight={true}
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />}
          />
          <FeatureToggle 
            label="Webshop Functionality" 
            price={PRICES.webshop} 
            active={features.webshop} 
            onClick={() => toggleFeature('webshop')} 
            highlight={true}
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
          />
          <FeatureToggle 
            label="Premium UI/UX Design" 
            price={PRICES.design} 
            active={features.design} 
            onClick={() => toggleFeature('design')} 
            highlight={true}
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />}
          />
        </div>

        {/* --- SUMMARY --- */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Left side: Package Level */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm mb-1">Recommended Package:</p>
              <div className={`text-xl font-bold px-4 py-1 rounded-full inline-block border
                ${packageLevel === 'Starter' ? 'border-gray-500 text-gray-300 bg-gray-800' : ''}
                ${packageLevel === 'Growth' ? 'border-sky-500 text-sky-400 bg-sky-900/30' : ''}
                ${packageLevel === 'Premium' ? 'border-amber-500 text-amber-400 bg-amber-900/30' : ''}
              `}>
                {packageLevel} Package
              </div>
            </div>

            {/* Right side: Price & Button */}
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm mb-1">Estimated Investment:</p>
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
                {formatCurrency(total)}
              </div>
              <p className="text-xs text-gray-500 mt-2 mb-4">*Indicative quote</p>
              
              <a href={`/contact?subject=calculation&package=${packageLevel}&amount=${total}`} 
                 className="inline-block bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors shadow-lg hover:shadow-sky-500/20">
                Proceed with this →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for cleaner code
function FeatureToggle({ label, price, active, onClick, icon, highlight }) {
  // Helper for formatting currency inside the toggle
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
  }

  return (
    <div 
      onClick={onClick}
      className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 group
        ${active 
          ? (highlight ? 'bg-amber-500/10 border-amber-500' : 'bg-sky-500/10 border-sky-500') 
          : 'bg-gray-800/40 border-white/5 hover:border-white/20 hover:bg-gray-800/60'
        }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
            ${active 
              ? (highlight ? 'bg-amber-500 text-black' : 'bg-sky-500 text-white') 
              : 'bg-gray-700 text-gray-400 group-hover:text-white'
            }`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {icon}
            </svg>
          </div>
          <div>
            <span className={`block font-medium ${active ? 'text-white' : 'text-gray-300'}`}>{label}</span>
            <span className={`text-xs ${active ? (highlight ? 'text-amber-400' : 'text-sky-400') : 'text-gray-500'}`}>
              +{formatCurrency(price)}
            </span>
          </div>
        </div>
        
        {/* Checkbox visual */}
        <div className={`w-5 h-5 rounded border flex items-center justify-center mt-1.5
          ${active 
            ? (highlight ? 'bg-amber-500 border-amber-500' : 'bg-sky-500 border-sky-500') 
            : 'border-gray-600 group-hover:border-gray-400'
          }`}>
          {active && <svg className={`w-3.5 h-3.5 ${highlight ? 'text-black' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
        </div>
      </div>
    </div>
  );
}