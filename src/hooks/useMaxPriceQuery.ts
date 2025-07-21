import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMaxPriceQuery = () => {
  return useQuery({
    queryKey: ["max-price"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("price_per_sqft")
        .eq("in_stock", true)
        .not("price_per_sqft", "is", null)
        .order("price_per_sqft", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Max price query error:", error);
        throw error;
      }

      const maxPrice = data?.[0]?.price_per_sqft || 100;
      return Math.ceil(maxPrice); // Round up to nearest dollar
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}; 