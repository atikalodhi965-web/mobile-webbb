import React, { useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tocItems = [
    { id: 'who-we-are', title: '1. Who We are' },
    { id: 'personal-info-processed', title: '2. Personal Information Processed about You' },
    { id: 'when-we-collect', title: '3. When We collect your information' },
    { id: 'purposes-lawful-basis', title: '4. Our purposes and lawful basis for the processing of your information' },
    { id: 'how-shared', title: '5. How your personal information is shared' },
    { id: 'how-long-stored', title: '6. How long We store your personal information' },
    { id: 'automated-decisions', title: '7. Automated decision-making and profiling' },
    { id: 'where-processed', title: '8. Where Your Personal Information is Processed' },
    { id: 'data-protection-rights', title: '9. Your data protection rights and choice' },
    { id: 'information-security', title: '10. Information Security' },
    { id: 'important-information', title: '11. Important information' },
    { id: 'contact-us', title: '12. Contact Us' },
  ];

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1C0D2A] selection:bg-[#FF6534] selection:text-white">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow w-full py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Main Title - Orange Red (#FF6534) replacing pink */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FF6534] text-center mb-10 sm:mb-14 tracking-tight">
            Privacy Notice
          </h1>

          {/* Table of Contents / Index */}
          <div className="mb-14 pb-8 border-b border-gray-100">
            <ol className="space-y-2 text-sm sm:text-[15px] font-semibold text-gray-800">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => scrollToSection(e, item.id)}
                    className="hover:text-[#FF6534] transition-colors cursor-pointer"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Sections List */}
          <div className="space-y-12 text-[#2B2035] leading-relaxed text-sm sm:text-base font-normal">

            {/* 1. Who We are */}
            <section id="who-we-are" className="scroll-mt-28 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                1. Who We are
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The data controller of the personal information collected and processed when you visit the website www.samz.com (hereinafter the 'Service') is SAMZ (UK) Trading Limited (hereinafter "SAMZ", "We", "Us" or "Our") with offices at Holborn Gate, 330 High Holborn, WC1V 7PP, London, England.
              </p>
              <p className="text-gray-700 leading-relaxed">
                When you use this Service, your personal information is processed as set forth below. Personal information means information relating to an identified or identifiable individual.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This privacy notice (hereinafter "Notice") applies only with respect to personal information collected when you use the Service and does not reflect the data handling practices of other services, websites, or applications.
              </p>
            </section>

            {/* 2. Personal Information Processed about You */}
            <section id="personal-info-processed" className="scroll-mt-28 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                2. Personal Information Processed about You
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may collect, use, store and transfer different kinds of personal information about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>Identity Data:</strong> includes first name, last name, title, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                <li><strong>Transaction Data:</strong> includes details about payments to and from you and details of repair services or products purchased from SAMZ.</li>
                <li><strong>Device &amp; Technical Data:</strong> includes device IMEI, serial number, device passcode (where supplied by you for testing purposes), device model, operating system, IP address, and browser information.</li>
              </ul>
            </section>

            {/* 3. When We collect your information */}
            <section id="when-we-collect" className="scroll-mt-28 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                3. When We collect your information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We collect personal information through direct interactions when you:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Book a smartphone, tablet, or computer repair online or in-store.</li>
                <li>Purchase refurbished devices, accessories, or protection plans.</li>
                <li>Create an account or complete our service check-in forms.</li>
                <li>Subscribe to SAMZ promotional offers, warranties, or newsletters.</li>
                <li>Contact our customer support team via live chat, phone, or email.</li>
              </ul>
            </section>

            {/* 4. Our purposes and lawful basis for the processing of your information */}
            <section id="purposes-lawful-basis" className="scroll-mt-28 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                4. Our purposes and lawful basis for the processing of your information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We only process your personal information when the law allows us to. Most commonly, we process your information on the following legal bases:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>Performance of a Contract:</strong> To diagnose, repair, and return your device, process payments, and honor our warranties.</li>
                <li><strong>Legitimate Interests:</strong> To improve our service offerings, ensure store and network security, and verify customer satisfaction.</li>
                <li><strong>Legal Obligation:</strong> To satisfy statutory accounting, tax, and consumer law requirements.</li>
                <li><strong>Consent:</strong> Where you have explicitly opted in to receive direct marketing news and exclusive offers.</li>
              </ul>
            </section>

            {/* 5. How your personal information is shared */}
            <section id="how-shared" className="scroll-mt-28 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                5. How your personal information is shared
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We do not sell your personal data. We may share your information with trusted third-party partners only as necessary to fulfill our services:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Authorized manufacturer repair networks (including Apple, Google, and Samsung) where genuine parts provisioning and service diagnostics are required.</li>
                <li>Secure payment gateway providers (e.g., Stripe, PayPal, Klarna).</li>
                <li>Courier and logistics providers for home collection and delivery services.</li>
                <li>Regulatory authorities and law enforcement when required by UK legislation.</li>
              </ul>
            </section>

            {/* 6. How long We store your personal information */}
            <section id="how-long-stored" className="scroll-mt-28 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                6. How long We store your personal information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements. Device repair records and warranty histories are maintained for the duration of the applicable warranty period plus statutory retention limits.
              </p>
            </section>

            {/* 7. Automated decision-making and profiling */}
            <section id="automated-decisions" className="scroll-mt-28 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                7. Automated decision-making and profiling
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We do not use automated decision-making or profiling systems that produce legal or similarly significant effects concerning our customers.
              </p>
            </section>

            {/* 8. Where Your Personal Information is Processed */}
            <section id="where-processed" className="scroll-mt-28 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                8. Where Your Personal Information is Processed
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your personal data is predominantly stored and processed within the United Kingdom and the European Economic Area (EEA). If data is ever transferred outside these territories, we ensure appropriate safeguards such as UK International Data Transfer Agreements or standard contractual clauses are in place.
              </p>
            </section>

            {/* 9. Your data protection rights and choice */}
            <section id="data-protection-rights" className="scroll-mt-28 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                9. Your data protection rights and choice
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Under UK data protection laws, you have rights including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>Right of Access:</strong> Ask us for copies of your personal data.</li>
                <li><strong>Right to Rectification:</strong> Ask us to rectify inaccurate or incomplete information.</li>
                <li><strong>Right to Erasure:</strong> Ask us to erase your personal data in certain circumstances.</li>
                <li><strong>Right to Restriction:</strong> Ask us to restrict the processing of your data.</li>
                <li><strong>Right to Data Portability:</strong> Request transfer of your data to another organization.</li>
                <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or direct marketing.</li>
              </ul>
            </section>

            {/* 10. Information Security */}
            <section id="information-security" className="scroll-mt-28 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                10. Information Security
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We have put in place appropriate technical and organizational security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. In addition, we limit access to your personal data to those employees, contractors, and other third parties who have a business need to know.
              </p>
            </section>

            {/* 11. Important information */}
            <section id="important-information" className="scroll-mt-28 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                11. Important information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                This website is not intended for children, and we do not knowingly collect data relating to children under 16 years of age. Our website may include links to third-party websites; clicking on those links may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
              </p>
            </section>

            {/* 12. Contact Us */}
            <section id="contact-us" className="scroll-mt-28 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                12. Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Notice, including any requests to exercise your legal rights, please contact our Data Protection Officer:
              </p>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-5 space-y-2 text-gray-700 text-sm">
                <p><strong>Entity:</strong> SAMZ (UK) Trading Limited</p>
                <p><strong>Address:</strong> Holborn Gate, 330 High Holborn, London, WC1V 7PP, United Kingdom</p>
                <p><strong>Email:</strong> <a href="mailto:privacy@samz.com" className="text-[#FF6534] underline font-semibold">privacy@samz.com</a></p>
                <p><strong>Customer Service:</strong> <a href="mailto:customerservice@samz.com" className="text-[#FF6534] underline font-semibold">customerservice@samz.com</a></p>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
