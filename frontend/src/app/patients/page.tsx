'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiCalendar, 
  FiClock, 
  FiFileText, 
  FiHeart, 
  FiShield, 
  FiPhone,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo
} from 'react-icons/fi';

const patientGuides = [
  {
    icon: FiCalendar,
    title: 'Appointment Booking',
    description: 'Book your appointment online or call us. Walk-ins are also welcome during clinic hours.',
    link: '/appointments/book',
    linkText: 'Book Now',
  },
  {
    icon: FiClock,
    title: 'Clinic Hours',
    description: 'Sunday - Friday: 7:00 AM - 7:00 PM, Saturday: 8:00 AM - 5:00 PM',
    link: '/contact',
    linkText: 'View Location',
  },
  {
    icon: FiFileText,
    title: 'First Visit',
    description: 'Bring your ID, any previous dental records, and list of current medications.',
    link: null,
    linkText: null,
  },
  {
    icon: FiShield,
    title: 'Insurance & Payment',
    description: 'We accept cash, cards, and major insurance providers. Payment plans available.',
    link: '/contact',
    linkText: 'Contact Us',
  },
];

const treatments = [
  {
    name: 'Dental Check-up',
    duration: '30-45 mins',
    price: 'Rs. 500 - 1,000',
    description: 'Comprehensive oral examination and consultation',
  },
  {
    name: 'Teeth Cleaning',
    duration: '45-60 mins',
    price: 'Rs. 1,200 - 2,000',
    description: 'Professional scaling and polishing',
  },
  {
    name: 'Dental Filling',
    duration: '30-60 mins',
    price: 'Rs. 1,500 - 3,000',
    description: 'Composite or amalgam filling for cavities',
  },
  {
    name: 'Root Canal Treatment',
    duration: '60-90 mins',
    price: 'Rs. 5,000 - 15,000',
    description: 'Single or multi-visit RCT procedure',
  },
  {
    name: 'Tooth Extraction',
    duration: '30-60 mins',
    price: 'Rs. 1,000 - 5,000',
    description: 'Simple to surgical extraction',
  },
  {
    name: 'Dental Crown',
    duration: 'Multiple visits',
    price: 'Rs. 4,000 - 15,000',
    description: 'PFM, Zirconia, or E-max crown',
  },
  {
    name: 'Orthodontic Braces',
    duration: '12-24 months',
    price: 'Rs. 35,000 - 80,000',
    description: 'Metal, ceramic, or clear aligners',
  },
  {
    name: 'Dental Implant',
    duration: '3-6 months',
    price: 'Rs. 40,000 - 80,000',
    description: 'Complete implant with crown',
  },
];

const faqs = [
  {
    question: 'How do I book an appointment?',
    answer: 'You can book an appointment through our website, call us at +977 9841-234567, or visit our clinic directly. Online booking is available 24/7.',
  },
  {
    question: 'What should I bring for my first visit?',
    answer: 'Please bring a valid ID, any previous dental X-rays or records, a list of current medications, and your insurance card if applicable.',
  },
  {
    question: 'Do you accept insurance?',
    answer: 'Yes, we accept most major insurance providers. Please contact our front desk to verify your coverage before your appointment.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, credit/debit cards, eSewa, Khalti, and bank transfers. Payment plans are available for major treatments.',
  },
  {
    question: 'Is emergency dental care available?',
    answer: 'Yes, we provide emergency dental services. Please call our emergency line for immediate assistance outside regular hours.',
  },
  {
    question: 'How often should I visit the dentist?',
    answer: 'We recommend a dental check-up every 6 months for optimal oral health. Some patients may need more frequent visits based on their dental condition.',
  },
];

const beforeVisit = [
  'Brush and floss your teeth before your appointment',
  'Arrive 15 minutes early for paperwork (first visit)',
  'Bring a list of current medications',
  'Note any dental concerns or symptoms',
  'Avoid eating heavily right before procedures',
];

const afterCare = [
  'Follow post-treatment instructions carefully',
  'Take prescribed medications as directed',
  'Maintain good oral hygiene',
  'Attend follow-up appointments',
  'Contact us immediately if you experience complications',
];

export default function PatientsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Patient Information
            </h1>
            <p className="text-xl text-primary-100">
              Everything you need to know for a comfortable and informed dental visit at Om Chabahil Dental Hospital.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Guide Cards */}
      <section className="py-16 bg-neutral-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {patientGuides.map((guide, index) => (
              <motion.div
                key={guide.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-card"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <guide.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{guide.title}</h3>
                <p className="text-neutral-600 text-sm mb-4">{guide.description}</p>
                {guide.link && (
                  <Link href={guide.link} className="text-primary-600 font-medium text-sm hover:text-primary-700">
                    {guide.linkText} →
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment Price Guide */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Treatment Price Guide
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Transparent pricing for our dental services. Actual costs may vary based on individual cases.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatments.map((treatment, index) => (
              <motion.div
                key={treatment.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-neutral-200 rounded-xl p-5 hover:shadow-card transition-shadow"
              >
                <h3 className="font-heading font-semibold mb-2">{treatment.name}</h3>
                <p className="text-sm text-neutral-500 mb-3">{treatment.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">
                    <FiClock className="inline mr-1" />
                    {treatment.duration}
                  </span>
                  <span className="font-semibold text-primary-600">{treatment.price}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-neutral-500 mt-8">
            * Prices are indicative and may vary. Please consult with our doctors for accurate estimates.
          </p>
        </div>
      </section>

      {/* Before & After Visit */}
      <section className="py-16 bg-neutral-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FiInfo className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-2xl font-heading font-bold">Before Your Visit</h2>
              </div>
              <ul className="space-y-4">
                {beforeVisit.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                  <FiHeart className="w-5 h-5 text-accent-600" />
                </div>
                <h2 className="text-2xl font-heading font-bold">After Care Tips</h2>
              </div>
              <ul className="space-y-4">
                {afterCare.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FiCheckCircle className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Take a Virtual Tour
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Explore our modern clinic facilities from the comfort of your home.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="aspect-video rounded-2xl overflow-hidden bg-neutral-900 shadow-xl">
              <video
                className="w-full h-full object-cover"
                controls
                poster="/images/clinic-1.jpg"
              >
                <source src="/videos/tour-1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-neutral-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Common questions from our patients answered.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-soft"
              >
                <h3 className="font-heading font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-neutral-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              Ready to Schedule Your Visit?
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Book your appointment online or give us a call. We look forward to caring for your smile!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/appointments/book" className="btn-primary bg-white text-primary-600 hover:bg-neutral-100">
                Book Appointment
              </Link>
              <a href="tel:+9779841234567" className="btn-secondary border-white text-white hover:bg-white/10">
                <FiPhone className="mr-2" />
                Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
