'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiSave,
  FiEdit,
  FiImage,
  FiHome,
  FiInfo,
  FiPhone,
  FiUsers,
  FiStar,
  FiMapPin,
  FiGrid,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { get, put, getErrorMessage } from '@/lib/api';

export default function ContentManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Hero Section
  const [heroContent, setHeroContent] = useState({
    title: 'Your Trusted Partner for',
    highlightText: 'Complete Dental Care',
    subtitle: 'Experience world-class dental treatment with our team of experienced professionals using state-of-the-art technology.',
    ctaText: 'Book Appointment',
    ctaSecondaryText: 'Our Services',
    backgroundImage: '/images/team.jpg',
    badge1: '15+ Years Experience',
    badge2: 'Modern Equipment',
    badge3: '10,000+ Happy Patients',
  });

  // About Section
  const [aboutContent, setAboutContent] = useState({
    title: 'About Om Chabahil Dental',
    subtitle: 'Leading Dental Care in Nepal',
    description: 'Om Chabahil Dental Hospital is a premier dental care facility located in the heart of Kathmandu. With over 15 years of experience, we provide comprehensive dental services using the latest technology and techniques.',
    mission: 'To provide accessible, affordable, and world-class dental care to all patients while maintaining the highest standards of hygiene and professionalism.',
    yearsExperience: '15+',
    happyPatients: '10,000+',
    dentalServices: '25+',
    expertDentists: '8',
  });

  // Services Section
  const [servicesContent, setServicesContent] = useState({
    title: 'Our Services',
    subtitle: 'Comprehensive Dental Care',
    description: 'We offer a wide range of dental services to meet all your oral health needs.',
  });

  // Contact Section
  const [contactContent, setContactContent] = useState({
    title: 'Get in Touch',
    subtitle: 'We\'re Here to Help',
    phone: '+977 01-4812345',
    whatsapp: '+977 9841234567',
    email: 'info@omchabahildental.com.np',
    address: 'Chabahil, Kathmandu, Nepal',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0391772!2d85.3450!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQzJzAyLjAiTiA4NcKwMjAnNDIuMCJF!5e0!3m2!1sen!2snp!4v1234567890',
    workingHours: 'Mon-Fri: 9AM-6PM, Sat: 9AM-4PM',
  });

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: FiHome },
    { id: 'about', label: 'About Section', icon: FiInfo },
    { id: 'services', label: 'Services Section', icon: FiGrid },
    { id: 'contact', label: 'Contact Section', icon: FiPhone },
    { id: 'statistics', label: 'Statistics', icon: FiStar },
  ];

  // Load content from database on mount
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const pageSlug = 'home';
        
        // Load hero section
        try {
          const heroData = await get(`content/page/${pageSlug}/hero`);
          if (heroData && heroData.content) {
            const c = heroData.content as any;
            setHeroContent({
              title: c.title || heroContent.title,
              highlightText: c.highlightText || heroContent.highlightText,
              subtitle: c.subtitle || heroContent.subtitle,
              ctaText: c.primaryCtaText || heroContent.ctaText,
              ctaSecondaryText: c.secondaryCtaText || heroContent.ctaSecondaryText,
              backgroundImage: c.backgroundImage || heroContent.backgroundImage,
              badge1: c.stats?.yearsExperience || heroContent.badge1,
              badge2: c.stats?.expertDentists || heroContent.badge2,
              badge3: c.stats?.happyPatients || heroContent.badge3,
            });
          }
        } catch (e) {
          console.log('Hero section not found, using defaults');
        }

        // Load about section
        try {
          const aboutData = await get(`content/page/${pageSlug}/about`);
          if (aboutData && aboutData.content) {
            const c = aboutData.content as any;
            setAboutContent({
              title: c.title || aboutContent.title,
              subtitle: c.badgeLabel || aboutContent.subtitle,
              description: c.paragraph1 || aboutContent.description,
              mission: c.paragraph2 || aboutContent.mission,
              yearsExperience: c.experienceYears || aboutContent.yearsExperience,
              happyPatients: heroContent.badge3 || aboutContent.happyPatients,
              dentalServices: '25+',
              expertDentists: heroContent.badge2 || aboutContent.expertDentists,
            });
          }
        } catch (e) {
          console.log('About section not found, using defaults');
        }

        // Load services section
        try {
          const servicesData = await get(`content/page/${pageSlug}/services`);
          if (servicesData && servicesData.content) {
            const c = servicesData.content as any;
            setServicesContent({
              title: c.title || servicesContent.title,
              subtitle: c.subtitle || servicesContent.subtitle,
              description: c.subtitle || servicesContent.description,
            });
          }
        } catch (e) {
          console.log('Services section not found, using defaults');
        }

        // Load contact section
        try {
          const contactData = await get(`content/page/${pageSlug}/contact`);
          if (contactData && contactData.content) {
            const c = contactData.content as any;
            setContactContent({
              title: c.title || contactContent.title,
              subtitle: c.subtitle || contactContent.subtitle,
              phone: c.phone || contactContent.phone,
              whatsapp: c.whatsapp || contactContent.whatsapp,
              email: c.email || contactContent.email,
              address: c.address || contactContent.address,
              mapEmbed: c.mapEmbed || contactContent.mapEmbed,
              workingHours: c.workingHours || contactContent.workingHours,
            });
          }
        } catch (e) {
          console.log('Contact section not found, using defaults');
        }
      } catch (error) {
        console.error('Failed to load content', error);
        // Continue with defaults if loading fails
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const pageSlug = 'home';
      
      // Save hero section
      await put(`content/page/${pageSlug}/hero`, {
        content: {
          badgeText: 'Open 7 Days a Week - Quality Dental Care',
          title: heroContent.title,
          highlightText: heroContent.highlightText,
          subtitle: heroContent.subtitle,
          primaryCtaText: heroContent.ctaText,
          secondaryCtaText: heroContent.ctaSecondaryText,
          backgroundImage: heroContent.backgroundImage,
          stats: {
            yearsExperience: heroContent.badge1,
            expertDentists: heroContent.badge2,
            happyPatients: heroContent.badge3,
          },
        },
      });

      // Save about section
      await put(`content/page/${pageSlug}/about`, {
        content: {
          badgeLabel: 'About Us',
          title: aboutContent.title,
          paragraph1: aboutContent.description,
          paragraph2: aboutContent.mission,
          experienceYears: aboutContent.yearsExperience,
          features: [
            'Modern dental equipment and sterilization',
            'Experienced and certified dentists',
            'Comfortable and hygienic environment',
            'Affordable treatment options',
            'Emergency dental services available',
            'Personalized patient care',
          ],
        },
      });

      // Save services section
      await put(`content/page/${pageSlug}/services`, {
        content: {
          badgeLabel: 'Our Services',
          title: servicesContent.title,
          subtitle: servicesContent.description,
        },
      });

      // Save contact section
      await put(`content/page/${pageSlug}/contact`, {
        content: {
          title: contactContent.title,
          subtitle: contactContent.subtitle,
          phone: contactContent.phone,
          whatsapp: contactContent.whatsapp,
          email: contactContent.email,
          address: contactContent.address,
          mapEmbed: contactContent.mapEmbed,
          workingHours: contactContent.workingHours,
        },
      });

      toast.success('Content saved successfully');
    } catch (error) {
      console.error('Failed to save content', error);
      toast.error(getErrorMessage(error) || 'Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Content Management</h1>
          <p className="text-neutral-600 mt-1">Edit website content and sections</p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving}>
          <FiSave className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-soft p-4 sticky top-24">
            <h3 className="text-sm font-medium text-neutral-500 mb-3 uppercase tracking-wider">Sections</h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-600 text-white'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-soft p-6">
            {/* Hero Section */}
            {activeSection === 'hero' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
                  <FiHome className="w-5 h-5 text-primary-600" />
                  Hero Section
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Title"
                    value={heroContent.title}
                    onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                  />
                  <Input
                    label="Highlight Text"
                    value={heroContent.highlightText}
                    onChange={(e) => setHeroContent({ ...heroContent, highlightText: e.target.value })}
                    helperText="This text will be highlighted in gradient"
                  />
                </div>

                <Textarea
                  label="Subtitle"
                  value={heroContent.subtitle}
                  onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
                  rows={2}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Primary CTA Text"
                    value={heroContent.ctaText}
                    onChange={(e) => setHeroContent({ ...heroContent, ctaText: e.target.value })}
                  />
                  <Input
                    label="Secondary CTA Text"
                    value={heroContent.ctaSecondaryText}
                    onChange={(e) => setHeroContent({ ...heroContent, ctaSecondaryText: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    label="Trust Badge 1"
                    value={heroContent.badge1}
                    onChange={(e) => setHeroContent({ ...heroContent, badge1: e.target.value })}
                  />
                  <Input
                    label="Trust Badge 2"
                    value={heroContent.badge2}
                    onChange={(e) => setHeroContent({ ...heroContent, badge2: e.target.value })}
                  />
                  <Input
                    label="Trust Badge 3"
                    value={heroContent.badge3}
                    onChange={(e) => setHeroContent({ ...heroContent, badge3: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Background Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-20 bg-neutral-100 rounded-lg overflow-hidden">
                      <img src={heroContent.backgroundImage} alt="Hero" className="w-full h-full object-cover" />
                    </div>
                    <Button variant="secondary" size="sm">
                      <FiImage className="w-4 h-4 mr-2" />
                      Change Image
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* About Section */}
            {activeSection === 'about' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
                  <FiInfo className="w-5 h-5 text-primary-600" />
                  About Section
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Section Title"
                    value={aboutContent.title}
                    onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                  />
                  <Input
                    label="Subtitle"
                    value={aboutContent.subtitle}
                    onChange={(e) => setAboutContent({ ...aboutContent, subtitle: e.target.value })}
                  />
                </div>

                <Textarea
                  label="Description"
                  value={aboutContent.description}
                  onChange={(e) => setAboutContent({ ...aboutContent, description: e.target.value })}
                  rows={4}
                />

                <Textarea
                  label="Mission Statement"
                  value={aboutContent.mission}
                  onChange={(e) => setAboutContent({ ...aboutContent, mission: e.target.value })}
                  rows={3}
                />
              </motion.div>
            )}

            {/* Services Section */}
            {activeSection === 'services' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
                  <FiGrid className="w-5 h-5 text-primary-600" />
                  Services Section
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Section Title"
                    value={servicesContent.title}
                    onChange={(e) => setServicesContent({ ...servicesContent, title: e.target.value })}
                  />
                  <Input
                    label="Subtitle"
                    value={servicesContent.subtitle}
                    onChange={(e) => setServicesContent({ ...servicesContent, subtitle: e.target.value })}
                  />
                </div>

                <Textarea
                  label="Description"
                  value={servicesContent.description}
                  onChange={(e) => setServicesContent({ ...servicesContent, description: e.target.value })}
                  rows={2}
                />

                <div className="bg-neutral-50 p-4 rounded-lg">
                  <p className="text-sm text-neutral-600">
                    To manage individual services, go to <a href="/admin/services" className="text-primary-600 hover:underline">Services Management</a>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Contact Section */}
            {activeSection === 'contact' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
                  <FiPhone className="w-5 h-5 text-primary-600" />
                  Contact Section
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Section Title"
                    value={contactContent.title}
                    onChange={(e) => setContactContent({ ...contactContent, title: e.target.value })}
                  />
                  <Input
                    label="Subtitle"
                    value={contactContent.subtitle}
                    onChange={(e) => setContactContent({ ...contactContent, subtitle: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Phone"
                    value={contactContent.phone}
                    onChange={(e) => setContactContent({ ...contactContent, phone: e.target.value })}
                  />
                  <Input
                    label="WhatsApp"
                    value={contactContent.whatsapp}
                    onChange={(e) => setContactContent({ ...contactContent, whatsapp: e.target.value })}
                  />
                  <Input
                    label="Email"
                    value={contactContent.email}
                    onChange={(e) => setContactContent({ ...contactContent, email: e.target.value })}
                  />
                  <Input
                    label="Address"
                    value={contactContent.address}
                    onChange={(e) => setContactContent({ ...contactContent, address: e.target.value })}
                  />
                </div>

                <Input
                  label="Working Hours"
                  value={contactContent.workingHours}
                  onChange={(e) => setContactContent({ ...contactContent, workingHours: e.target.value })}
                />

                <Textarea
                  label="Google Maps Embed URL"
                  value={contactContent.mapEmbed}
                  onChange={(e) => setContactContent({ ...contactContent, mapEmbed: e.target.value })}
                  rows={2}
                  helperText="Paste the Google Maps embed URL here"
                />
              </motion.div>
            )}

            {/* Statistics Section */}
            {activeSection === 'statistics' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
                  <FiStar className="w-5 h-5 text-primary-600" />
                  Statistics
                </h2>
                <p className="text-neutral-600 text-sm">
                  These statistics are displayed throughout the website to build trust with visitors.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Years of Experience"
                    value={aboutContent.yearsExperience}
                    onChange={(e) => setAboutContent({ ...aboutContent, yearsExperience: e.target.value })}
                  />
                  <Input
                    label="Happy Patients"
                    value={aboutContent.happyPatients}
                    onChange={(e) => setAboutContent({ ...aboutContent, happyPatients: e.target.value })}
                  />
                  <Input
                    label="Dental Services"
                    value={aboutContent.dentalServices}
                    onChange={(e) => setAboutContent({ ...aboutContent, dentalServices: e.target.value })}
                  />
                  <Input
                    label="Expert Dentists"
                    value={aboutContent.expertDentists}
                    onChange={(e) => setAboutContent({ ...aboutContent, expertDentists: e.target.value })}
                  />
                </div>

                <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                  <h3 className="font-medium text-primary-900 mb-2">Preview</h3>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary-600">{aboutContent.yearsExperience}</p>
                      <p className="text-sm text-neutral-600">Years Experience</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary-600">{aboutContent.happyPatients}</p>
                      <p className="text-sm text-neutral-600">Happy Patients</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary-600">{aboutContent.dentalServices}</p>
                      <p className="text-sm text-neutral-600">Services</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary-600">{aboutContent.expertDentists}</p>
                      <p className="text-sm text-neutral-600">Dentists</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
