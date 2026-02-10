'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiPhone, FiCalendar } from 'react-icons/fi';
import { Card, CardContent } from '@/components/ui/Card';
import { get, PaginatedResponse } from '@/lib/api';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  photo?: string;
  isActive: boolean;
  phone: string;
}

export function DoctorsSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await get<PaginatedResponse<Doctor>>('doctors', {
          params: { 
            page: 1, 
            limit: 4, // Only show 4 doctors on homepage
            sortBy: 'name', 
            sortOrder: 'asc'
          },
        });
        setDoctors(response.data || []);
      } catch (error) {
        console.error('Failed to load doctors', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

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
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-neutral-500 text-lg mt-4">Loading doctors...</p>
          </div>
        ) : (
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
                    {doctor.photo ? (
                      <img
                        src={doctor.photo}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl font-bold text-primary-300">
                          {doctor.name.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                    )}
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
                        href={`tel:${doctor.phone}`}
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
        )}

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
