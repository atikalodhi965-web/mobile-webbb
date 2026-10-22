import React from 'react';
import Header from '../../components/Header/Header';
import HeroSlider from '../../components/HeroSlider/HeroSlider';
import CustomerReviews from '../../components/CustomerReviews/CustomerReviews';
import ServiceSelect from '../../components/ServiceSelect/ServiceSelect';
import DevicesBrands from '../../components/DevicesBrands/DevicesBrands';
import WhySAMZ from '../../components/WhySAMZ/WhySAMZ';
import SupportingLinks from '../../components/SupportingLinks/SupportingLinks';
import Footer from '../../components/Footer/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#FF6534] selection:text-white">
      {/* Header Component */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Auto-Sliding Hero Sections */}
        <HeroSlider autoSlideInterval={5000} />

        {/* Customer Reviews Section */}
        <CustomerReviews />

        {/* Select-Type Service Cards Section */}
        <ServiceSelect />

        {/* Devices and Brands Section */}
        <DevicesBrands />

        {/* Why SAMZ Section */}
        <WhySAMZ />

        {/* Supporting Links Section */}
        <SupportingLinks />

        {/* Footer Section */}
        <Footer />
      </main>
    </div>
  );
};

export default Home;
