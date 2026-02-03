'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { 
  FaTooth, 
  FaTeethOpen, 
  FaChild, 
  FaSyringe, 
  FaXRay,
  FaSmile
} from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/Card';

const services = [
  {
    icon: FaTooth,
    title: 'General Dentistry',
    description: 'Comprehensive dental care including cleanings, fillings, and preventive treatments.',
    href: '/services#general',
  },
  {
    icon: FaTeethOpen,
    title: 'Orthodontics',
    description: 'Braces, aligners, and teeth straightening solutions for a perfect smile.',
    href: '/services#orthodontics',
  },
  {
    icon: FaSyringe,
    title: 'Oral Surgery',
    description: 'Expert surgical procedures including extractions, implants, and jaw surgery.',
    href: '/services#surgery',
  },
  {
    icon: FaChild,
    title: 'Pediatric Dentistry',
    description: 'Gentle, specialized dental care designed for children of all ages.',
    href: '/services#pediatric',
  },
  {
    icon: FaSmile,
    title: 'Cosmetic Dentistry',
    description: 'Teeth whitening, veneers, and smile makeovers for your dream smile.',
    href: '/services#cosmetic',
  },
  {
    icon: FaXRay,
    title: 'Endodontics',
    description: 'Root canal treatments and other procedures to save damaged teeth.',
    href: '/services#endodontics',
  },
];

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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div key={service.title} variants={itemVariants}>
              <Link href={service.href}>
                <Card hover className="h-full group">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors">
                      <service.icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-neutral-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-neutral-600 mb-4">
                      {service.description}
                    </p>
                    <span className="inline-flex items-center text-primary-600 font-medium group-hover:gap-2 transition-all">
                      Learn more
                      <FiArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

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
