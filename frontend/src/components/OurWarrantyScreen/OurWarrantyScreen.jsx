import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './OurWarrantyScreen.css';
import warrantyBannerImg from '../../assets/images/warranty-banner.png';

const OurWarrantyScreen = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    model: '',
    store: 'Bank Station',
    claimInfo: '',
    subscribe: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.fullName && formData.email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          model: '',
          store: 'Bank Station',
          claimInfo: '',
          subscribe: false,
        });
      }, 5000);
    }
  };

  return (
    <div className="warranty-container">
      {/* 1. Main Title */}
      <h1 className="warranty-title">Your Warranty</h1>

      {/* 2. Hero Banner Section */}
      <div className="warranty-banner-wrapper">
        <div className="warranty-banner-content">
          <div className="warranty-banner-text">
            <h2>
              SAMZ
              <span className="highlight-pink">Warranty</span>
            </h2>
            <p>Learn about what’s covered under your warranty</p>
          </div>
          <div className="warranty-banner-image-container">
            <img
              src={warrantyBannerImg}
              alt="SAMZ repair technicians working on smartphone devices"
              className="warranty-banner-img"
            />
          </div>
        </div>
      </div>

      {/* 3. Introductory Text */}
      <div className="warranty-intro-text">
        <p>
          We at SAMZ provide different types of warranty depending on what type of Repair or Product it is. The use of our repair Service may void your manufacturer's warranty. If you would like to avoid this, then please take your Device directly to the manufacturer. The Warranty is linked to a specific device as identified by its unique IMEI or serial number and to a specific Customer as identified by the records on our system. It will cover the Customer for any re-occurrence of the original fault and for the part replaced / repaired only, however if additional faults arise, they will not be covered under the terms of this Warranty. Furthermore, the Warranty will not cover accidental damage, nor will the cover extend should the device change ownership.
        </p>
      </div>

      {/* 4. Google Pixel 4a Battery Warranty Box */}
      <div className="warranty-google-box">
        <h3 className="warranty-google-title">
          Looking for Google Pixel 4a Battery Warranty?
        </h3>
        <p className="warranty-google-desc">
          If you've been referred by Google, and are eligible for a battery replacement on your Google Pixel 4a, you can book your appointment by{' '}
          <Link to="/pages/repairs/google" className="warranty-link">
            clicking here
          </Link>
          . No payment is required, we will replace your battery in-store and there will be no charge to you.
        </p>
      </div>

      {/* 5. How Long Is My Warranty Table Section */}
      <div className="warranty-table-section">
        <h2 className="warranty-title" style={{ fontSize: '2.1rem', marginBottom: '1.75rem' }}>
          How long is my warranty?
        </h2>

        <div className="warranty-table-container">
          <table className="warranty-table">
            <thead>
              <tr>
                <th style={{ width: '38%' }}>Manufacturers</th>
                <th style={{ width: '15.5%' }}>Screen</th>
                <th style={{ width: '15.5%' }}>Smaller parts</th>
                <th style={{ width: '15.5%' }}>Battery</th>
                <th style={{ width: '15.5%' }}>Liquid Damage</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1: SAMZ Standard & Premium (iPhone) */}
              <tr>
                <td className="brand-col-cell">SAMZ Standard &amp; Premium (iPhone)</td>
                <td className="duration-cell" rowSpan={6} colSpan={2}>
                  Lifetime
                </td>
                <td className="duration-cell" rowSpan={6}>
                  12 Months
                </td>
                <td className="duration-cell" rowSpan={8}>
                  3 Months
                </td>
              </tr>
              {/* Row 2: Samsung */}
              <tr>
                <td className="brand-col-cell">Samsung</td>
              </tr>
              {/* Row 3: Google */}
              <tr>
                <td className="brand-col-cell">Google</td>
              </tr>
              {/* Row 4: Huawei */}
              <tr>
                <td className="brand-col-cell">Huawei</td>
              </tr>
              {/* Row 5: OnePlus */}
              <tr>
                <td className="brand-col-cell">OnePlus</td>
              </tr>
              {/* Row 6: iPad */}
              <tr>
                <td className="brand-col-cell">iPad</td>
              </tr>

              {/* Row 7: MacBook */}
              <tr>
                <td className="brand-col-cell">MacBook</td>
                <td className="duration-cell" colSpan={3}>
                  12 Months
                </td>
              </tr>

              {/* Row 8: Apple Genuine (iPhone) */}
              <tr>
                <td className="brand-col-cell">Apple Genuine (iPhone)</td>
                <td className="duration-cell" colSpan={2}>
                  3 Months
                </td>
                <td className="gray-empty-cell" colSpan={1}></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="warranty-table-notes">
          <p className="mb-2">
            SAMZ warranty covers parts against failure and not against liquid damage or accidental damage.
          </p>
          <p className="mb-2">
            Should your device be diagnosed with any liquid damage at point of repair, any parts replaced will only have a 3 month warranty.
          </p>
          <p className="italic mt-3">
            **Unless otherwise stated, SAMZ will provide repair or replacement services if there is a defect in the materials or workmanship of a product.**
          </p>
        </div>
      </div>

      {/* 6. FAQ Section */}
      <div className="warranty-faq-section">
        <div className="warranty-faq-item">
          <h3 className="warranty-faq-question">What is covered under my SAMZ warranty?</h3>
          <p className="warranty-faq-answer">
            Inherent defects with the parts installed will be covered under SAMZ warranty.
          </p>
        </div>

        <div className="warranty-faq-item">
          <h3 className="warranty-faq-question">What is not covered under my SAMZ warranty?</h3>
          <p className="warranty-faq-answer">
            Accidental and liquid damage will not be covered under SAMZ warranty.
          </p>
        </div>

        <div className="warranty-faq-item">
          <h3 className="warranty-faq-question">What to do if you experience a fault?</h3>
          <p className="warranty-faq-answer">
            Please, return with your device to any of our stores nationwide &amp; one of our specialists will be able to assist you further.
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-8">
          <Link to="/pages/repairs" className="warranty-cta-btn">
            Book Appointment now
          </Link>
        </div>
      </div>

      {/* 7. Warranty Claim Form Section */}
      <div className="warranty-form-section">
        <h2 className="warranty-form-title">Warranty Claim Form</h2>
        <p className="warranty-form-subtitle">
          Fill in the form below if you wish to make a warranty claim.
        </p>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-6 rounded-lg text-center my-6">
            <h4 className="font-bold text-lg mb-1">Warranty Claim Submitted!</h4>
            <p className="text-sm">
              Thank you for submitting your warranty claim. Our customer support team will review your details and contact you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="warranty-form-group">
              <label className="warranty-form-label" htmlFor="fullName">
                Full name*
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="warranty-form-input"
              />
            </div>

            {/* Email */}
            <div className="warranty-form-group">
              <label className="warranty-form-label" htmlFor="email">
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="warranty-form-input"
              />
            </div>

            {/* Phone number */}
            <div className="warranty-form-group">
              <label className="warranty-form-label" htmlFor="phone">
                Phone number*
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="warranty-form-input"
              />
            </div>

            {/* Make/Model */}
            <div className="warranty-form-group">
              <label className="warranty-form-label" htmlFor="model">
                Make/Model*
              </label>
              <input
                type="text"
                id="model"
                name="model"
                placeholder="Make/Model"
                value={formData.model}
                onChange={handleChange}
                required
                className="warranty-form-input"
              />
            </div>

            {/* Store Visited */}
            <div className="warranty-form-group">
              <label className="warranty-form-label" htmlFor="store">
                Store Visited*
              </label>
              <select
                id="store"
                name="store"
                value={formData.store}
                onChange={handleChange}
                required
                className="warranty-form-select"
              >
                <option value="Bank Station">Bank Station</option>
                <option value="Kings Road London">Kings Road London</option>
                <option value="Oxford Street London">Oxford Street London</option>
                <option value="Victoria Station">Victoria Station</option>
                <option value="Manchester Arndale">Manchester Arndale</option>
                <option value="Birmingham Bullring">Birmingham Bullring</option>
                <option value="Leeds Trinity">Leeds Trinity</option>
              </select>
            </div>

            {/* Claim Information */}
            <div className="warranty-form-group">
              <label className="warranty-form-label" htmlFor="claimInfo">
                Claim Information
              </label>
              <textarea
                id="claimInfo"
                name="claimInfo"
                placeholder="Claim Information"
                value={formData.claimInfo}
                onChange={handleChange}
                className="warranty-form-textarea"
              ></textarea>
            </div>

            {/* Newsletter Checkbox */}
            <div className="warranty-checkbox-container">
              <input
                type="checkbox"
                id="subscribe"
                name="subscribe"
                checked={formData.subscribe}
                onChange={handleChange}
                className="w-4 h-4 text-[#FF6534] border-gray-300 rounded focus:ring-[#FF6534]"
              />
              <label htmlFor="subscribe" className="warranty-checkbox-label">
                I'm happy to receive email newsletters from SAMZ about great special offers and promotions, competitions and useful guides :)
              </label>
            </div>

            {/* Privacy disclaimer text */}
            <p className="warranty-disclaimer">
              PS. We will use your above information only to contact you about your inquiry unless you opt into marketing. For further information about how we handle your data, you can view our privacy policy
            </p>

            {/* Submit Button */}
            <div className="warranty-submit-btn-wrapper">
              <button type="submit" className="warranty-submit-btn">
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OurWarrantyScreen;
