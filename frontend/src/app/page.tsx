import { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { AboutSection } from '@/components/home/AboutSection';
import { StatsSection } from '@/components/home/StatsSection';
import { DoctorsSection } from '@/components/home/DoctorsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';
import { BlogSection } from '@/components/home/BlogSection';

export const metadata: Metadata = {
  title: 'Premier Dental College & Hospital | Excellence in Dental Education & Care',
  description: 'Leading dental college offering BDS, MDS programs with state-of-the-art facilities. Expert dental care services with experienced specialists. Book appointments online.',
  openGraph: {
    title: 'Premier Dental College & Hospital',
    description: 'Excellence in Dental Education & Healthcare',
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
