
import { useThrottledQuery } from "@/hooks/useThrottledQuery";
import { supabase } from "@/integrations/supabase/client";

export const useOptimizedProductsQuery = (selectedCategory?: string | null) => {
  return useThrottledQuery({
    queryKey: ['products', selectedCategory],
    queryFn: async () => {
      // Use connection speed to determine query optimization with proper type checking
      const connection = (navigator as any).connection;
      const connectionSpeed = connection?.effectiveType || 'fast';
      
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price_per_sqft,
          origin_country,
          material_type,
          size_options,
          finish_type,
          thickness_mm,
          image_urls,
          is_premium,
          category:categories(name, description)
        `)
        .eq('in_stock', true);

      // Limit results for slow connections
      if (connectionSpeed === 'slow-2g' || connectionSpeed === '2g') {
        query = query.limit(20);
      } else if (connectionSpeed === '3g') {
        query = query.limit(50);
      } else {
        query = query.limit(100);
      }

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      query = query
        .order('is_premium', { ascending: false })
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    throttleDelay: 500, // Custom throttle delay
  });
};
