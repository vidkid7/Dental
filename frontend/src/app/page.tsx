import { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { AboutSection } from '@/components/home/AboutSection';
import { StatsSection } from '@/components/home/StatsSection';
import { DoctorsSection } from '@/components/home/DoctorsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';
import { BlogSection } from '@/components/home/BlogSection';

// Note: Metadata is static in Next.js App Router
// For dynamic metadata, we would need to use generateMetadata function
export const metadata: Metadata = {
  title: 'Om Chabahil Dental Hospital | Quality Dental Care in Kathmandu',
  description:
    'Om Chabahil Dental Hospital provides quality dental care with modern technology and experienced professionals in Kathmandu, Nepal.',
  openGraph: {
    title: 'Om Chabahil Dental Hospital',
    description: 'Quality Dental Care in Kathmandu',
    images: ['/og-image.jpg'],
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <StatsSection />
      <DoctorsSection />
      <TestimonialsSection />
      <BlogSection />
      <CTASection />
    </>
  );
}
