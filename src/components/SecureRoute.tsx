import { useEffect, useState, ReactNode } from 'react';
import { useSecurity } from './SecurityProvider';
import { LoadingSpinner } from './LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecureRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

export const SecureRoute = ({ children, requireAuth = true, adminOnly = false }: SecureRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { isSecure, securityLevel, checkSecurity } = useSecurity();
  const { toast } = useToast();

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        setIsLoading(true);

        // Check security status
        const securityCheck = await checkSecurity();
        
        if (!securityCheck) {
          toast({
            title: "Access Denied",
            description: "Security verification failed.",
            variant: "destructive",
          });
          setIsAuthorized(false);
          return;
        }

        // Check authentication if required
        if (requireAuth) {
          const { data: { user }, error } = await supabase.auth.getUser();
          
          if (error || !user) {
            toast({
              title: "Authentication Required",
              description: "Please sign in to access this page.",
              variant: "destructive",
            });
            setIsAuthorized(false);
            return;
          }

          // Check admin access if required
          if (adminOnly) {
            const { data: adminUser, error: adminError } = await supabase
              .from('admin_users')
              .select('id')
              .eq('user_id', user.id)
              .single();

            if (adminError || !adminUser) {
              toast({
                title: "Admin Access Required",
                description: "You don't have permission to access this page.",
                variant: "destructive",
              });
              setIsAuthorized(false);
              return;
            }
          }
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Access verification failed:', error);
        toast({
          title: "Access Error",
          description: "Failed to verify access. Please try again.",
          variant: "destructive",
        });
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAccess();
  }, [requireAuth, adminOnly, checkSecurity, toast]);

  // Show loading while checking
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Verifying access..." />
          <p className="mt-4 text-sm text-muted-foreground">
            Security Level: {securityLevel}
          </p>
        </div>
      </div>
    );
  }

  // Show access denied if not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">
              {requireAuth 
                ? "You need to be authenticated to access this page."
                : "You don't have permission to access this resource."
              }
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show security warning if security level is low
  if (securityLevel === 'low') {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm text-yellow-800">
              Security Warning: Your connection may not be secure. Please use HTTPS.
            </span>
          </div>
        </div>
        {children}
      </div>
    );
  }

  // Render the protected content
  return <>{children}</>;
}; 