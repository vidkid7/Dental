'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiImage, FiUpload } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { get, put, getErrorMessage } from '@/lib/api';
import Image from 'next/image';

interface HomeImage {
  id: string;
  url: string;
  alt: string;
  section: 'home-hero' | 'home-about';
}

export default function HomeImagesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  // Home page hero section image
  const [heroImage, setHeroImage] = useState<HomeImage>({
    id: 'home-hero',
    url: '/images/team.jpg',
    alt: 'Om Chabahil Dental Team',
    section: 'home-hero',
  });

  // Home page about section images (4 clinic images)
  const [aboutImages, setAboutImages] = useState<HomeImage[]>([
    { id: 'home-about-1', url: '/images/clinic-1.jpg', alt: 'Dental Clinic', section: 'home-about' },
    { id: 'home-about-2', url: '/images/clinic-2.jpg', alt: 'Dental Equipment', section: 'home-about' },
    { id: 'home-about-3', url: '/images/clinic-3.jpg', alt: 'Treatment Room', section: 'home-about' },
    { id: 'home-about-4', url: '/images/clinic-4.jpg', alt: 'Dental Procedure', section: 'home-about' },
  ]);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      // Load home page hero section
      const heroData: any = await get('content/page/home/hero');
      if (heroData?.content?.imagePath) {
        setHeroImage({
          ...heroImage,
          url: heroData.content.imagePath,
        });
      }

      // Load home page about section
      const aboutData: any = await get('content/page/home/about');
      if (aboutData?.content?.imagePaths && Array.isArray(aboutData.content.imagePaths)) {
        const paths = aboutData.content.imagePaths;
        setAboutImages([
          { id: 'home-about-1', url: paths[0] || '/images/clinic-1.jpg', alt: 'Dental Clinic', section: 'home-about' },
          { id: 'home-about-2', url: paths[1] || '/images/clinic-2.jpg', alt: 'Dental Equipment', section: 'home-about' },
          { id: 'home-about-3', url: paths[2] || '/images/clinic-3.jpg', alt: 'Treatment Room', section: 'home-about' },
          { id: 'home-about-4', url: paths[3] || '/images/clinic-4.jpg', alt: 'Dental Procedure', section: 'home-about' },
        ]);
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
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(imageId);

    try {
      // Upload image using FormData
      const formData = new FormData();
      formData.append('file', file);

      // Get auth token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

      // Use fetch API directly to avoid axios header issues
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const uploadUrl = `${apiUrl}/api/v1/media/upload`;
      
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers,
        body: formData,
        // Don't set Content-Type - browser will set it with boundary
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }

      const uploadResponse = await uploadRes.json();

      if (!uploadResponse?.url) {
        throw new Error('Upload failed - no URL returned');
      }

      const imageUrl = uploadResponse.url;

      // Update state immediately
      if (section === 'home-hero') {
        setHeroImage({ ...heroImage, url: imageUrl });
        
        // Get current content and update with new image
        const heroData: any = await get('content/page/home/hero');
        await put('content/page/home/hero', {
          content: {
            ...heroData?.content,
            imagePath: imageUrl,
          },
        });
      } else if (section === 'home-about') {
        const index = aboutImages.findIndex(img => img.id === imageId);
        if (index !== -1) {
          const newImages = [...aboutImages];
          newImages[index] = { ...newImages[index], url: imageUrl };
          setAboutImages(newImages);

          // Get current content and update with new images
          const aboutData: any = await get('content/page/home/about');
          await put('content/page/home/about', {
            content: {
              ...aboutData?.content,
              imagePaths: newImages.map(img => img.url),
            },
          });
        }
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
      // Save hero section
      const heroData: any = await get('content/page/home/hero');
      await put('content/page/home/hero', {
        content: {
          ...heroData?.content,
          imagePath: heroImage.url,
        },
      });

      // Save about section
      const aboutData: any = await get('content/page/home/about');
      await put('content/page/home/about', {
        content: {
          ...aboutData?.content,
          imagePaths: aboutImages.map(img => img.url),
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
    image: HomeImage;
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
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Home Page Images</h1>
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

      {/* Hero Section Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-heading font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <FiImage className="w-5 h-5 text-primary-600" />
          Hero Section
        </h2>
        <ImageUploadCard
          image={heroImage}
          title="Main Hero Image"
          description="This image appears in the hero section at the top of the home page"
          onUpload={(file) => handleImageUpload(file, heroImage.id, 'home-hero')}
        />
      </motion.div>

      {/* About Section Images */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-heading font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <FiImage className="w-5 h-5 text-primary-600" />
          About Section
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {aboutImages.map((image, index) => (
            <ImageUploadCard
              key={image.id}
              image={image}
              title={`About Image ${index + 1}`}
              description={`This image appears in the about section grid on the home page`}
              onUpload={(file) => handleImageUpload(file, image.id, 'home-about')}
            />
          ))}
        </div>
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
