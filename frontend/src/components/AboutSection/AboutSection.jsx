import React from 'react';

const AboutSection = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 font-sans">
      {/* Top Separator Line */}
      <div className="w-full h-[2px] bg-slate-300/80 my-10 sm:my-12"></div>

      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FF6534] text-center mb-8 tracking-tight">
        About us
      </h2>

      {/* Paragraphs */}
      <div className="text-center space-y-5 text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
        <p>
          SAMZ specialises in repairing smartphones, tablets &amp; laptops, appointed by <strong className="text-gray-900 font-bold">Samsung</strong> as an <strong className="text-gray-900 font-bold">Authorised Service Partner</strong>, by <strong className="text-gray-900 font-bold">Google</strong> as an <strong className="text-gray-900 font-bold">Authorised Service Provider</strong> and by <strong className="text-gray-900 font-bold">Apple</strong> as an <strong className="text-gray-900 font-bold">Independent Repair Provider</strong>.
        </p>

        <p>
          Using only highly trained and accredited tech repair Specialists, We pride ourselves on fast turnaround times and provide a lifetime warranty on the majority of our repairs, for your peace of mind.
        </p>

        <p>
          Our in-store teams are friendly and knowledgeable, and are able to diagnose a wide range of hardware issues as well as help with any software troubles. SAMZ repair technicians are all highly trained and our repairs take place in both our high street stores and service centres.
        </p>
      </div>

      {/* Bottom Separator Line */}
      <div className="w-full h-[2px] bg-slate-300/80 my-10 sm:my-12"></div>
    </div>
  );
};

export default AboutSection;
