'use client';


import BlogCard from '@/components/BlogCard';
import { blogPosts } from '@/data/blogData';
import { BookOpen } from 'lucide-react';

const BlogListPage = () => {
  return (
    <div className="bg-surface min-h-screen">
      

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-primary-light/20 to-white py-16 sm:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            <BookOpen className="w-4 h-4" />
            Knowledge Base
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Our <span className="text-primary">Blog</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Expert insights, step-by-step tutorials, and proven strategies to help you master local SEO and dominate Google Maps.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to get more reviews?
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Join 500+ businesses using ReviewQR to grow their digital reputation instantly.
              </p>
              <a
                href="/google-review-qr-code-generator"
                className="inline-flex items-center px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all active:scale-95 shadow-lg shadow-primary/20"
              >
                Create Your Free QR Code
              </a>
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogListPage;
