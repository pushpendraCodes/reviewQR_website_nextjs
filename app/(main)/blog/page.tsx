'use client';

import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import { blogPosts } from '@/data/blogData';
import { getSeoPriorityPosts, GENERATOR_PATH } from '@/lib/seo/internal-links';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';

const BlogListPage = () => {
  const priorityPosts = getSeoPriorityPosts();
  const prioritySlugs = new Set(priorityPosts.map((p) => p.slug));
  const otherPosts = blogPosts.filter((p) => !prioritySlugs.has(p.slug));

  return (
    <div className="bg-surface min-h-screen">
      <section className="bg-gradient-to-br from-white via-primary-light/20 to-white py-16 sm:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            <BookOpen className="w-4 h-4" />
            Knowledge Base
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Our <span className="text-primary">Blog</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Expert insights, step-by-step tutorials, and proven strategies to help you master local SEO and dominate Google Maps.
          </p>
          <Link
            href={GENERATOR_PATH}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-all"
          >
            Open free QR generator
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Priority guides — crawl-focused */}
      <section className="pt-16 sm:pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
              Start here
            </h2>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 tracking-tight">
            Most useful Google Review QR guides
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {priorityPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {otherPosts.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">
              More articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to get more reviews?
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Generate a free Google Review QR code, then upgrade for AI suggestions that help customers finish reviews faster.
              </p>
              <Link
                href={GENERATOR_PATH}
                className="inline-flex items-center px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all active:scale-95 shadow-lg shadow-primary/20"
              >
                Create Your Free QR Code
              </Link>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogListPage;
