import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "myplayer4560@gmail.com"; // Your admin email

export const useAdminCheck = () => {
  return useQuery({
    queryKey: ['admin-check'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;
      
      // Check if the user's email matches the admin email
      return user.email === ADMIN_EMAIL;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
