'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaTooth, 
  FaTeethOpen, 
  FaChild, 
  FaSyringe, 
  FaXRay,
  FaSmile,
  FaTeeth,
  FaTint
} from 'react-icons/fa';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { get } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Service {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  isActive: boolean;
  order: number;
}

// Hardcoded service images mapping
const serviceImages: Record<string, string> = {
  'general-dentistry': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80',
  'orthodontics': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80',
  'oral-maxillofacial-surgery': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80',
  'oral-surgery': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80',
  'pediatric-dentistry': 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&q=80',
  'cosmetic-dentistry': 'https://images.unsplash.com/photo-1609840114035-3c981407e31f?w=800&q=80',
  'endodontics': 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80',
  'prosthodontics': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80',
  'periodontics': 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=800&q=80',
};

// Get service image based on slug
const getServiceImage = (slug: string) => {
  return serviceImages[slug] || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80';
};

// Icon mapping for services
const iconMap: Record<string, any> = {
  'xray': FaXRay,
  'hygiene': FaTooth,
  'filling': FaTooth,
  'rct': FaSyringe,
  'crown': FaTeeth,
  'denture': FaTeeth,
  'braces': FaTeethOpen,
  'appliance': FaTeethOpen,
  'surgery': FaSyringe,
  'perio': FaTint,
  'pedo': FaChild,
  'cosmetic': FaSmile,
};

// Get icon based on service slug
const getServiceIcon = (slug: string) => {
  const key = Object.keys(iconMap).find(k => slug.includes(k));
  return key ? iconMap[key] : FaTooth;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await get<Service[]>('services', {
          params: { 
            page: 1, 
            limit: 100, 
            sortBy: 'order', 
            sortOrder: 'asc'
          },
        });
        setServices(response || []);
      } catch (error) {
        console.error('Failed to load services', error);
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Our Dental Services
            </h1>
            <p className="text-xl text-primary-200">
              Comprehensive dental care for the whole family, from routine checkups 
              to advanced treatments, delivered with expertise and compassion.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="text-neutral-500 text-lg mt-4">Loading services...</p>
            </div>
          ) : services.length > 0 ? (
            <div className="space-y-24">
              {services.map((service, index) => {
                const ServiceIcon = getServiceIcon(service.slug);
                return (
                  <div
                    key={service.id}
                    id={service.slug}
                    className={`grid lg:grid-cols-2 gap-12 items-center ${
                      index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-card">
                        <img 
                          src={getServiceImage(service.slug)} 
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                      <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                        <ServiceIcon className="w-8 h-8 text-primary-600" />
                      </div>
                      <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-4">
                        {service.name}
                      </h2>
                      <p className="text-lg text-neutral-600 mb-6">
                        {service.description}
                      </p>
                      <div className="mb-8">
                        <p className="text-neutral-700">{service.shortDescription}</p>
                      </div>
                      <Link href="/appointments/book" className="btn-primary">
                        Book an Appointment
                        <FiArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-500 text-lg">No services available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-900">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Need Help Choosing a Treatment?
          </h2>
          <p className="text-primary-200 mb-8 max-w-2xl mx-auto">
            Our experienced dental team is here to help you find the best treatment 
            option for your needs. Schedule a consultation today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/appointments/book" className="btn-white">
              Schedule Consultation
            </Link>
            <Link href="/contact" className="btn bg-accent-500 text-white hover:bg-accent-600">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
