import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductsQueryOptions {
  categoryName?: string | null;
  page?: number;
  pageSize?: number;
}

export const useProductsQuery = ({
  categoryName = null,
  page = 1,
  pageSize = 12,
}: ProductsQueryOptions = {}) => {
  return useQuery({
    queryKey: ["products", { categoryName, page, pageSize }],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      console.log("🔍 Products Query Debug:", {
        categoryName,
        page,
        pageSize,
        from,
        to
      });

      let query = supabase
        .from("products")
        .select(
          `
          *,
          category:categories!inner(*)
        `,
          { count: "exact" }
        )
        .eq("in_stock", true)
        .range(from, to)
        .order("created_at", { ascending: false });

      if (categoryName) {
        console.log("🎯 Filtering by category:", categoryName);
        query = query.eq("categories.name", categoryName);
      }

      const { data, error, count } = await query;

      console.log("📊 Query Results:", {
        productsCount: data?.length || 0,
        totalCount: count,
        error: error?.message,
        firstProductCategory: data?.[0]?.category?.name
      });

      if (error) {
        console.error("Products query error:", error);
        throw error;
      }
      return { products: data || [], count: count || 0 };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
