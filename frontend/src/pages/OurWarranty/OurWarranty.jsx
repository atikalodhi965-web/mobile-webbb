import React, { useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import OurWarrantyScreen from '../../components/OurWarrantyScreen/OurWarrantyScreen';

const OurWarranty = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1C0D2A] selection:bg-[#FF6534] selection:text-white">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow w-full">
        <OurWarrantyScreen />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OurWarranty;
