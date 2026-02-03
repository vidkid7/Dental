'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiClock, FiUser, FiArrowRight } from 'react-icons/fi';
import { get } from '@/lib/api';

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
}

interface PaginatedResponse {
  data: BlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const params: Record<string, any> = {
          page: currentPage,
          limit: 12,
          sortBy: 'publishedAt',
          sortOrder: 'desc',
        };

        if (selectedCategory !== 'All') {
          params.category = selectedCategory;
        }

        if (searchQuery) {
          params.search = searchQuery;
        }

        const response = await get<PaginatedResponse>('blog', { params });
        setPosts(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Failed to load blog posts', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [currentPage, selectedCategory, searchQuery]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await get<string[]>('blog/categories');
        setCategories(['All', ...cats]);
      } catch (error) {
        console.error('Failed to load categories', error);
        setCategories(['All']);
      }
    };

    loadCategories();
  }, []);

  const featuredPost = posts.find((p) => p.isPublished);
  const regularPosts = posts.filter((p) => p.id !== featuredPost?.id);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Dental Knowledge Hub
            </h1>
            <p className="text-xl text-primary-200">
              Expert insights, dental health tips, and the latest news from 
              our team of dental professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 bg-white border-b border-neutral-100">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[250px] max-w-md relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                className="input pl-12"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="section-padding bg-neutral-50">
          <div className="container-custom">
            <Link href={`/blog/${featuredPost.slug}`}>
              <div className="bg-white rounded-2xl shadow-card overflow-hidden group">
                <div className="grid lg:grid-cols-2">
                  <div className="relative aspect-[16/10] lg:aspect-auto">
                    {featuredPost.featuredImage ? (
                      <Image
                        src={featuredPost.featuredImage}
                        alt={featuredPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                        <span className="text-primary-500/50">Featured Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <span className="badge-accent mb-4 w-fit">Featured</span>
                    <h2 className="text-2xl lg:text-3xl font-heading font-bold text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-neutral-600 mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-neutral-500 mb-6">
                      <span className="flex items-center gap-1">
                        <FiUser className="w-4 h-4" />
                        {featuredPost.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        {featuredPost.readingTime} min read
                      </span>
                    </div>
                    <span className="inline-flex items-center text-primary-600 font-medium">
                      Read Article
                      <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-8">
            {isLoading ? 'Loading Articles...' : 'Latest Articles'}
          </h2>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden animate-pulse">
                  <div className="aspect-[16/10] bg-neutral-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-neutral-200 rounded w-1/2" />
                    <div className="h-6 bg-neutral-200 rounded" />
                    <div className="h-4 bg-neutral-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <article className="bg-white rounded-2xl border border-neutral-100 overflow-hidden group hover:shadow-card transition-shadow h-full">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {post.featuredImage ? (
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                            <span className="text-primary-400/50 text-sm">Blog Image</span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="badge bg-white/90 text-primary-700">{post.category}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-neutral-500 mb-3">
                          <span>{post.author}</span>
                          <span>{post.readingTime} min read</span>
                        </div>
                        <h3 className="text-xl font-heading font-semibold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-neutral-600 line-clamp-2">{post.excerpt}</p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-neutral-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-500 text-lg">No articles found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary-900">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-primary-200 mb-8">
              Get the latest dental health tips and news delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button type="submit" className="btn bg-accent-500 text-white hover:bg-accent-600 whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
