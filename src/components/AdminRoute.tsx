import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Navigate } from "react-router-dom";
import { LoadingSpinner } from "./LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const ADMIN_EMAIL = "myplayer4560@gmail.com"; // Your admin email

interface AdminRouteProps {
  children: JSX.Element;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { data: isAdminFromHook, isLoading: hookLoading } = useAdminCheck();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if current user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Debug logging
  console.log("AdminRoute Debug:", {
    userEmail: user?.email,
    isAdminFromHook,
    isAdmin,
    loading,
    hookLoading
  });

  if (loading || hookLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking admin access..." />
      </div>
    );
  }

  if (!isAdmin) {
    console.log("User is not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log("User is admin, showing admin content");
  return children;
};
