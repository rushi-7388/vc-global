import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FilterOptions } from "@/components/ProductFilters";

interface ProductsQueryOptions {
  categoryName?: string | null;
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: FilterOptions;
}

export const useProductsQuery = ({
  categoryName = null,
  page = 1,
  pageSize = 12,
  search = "",
  filters,
}: ProductsQueryOptions = {}) => {
  return useQuery({
    queryKey: ["products", { categoryName, page, pageSize, search, filters }],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      console.log("🔍 Products Query Debug:", {
        categoryName,
        page,
        pageSize,
        from,
        to,
        search,
        filters,
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
        .range(from, to);

      // Apply filters
      if (filters) {
        // Price range filter
        if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 999999)) {
          query = query.gte("price_per_sqft", filters.priceRange[0]);
          if (filters.priceRange[1] < 999999) {
            query = query.lte("price_per_sqft", filters.priceRange[1]);
          }
        }

        // Material type filter
        if (filters.materialTypes && filters.materialTypes.length > 0) {
          query = query.in("material_type", filters.materialTypes);
        }

        // In stock filter
        if (filters.inStockOnly) {
          query = query.eq("in_stock", true);
        } else {
          // Default to showing in-stock items only
          query = query.eq("in_stock", true);
        }
      } else {
        // Default to showing in-stock items only
        query = query.eq("in_stock", true);
      }

      // Category filter
      if (categoryName) {
        console.log("🎯 Filtering by category:", categoryName);
        query = query.eq("categories.name", categoryName);
      }

      // Search filter
      if (search && search.trim() !== "") {
        const searchTerm = search.trim();
        query = query.or(
          `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,material_type.ilike.%${searchTerm}%`
        );
      }

      // Apply sorting
      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case "price_low":
            query = query.order("price_per_sqft", { ascending: true });
            break;
          case "price_high":
            query = query.order("price_per_sqft", { ascending: false });
            break;
          case "newest":
            query = query.order("created_at", { ascending: false });
            break;
          case "oldest":
            query = query.order("created_at", { ascending: true });
            break;
          case "name":
          default:
            query = query.order("name", { ascending: true });
            break;
        }
      } else {
        // Default sorting
        query = query.order("created_at", { ascending: false });
      }

      const { data, error, count } = await query;

      console.log("📊 Query Results:", {
        productsCount: data?.length || 0,
        totalCount: count,
        error: error?.message,
        firstProductCategory: data?.[0]?.category?.name,
        appliedFilters: filters
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
