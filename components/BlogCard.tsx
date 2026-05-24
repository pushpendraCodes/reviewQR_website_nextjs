'use client';

import Link from 'next/link';;
import { Calendar, User, ArrowRight } from 'lucide-react';
import { type BlogPost } from '../data/blogData';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold rounded-full shadow-sm">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {post.date}
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {post.author}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
          {post.description}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-50">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm group/link"
          >
            Read Article
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
