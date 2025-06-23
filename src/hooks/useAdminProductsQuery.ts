import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminProductsQuery = () => {
  return useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
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
          image_files,
          is_premium,
          in_stock,
          created_at,
          updated_at,
          category:categories(name, description)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Admin products query error:', error);
        throw error;
      }
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for admin view
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}; 