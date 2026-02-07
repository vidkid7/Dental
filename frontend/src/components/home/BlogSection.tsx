'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiClock, FiUser } from 'react-icons/fi';
import { Card, CardContent } from '@/components/ui/Card';
import { useEffect, useState } from 'react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  author: string;
  category: string;
  readingTime: number;
  isPublished: boolean;
}

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog?limit=3`;
        console.log('[BlogSection] Fetching from:', apiUrl);
        
        const response = await fetch(apiUrl);
        console.log('[BlogSection] Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[BlogSection] API response:', data);
        
        // Handle both paginated and non-paginated responses
        const blogPosts = data.data || data;
        console.log('[BlogSection] Blog posts:', blogPosts);
        
        // Filter only published posts
        const publishedPosts = blogPosts.filter((post: BlogPost) => post.isPublished);
        console.log('[BlogSection] Published posts:', publishedPosts);
        
        const finalPosts = publishedPosts.slice(0, 3);
        console.log('[BlogSection] Final posts to display:', finalPosts);
        
        setPosts(finalPosts);
      } catch (error) {
        console.error('[BlogSection] Failed to fetch blog posts:', error);
        // Fallback to empty array on error
        setPosts([]);
      } finally {
        setLoading(false);
        console.log('[BlogSection] Loading complete');
      }
    };

    fetchBlogs();
  }, []);
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
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full overflow-hidden">
                  <div className="relative aspect-[16/10] bg-neutral-200 animate-pulse" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-neutral-200 rounded animate-pulse mb-3 w-1/2" />
                    <div className="h-6 bg-neutral-200 rounded animate-pulse mb-3" />
                    <div className="h-4 bg-neutral-200 rounded animate-pulse mb-2" />
                    <div className="h-4 bg-neutral-200 rounded animate-pulse w-3/4" />
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : posts.length > 0 ? (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card hover className="h-full group overflow-hidden">
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center">
                          <span className="text-primary-600/50 text-sm">No Image</span>
                        </div>
                      )}
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
            ))
          ) : (
            // No posts message
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-500">No blog posts available yet.</p>
            </div>
          )}
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
