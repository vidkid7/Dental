'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Animation variants for image transitions
const imageVariants = {
  enter: {
    opacity: 0,
  },
  center: {
    opacity: 1,
    transition: {
      duration: 1,
      ease: 'easeInOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

export default function TestSliderPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Test images - hardcoded
  const heroImages = [
    '/images/team.jpg',
    '/images/clinic-1.jpg',
    '/images/clinic-2.jpg',
  ];

  // Auto-advance slider every 5 seconds
  useEffect(() => {
    console.log('Setting up auto-slide interval');
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const next = (prev + 1) % heroImages.length;
        console.log('Auto-advancing from', prev, 'to', next);
        return next;
      });
    }, 5000);

    return () => {
      console.log('Cleaning up interval');
      clearInterval(interval);
    };
  }, [heroImages.length]);

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Hero Slider Test Page</h1>
        <p className="mb-4">
          This page tests the slider functionality independently. Images should auto-rotate every 5 seconds.
        </p>
        <p className="mb-8">
          Current Image: {currentImageIndex + 1} of {heroImages.length}
        </p>

        {/* Slider Container */}
        <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-2xl">
          {/* Background Image Slider Layer */}
          <div className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <Image
                  src={heroImages[currentImageIndex]}
                  alt={`Test Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Premium Gradient Overlay - Left to right for better text readability */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)'
            }}
          />

          {/* Slider Controls */}
          <>
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Previous image"
            >
              <FiChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Next image"
            >
              <FiChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white font-medium">
                {currentImageIndex + 1} / {heroImages.length}
              </span>
            </div>
          </>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">Debug Information</h2>
          <ul className="space-y-1 text-sm">
            <li>Current Index: {currentImageIndex}</li>
            <li>Total Images: {heroImages.length}</li>
            <li>Current Image: {heroImages[currentImageIndex]}</li>
            <li>Auto-slide: Every 5 seconds</li>
          </ul>
        </div>

        {/* Instructions */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold mb-2">Test Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Wait 5 seconds - image should change automatically</li>
            <li>Click the left arrow - should go to previous image</li>
            <li>Click the right arrow - should go to next image</li>
            <li>Click any dot - should jump to that image</li>
            <li>Check browser console for debug logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
