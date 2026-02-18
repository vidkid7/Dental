'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiPhone, FiMail, FiChevronDown, FiMapPin } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { useSettings } from '@/hooks/useSettings';

interface NavigationItem {
  name: string;
  href: string;
  children?: { name: string; href: string }[];
}

const navigation: NavigationItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Our Doctors', href: '/doctors' },
  { name: 'Treatment Gallery', href: '/gallery' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-900 text-white py-2 hidden md:block">
        <div className="container-custom flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href={`tel:${settings.phone?.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 hover:text-primary-200 transition-colors">
              <FiPhone className="w-4 h-4" />
              <span>{settings.phone}</span>
            </a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-primary-200 transition-colors">
              <FiMail className="w-4 h-4" />
              <span>{settings.email}</span>
            </a>
            <span className="flex items-center gap-2">
              <FiMapPin className="w-4 h-4" />
              <span>{settings.address?.replace(', Nepal', '')}</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-primary-200 transition-colors">
              Staff Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          isScrolled ? 'bg-white shadow-soft' : 'bg-white/95 backdrop-blur-md'
        )}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-14 h-14 relative">
                <Image
                  src={settings.logo || '/images/logo.jpg'}
                  alt={settings.siteName || 'Om Chabahil Dental Hospital'}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-heading font-bold text-lg text-neutral-900 leading-tight">
                  {settings.siteName || 'Om Chabahil Dental Hospital'}
                </h1>
                <p className="text-xs text-neutral-500">{settings.address?.replace(', Nepal', '')}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 flex-nowrap">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap',
                      pathname === item.href || pathname.startsWith(item.href + '/')
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                    )}
                  >
                    {item.name}
                    {item.children && <FiChevronDown className="w-4 h-4" />}
                  </Link>

                  {/* Dropdown */}
                  {item.children && (
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-card py-2 border border-neutral-100"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                'block px-4 py-2.5 text-sm transition-colors',
                                pathname === child.href
                                  ? 'text-primary-600 bg-primary-50'
                                  : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                              )}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/appointments/book" className="btn-primary">
                Book Appointment
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-700 hover:text-primary-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-neutral-100 overflow-hidden"
            >
              <div className="container-custom py-4 space-y-2">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'block px-4 py-3 text-base font-medium rounded-lg transition-colors',
                        pathname === item.href
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                      )}
                    >
                      {item.name}
                    </Link>
                    {item.children && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={cn(
                              'block px-4 py-2 text-sm rounded-lg transition-colors',
                              pathname === child.href
                                ? 'text-primary-600 bg-primary-50'
                                : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-4 border-t border-neutral-100">
                  <Link href="/appointments/book" className="btn-primary w-full justify-center">
                    Book Appointment
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
