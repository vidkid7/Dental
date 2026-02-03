'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiX, FiChevronLeft, FiChevronRight, FiPlay } from 'react-icons/fi';
import { get } from '@/lib/api';

const mediaTypes = ['All', 'Images', 'Videos'];

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  folder?: string;
  caption?: string;
  alt?: string;
}

interface PaginatedResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

export default function GalleryPage() {
  const [selectedMediaType, setSelectedMediaType] = useState('All');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load gallery items from database
  useEffect(() => {
    const loadGallery = async () => {
      try {
        setIsLoading(true);
        // Call public API endpoint (no authentication required)
        const response = await get<PaginatedResponse>('media/public');
        setGalleryItems(response.data || []);
      } catch (error) {
        console.error('Failed to load gallery', error);
        // Fallback to empty array if API fails
        setGalleryItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadGallery();
  }, []);

  const filteredItems = galleryItems.filter(item => {
    // Filter by media type only
    if (selectedMediaType === 'All') return true;
    if (selectedMediaType === 'Images') return item.type === 'image';
    if (selectedMediaType === 'Videos') return item.type === 'video';
    return true;
  });

  const currentIndex = selectedItem ? filteredItems.findIndex(item => item.id === selectedItem.id) : -1;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedItem(filteredItems[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setSelectedItem(filteredItems[currentIndex + 1]);
    }
  };

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
              Photo & Video Gallery
            </h1>
            <p className="text-xl text-primary-100">
              Explore our clinic, meet our team, and see the quality care we provide at Om Chabahil Dental Hospital.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-neutral-50 sticky top-20 z-30 border-b">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center">
            {mediaTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedMediaType(type)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  selectedMediaType === type
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container-custom">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-neutral-500">Loading gallery...</p>
            </div>
          ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-200">
                    {item.type === 'image' ? (
                      <Image
                        src={item.url}
                        alt={item.alt || ''}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <>
                        {/* Video thumbnail */}
                        <video
                          src={item.url}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          preload="metadata"
                        />
                        {/* Video Play Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <FiPlay className="w-7 h-7 text-primary-600 ml-1" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          )}

          {!isLoading && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500">No items found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
            >
              <FiX className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            {currentIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 z-10"
              >
                <FiChevronLeft className="w-10 h-10" />
              </button>
            )}
            {currentIndex < filteredItems.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 z-10"
              >
                <FiChevronRight className="w-10 h-10" />
              </button>
            )}

            {/* Content */}
            <motion.div
              key={selectedItem.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'image' ? (
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                  <Image
                    src={selectedItem.url}
                    alt={selectedItem.alt || ''}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <video
                    className="w-full h-full"
                    controls
                    autoPlay
                  >
                    <source src={selectedItem.url} type="video/mp4" />
                  </video>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
