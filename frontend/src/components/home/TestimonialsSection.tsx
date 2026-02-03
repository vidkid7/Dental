'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Images replaced with placeholders for development
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import { FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Patient',
    content: 'The care I received at Premier Dental was exceptional. The staff was incredibly professional, and the dentist took the time to explain every procedure. I\'ve never felt more comfortable at a dental clinic.',
    rating: 5,
    image: '/images/testimonial-1.jpg',
  },
  {
    id: 2,
    name: 'Dr. James Wilson',
    role: 'BDS Alumni 2018',
    content: 'My education at Premier Dental College prepared me exceptionally well for my career. The clinical exposure and mentorship I received were invaluable. I\'m now running my own successful practice.',
    rating: 5,
    image: '/images/testimonial-2.jpg',
  },
  {
    id: 3,
    name: 'Emily Chen',
    role: 'Parent',
    content: 'Finding a dentist my kids actually want to visit was a miracle! The pediatric team is amazing - patient, gentle, and great at making dental visits fun. Both my children now love going to the dentist.',
    rating: 5,
    image: '/images/testimonial-3.jpg',
  },
  {
    id: 4,
    name: 'Michael Rodriguez',
    role: 'Patient',
    content: 'After years of avoiding dentists, I finally found one I trust. The entire team made me feel at ease, and the results of my smile makeover exceeded all my expectations.',
    rating: 5,
    image: '/images/testimonial-4.jpg',
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="badge-primary mb-4">Testimonials</span>
          <h2 className="section-title mb-4">
            What Our Patients & Students Say
          </h2>
          <p className="section-subtitle mx-auto">
            Hear from those who have experienced our care and education firsthand.
          </p>
        </motion.div>

        {/* Testimonial Slider */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-card"
              >
                <FaQuoteLeft className="w-12 h-12 text-primary-200 mb-6" />
                
                <p className="text-xl md:text-2xl text-neutral-700 leading-relaxed mb-8">
                  "{testimonials[currentIndex].content}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {testimonials[currentIndex].name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-neutral-900">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-neutral-500">
                        {testimonials[currentIndex].role}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <FiStar
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-neutral-700 hover:bg-primary-600 hover:text-white transition-colors"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-neutral-700 hover:bg-primary-600 hover:text-white transition-colors"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary-600' : 'bg-neutral-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
