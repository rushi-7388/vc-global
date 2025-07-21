import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProductSearchResult {
  id: string;
  name: string;
  price_per_sqft: number | null;
  image_urls: string[] | null;
  image_files: string[] | null;
  category: {
    name: string;
  } | null;
}

interface UseProductSearchOptions {
  searchTerm: string;
  enabled?: boolean;
  limit?: number;
}

export const useProductSearch = ({ 
  searchTerm, 
  enabled = true, 
  limit = 8 
}: UseProductSearchOptions) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return useQuery({
    queryKey: ['product-search', debouncedSearchTerm, limit],
    queryFn: async (): Promise<ProductSearchResult[]> => {
      if (!debouncedSearchTerm.trim()) {
        return [];
      }

      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price_per_sqft,
          image_urls,
          image_files,
          category:categories(name)
        `)
        .eq('in_stock', true)
        .or(`name.ilike.%${debouncedSearchTerm.trim()}%,description.ilike.%${debouncedSearchTerm.trim()}%,material_type.ilike.%${debouncedSearchTerm.trim()}%`)
        .limit(limit)
        .order('name', { ascending: true });

      if (error) {
        console.error('Product search error:', error);
        throw error;
      }

      return data || [];
    },
    enabled: enabled && debouncedSearchTerm.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}; 