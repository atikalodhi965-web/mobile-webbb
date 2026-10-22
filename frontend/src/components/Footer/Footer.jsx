import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    // Check scroll position on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="footer-container text-[#1C0D2A] py-10 sm:py-12 px-6 sm:px-10 lg:px-16 font-sans relative">
      <div className="max-w-7xl mx-auto">

        {/* Top Grid: Links and Copyright */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8 items-start">

          {/* Item 1: Copyright */}
          <div>
            <h4 className="font-extrabold text-base sm:text-lg text-[#1C0D2A] leading-snug">
              Copyright © 2026 All rights<br />reserved
            </h4>
          </div>

          {/* Item 2: Terms & Conditions */}
          <div>
            <Link
              to="/pages/terms-conditions"
              className="font-extrabold text-base sm:text-lg text-[#1C0D2A] underline hover:text-[#FF6534] transition-colors"
            >
              Terms &amp; Conditions
            </Link>
          </div>

          {/* Item 3: Privacy Notice */}
          <div>
            <Link
              to="/pages/privacy-policy"
              className="font-extrabold text-base sm:text-lg text-[#1C0D2A] underline hover:text-[#FF6534] transition-colors"
            >
              Privacy Notice
            </Link>
          </div>

          {/* Item 4: Cookie Settings & Cookie Policy */}
          <div>
            <div className="flex flex-col space-y-1">
              <a
                href="#cookie-settings"
                className="font-extrabold text-base sm:text-lg text-[#1C0D2A] underline hover:text-[#FF6534] transition-colors"
              >
                Cookie Settings
              </a>
              <a
                href="#cookie-policy"
                className="font-extrabold text-base sm:text-lg text-[#1C0D2A] underline hover:text-[#FF6534] transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section: Company Registration Info */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pt-4">

          {/* Company Registration & Address Details */}
          <div className="text-xs sm:text-sm text-[#352545] leading-relaxed max-w-3xl font-medium">
            <p>
              SAMZ (UK) Trading Limited registered in England and Wales under the company registration number 09347098
            </p>
            <p className="mt-0.5">
              Registered office address: Holborn Gate, 330 High Holborn, London, England, WC1V 7PP
            </p>
          </div>

          <Link
            to="/admin/login"
            className="text-xs font-bold text-[#FF6534] hover:underline shrink-0"
          >
            Admin Login
          </Link>
        </div>

      </div>

      {/* Floating Back to Top Square Button (Fixed at Bottom Right of Screen) */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        className={`floating-scroll-top-btn fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-12 h-12 rounded-sm flex items-center justify-center text-white cursor-pointer shadow-lg z-50 transition-all duration-300 ${showScrollTop ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
          }`}
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
