'use client';

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

export default function TestBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        console.log('Fetching from:', `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog?limit=3`);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog?limit=3`);
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Full API response:', data);
        
        const blogPosts = data.data || data;
        console.log('Blog posts:', blogPosts);
        
        const publishedPosts = blogPosts.filter((post: BlogPost) => post.isPublished);
        console.log('Published posts:', publishedPosts);
        
        setPosts(publishedPosts.slice(0, 3));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Failed to fetch blog posts:', err);
        setError(errorMessage);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Blog API Test Page</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}/api/v1/blog?limit=3</p>
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
        <p><strong>Posts Count:</strong> {posts.length}</p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-lg">Loading blog posts...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {!loading && posts.length === 0 && !error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>No blog posts found</p>
        </div>
      )}

      {posts.length > 0 && (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-lg p-6 bg-white shadow">
              <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-2">{post.excerpt}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>Author: {post.author}</span>
                <span>Category: {post.category}</span>
                <span>Reading Time: {post.readingTime} min</span>
              </div>
              {post.featuredImage && (
                <div className="mt-4">
                  <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover rounded" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
