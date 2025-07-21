import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMaterialTypesQuery = () => {
  return useQuery({
    queryKey: ["material-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("material_type")
        .eq("in_stock", true)
        .not("material_type", "is", null);

      if (error) {
        console.error("Material types query error:", error);
        throw error;
      }

      // Extract unique material types and filter out null/empty values
      const materialTypes = [...new Set(
        data
          ?.map(item => item.material_type)
          .filter(type => type && type.trim() !== "")
      )].sort();

      return materialTypes;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}; 