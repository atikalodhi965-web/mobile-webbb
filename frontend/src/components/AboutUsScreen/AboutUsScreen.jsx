import React from 'react';
import './AboutUsScreen.css';

import storeCounterImg from '../../assets/images/about-store-counter.png';
import workbenchImg from '../../assets/images/about-workbench.png';
import technicianImg from '../../assets/images/about-technician.png';
import storefrontImg from '../../assets/images/about-storefront.png';

const AboutUsScreen = () => {
  return (
    <div className="about-us-container">
      {/* Title */}
      <h1 className="about-us-title">
        The UK’s Leading Tech Repair Specialist
      </h1>

      {/* Main Two-Column Content Section */}
      <div className="about-us-grid">
        {/* Left Column */}
        <div className="flex flex-col">
          <p className="about-us-text-p">
            Founded in 2013 by entrepreneur Julian Shovlin, SAMZ is the UK's leading tech repair brand, offering express walk-in repair services for smartphones, tablets and laptops.
          </p>

          <p className="about-us-text-p">
            The concept of SAMZ was born out of the evident gap in the market for a trusted, specialist destination for consumers looking for tech repairs.
          </p>

          <p className="about-us-text-p">
            While at university, Julian identified through his own misfortune with his smartphone that the market was completely under-serviced, despite the fact that smartphones and other personal devices were becoming increasingly important to our everyday lives.
          </p>

          <p className="about-us-text-p">
            It was here he began his mission to establish a trustworthy brand and to build a team who were able to provide high-quality service express repairs.
          </p>

          <p className="about-us-text-p">
            In 2013, the very first SAMZ store opened its doors to the public on Kings Road, London. Since then, SAMZ has grown from strength to strength, rapidly expanding to <strong>35 convenient locations</strong> in high streets, train stations and shopping centres across London and the UK.
          </p>

          {/* Workbench Image at bottom of left column */}
          <div className="about-us-img-container mt-2">
            <img
              src={workbenchImg}
              alt="SAMZ repair workbench with precision tools"
              className="about-us-img"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col">
          {/* Store Counter Image at top of right column */}
          <div className="about-us-img-container mb-6 mt-0">
            <img
              src={storeCounterImg}
              alt="SAMZ express walk-in repair store counter"
              className="about-us-img"
            />
          </div>

          <p className="about-us-text-p">
            SAMZ specialises in repairing smartphones, tablets &amp; laptops, appointed by <strong>Google</strong> as an Authorised Service Provider and by <strong>Apple</strong> as an Independent Repair Provider.
          </p>

          <p className="about-us-text-p">
            Friendly, tech repair specialists can fix the most common device faults within 30 minutes. These include screen replacements, camera repairs, new batteries, liquid damage solutions, logic board replacements and data recovery.
          </p>
        </div>
      </div>

      {/* Feature Badges Section (Express Repairs, Lifetime Warranty, Price Promise) */}
      <div className="about-us-features">
        {/* Express Repairs */}
        <div className="about-us-feature-item">
          <svg className="about-us-feature-icon" viewBox="0 0 64 64" fill="currentColor">
            {/* Speed Clock Icon */}
            <path d="M32 6C17.6 6 6 17.6 6 32c0 14.4 11.6 26 26 26 14.4 0 26-11.6 26-26C58 17.6 46.4 6 32 6zm0 47C20.4 53 11 43.6 11 32S20.4 11 32 11s21 9.4 21 21-9.4 21-21 21z" />
            <path d="M30 19h4v14h-4z" />
            <path d="M32 30l8.5-8.5 2.8 2.8L34.8 32.8z" />
            <circle cx="32" cy="33" r="3.5" />
            <path d="M4 27h8v3.5H4zm-2 9h6v3.5H2z" />
          </svg>
          <div className="about-us-feature-text">
            Express<br />Repairs
          </div>
        </div>

        {/* Lifetime Warranty */}
        <div className="about-us-feature-item">
          <svg className="about-us-feature-icon" viewBox="0 0 64 64" fill="currentColor">
            {/* Badge Ribbon Checkmark Icon */}
            <path d="M32 4c-11 0-20 9-20 20 0 7.8 4.5 14.6 11 17.8V58l9-4.5 9 4.5V41.8c6.5-3.2 11-10 11-17.8 0-11-9-20-20-20zm0 35c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z" />
            <path d="M26.5 24.5l-4-4-2.8 2.8 6.8 6.8 14-14-2.8-2.8z" />
          </svg>
          <div className="about-us-feature-text">
            Lifetime<br />Warranty
          </div>
        </div>

        {/* Price Promise */}
        <div className="about-us-feature-item">
          <svg className="about-us-feature-icon" viewBox="0 0 64 64" fill="currentColor">
            {/* Thumbs Up Icon */}
            <path d="M52 28H37.6l2.4-11.5c.3-1.6-.1-3.2-1.2-4.3-1.1-1.1-2.7-1.6-4.3-1.4l-1.8.2-11 14V14H6v34h15.7l.9.4c1.2.6 3.8 1.6 7.4 1.6h15.3c3.9 0 7.2-2.8 7.9-6.6l3.4-17c.5-2.5-.2-5.1-1.9-7-1.7-1.8-4.2-2.9-6.7-2.9zM11 43V19h5.7v24H11zm38.8-13.6l-3.4 17c-.3 1.5-1.6 2.6-3.1 2.6H28c-3.1 0-5.3-.8-6.3-1.3V26.7l9.7-12.4.3-.05c.4-.05.8.08 1.1.35.3.27.4.7.3 1.1L30 29.5h22c1.2 0 2.3.5 3 1.4.7.9 1 2.1.8 3.1z" />
          </svg>
          <div className="about-us-feature-text">
            Price<br />Promise
          </div>
        </div>
      </div>

      {/* Note: Trustpilot section skipped as requested */}

      {/* Bottom Images Grid (Two side-by-side images) */}
      <div className="about-us-bottom-grid">
        <div>
          <img
            src={technicianImg}
            alt="SAMZ technician at work"
            className="about-us-bottom-img"
          />
        </div>
        <div>
          <img
            src={storefrontImg}
            alt="SAMZ store exterior"
            className="about-us-bottom-img"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUsScreen;
