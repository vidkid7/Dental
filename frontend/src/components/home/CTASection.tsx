'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiCalendar, FiPhone, FiMapPin } from 'react-icons/fi';

export function CTASection() {
  return (
    <section className="relative py-20 bg-primary-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6">
              Ready to Start Your{' '}
              <span className="text-accent-400">Dental Journey?</span>
            </h2>
            <p className="text-xl text-primary-200 mb-8">
              Whether you're looking for quality dental care or pursuing a career in dentistry, 
              we're here to help you every step of the way.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/appointments/book" className="btn-white btn-lg">
                <FiCalendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Link>
              <Link href="/academics/admissions" className="btn bg-accent-500 text-white hover:bg-accent-600 btn-lg">
                Apply for Admission
              </Link>
            </div>
          </motion.div>

          {/* Contact Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Phone Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiPhone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-primary-200 text-sm mb-1">Call us anytime</p>
                <a href="tel:014592100" className="text-2xl font-bold text-white hover:text-accent-400 transition-colors">
                  0145-92100
                </a>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiMapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-primary-200 text-sm mb-1">Visit us at</p>
                <p className="text-xl font-semibold text-white">
                  Chabahil, Koteshwor, Kathmandu, Nepal
                </p>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <p className="text-primary-200 text-sm mb-3">Working Hours</p>
              <div className="grid grid-cols-2 gap-4 text-white">
                <div>
                  <p className="font-semibold">Monday - Friday</p>
                  <p className="text-primary-200">8:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <p className="font-semibold">Saturday</p>
                  <p className="text-primary-200">9:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
