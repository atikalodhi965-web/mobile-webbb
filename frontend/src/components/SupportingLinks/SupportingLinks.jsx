import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SupportingLinks.css';

const SupportingLinks = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <section className="supporting-links-bg text-white py-16 px-6 sm:px-10 lg:px-16 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-12">

          {/* Column 1: Newsletter & Social Links (Width: 4/12) */}
          <div className="md:col-span-4 pr-0 md:pr-8 lg:pr-12 md:border-r md:border-white/15">
            {/* Header */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FF6534] tracking-tight mb-4">
              Newsletter
            </h3>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6 font-normal max-w-sm">
              Join our newsletter for the latest offers and product news
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="flex items-center overflow-hidden rounded max-w-sm bg-white p-0.5 shadow-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="flex-grow px-4 py-2.5 text-gray-800 text-sm placeholder-gray-400 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="supporting-links-submit-btn text-white font-bold text-sm px-6 py-2.5 rounded-sm transition-colors cursor-pointer"
                >
                  Submit
                </button>
              </div>
              {subscribed && (
                <p className="text-[#FF6534] text-xs font-semibold mt-2">
                  Thank you for subscribing!
                </p>
              )}
            </form>

            {/* Social Media Icons (Twitter, Instagram, Facebook, LinkedIn) */}
            <div className="flex items-center gap-3">
              {/* Twitter / X */}
              <a
                href="#twitter"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full supporting-links-social-btn flex items-center justify-center text-white cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full supporting-links-social-btn flex items-center justify-center text-white cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full supporting-links-social-btn flex items-center justify-center text-white cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full supporting-links-social-btn flex items-center justify-center text-white cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Supporting Links (Width: 5/12) */}
          <div className="md:col-span-5 px-0 md:px-8 lg:px-12 md:border-r md:border-white/15">
            {/* Header */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FF6534] tracking-tight mb-5">
              Supporting Links
            </h3>

            <ul className="space-y-2.5 text-sm">
              {/* About Us (Parent Title) */}
              <li className="font-bold text-white text-base pt-0.5">
                About Us
              </li>

              {/* Sub-links indented under About Us */}
              <ul className="pl-4 space-y-2.5 text-gray-300 font-normal">
                <li>
                  <Link to="/pages/our-warranty" className="hover:text-[#FF6534] transition-colors">
                    Our Warranty
                  </Link>
                </li>
                <li>
                  <a href="#split-payment" className="hover:text-[#FF6534] transition-colors">
                    Split Your Payment In 3
                  </a>
                </li>
                <li>
                  <Link to="/pages/about-us" className="hover:text-[#FF6534] transition-colors">
                    About SAMZ
                  </Link>
                </li>
                <li>
                  <a href="#news" className="hover:text-[#FF6534] transition-colors">
                    News
                  </a>
                </li>
                <li>
                  <a href="#blog" className="hover:text-[#FF6534] transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <Link to="/pages/terms-conditions" className="hover:text-[#FF6534] transition-colors">
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/pages/privacy-policy" className="hover:text-[#FF6534] transition-colors">
                    Our Privacy Policy
                  </Link>
                </li>
                <li>
                  <a href="#offers-deals" className="hover:text-[#FF6534] transition-colors">
                    SAMZ Offers & Deals
                  </a>
                </li>
                <li>
                  <a href="#student-discount" className="hover:text-[#FF6534] transition-colors">
                    Student Discount
                  </a>
                </li>
                <li>
                  <a href="#environment" className="hover:text-[#FF6534] transition-colors">
                    Environment
                  </a>
                </li>
                <li>
                  <a href="#faq-contact" className="hover:text-[#FF6534] transition-colors">
                    FAQ & Contact Us
                  </a>
                </li>
                <li>
                  <a href="#business-customers" className="hover:text-[#FF6534] transition-colors">
                    Business Customers
                  </a>
                </li>
              </ul>

              {/* Additional standalone supporting links */}
              <li className="pt-2">
                <a href="#delivery-returns" className="font-bold text-white hover:text-[#FF6534] transition-colors">
                  Delivery & Returns
                </a>
              </li>
              <li className="pt-1">
                <a href="#sitemap" className="font-bold text-[#FF6534] hover:underline transition-colors">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Smartphone Repairs (Width: 3/12) */}
          <div className="md:col-span-3 pl-0 md:pl-8 lg:pl-10">
            {/* Header */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FF6534] tracking-tight mb-5">
              Smartphone Repairs
            </h3>

            <ul className="space-y-3 text-sm text-gray-200 font-semibold">
              <li>
                <a href="#iphone-repairs" className="hover:text-[#FF6534] transition-colors">
                  IPhone Repairs
                </a>
              </li>
              <li>
                <a href="#samsung-repairs" className="hover:text-[#FF6534] transition-colors">
                  Samsung Repairs
                </a>
              </li>
              <li>
                <a href="#google-repairs" className="hover:text-[#FF6534] transition-colors">
                  Google Repairs
                </a>
              </li>
              <li>
                <a href="#all-phone-repairs" className="hover:text-[#FF6534] transition-colors">
                  All Phone Repairs
                </a>
              </li>
              <li>
                <a href="#book-appointment" className="hover:text-[#FF6534] transition-colors">
                  Book Appointment
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SupportingLinks;
