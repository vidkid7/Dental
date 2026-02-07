'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiFacebook, FiInstagram, FiYoutube, FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import { useSettings } from '@/hooks/useSettings';

const footerLinks = {
  services: [
    { name: 'General Dentistry', href: '/services#general' },
    { name: 'Orthodontics', href: '/services#orthodontics' },
    { name: 'Root Canal Treatment', href: '/services#rct' },
    { name: 'Dental Implants', href: '/services#implants' },
    { name: 'Cosmetic Dentistry', href: '/services#cosmetic' },
    { name: 'Pediatric Dentistry', href: '/services#pediatric' },
  ],
  quickLinks: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Doctors', href: '/doctors' },
    { name: 'Book Appointment', href: '/appointments/book' },
    { name: 'Patient Guide', href: '/patients' },
    { name: 'Treatment Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: FiFacebook, href: 'https://facebook.com/omchabahildental' },
  { name: 'Instagram', icon: FiInstagram, href: 'https://instagram.com/omchabahildental' },
  { name: 'YouTube', icon: FiYoutube, href: 'https://youtube.com/@omchabahildental' },
];

export function Footer() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 relative bg-white rounded-lg p-1">
                <Image
                  src="/images/logo.jpg"
                  alt="Om Chabahil Dental"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg leading-tight">
                  Om Chabahil Dental
                </h2>
                <p className="text-xs text-neutral-400">Koteshwor, Kathmandu</p>
              </div>
            </Link>
            <p className="text-neutral-400 mb-6 max-w-sm">
              Your trusted dental care partner in Kathmandu. Providing quality dental services 
              with modern technology and experienced professionals.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="https://maps.google.com/?q=Om+Chabahil+Dental+Koteshwor" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-neutral-400 hover:text-white transition-colors">
                <FiMapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary-400" />
                <span dangerouslySetInnerHTML={{ __html: settings.address?.replace(', Kathmandu', ',<br />Kathmandu') || '' }} />
              </a>
              <a href={`tel:${settings.phone?.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors">
                <FiPhone className="w-5 h-5 flex-shrink-0 text-primary-400" />
                <span>{settings.phone}</span>
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors">
                <FiMail className="w-5 h-5 flex-shrink-0 text-primary-400" />
                <span>{settings.email}</span>
              </a>
              <div className="flex items-start gap-3 text-neutral-400">
                <FiClock className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary-400" />
                <div>
                  <p>Sun - Fri: 7:00 AM - 7:00 PM</p>
                  <p>Saturday: 8:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-neutral-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-neutral-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-neutral-400">
              <p>&copy; {currentYear} Om Chabahil Dental Hospital. All rights reserved.</p>
              <div className="flex items-center gap-4">
                {footerLinks.legal.map((link) => (
                  <Link key={link.name} href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-primary-600 hover:text-white transition-all"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
