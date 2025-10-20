
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingBag, Heart, Eye } from 'lucide-react';

// ===== HERO CAROUSEL COMPONENT =====
const HeroCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, images.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  if (images.length === 0) {
    return (
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
        <p className="text-gray-600">No banners available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden group shadow-2xl">
      {/* Slides */}
      <div className="relative w-full h-full">
        {images.map((banner, index) => (
          <div
            key={banner._id || index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={banner.image}
              alt={banner.title || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Overlay Content */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
              <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-2xl text-white space-y-4">
                  {banner.title && (
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
                      {banner.title}
                    </h1>
                  )}
                  {banner.description && (
                    <p className="text-lg md:text-xl text-gray-200 animate-fade-in-delay">
                      {banner.description}
                    </p>
                  )}
                  {banner.buttonText && banner.link && (
                    <a
                      href={banner.link}
                      className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full transition-all transform hover:scale-105 shadow-lg"
                    >
                      {banner.buttonText}
                    </a>
                  )}
                </div>
              </div>
            </div> */}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all ${
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            } h-2 rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;