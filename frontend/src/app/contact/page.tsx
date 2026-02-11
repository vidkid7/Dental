'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { post, getErrorMessage } from '@/lib/api';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  type: z.string().min(1, 'Please select an enquiry type'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const enquiryTypes = [
  { value: 'general', label: 'General Enquiry' },
  { value: 'appointment', label: 'Appointment Related' },
  { value: 'admission', label: 'Admission Enquiry' },
  { value: 'services', label: 'Services Information' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'complaint', label: 'Complaint' },
];

const contactInfo = [
  {
    icon: FiMapPin,
    title: 'Visit Us',
    lines: ['Chabahil, Koteshwor', 'Kathmandu, Nepal'],
  },
  {
    icon: FiPhone,
    title: 'Call Us',
    lines: ['+977 9841-234567', '+977 01-4567890'],
  },
  {
    icon: FiMail,
    title: 'Email Us',
    lines: ['info@omchabahildental.com.np', 'appointment@omchabahildental.com.np'],
  },
  {
    icon: FiClock,
    title: 'Working Hours',
    lines: ['Sun - Fri: 7:00 AM - 7:00 PM', 'Saturday: 8:00 AM - 5:00 PM'],
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Submit enquiry to backend API
      await post('enquiries', {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        type: data.type,
        subject: data.subject,
        message: data.message,
      });
      
      toast.success('Your message has been sent successfully! We will get back to you soon.');
      reset();
    } catch (error) {
      console.error('Failed to submit enquiry:', error);
      toast.error(getErrorMessage(error) || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Contact Us
            </h1>
            <p className="text-xl text-primary-200">
              Have questions? We'd love to hear from you. Visit our clinic or send us a message.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">
                Get in Touch
              </h2>
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">{info.title}</h3>
                    {info.lines.map((line, i) => (
                      <p key={i} className="text-neutral-600">{line}</p>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Map */}
              <div className="mt-8 aspect-video rounded-2xl overflow-hidden bg-neutral-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.456!2d85.3451!3d27.7102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1900db123456%3A0x1234567890abcdef!2sChabahil%2C%20Kathmandu!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-neutral-50 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Your Name"
                    placeholder="Ram Sharma"
                    error={errors.name?.message}
                    {...register('name')}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="ram@example.com"
                    error={errors.email?.message}
                    {...register('email')}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Phone Number"
                    placeholder="+977 98XXXXXXXX"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  <Select
                    label="Enquiry Type"
                    options={enquiryTypes}
                    placeholder="Select type"
                    error={errors.type?.message}
                    {...register('type')}
                    required
                  />
                </div>

                <Input
                  label="Subject"
                  placeholder="How can we help you?"
                  error={errors.subject?.message}
                  {...register('subject')}
                  required
                />

                <Textarea
                  label="Message"
                  placeholder="Write your message here..."
                  rows={5}
                  error={errors.message?.message}
                  {...register('message')}
                  required
                />

                <Button type="submit" isLoading={isSubmitting} className="w-full md:w-auto">
                  <FiSend className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-16 bg-primary-900">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Need Immediate Assistance?
            </h2>
            <p className="text-primary-200 mb-8">
              For appointments and urgent dental queries, call us directly
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="tel:+9779841234567" 
                className="btn-white flex items-center gap-2"
              >
                <FiPhone className="w-5 h-5" />
                +977 9841-234567
              </a>
              <a 
                href="https://wa.me/9779841234567" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-green-500 text-white hover:bg-green-600 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
