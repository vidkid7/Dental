'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiSearch, FiCalendar, FiPhone, FiAward, FiClock } from 'react-icons/fi';
import { Input } from '@/components/ui/Input';

const doctors = [
  {
    id: '1',
    name: 'Dr. Bikash Sharma',
    specialization: 'General Dentistry',
    qualification: 'BDS, NMC Registered',
    experience: 12,
    about: 'Expert in general dental care, preventive dentistry, and restorative treatments.',
    languages: ['Nepali', 'English', 'Hindi'],
    available: true,
  },
  {
    id: '2',
    name: 'Dr. Sunita Thapa',
    specialization: 'Orthodontics',
    qualification: 'BDS, MDS (Orthodontics)',
    experience: 8,
    about: 'Specialist in braces, aligners, and teeth alignment treatments.',
    languages: ['Nepali', 'English'],
    available: true,
  },
  {
    id: '3',
    name: 'Dr. Ram Prasad KC',
    specialization: 'Oral Surgery',
    qualification: 'BDS, MDS (OMFS)',
    experience: 15,
    about: 'Experienced oral surgeon specializing in extractions, implants, and jaw surgeries.',
    languages: ['Nepali', 'English', 'Hindi'],
    available: true,
  },
  {
    id: '4',
    name: 'Dr. Anita Gurung',
    specialization: 'Endodontics',
    qualification: 'BDS, MDS (Endodontics)',
    experience: 10,
    about: 'Root canal specialist with expertise in saving damaged teeth.',
    languages: ['Nepali', 'English'],
    available: true,
  },
  {
    id: '5',
    name: 'Dr. Suman Adhikari',
    specialization: 'Prosthodontics',
    qualification: 'BDS, MDS (Prostho)',
    experience: 9,
    about: 'Expert in dental crowns, bridges, dentures, and smile makeovers.',
    languages: ['Nepali', 'English'],
    available: true,
  },
  {
    id: '6',
    name: 'Dr. Priya Shrestha',
    specialization: 'Pediatric Dentistry',
    qualification: 'BDS, MDS (Pedo)',
    experience: 7,
    about: 'Child-friendly dentist specializing in dental care for kids and adolescents.',
    languages: ['Nepali', 'English'],
    available: true,
  },
  {
    id: '7',
    name: 'Dr. Rajesh Maharjan',
    specialization: 'Periodontics',
    qualification: 'BDS, MDS (Perio)',
    experience: 11,
    about: 'Gum specialist treating gum diseases and performing dental implants.',
    languages: ['Nepali', 'Newari', 'English'],
    available: true,
  },
  {
    id: '8',
    name: 'Dr. Maya Tamang',
    specialization: 'Cosmetic Dentistry',
    qualification: 'BDS, Certified Cosmetic Dentist',
    experience: 6,
    about: 'Specializing in teeth whitening, veneers, and smile enhancement procedures.',
    languages: ['Nepali', 'English'],
    available: true,
  },
];

const specializations = [
  'All',
  'General Dentistry',
  'Orthodontics',
  'Oral Surgery',
  'Endodontics',
  'Prosthodontics',
  'Pediatric Dentistry',
  'Periodontics',
  'Cosmetic Dentistry',
];

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

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
          {filteredDoctors.length > 0 ? (
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
                    {doctor.available && (
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
                      {doctor.about}
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
                        href="tel:+9779841234567"
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
