'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiPhone, FiCalendar } from 'react-icons/fi';
import { Card, CardContent } from '@/components/ui/Card';

const doctors = [
  {
    id: '1',
    name: 'Dr. Bikash Sharma',
    specialization: 'General Dentistry',
    qualification: 'BDS, NMC Registered',
    experience: 12,
    image: '/images/clinic-1.jpg',
  },
  {
    id: '2',
    name: 'Dr. Sunita Thapa',
    specialization: 'Orthodontics',
    qualification: 'BDS, MDS (Ortho)',
    experience: 8,
    image: '/images/clinic-2.jpg',
  },
  {
    id: '3',
    name: 'Dr. Ram Prasad KC',
    specialization: 'Oral Surgery',
    qualification: 'BDS, MDS (OMFS)',
    experience: 15,
    image: '/images/clinic-3.jpg',
  },
  {
    id: '4',
    name: 'Dr. Anita Gurung',
    specialization: 'Endodontics',
    qualification: 'BDS, MDS (Endo)',
    experience: 10,
    image: '/images/clinic-4.jpg',
  },
];

export function DoctorsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="badge-primary mb-4">Our Team</span>
          <h2 className="section-title mb-4">
            Meet Our Expert Dentists
          </h2>
          <p className="section-subtitle mx-auto">
            Our team of experienced and qualified dental professionals is dedicated 
            to providing you with the best possible care.
          </p>
        </motion.div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hover className="group overflow-hidden">
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold text-primary-300">
                      {doctor.name.split(' ').slice(1).map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Quick Actions - Show on Hover */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href="/appointments/book"
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-700 hover:bg-primary-600 hover:text-white transition-colors"
                    >
                      <FiCalendar className="w-5 h-5" />
                    </Link>
                    <a
                      href="tel:+9779841234567"
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-700 hover:bg-primary-600 hover:text-white transition-colors"
                    >
                      <FiPhone className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-primary-600 font-medium text-sm mb-2">
                    {doctor.specialization}
                  </p>
                  <p className="text-neutral-500 text-sm">
                    {doctor.qualification}
                  </p>
                  <p className="text-neutral-400 text-xs mt-1">
                    {doctor.experience} years experience
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/doctors" className="btn-primary">
            View All Doctors
            <FiArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
