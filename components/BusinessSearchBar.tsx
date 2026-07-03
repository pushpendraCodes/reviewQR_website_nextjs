'use client';

import { Search, Loader2 } from 'lucide-react';
import { BUSINESS_CATEGORIES } from '../utils/mockData';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

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
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search your business name and city..."
          className="w-full pl-12 pr-28 py-4 text-base border-2 border-gray-200 rounded-xl outline-none transition-all duration-200 placeholder:text-gray-400 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
        <button
          onClick={onSearch}
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>


      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 mt-3">for example: Sharma Medical Store Rewa mp</span>
        <span className="text-xs text-gray-500 mt-3"></span>
      </div>


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