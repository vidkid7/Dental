import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Om Chabahil Dental Hospital | Quality Dental Care in Kathmandu',
    template: '%s | Om Chabahil Dental',
  },
  description: 'Om Chabahil Dental Hospital - Your trusted dental care partner in Kathmandu, Nepal. Modern equipment, experienced dentists. Book appointments online.',
  keywords: ['dental hospital', 'dentist kathmandu', 'dental clinic', 'teeth treatment', 'root canal', 'dental implant', 'orthodontics', 'koteshwor dental'],
  authors: [{ name: 'Om Chabahil Dental Hospital' }],
  creator: 'Om Chabahil Dental Hospital',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Om Chabahil Dental Hospital',
    title: 'Om Chabahil Dental Hospital',
    description: 'Quality Dental Care in Kathmandu',
    images: [
      {
        url: '/images/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Om Chabahil Dental Hospital',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Om Chabahil Dental Hospital',
    description: 'Quality Dental Care in Kathmandu',
    images: ['/images/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-sans antialiased bg-white text-neutral-900">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#171717',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
