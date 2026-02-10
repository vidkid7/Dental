'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiPlay, FiCalendar, FiPhone } from 'react-icons/fi';
import { get } from '@/lib/api';

interface HeroContent {
  badgeText?: string;
  title?: string;
  highlightText?: string;
  subtitle?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  stats?: {
    yearsExperience?: string;
    expertDentists?: string;
    happyPatients?: string;
  };
}

export function HeroSection() {
  const [content, setContent] = useState<HeroContent>({
    badgeText: 'Open 7 Days a Week - Quality Dental Care',
    title: 'Your Smile,',
    highlightText: 'Our Priority',
    subtitle: 'Om Chabahil Dental Hospital - Providing quality dental care with modern technology and experienced professionals in Kathmandu, Nepal.',
    primaryCtaText: 'Book Appointment',
    secondaryCtaText: 'Call Now',
    stats: {
      yearsExperience: '10+',
      expertDentists: '15+',
      happyPatients: '5000+',
    },
  });
  const [heroImage, setHeroImage] = useState('/images/team.jpg');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await get<any>('content/page/home/hero');
        if (response && response.content) {
          setContent({
            badgeText: response.content.badgeText || content.badgeText,
            title: response.content.title || content.title,
            highlightText: response.content.highlightText || content.highlightText,
            subtitle: response.content.subtitle || content.subtitle,
            primaryCtaText: response.content.primaryCtaText || content.primaryCtaText,
            secondaryCtaText: response.content.secondaryCtaText || content.secondaryCtaText,
            stats: response.content.stats || content.stats,
          });
          
          // Load hero image
          if (response.content.imagePath) {
            setHeroImage(response.content.imagePath);
          }
        }
      } catch (error) {
        console.error('Failed to load hero content', error);
        // Keep default content on error
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-soft mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-neutral-600">
                {content.badgeText}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-neutral-900 leading-tight mb-6">
              {content.title}{' '}
              <span className="gradient-text">{content.highlightText}</span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-lg">
              {content.subtitle}
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/appointments/book" className="btn-primary btn-lg group">
                <FiCalendar className="w-5 h-5 mr-2" />
                {content.primaryCtaText}
                <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="tel:+9779841234567" className="btn-secondary btn-lg">
                <FiPhone className="w-5 h-5 mr-2" />
                {content.secondaryCtaText}
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-8 pt-8 border-t border-neutral-200">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">{content.stats?.yearsExperience}</p>
                <p className="text-sm text-neutral-500">Years Experience</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">{content.stats?.expertDentists}</p>
                <p className="text-sm text-neutral-500">Expert Dentists</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">{content.stats?.happyPatients}</p>
                <p className="text-sm text-neutral-500">Happy Patients</p>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main Image */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-elevated">
                <Image
                  src={heroImage}
                  alt="Om Chabahil Dental Team"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent" />
              </div>

              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-card p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">Certified</p>
                    <p className="text-sm text-neutral-500">NMC Registered</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute -right-8 bottom-1/4 bg-white rounded-2xl shadow-card p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">Patient Care</p>
                    <p className="text-sm text-neutral-500">First Priority</p>
                  </div>
                </div>
              </motion.div>

              {/* Virtual Tour Button */}
              <Link
                href="/gallery"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg hover:bg-white transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <FiPlay className="w-5 h-5 text-white ml-0.5" />
                  </div>
                  <span className="font-medium text-neutral-900">View Gallery & Tour</span>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
