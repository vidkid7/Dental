'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { get } from '@/lib/api';

interface HeroContent {
  badgeText?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  imagePath?: string;
  images?: string[]; // Array of up to 3 image paths
}

interface HeroApiResponse {
  content: HeroContent;
}

// Animation variants for container with staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
      duration: 0.5,
    },
  },
};

// Animation variants for individual content items
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
    },
  },
};

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

export function HeroSection() {
  const [content, setContent] = useState<HeroContent>({
    badgeText: 'Open 7 Days a Week - Quality Dental Care',
    title: 'Your Trusted Healthcare Partner',
    subtitle: 'Om Chabahil Dental Hospital - Providing quality dental care with modern technology and experienced professionals in Kathmandu, Nepal.',
    ctaText: 'Book Appointment',
    imagePath: '/images/team.jpg',
    images: [
      '/images/team.jpg',
      '/images/clinic-1.jpg',
      '/images/clinic-2.jpg',
    ], // Default with 3 images to show slider
  });
  const [isContentReady, setIsContentReady] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get the array of images (up to 3)
  const heroImages = content.images && content.images.length > 0 
    ? content.images.slice(0, 3) 
    : [content.imagePath || '/images/team.jpg'];

  // Debug logging
  useEffect(() => {
    console.log('Hero Images:', heroImages);
    console.log('Hero Images Length:', heroImages.length);
    console.log('Current Image Index:', currentImageIndex);
  }, [heroImages, currentImageIndex]);

  // Auto-advance slider every 5 seconds
  useEffect(() => {
    if (heroImages.length <= 1) return; // Don't auto-advance if only one image

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length, heroImages]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await get<HeroApiResponse>('content/page/home/hero');
        if (response && response.content) {
          // Determine which images to use
          let imagesToUse: string[];
          
          if (response.content.images && response.content.images.length > 0) {
            // Use images array from API
            imagesToUse = response.content.images;
          } else if (response.content.imagePath) {
            // Fallback to single imagePath, but keep default multiple images if available
            imagesToUse = content.images && content.images.length > 1 
              ? content.images 
              : [response.content.imagePath];
          } else {
            // Use default images
            imagesToUse = content.images || ['/images/team.jpg'];
          }

          // Merge API content with default content, only overriding non-empty values
          setContent({
            badgeText: response.content.badgeText || content.badgeText,
            title: response.content.title || content.title,
            subtitle: response.content.subtitle || content.subtitle,
            ctaText: response.content.ctaText || content.ctaText,
            imagePath: response.content.imagePath || content.imagePath,
            images: imagesToUse,
          });
        }
      } catch (error) {
        console.error('Failed to load hero content:', error);
        // Keep default content on error - graceful degradation
      } finally {
        setIsContentReady(true);
      }
    };

    fetchContent();
  }, []);

  // Helper function to highlight a word in the title with dental blue
  const renderTitle = (title: string) => {
    // Words to potentially highlight in dental blue
    const highlightWords = ['Healthcare', 'Dental', 'Trusted', 'Partner', 'Care', 'Smile', 'Health'];
    
    const words = title.split(' ');
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:]/, '');
      const punctuation = word.match(/[.,!?;:]/) ? word.match(/[.,!?;:]/)![0] : '';
      
      if (highlightWords.includes(cleanWord)) {
        return (
          <span key={index}>
            <span style={{ color: '#4FC3F7' }}>{cleanWord}</span>
            {punctuation}{' '}
          </span>
        );
      }
      return <span key={index}>{word} </span>;
    });
  };

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
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Slider Layer (z-0) */}
      <div className="absolute inset-0 z-0">
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
              alt={`Om Chabahil Dental Hospital - Image ${currentImageIndex + 1}`}
              fill
              priority={currentImageIndex === 0}
              className="object-cover object-center"
              sizes="100vw"
              onLoadingComplete={() => setIsContentReady(true)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Premium Gradient Overlay Layer (z-1) - Left-to-right for better text readability */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)'
        }}
      />

      {/* Slider Controls - Only show if more than 1 image */}
      {heroImages.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Previous image"
          >
            <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Next image"
          >
            <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'bg-white w-6 sm:w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Content Container (z-10) - Center-left alignment for premium look */}
      <motion.div
        className="relative z-10 flex flex-col items-start justify-center text-left px-6 py-8 sm:px-12 sm:py-12 md:px-16 md:py-16 lg:px-20 lg:py-20 max-w-7xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate={isContentReady ? 'visible' : 'hidden'}
      >
        <div className="max-w-2xl">
          {/* Badge - Dental blue accent with soft styling */}
          {content.badgeText && (
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6"
              style={{
                backgroundColor: 'rgba(79, 195, 247, 0.15)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(79, 195, 247, 0.3)'
              }}
            >
              <span 
                className="w-2 h-2 rounded-full animate-pulse" 
                style={{ backgroundColor: '#4FC3F7' }}
              />
              <span 
                className="text-xs sm:text-sm font-medium"
                style={{ color: '#E6F4F8' }}
              >
                {content.badgeText}
              </span>
            </motion.div>
          )}

          {/* Headline - Pure white with dental blue accent word */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6"
            style={{ color: '#FFFFFF' }}
          >
            {renderTitle(content.title || '')}
          </motion.h1>

          {/* Subtitle - Soft light blue for calm, trustworthy feel */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-6 sm:mb-8"
            style={{ color: '#E6F4F8' }}
          >
            {content.subtitle}
          </motion.p>

          {/* CTA Button - Clean dental blue */}
          <motion.div variants={itemVariants}>
            <Link
              href="/appointments/book"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 min-h-[44px] min-w-[44px] font-semibold text-base sm:text-lg text-white rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 touch-manipulation"
              style={{
                backgroundColor: '#0288D1',
                boxShadow: '0 4px 14px 0 rgba(2, 136, 209, 0.39)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0277BD';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(2, 136, 209, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0288D1';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(2, 136, 209, 0.39)';
              }}
            >
              <FiCalendar className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <span>{content.ctaText}</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
