import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { ChevronDown, ChevronUp, Info, HelpCircle, FileText, CheckCircle2, Sparkles } from 'lucide-react';

const ProtectionProduct = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // State for collapsible accordion sections (closed by default in initial state as requested)
  const [openSections, setOpenSections] = useState({
    whatDoIGet: false,
    howItWorks: false,
    tcs: false,
  });

  // State for T&Cs active tab / sub-dropdown
  const [activeTcTab, setActiveTcTab] = useState('before-17nov22');

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col font-sans text-[#1F1B2E] selection:bg-[#FF6534] selection:text-white">
      {/* Navigation Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Main Screen Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FF6534] text-center mb-8 sm:mb-10 tracking-tight">
          SAMZ Protection Product
        </h1>

        {/* First Section: SAMZ Protection Pack Banner */}
        <section className="bg-[#1B0B2A] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden mb-8 border border-[#2D1645]">
          {/* Subtle Ambient Background Highlights */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF6534]/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FF6534]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">

            {/* Left Column: Branding Title & Tagline */}
            <div className="lg:col-span-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  SAMZ
                </span>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FF6534] tracking-tight">
                  Protection
                </span>
                {/* Cross Emblem */}
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-1 transform rotate-45">
                    <div className="w-3 sm:w-3.5 h-3 sm:h-3.5 bg-[#FF6534] rounded-xs"></div>
                    <div className="w-3 sm:w-3.5 h-3 sm:h-3.5 bg-[#FF6534] rounded-xs"></div>
                    <div className="w-3 sm:w-3.5 h-3 sm:h-3.5 bg-[#FF6534] rounded-xs"></div>
                    <div className="w-3 sm:w-3.5 h-3 sm:h-3.5 bg-[#FF6534] rounded-xs"></div>
                  </div>
                </div>
                <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  Pack
                </span>
              </div>

              <p className="text-base sm:text-lg font-medium text-orange-100/90 italic tracking-wide">
                Not just a case. It's a just in case!
              </p>
            </div>

            {/* Right Column: Visual Pack Perks */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-4 sm:gap-6 text-center">

              {/* Feature 1: Any Case */}
              <div className="flex flex-col items-center max-w-[130px]">
                <div className="w-16 h-24 border-2 border-white/80 rounded-2xl flex items-center justify-center p-1.5 mb-2 bg-white/5 backdrop-blur-sm">
                  <div className="w-full h-full bg-[#FF6534]/30 rounded-xl"></div>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-white/90">Any Case</span>
              </div>

              {/* Plus Separator */}
              <span className="text-2xl font-light text-purple-300/80 sm:self-center">+</span>

              {/* Feature 2: 12 Month Guarantee */}
              <div className="flex flex-col items-center max-w-[170px]">
                <div className="w-16 h-24 border-2 border-white/80 rounded-2xl flex flex-col items-center justify-center p-2 mb-2 bg-white/5 backdrop-blur-sm relative">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-white leading-none">12</span>
                    <span className="text-[9px] font-bold text-[#FF6534] uppercase tracking-wider">MONTH</span>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-white/90 leading-tight">
                  Guarantee to cover the cost of <span className="text-[#FF6534] font-bold">1 screen repair</span>
                </span>
              </div>

              {/* Plus Separator */}
              <span className="text-2xl font-light text-purple-300/80 sm:self-center">+</span>

              {/* Feature 3: Screen Protector */}
              <div className="flex flex-col items-center max-w-[160px]">
                <div className="w-16 h-24 border-2 border-dashed border-white/80 rounded-2xl flex items-center justify-center p-2 mb-2 bg-white/5 backdrop-blur-sm relative">
                  <div className="w-10 h-16 border border-white/60 rounded-lg"></div>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-white/90 leading-tight">
                  Screen Protector <span className="text-purple-300 text-[11px] font-normal block">(+unlimited replacements)</span>
                </span>
              </div>

            </div>

          </div>
        </section>

        {/* Alert / Notice Bar */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 text-center mb-10 shadow-xs">
          <p className="text-xs sm:text-sm md:text-base font-semibold text-amber-900 leading-relaxed flex items-center justify-center gap-2">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>
              This product is no longer available. If you purchased our Protection Pack within the past 12 months, you are still eligible for your free screen replacement.
            </span>
          </p>
        </div>

        {/* Dropdowns / Collapsible Accordions Section */}
        <div className="space-y-6">

          {/* ACCORDION 1: What do I get? */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden transition-all duration-300 hover:border-[#FF6534]/40">
            <button
              onClick={() => toggleSection('whatDoIGet')}
              className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r from-white via-orange-50/30 to-white text-left transition-colors duration-200 cursor-pointer group"
              aria-expanded={openSections.whatDoIGet}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF6534]/10 text-[#FF6534] flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#FF6534] tracking-tight">
                  What do I get?
                </h2>
              </div>
              <div className="p-2 rounded-full text-[#FF6534] group-hover:bg-[#FF6534]/10 transition-colors">
                {openSections.whatDoIGet ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
              </div>
            </button>

            {openSections.whatDoIGet && (
              <div className="px-6 pb-8 pt-2 border-t border-gray-100 text-center sm:text-left">
                <p className="text-base sm:text-lg font-bold text-[#1F1B2E] mb-6 leading-relaxed">
                  Get any phone case + screen protector + your next screen replacement FREE of charge.
                </p>

                <div className="bg-[#FFF2EC]/70 rounded-2xl p-5 border border-[#FF6534]/20 space-y-3.5 text-xs sm:text-sm text-gray-700 font-medium">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6534] mt-0.5 flex-shrink-0" />
                    <span>Screen replacements will be with our <strong>'SAMZ Standard'</strong> option.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6534] mt-0.5 flex-shrink-0" />
                    <span>Upgrade to replacements with <strong>'SAMZ Premium'</strong> screens for an extra £15.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6534] mt-0.5 flex-shrink-0" />
                    <span>Your choice of either a black, premium silicone case, or clear, protective case.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 2: How does it work? */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden transition-all duration-300 hover:border-[#FF6534]/40">
            <button
              onClick={() => toggleSection('howItWorks')}
              className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r from-white via-orange-50/30 to-white text-left transition-colors duration-200 cursor-pointer group"
              aria-expanded={openSections.howItWorks}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF6534]/10 text-[#FF6534] flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#FF6534] tracking-tight">
                  How does it work?
                </h2>
              </div>
              <div className="p-2 rounded-full text-[#FF6534] group-hover:bg-[#FF6534]/10 transition-colors">
                {openSections.howItWorks ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
              </div>
            </button>

            {openSections.howItWorks && (
              <div className="px-6 pb-8 pt-2 border-t border-gray-100 text-center sm:text-left">
                <p className="text-base sm:text-lg font-extrabold text-[#1F1B2E] mb-4">
                  It's simple!
                </p>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/70 space-y-3 text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#FF6534] mt-2 flex-shrink-0"></span>
                    <span>If your screen breaks in the following 12 months, we'll replace for no additional charge.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#FF6534] mt-2 flex-shrink-0"></span>
                    <span>You must have your case and screen protector present (even if broken) in order to claim a screen repair.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#FF6534] mt-2 flex-shrink-0"></span>
                    <span>If your screen protector ever breaks within the following 12 months, just pop into any SAMZ store and we will replace it for no additional charge.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 3: T&Cs */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden transition-all duration-300 hover:border-[#FF6534]/40">
            <button
              onClick={() => toggleSection('tcs')}
              className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r from-white via-orange-50/30 to-white text-left transition-colors duration-200 cursor-pointer group"
              aria-expanded={openSections.tcs}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF6534]/10 text-[#FF6534] flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#FF6534] tracking-tight">
                  T&Cs
                </h2>
              </div>
              <div className="p-2 rounded-full text-[#FF6534] group-hover:bg-[#FF6534]/10 transition-colors">
                {openSections.tcs ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
              </div>
            </button>

            {openSections.tcs && (
              <div className="px-4 sm:px-6 pb-8 pt-4 border-t border-gray-100">
                {/* T&Cs Tab Headers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setActiveTcTab('before-17nov22')}
                    className={`p-4 rounded-xl font-bold text-xs sm:text-sm text-center transition-all duration-200 border cursor-pointer ${activeTcTab === 'before-17nov22'
                      ? 'bg-[#B5CFE3] text-[#1F1B2E] border-[#93B7D5] shadow-sm font-extrabold ring-2 ring-[#B5CFE3]/50'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/80'
                      }`}
                  >
                    T&Cs for protection product bought up to and including 17/11/22
                  </button>

                  <button
                    onClick={() => setActiveTcTab('after-18nov22')}
                    className={`p-4 rounded-xl font-bold text-xs sm:text-sm text-center transition-all duration-200 border cursor-pointer ${activeTcTab === 'after-18nov22'
                      ? 'bg-[#B5CFE3] text-[#1F1B2E] border-[#93B7D5] shadow-sm font-extrabold ring-2 ring-[#B5CFE3]/50'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/80'
                      }`}
                  >
                    T&Cs for protection product bought from 18/11/22 to 31/12/24
                  </button>
                </div>

                {/* Tab Content Display */}
                <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 text-xs sm:text-sm text-gray-700 space-y-6">
                  {activeTcTab === 'before-17nov22' ? (
                    <>
                      {/* Section 1 */}
                      <div>
                        <h3 className="text-sm sm:text-base font-extrabold text-[#FF6534] mb-3">
                          1. Who we are
                        </h3>
                        <p className="mb-2 leading-relaxed">
                          1.1. We are SAMZ UK Trading Limited, a company registered in England and Wales under company number 09347088 and a registered office at Suite 3.08 20 Procter Street, London, United Kingdom, WC1V 6NX. Our VAT number is 214 8840 08.
                        </p>
                        <p className="leading-relaxed">
                          1.2. For more information about us and our contact details, please follow:{' '}
                          <a
                            href="https://www.SAMZ.com/pages/faq-contact-us"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#FF6534] underline hover:text-[#e05020] break-all font-semibold"
                          >
                            https://www.SAMZ.com/pages/faq-contact-us
                          </a>
                        </p>
                      </div>

                      {/* Section 2 */}
                      <div>
                        <h3 className="text-sm sm:text-base font-extrabold text-[#FF6534] mb-3">
                          2. These Terms
                        </h3>
                        <p className="mb-2 leading-relaxed">
                          2.1. These terms and conditions ("Protection Product Terms") shall apply to the provision of our protection product Service ("Protection Product") to you and they incorporate by reference our Conditions of Repair found{' '}
                          <a
                            href="https://www.SAMZ.com/pages/terms-conditions"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#FF6534] underline hover:text-[#e05020] break-all font-semibold"
                          >
                            https://www.SAMZ.com/pages/terms-conditions
                          </a>
                          , which together (and any other documents and policies which are referred to in them) make up the Agreement between you and us in respect of the services and/or products that we may provide to you as part of the Protection Product.
                        </p>
                        <p className="mb-2 leading-relaxed">
                          2.2. Should there be any conflict between these Protection Product Terms and our Conditions of Repair, then these Protection Product Terms shall take precedence.
                        </p>
                        <p className="leading-relaxed">
                          2.3. Any capitalised terms in these Protection Product Terms shall have the meaning given to them in the Conditions of Repair unless otherwise defined.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Section 1 for 18/11/22 - 31/12/24 */}
                      <div>
                        <h3 className="text-sm sm:text-base font-extrabold text-[#FF6534] mb-3">
                          1. Who we are
                        </h3>
                        <p className="mb-2 leading-relaxed">
                          1.1. We are SAMZ UK Trading Limited, registered in England & Wales under company number 09347088. VAT number 214 8840 08.
                        </p>
                        <p className="leading-relaxed">
                          1.2. For customer support or store enquiries, please visit:{' '}
                          <a
                            href="https://www.SAMZ.com/pages/faq-contact-us"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#FF6534] underline hover:text-[#e05020] break-all font-semibold"
                          >
                            https://www.SAMZ.com/pages/faq-contact-us
                          </a>
                        </p>
                      </div>

                      {/* Section 2 for 18/11/22 - 31/12/24 */}
                      <div>
                        <h3 className="text-sm sm:text-base font-extrabold text-[#FF6534] mb-3">
                          2. Terms & Coverage Details
                        </h3>
                        <p className="mb-2 leading-relaxed">
                          2.1. Coverage includes 1 free screen replacement (SAMZ Standard grade) and unlimited screen protector replacements within 12 months from original purchase date.
                        </p>
                        <p className="mb-2 leading-relaxed">
                          2.2. Customers must present the original fitted case and screen protector (even if damaged or shattered) at the store to claim a replacement.
                        </p>
                        <p className="leading-relaxed">
                          2.3. Screen replacements can be upgraded to SAMZ Premium screens for a £15 surcharge at the time of repair booking.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProtectionProduct;
