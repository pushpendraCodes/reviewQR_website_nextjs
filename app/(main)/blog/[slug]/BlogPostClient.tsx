'use client';

import Link from 'next/link';
import { blogPosts, type BlogPost } from '@/data/blogData';
import { Calendar, User, ArrowLeft, Share2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

interface BlogPostClientProps {
  post: BlogPost;
}

const BlogPostClient = ({ post }: BlogPostClientProps) => {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="bg-white min-h-screen">
      <header className="relative h-[50vh] sm:h-[60vh] min-h-[400px] w-full">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full pb-12 sm:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                {post.category}
              </span>
              <div className="flex items-center gap-4 text-xs text-white/70">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <time dateTime={post.date}>{post.date}</time>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {post.author}
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">{post.title}</h1>
          </div>
        </div>
      </header>

      <main className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12">
          <article className="flex-1 max-w-4xl">
            <div
              className="prose prose-lg prose-slate max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-600 prose-a:text-primary prose-code:text-primary prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {post.keywords.split(',').map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-md border border-gray-100"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold text-sm transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share Article
              </button>
            </div>
          </article>

          <aside className="w-full lg:w-80 space-y-8">
            <div className="bg-surface rounded-2xl p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Grow Your Business</h2>
              <p className="text-sm text-gray-500 mb-6">
                Start collecting more reviews today with our professional QR standees.
              </p>
              <Link
                href="/google-review-qr-code-generator"
                className="block w-full text-center py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all active:scale-95 shadow-md shadow-primary/10"
              >
                Get Started Free
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Related Articles</h2>
              <div className="space-y-4">
                {blogPosts
                  .filter((p) => p.id !== post.id)
                  .slice(0, 3)
                  .map((related) => (
                    <Link
                      key={related.id}
                      href={`/blog/${related.slug}`}
                      className="group flex flex-col gap-1"
                    >
                      <span className="text-xs text-gray-400">{related.date}</span>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors line-clamp-2">
                        {related.title}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Was this article helpful?</h2>
          <p className="text-gray-500 mb-8">
            Share it with other business owners who want to boost their Google ranking.
          </p>
          <button
            onClick={handleShare}
            className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-primary hover:text-primary transition-all"
          >
            Copy Share Link
          </button>
        </div>
      </section>
    </div>
  );
};

export default BlogPostClient;
