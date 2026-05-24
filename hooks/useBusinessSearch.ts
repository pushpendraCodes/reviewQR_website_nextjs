'use client';

// src/hooks/useBusinessSearch.ts
import { useState, useCallback } from "react";
import { useLazySearchBusinessesQuery } from "../store/api/placesApi";
import type { Business } from "../store/api/placesApi";

export const useBusinessSearch = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hasSearched, setHasSearched] = useState(false);

  const [triggerSearch, { data, isFetching, isError }] = useLazySearchBusinessesQuery();

  const results: Business[] = data?.results ?? [];

  const searchNow = useCallback(() => {
    if (!query.trim()) {
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    triggerSearch({ q: query, category: selectedCategory });
  }, [query, selectedCategory, triggerSearch]);

  return {
    query,
    setQuery,
    results,
    isLoading: isFetching,
    isError,
    hasSearched,
    selectedCategory,
    setSelectedCategory,
    searchNow,
  };
};