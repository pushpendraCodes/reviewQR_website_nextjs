'use client';

import { Search, Loader2, Lock } from 'lucide-react';
import { BUSINESS_CATEGORIES } from '../utils/mockData';
import { useAppSelector } from '../store/hooks';
import { useRouter } from 'next/navigation'; // ← removed double semicolon
import type { RootState } from '../store/store';
interface BusinessSearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  isLoading: boolean;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onSearch: () => void;
}

const BusinessSearchBar = ({
  query,
  setQuery,
  isLoading,
  selectedCategory,
  setSelectedCategory,
  onSearch,
}: BusinessSearchBarProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch();
  };
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated ?? false);
  const router = useRouter(); // ← renamed to router

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => isAuthenticated && setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search your business name and city..."
          readOnly={!isAuthenticated}
          className={`w-full pl-12 pr-28 py-4 text-base border-2 rounded-xl outline-none transition-all duration-200 placeholder:text-gray-400 ${!isAuthenticated
            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
            : 'border-gray-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10'
            }`}
        />
        <button
          onClick={onSearch}
          disabled={isLoading || !query.trim() || !isAuthenticated}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {!isAuthenticated && (
        <div className="mt-3 flex items-center justify-between gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <Lock className="w-4 h-4 shrink-0 text-amber-500" />
            <span>Please login for better search results</span>
          </div>
          <button
            onClick={() => router.push("/auth/login")} // ← fixed
            className="shrink-0 px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-all duration-200 active:scale-95"
          >
            Login
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {BUSINESS_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${selectedCategory === category
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
              }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BusinessSearchBar;