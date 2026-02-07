'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiSearch, FiCalendar, FiPhone, FiAward, FiClock } from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { get, PaginatedResponse } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  bio: string;
  isActive: boolean;
  email: string;
  phone: string;
}

const specializations = [
  'All',
  'General Dentistry',
  'Orthodontics',
  'Oral & Maxillofacial Surgery',
  'Endodontics',
  'Prosthodontics',
  'Pediatric Dentistry',
  'Periodontics',
  'Conservative Dentistry & Endodontics',
  'Periodontist',
];

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
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
            limit: 100, 
            sortBy: 'name', 
            sortOrder: 'asc'
          },
        });
        setDoctors(response.data || []);
      } catch (error) {
        console.error('Failed to load doctors', error);
        toast.error('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === 'All' ||
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  return (
    <main>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Our Dental Team
            </h1>
            <p className="text-xl text-primary-200">
              Meet our experienced team of dental professionals dedicated to providing you 
              with the best possible care at Om Chabahil Dental Hospital.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b sticky top-20 z-30">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96">
              <Input
                placeholder="Search doctors..."
                leftIcon={<FiSearch className="w-5 h-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {specializations.slice(0, 5).map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialization(spec)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSpecialization === spec
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="text-neutral-500 text-lg mt-4">Loading doctors...</p>
            </div>
          ) : filteredDoctors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-card overflow-hidden group"
                >
                  {/* Doctor Image Placeholder */}
                  <div className="relative aspect-square bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                    <span className="text-6xl font-bold text-primary-300">
                      {doctor.name.split(' ').slice(1).map((n) => n[0]).join('')}
                    </span>
                    {doctor.isActive && (
                      <span className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs rounded-full">
                        Available
                      </span>
                    )}
                  </div>

                  {/* Doctor Info */}
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-primary-600 font-medium text-sm mb-2">
                      {doctor.specialization}
                    </p>
                    <p className="text-neutral-500 text-sm mb-3">
                      {doctor.qualification}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                      <span className="flex items-center gap-1">
                        <FiAward className="w-4 h-4" />
                        {doctor.experience} yrs
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        Available
                      </span>
                    </div>

                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                      {doctor.bio}
                    </p>

                    <div className="flex gap-2">
                      <Link
                        href="/appointments/book"
                        className="flex-1 btn-primary text-sm py-2 justify-center"
                      >
                        <FiCalendar className="w-4 h-4 mr-1" />
                        Book
                      </Link>
                      <a
                        href={`tel:${doctor.phone}`}
                        className="btn-secondary text-sm py-2"
                      >
                        <FiPhone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-500 text-lg">No doctors found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-900">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Need Help Finding the Right Doctor?
          </h2>
          <p className="text-primary-200 mb-8 max-w-2xl mx-auto">
            Our team is here to help you find the right specialist for your dental needs.
            Contact us for a consultation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/appointments/book" className="btn-white">
              Book Appointment
            </Link>
            <a href="tel:+9779841234567" className="btn bg-accent-500 text-white hover:bg-accent-600 flex items-center gap-2">
              <FiPhone className="w-5 h-5" />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
