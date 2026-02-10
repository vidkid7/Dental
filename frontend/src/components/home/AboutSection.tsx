'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiCheck, FiArrowRight } from 'react-icons/fi';

const features = [
  'Modern dental equipment and sterilization',
  'Experienced and certified dentists',
  'Comfortable and hygienic environment',
  'Affordable treatment options',
  'Emergency dental services available',
  'Personalized patient care',
];

export function AboutSection() {
  const [clinicImages, setClinicImages] = useState([
    '/images/clinic-1.jpg',
    '/images/clinic-2.jpg',
    '/images/clinic-3.jpg',
    '/images/clinic-4.jpg',
  ]);

  useEffect(() => {
    // Load images from API
    const loadImages = async () => {
      try {
        console.log('[Home About Section] Loading images from API...');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        console.log('[Home About Section] API URL:', apiUrl);
        
        const response = await fetch(`${apiUrl}/api/v1/content/page/home/about`);
        console.log('[Home About Section] Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('[Home About Section] Full response data:', JSON.stringify(data, null, 2));
          
          if (data?.content?.imagePaths && Array.isArray(data.content.imagePaths)) {
            console.log('[Home About Section] Setting all images to:', data.content.imagePaths);
            setClinicImages(data.content.imagePaths);
          } else {
            console.log('[Home About Section] No imagePaths array found in response');
          }
        } else {
          console.log('[Home About Section] Response not OK:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('[Home About Section] Failed to load images', error);
        // Continue with default images
      }
    };

    loadImages();
  }, []);
  return (
    <section className="section-padding bg-neutral-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-card">
                  <Image
                    src={clinicImages[0]}
                    alt="Om Chabahil Dental Clinic"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-card">
                  <Image
                    src={clinicImages[1]}
                    alt="Dental Equipment"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="pt-8 space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-card">
                  <Image
                    src={clinicImages[2]}
                    alt="Treatment Room"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-card">
                  <Image
                    src={clinicImages[3]}
                    alt="Dental Procedure"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Experience Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-8 py-4 rounded-2xl shadow-elevated"
            >
              <p className="text-3xl font-bold text-center">10+</p>
              <p className="text-sm text-primary-100">Years of Service</p>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-primary mb-4">About Us</span>
            <h2 className="section-title mb-6">
              Your Trusted{' '}
              <span className="gradient-text">Dental Care Partner</span>
            </h2>
            <p className="text-neutral-600 mb-6">
              Om Chabahil Dental Hospital has been serving the Kathmandu community with 
              quality dental care services. Our clinic in Koteshwor is equipped with 
              modern technology and staffed by experienced dental professionals.
            </p>
            <p className="text-neutral-600 mb-8">
              We believe in providing personalized care to each patient, ensuring comfort 
              and satisfaction. From routine check-ups to complex dental procedures, we 
              offer comprehensive dental services for the whole family.
            </p>

            {/* Features List */}
            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiCheck className="w-4 h-4 text-accent-600" />
                  </div>
                  <span className="text-neutral-700">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link href="/about" className="btn-primary">
                Learn More About Us
                <FiArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/services" className="btn-secondary">
                Our Services
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
