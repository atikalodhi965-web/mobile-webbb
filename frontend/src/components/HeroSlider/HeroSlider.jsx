import React, { useState, useEffect } from 'react';
import HeroSection from '../Hero/HeroSection';
import HeroSection2 from '../Hero2/HeroSection2';
import './HeroSlider.css';

const HeroSlider = ({ autoSlideInterval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide === 0 ? 1 : 0));
    }, autoSlideInterval);

    return () => clearInterval(timer);
  }, [autoSlideInterval]);

  return (
    <div className="relative overflow-hidden w-full select-none">
      {/* Slider Track Container */}
      <div
        className="flex w-[200%] transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 50}%)` }}
      >
        {/* Slide 1: HeroSection2 (Cheeky Refurb) */}
        <div className="w-1/2 flex-shrink-0">
          <HeroSection2 />
        </div>

        {/* Slide 2: HeroSection (Fixes in a Flash) */}
        <div className="w-1/2 flex-shrink-0">
          <HeroSection />
        </div>
      </div>

      {/* Subtle Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        <button
          onClick={() => setCurrentSlide(0)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            currentSlide === 0 ? 'bg-[#FF6534] w-8' : 'bg-white/50 hover:bg-white/80'
          }`}
          aria-label="Go to Slide 1"
        />
        <button
          onClick={() => setCurrentSlide(1)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            currentSlide === 1 ? 'bg-[#FF6534] w-8' : 'bg-white/50 hover:bg-white/80'
          }`}
          aria-label="Go to Slide 2"
        />
      </div>
    </div>
  );
};

export default HeroSlider;
