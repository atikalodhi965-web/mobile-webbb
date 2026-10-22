import React, { useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1C0D2A] selection:bg-[#FF6534] selection:text-white">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow w-full py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Main Title - Orange Red (#FF6534) replacing pink */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FF6534] text-center mb-12 sm:mb-16 tracking-tight">
            Terms &amp; Conditions
          </h1>

          {/* Document Content */}
          <div className="space-y-10 text-[#2B2035] leading-relaxed text-sm sm:text-base font-normal">

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                1. Agreement for repair
              </h2>
              <p className="text-gray-700 leading-relaxed">
                1.1 The terms set out in these Conditions of Repair ("Agreement") shall apply to the service ("Service") we provide to repair your smartphone, tablet, computer and/or any accessories ("Device") on the service check-in form.
              </p>
              <p className="text-gray-700 leading-relaxed">
                1.2 Reference to "us", "we" and "our" refer to SAMZ and references to "you" and "your" are references to you ("Customer"), the person addressed on this form.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                2. All repairs (unless otherwise stated)
              </h2>
              <p className="text-gray-700 leading-relaxed">
                2.1 This Agreement shall commence from the date you sign the service check-in form and shall continue until we have repaired or otherwise returned your Device, whichever is sooner, and received any payment due from you.
              </p>
              <p className="text-gray-700 leading-relaxed">
                2.2 We shall make reasonable efforts to repair your Device subject to the availability of any parts required and/or the terms of any relevant guarantee or warranty. We shall perform the Service using our utmost care and skill.
              </p>
              <p className="text-gray-700 leading-relaxed">
                2.3 We offer both high-quality after-market and OEM (genuine) parts (where possible) for the repairs of your device.
              </p>
              <p className="text-gray-700 leading-relaxed">
                2.4 Where specified we also offer genuine Apple parts sourced from Apple. In such scenarios we will use Apple diagnostics, tools, and processes to make sure your Apple product repair is done safely and reliably.
              </p>
              <p className="text-gray-700 leading-relaxed">
                2.5 We perform a series of tests when booking a device in for repair. If the device is not testable during this stage, SAMZ is not liable for any faults found therefore we shall require the passcode of your Device to test the Device before and after the Service. Should you prefer to keep this information private, we can still proceed with an appointment, but will not be able to perform a full functional check on the Device until you return to the store, which can delay the provision of the Service, if any adjustments need to be made.
              </p>
              <p className="text-gray-700 leading-relaxed">
                2.6 Any time estimate for completion of the service, which may be given to you, is an estimate only and does not form any obligation under the terms of this Agreement.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                3. Warranty and guarantee
              </h2>
              <p className="text-gray-700 leading-relaxed">
                3.1 All repairs carried out by SAMZ are backed by our comprehensive warranty as specified at the time of booking. For screen and hardware replacements, this covers defects in parts and workmanship.
              </p>
              <p className="text-gray-700 leading-relaxed">
                3.2 The warranty does not cover accidental damage, liquid intrusion, physical impact occurring post-repair, software modifications, jailbreaking, or repairs attempted by unauthorized third parties.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                4. Liability and customer data
              </h2>
              <p className="text-gray-700 leading-relaxed">
                4.1 While our technicians handle every device with extreme care, SAMZ strongly advises all customers to back up device data prior to repair. SAMZ accepts no liability for loss of data, corrupted media, or loss of access to accounts during or following the repair process.
              </p>
              <p className="text-gray-700 leading-relaxed">
                4.2 Nothing in this Agreement shall limit or exclude our liability for death or personal injury caused by negligence, fraud, or any statutory rights that cannot be excluded under applicable UK consumer law.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                5. Device collection and storage
              </h2>
              <p className="text-gray-700 leading-relaxed">
                5.1 When your device is repaired and ready for collection, SAMZ will notify you via email, SMS, or phone.
              </p>
              <p className="text-gray-700 leading-relaxed">
                5.2 Devices left uncollected for more than 60 days following notification may be recycled, disposed of, or sold to recover repair and storage costs, in accordance with applicable UK legislation.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                6. Pricing and payment
              </h2>
              <p className="text-gray-700 leading-relaxed">
                6.1 All repair prices quoted include parts, labour, and applicable taxes unless stated otherwise.
              </p>
              <p className="text-gray-700 leading-relaxed">
                6.2 Payment must be completed before or upon device collection. We accept major credit/debit cards, contactless payments, and approved financing options.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">
                7. Booking cancellations and diagnostics
              </h2>
              <p className="text-gray-700 leading-relaxed">
                7.1 You may cancel your appointment without penalty prior to technician work commencing. Where extensive diagnostic testing has been conducted, a standard diagnostic inspection fee may apply if you choose not to proceed with the recommended repair.
              </p>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TermsConditions;
