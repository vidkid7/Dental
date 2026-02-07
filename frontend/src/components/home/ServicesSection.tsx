'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
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
import { Card, CardContent } from '@/components/ui/Card';
import { get } from '@/lib/api';

interface Service {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  isActive: boolean;
}

// Icon mapping for services
const iconMap: Record<string, any> = {
  'xray': FaXRay,
  'x-ray': FaXRay,
  'hygiene': FaTooth,
  'filling': FaTooth,
  'rct': FaSyringe,
  'root-canal': FaSyringe,
  'crown': FaTeeth,
  'implant': FaTeeth,
  'denture': FaTeeth,
  'braces': FaTeethOpen,
  'orthodontic': FaTeethOpen,
  'appliance': FaTeethOpen,
  'surgery': FaSyringe,
  'oral-surgery': FaSyringe,
  'perio': FaTint,
  'pedo': FaChild,
  'pediatric': FaChild,
  'cosmetic': FaSmile,
};

// Get icon based on service slug
const getServiceIcon = (slug: string) => {
  const key = Object.keys(iconMap).find(k => slug.includes(k));
  return key ? iconMap[key] : FaTooth;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function ServicesSection() {
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
            limit: 6, // Show 6 services on homepage
            sortBy: 'order', 
            sortOrder: 'asc'
          },
        });
        setServices(response || []);
      } catch (error) {
        console.error('Failed to load services', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
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
          <span className="badge-primary mb-4">Our Services</span>
          <h2 className="section-title mb-4">
            Comprehensive Dental Care
          </h2>
          <p className="section-subtitle mx-auto">
            From routine checkups to advanced procedures, we offer a full range of 
            dental services to meet all your oral health needs.
          </p>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-neutral-500 text-lg mt-4">Loading services...</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service, index) => {
              const ServiceIcon = getServiceIcon(service.slug);
              return (
                <motion.div key={service.id} variants={itemVariants}>
                  <Link href={`/services#${service.slug}`}>
                    <Card hover className="h-full group">
                      <CardContent className="p-6">
                        <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors">
                          <ServiceIcon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-xl font-heading font-semibold text-neutral-900 mb-2">
                          {service.name}
                        </h3>
                        <p className="text-neutral-600 mb-4">
                          {service.shortDescription}
                        </p>
                        <span className="inline-flex items-center text-primary-600 font-medium group-hover:gap-2 transition-all">
                          Learn more
                          <FiArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/services" className="btn-primary">
            View All Services
            <FiArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
