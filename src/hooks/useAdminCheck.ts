
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminCheck = () => {
  return useQuery({
    queryKey: ['admin-check'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (error) return false;
      return !!data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
