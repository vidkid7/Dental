'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
// Images replaced with placeholders for development
import { FiArrowRight, FiClock, FiUser } from 'react-icons/fi';
import { Card, CardContent } from '@/components/ui/Card';

const posts = [
  {
    id: '1',
    title: '10 Essential Tips for Maintaining Oral Health',
    excerpt: 'Discover the key practices that can help you maintain a healthy smile and prevent dental problems.',
    image: '/images/blog-1.jpg',
    author: 'Dr. Sarah Johnson',
    readingTime: 5,
    category: 'Dental Care',
    slug: '10-essential-tips-for-oral-health',
  },
  {
    id: '2',
    title: 'Understanding the BDS Program: A Complete Guide',
    excerpt: 'Everything you need to know about pursuing a Bachelor of Dental Surgery degree at our institution.',
    image: '/images/blog-2.jpg',
    author: 'Admin',
    readingTime: 8,
    category: 'Education',
    slug: 'understanding-bds-program',
  },
  {
    id: '3',
    title: 'Modern Orthodontics: Beyond Traditional Braces',
    excerpt: 'Explore the latest advancements in orthodontic treatment, from clear aligners to lingual braces.',
    image: '/images/blog-3.jpg',
    author: 'Dr. Michael Chen',
    readingTime: 6,
    category: 'Orthodontics',
    slug: 'modern-orthodontics-beyond-braces',
  },
];

export function BlogSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="badge-primary mb-4">Blog & News</span>
          <h2 className="section-title mb-4">
            Dental Knowledge Hub
          </h2>
          <p className="section-subtitle mx-auto">
            Stay informed with the latest dental health tips, news, and educational content 
            from our experts.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card hover className="h-full group overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center">
                      <span className="text-primary-600/50 text-sm">Blog Image</span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="badge-accent">{post.category}</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-neutral-500 mb-3">
                      <span className="flex items-center gap-1">
                        <FiUser className="w-4 h-4" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        {post.readingTime} min read
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-neutral-600 line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center text-primary-600 font-medium">
                      Read More
                      <FiArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/blog" className="btn-primary">
            View All Articles
            <FiArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
