'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiImage, FiUpload } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { get, put, post, getErrorMessage } from '@/lib/api';
import Image from 'next/image';

interface AboutImage {
  id: string;
  url: string;
  alt: string;
  section: 'about-main' | 'about-services' | 'home-about';
}

export default function AboutImagesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  // About page main image (team photo)
  const [aboutMainImage, setAboutMainImage] = useState<AboutImage>({
    id: 'about-main',
    url: '/images/team.jpg',
    alt: 'Om Chabahil Dental Team',
    section: 'about-main',
  });

  // About page services images (4 clinic images)
  const [aboutServicesImages, setAboutServicesImages] = useState<AboutImage[]>([
    { id: 'clinic-1', url: '/images/clinic-1.jpg', alt: 'Dental Clinic', section: 'about-services' },
    { id: 'clinic-2', url: '/images/clinic-2.jpg', alt: 'Dental Equipment', section: 'about-services' },
    { id: 'clinic-3', url: '/images/clinic-3.jpg', alt: 'Treatment Room', section: 'about-services' },
    { id: 'clinic-4', url: '/images/clinic-4.jpg', alt: 'Dental Procedure', section: 'about-services' },
  ]);

  // Home page about section image
  const [homeAboutImage, setHomeAboutImage] = useState<AboutImage>({
    id: 'home-about',
    url: '/images/team.jpg',
    alt: 'Om Chabahil Dental Team',
    section: 'home-about',
  });

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      // Load about page main section
      const aboutMainData: any = await get('content/page/about/main');
      if (aboutMainData?.content?.imagePath) {
        setAboutMainImage({
          ...aboutMainImage,
          url: aboutMainData.content.imagePath,
        });
      }

      // Load about page services section
      const aboutServicesData: any = await get('content/page/about/services-overview');
      if (aboutServicesData?.content?.imagePaths && Array.isArray(aboutServicesData.content.imagePaths)) {
        const paths = aboutServicesData.content.imagePaths;
        setAboutServicesImages([
          { id: 'clinic-1', url: paths[0] || '/images/clinic-1.jpg', alt: 'Dental Clinic', section: 'about-services' },
          { id: 'clinic-2', url: paths[1] || '/images/clinic-2.jpg', alt: 'Dental Equipment', section: 'about-services' },
          { id: 'clinic-3', url: paths[2] || '/images/clinic-3.jpg', alt: 'Treatment Room', section: 'about-services' },
          { id: 'clinic-4', url: paths[3] || '/images/clinic-4.jpg', alt: 'Dental Procedure', section: 'about-services' },
        ]);
      }

      // Load home page about section
      const homeAboutData: any = await get('content/page/home/about');
      if (homeAboutData?.content?.imagePath) {
        setHomeAboutImage({
          ...homeAboutImage,
          url: homeAboutData.content.imagePath,
        });
      }
    } catch (error) {
      console.error('Failed to load images', error);
      toast.error('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File, imageId: string, section: string) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(imageId);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'about-images');

      const response: any = await post('media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.url;

      // Update the appropriate state and save to database immediately
      if (section === 'about-main') {
        setAboutMainImage({ ...aboutMainImage, url: imageUrl });
        
        // Save to database immediately
        await put('content/page/about/main', {
          content: {
            title: 'Our Story',
            paragraph1: 'Om Chabahil Dental Hospital was established with a vision to provide accessible, affordable, and quality dental care to the people of Kathmandu. Located in the heart of Koteshwor, we have been serving the community for over a decade.',
            paragraph2: 'Our clinic is equipped with modern dental equipment and follows international standards of sterilization and hygiene. We believe in providing personalized care to each patient, understanding their unique needs and concerns.',
            paragraph3: 'From routine dental check-ups to complex procedures like dental implants and orthodontic treatments, our experienced team is here to help you achieve and maintain a healthy, beautiful smile.',
            address: 'Chabahil, Koteshwor, Kathmandu, Nepal',
            imagePath: imageUrl,
          },
        });
      } else if (section === 'home-about') {
        setHomeAboutImage({ ...homeAboutImage, url: imageUrl });
        
        // Get current content and update with new image
        const homeAboutData: any = await get('content/page/home/about');
        await put('content/page/home/about', {
          content: {
            ...homeAboutData?.content,
            imagePath: imageUrl,
          },
        });
      } else if (section === 'about-services') {
        const updatedImages = aboutServicesImages.map(img => 
          img.id === imageId ? { ...img, url: imageUrl } : img
        );
        setAboutServicesImages(updatedImages);
        
        // Save to database immediately
        await put('content/page/about/services-overview', {
          content: {
            title: 'Our Services',
            description: 'We offer a comprehensive range of dental services to meet all your oral health needs. Our team is trained in the latest techniques and uses modern equipment for optimal results.',
            services: [
              'General Dentistry & Check-ups',
              'Root Canal Treatment (RCT)',
              'Dental Implants',
              'Orthodontics (Braces)',
              'Cosmetic Dentistry',
              'Pediatric Dentistry',
              'Oral Surgery',
              'Teeth Whitening',
            ],
            imagePaths: updatedImages.map(img => img.url),
          },
        });
      }

      toast.success('Image uploaded and saved successfully');
    } catch (error) {
      console.error('Failed to upload image', error);
      toast.error(getErrorMessage(error) || 'Failed to upload image');
    } finally {
      setIsUploading(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save about page main section
      await put('content/page/about/main', {
        content: {
          title: 'Our Story',
          paragraph1: 'Om Chabahil Dental Hospital was established with a vision to provide accessible, affordable, and quality dental care to the people of Kathmandu. Located in the heart of Koteshwor, we have been serving the community for over a decade.',
          paragraph2: 'Our clinic is equipped with modern dental equipment and follows international standards of sterilization and hygiene. We believe in providing personalized care to each patient, understanding their unique needs and concerns.',
          paragraph3: 'From routine dental check-ups to complex procedures like dental implants and orthodontic treatments, our experienced team is here to help you achieve and maintain a healthy, beautiful smile.',
          address: 'Chabahil, Koteshwor, Kathmandu, Nepal',
          imagePath: aboutMainImage.url,
        },
      });

      // Save about page services section
      await put('content/page/about/services-overview', {
        content: {
          title: 'Our Services',
          description: 'We offer a comprehensive range of dental services to meet all your oral health needs. Our team is trained in the latest techniques and uses modern equipment for optimal results.',
          services: [
            'General Dentistry & Check-ups',
            'Root Canal Treatment (RCT)',
            'Dental Implants',
            'Orthodontics (Braces)',
            'Cosmetic Dentistry',
            'Pediatric Dentistry',
            'Oral Surgery',
            'Teeth Whitening',
          ],
          imagePaths: aboutServicesImages.map(img => img.url),
        },
      });

      // Save home page about section
      const homeAboutData: any = await get('content/page/home/about');
      await put('content/page/home/about', {
        content: {
          ...homeAboutData?.content,
          imagePath: homeAboutImage.url,
        },
      });

      toast.success('Images saved successfully');
    } catch (error) {
      console.error('Failed to save images', error);
      toast.error(getErrorMessage(error) || 'Failed to save images');
    } finally {
      setIsSaving(false);
    }
  };

  const ImageUploadCard = ({
    image,
    title,
    description,
    onUpload,
  }: {
    image: AboutImage;
    title: string;
    description: string;
    onUpload: (file: File) => void;
  }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h3 className="font-heading font-semibold text-neutral-900 mb-2">{title}</h3>
        <p className="text-sm text-neutral-600 mb-4">{description}</p>

        <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-100 mb-4">
          <Image src={image.url} alt={image.alt} fill className="object-cover" />
        </div>

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onUpload(file);
                // Reset input so same file can be selected again
                e.target.value = '';
              }
            }}
            disabled={isUploading === image.id}
          />
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={handleButtonClick}
            disabled={isUploading === image.id}
            isLoading={isUploading === image.id}
          >
            <FiUpload className="w-4 h-4 mr-2" />
            {isUploading === image.id ? 'Uploading...' : 'Upload New Image'}
          </Button>
        </div>

        <p className="text-xs text-neutral-500 mt-2">
          Recommended: 1200x800px, Max 5MB, JPG/PNG
        </p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">About Us Images</h1>
          <p className="text-neutral-600 mt-1">Images are saved automatically after upload</p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving} variant="secondary">
          <FiSave className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      {/* Auto-save Info */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-green-900 mb-1">Auto-Save Enabled</h3>
            <p className="text-sm text-green-800">
              Images are automatically saved to the database after upload. You can refresh the page anytime and your changes will persist. 
              The "Save All Changes" button is available if you need to manually trigger a save.
            </p>
          </div>
        </div>
      </div>

      {/* About Page Main Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-heading font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <FiImage className="w-5 h-5 text-primary-600" />
          About Page - Main Section
        </h2>
        <ImageUploadCard
          image={aboutMainImage}
          title="Team Photo"
          description="This image appears in the 'Our Story' section on the About Us page"
          onUpload={(file) => handleImageUpload(file, aboutMainImage.id, 'about-main')}
        />
      </motion.div>

      {/* About Page Services Images */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-heading font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <FiImage className="w-5 h-5 text-primary-600" />
          About Page - Services Section
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {aboutServicesImages.map((image, index) => (
            <ImageUploadCard
              key={image.id}
              image={image}
              title={`Clinic Image ${index + 1}`}
              description={`This image appears in the services grid on the About Us page`}
              onUpload={(file) => handleImageUpload(file, image.id, 'about-services')}
            />
          ))}
        </div>
      </motion.div>

      {/* Home Page About Section Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-heading font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <FiImage className="w-5 h-5 text-primary-600" />
          Home Page - About Section
        </h2>
        <ImageUploadCard
          image={homeAboutImage}
          title="About Section Image"
          description="This image appears in the About section on the Home page"
          onUpload={(file) => handleImageUpload(file, homeAboutImage.id, 'home-about')}
        />
      </motion.div>

      {/* Info Box */}
      <div className="bg-primary-50 border border-primary-100 rounded-xl p-6">
        <h3 className="font-medium text-primary-900 mb-2">Image Guidelines</h3>
        <ul className="text-sm text-primary-800 space-y-1">
          <li>• Use high-quality images that represent your dental practice professionally</li>
          <li>• Recommended dimensions: 1200x800px for best results</li>
          <li>• Maximum file size: 5MB per image</li>
          <li>• Supported formats: JPG, PNG, WebP</li>
          <li>• Images are automatically optimized for web performance</li>
        </ul>
      </div>
    </div>
  );
}
