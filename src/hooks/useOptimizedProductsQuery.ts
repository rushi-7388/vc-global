import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/integrations/supabase/types";

export const useOptimizedProductsQuery = (
  categoryName: string | null,
  limit?: number
) => {
  return useQuery<Product[]>({
    queryKey: ["products", { categoryName, limit }],
    queryFn: async () => {
      console.log("🔍 Optimized Products Query Debug:", {
        categoryName,
        limit
      });

      let query = supabase
        .from("products")
        .select(
          `
          *,
          category:categories!inner(*)
        `
        )
        .eq("in_stock", true);

      if (categoryName) {
        console.log("🎯 Optimized Query - Filtering by category:", categoryName);
        query = query.eq("categories.name", categoryName);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      console.log("📊 Optimized Query Results:", {
        productsCount: data?.length || 0,
        error: error?.message,
        firstProductCategory: data?.[0]?.category?.name,
        allCategories: data?.map(p => p.category?.name),
        rawData: data?.[0] // Let's see the raw data structure
      });

      if (error) {
        console.error("Products query error:", error);
        throw error;
      }
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
