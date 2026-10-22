/**
 * CustomerReviews.jsx
 * Fetches reviews from the backend via useReviews hook.
 * Falls back to static data while loading or if the API is unavailable.
 */
import React, { useState, useEffect } from 'react';
import { useReviews } from '../../hooks/useContent';
import './CustomerReviews.css';

// Static fallback reviews (used while API is loading or on error)
const STATIC_REVIEWS = [
  {
    _id: 1,
    rating: 5,
    quote: '"Incredible service from Gurpreet today. He was calm, helpful, proactive and changed my screen as I waited."',
    author: 'Hemali Patel',
    location: 'Charing Cross',
    source: 'Google review',
  },
  {
    _id: 2,
    rating: 5,
    quote: '"Jinay solved my broken iPhone really quickly! Great service would recommend."',
    author: 'Samuel Fleischman',
    location: 'Tottenham Court Road',
    source: 'Google review',
  },
  {
    _id: 3,
    rating: 5,
    quote: '"Brilliant service, very speedy and would recommend."',
    author: 'Elena Lau',
    location: 'Southampton',
    source: 'Google review',
  },
  {
    _id: 4,
    rating: 5,
    quote: '"Staff was exceptionally helpful. Battery replacement completed in under 30 minutes!"',
    author: 'Marcus Vance',
    location: 'Victoria Station',
    source: 'Google review',
  },
  {
    _id: 5,
    rating: 5,
    quote: '"Saved my phone after water damage! Transparent pricing and super fast turnaround."',
    author: 'Sophie Taylor',
    location: 'Covent Garden',
    source: 'Google review',
  },
  {
    _id: 6,
    rating: 5,
    quote: '"Friendly team, instant diagnosis, and fixed the charging port while I grabbed a coffee."',
    author: 'David Miller',
    location: 'Brighton',
    source: 'Google review',
  },
];

const CustomerReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);

  // Fetch reviews from backend
  const { reviews: apiReviews, loading, error } = useReviews();

  // Use API data if available, otherwise fall back to static data
  const displayReviews = !loading && !error && apiReviews.length > 0
    ? apiReviews
    : STATIC_REVIEWS;

  // Adjust visible cards count based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset index when reviews change
  useEffect(() => { setCurrentIndex(0); }, [displayReviews.length]);

  const totalPages = Math.ceil(displayReviews.length / cardsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const visibleReviews = displayReviews.slice(
    currentIndex * cardsPerPage,
    currentIndex * cardsPerPage + cardsPerPage
  );

  return (
    <section className="bg-[#FAF7F8] py-16 md:py-20 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10 md:mb-12">
          {/* Left Title & Subtitle */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-[2px] bg-[#FF6534] inline-block rounded-full"></span>
              <span className="text-[#FF6534] font-bold text-xs sm:text-sm tracking-wider uppercase">
                CUSTOMER REVIEWS
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F1B2E] tracking-tight leading-tight">
              What our customers <span className="text-[#FF6534]">say about SAMZ</span>
            </h2>

            <p className="text-[#6E6B7B] font-medium text-sm sm:text-base mt-3">
              Recent Google reviews from customers across SAMZ stores.
            </p>
          </div>

          {/* Right Google Reviews Badge */}
          <div className="flex-shrink-0 self-start md:self-auto pt-1 mt-20">
            <div className="inline-flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-md transition-all cursor-pointer">
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="font-bold text-sm text-[#1F1B2E]">Google reviews</span>
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-gray-100 min-h-[220px] animate-pulse">
                <div className="flex gap-1 mb-5">
                  {[1,2,3,4,5].map(s => <div key={s} className="w-4 h-4 bg-gray-200 rounded" />)}
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-4/5" />
                  <div className="h-3 bg-gray-200 rounded w-3/5" />
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 transition-all duration-300">
            {visibleReviews.map((review) => (
              <div
                key={review._id ?? review.id}
                className="bg-white rounded-2xl p-7 flex flex-col justify-between shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-all duration-200 group min-h-[220px]"
              >
                {/* Card Top: Stars & Quote */}
                <div>
                  {/* Stars */}
                  <div className="flex gap-1.5 text-yellow-400 mb-5">
                    {[...Array(review.rating ?? 5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-[#262233] font-medium text-sm leading-relaxed">
                    {review.quote ?? review.text}
                  </p>
                </div>

                {/* Card Bottom */}
                <div className="mt-6">
                  <hr className="border-t border-gray-100 mb-4" />
                  <div className="flex items-end justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#1F1B2E]">
                        {review.author ?? review.name}
                      </h4>
                      <p className="text-xs text-[#787486] font-normal mt-0.5">
                        {review.location}
                      </p>
                    </div>
                    <span className="text-xs text-[#8E8A9C] font-normal">
                      {review.source ?? 'Google review'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Carousel Controls */}
        {!loading && (
          <div className="flex items-center justify-between mb-10 pt-2">
            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                    currentIndex === idx
                      ? 'w-7 h-2 bg-[#FF6534]'
                      : 'w-2 h-2 bg-[#E2DCE5] hover:bg-[#c9c2ce]'
                  }`}
                  aria-label={`Go to review slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-gray-300/80 flex items-center justify-center text-[#1F1B2E] hover:border-[#FF6534] hover:text-[#FF6534] hover:bg-white transition-all cursor-pointer shadow-sm focus:outline-none"
                aria-label="Previous reviews"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-gray-300/80 flex items-center justify-center text-[#1F1B2E] hover:border-[#FF6534] hover:text-[#FF6534] hover:bg-white transition-all cursor-pointer shadow-sm focus:outline-none"
                aria-label="Next reviews"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="flex justify-center pt-2">
          <a
            href="#stores"
            className="inline-flex items-center gap-2 bg-white hover:bg-[#FF6534] text-[#1F1B2E] hover:text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-full border border-gray-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 group cursor-pointer"
          >
            <span>Find your nearest SAMZ store</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
};

export default CustomerReviews;
