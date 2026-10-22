import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUsDropdown.css';

const AboutUsDropdown = ({ onMouseEnter, onMouseLeave, onItemClick }) => {
  const links = [
    { title: 'Our Warranty', href: '/pages/our-warranty' },
    // { title: 'Split Your Payment in 3', href: '#split-payment' },
    { title: 'About SAMZ', href: '/pages/about-us' },
    { title: 'News', href: '#news' },
    { title: 'Blog', href: '#blog' },
    { title: 'Terms & Conditions', href: '/pages/terms-conditions' },
    { title: 'Our Privacy Policy', href: '/pages/privacy-policy' },
    { title: 'SAMZ Offers & Deals', href: '#offers-deals' },
    { title: 'Student Discount', href: '#student-discount' },
    { title: 'Environment', href: '#environment' },
    { title: 'FAQ & Contact Us', href: '#faq-contact' },
    { title: 'Business Customers', href: '#business-customers' },
  ];

  return (
    <div
      className="absolute top-full left-3 pt-1 z-50 w-[220px] font-sans"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Container with rounded corners and shadow matching reference design */}
      <div className="about-us-dropdown-container overflow-hidden bg-white">

        {/* Top Accent Bar in #FF6534 */}
        <div className="h-[2px] bg-[#FF6534] w-full"></div>

        {/* Links List */}
        <div className="divide-y divide-gray-100">
          {links.map((link) => (
            link.href.startsWith('/') ? (
              <Link
                key={link.title}
                to={link.href}
                className="about-us-dropdown-link"
                onClick={() => {
                  if (onItemClick) onItemClick();
                }}
              >
                {link.title}
              </Link>
            ) : (
              <a
                key={link.title}
                href={link.href}
                className="about-us-dropdown-link"
                onClick={() => {
                  if (onItemClick) onItemClick();
                }}
              >
                {link.title}
              </a>
            )
          ))}
        </div>

      </div>
    </div>
  );
};

export default AboutUsDropdown;
