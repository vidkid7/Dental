'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiClock,
  FiUser,
  FiCalendar,
  FiArrowLeft,
  FiShare2,
  FiTag,
  FiEye,
} from 'react-icons/fi';
import { get, getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  views: number;
  readingTime: number;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;

      setIsLoading(true);
      try {
        // Fetch blog post by slug
        const postData = await get<BlogPost>(`blog/slug/${slug}`);
        setPost(postData);

        // Fetch related posts (same category)
        if (postData.category) {
          try {
            const related = await get<{ data: BlogPost[] }>(`blog`, {
              params: {
                category: postData.category,
                limit: 3,
                page: 1,
              },
            });
            // Filter out current post
            const filtered = related.data.filter((p) => p.id !== postData.id);
            setRelatedPosts(filtered.slice(0, 3));
          } catch (error) {
            console.error('Failed to load related posts', error);
          }
        }
      } catch (error) {
        console.error('Failed to load blog post', error);
        toast.error(getErrorMessage(error) || 'Blog post not found');
        router.push('/blog');
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug, router]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Post Not Found</h1>
          <Link href="/blog" className="btn-primary">
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-6 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            <div className="mb-4">
              <span className="badge-accent">{post.category}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
              {post.title}
            </h1>

            <p className="text-xl text-primary-200 mb-8">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-6 text-primary-200">
              <div className="flex items-center gap-2">
                <FiUser className="w-5 h-5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="w-5 h-5" />
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="w-5 h-5" />
                <span>{post.readingTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <FiEye className="w-5 h-5" />
                <span>{post.views} views</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <section className="py-8 bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-elevated">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <article className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="prose prose-lg max-w-none"
                >
                  {/* Render content as HTML */}
                  <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </motion.div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-neutral-200">
                    <div className="flex items-center gap-2 flex-wrap">
                      <FiTag className="w-5 h-5 text-neutral-400" />
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Section */}
                <div className="mt-8 pt-8 border-t border-neutral-200">
                  <div className="flex items-center justify-between">
                    <p className="text-neutral-600 font-medium">Share this article</p>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                    >
                      <FiShare2 className="w-5 h-5" />
                      Share
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Author Card */}
                  <div className="bg-neutral-50 rounded-xl p-6">
                    <h3 className="font-semibold text-neutral-900 mb-4">About the Author</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-bold">
                          {post.author
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{post.author}</p>
                        <p className="text-sm text-neutral-500">{post.category} Specialist</p>
                      </div>
                    </div>
                  </div>

                  {/* Article Info */}
                  <div className="bg-neutral-50 rounded-xl p-6">
                    <h3 className="font-semibold text-neutral-900 mb-4">Article Info</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Reading Time</span>
                        <span className="font-medium">{post.readingTime} min</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Views</span>
                        <span className="font-medium">{post.views}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Published</span>
                        <span className="font-medium">
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-padding bg-neutral-50">
          <div className="container-custom">
            <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-8">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-card transition-shadow group"
                  >
                    {relatedPost.featuredImage && (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="badge bg-primary-100 text-primary-700 text-xs mb-3">
                        {relatedPost.category}
                      </span>
                      <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-neutral-600 text-sm line-clamp-2 mb-4">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-neutral-500">
                        <span>{relatedPost.readingTime} min read</span>
                        <span>{relatedPost.views} views</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary-900">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Need Dental Care?
          </h2>
          <p className="text-primary-200 mb-8 max-w-2xl mx-auto">
            Book an appointment with our expert dental team today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/appointments/book" className="btn-white">
              Book Appointment
            </Link>
            <Link href="/blog" className="btn bg-accent-500 text-white hover:bg-accent-600">
              Read More Articles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
