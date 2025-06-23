import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserBlockingSystem } from '@/utils/userBlocking';

export const useUserBlocking = () => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Check if user is blocked
          const blocked = UserBlockingSystem.isUserBlocked(user.id);
          setIsBlocked(blocked);
        } else {
          setIsBlocked(false);
        }
      } catch (error) {
        console.error('Error checking user blocking status:', error);
        setIsBlocked(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const blocked = UserBlockingSystem.isUserBlocked(session.user.id);
        setIsBlocked(blocked);
      } else {
        setIsBlocked(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const blockUser = async (userId: string, email: string, reason: string) => {
    return await UserBlockingSystem.blockUser(userId, email, reason, user?.email || 'Admin');
  };

  const unblockUser = async (userId: string) => {
    return await UserBlockingSystem.unblockUser(userId);
  };

  const recordSuspiciousActivity = async (activity: string) => {
    if (user) {
      await UserBlockingSystem.recordSuspiciousActivity(user.id, user.email, activity);
    }
  };

  return {
    isBlocked,
    loading,
    user,
    blockUser,
    unblockUser,
    recordSuspiciousActivity,
  };
}; 