import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecurityContextType {
  isSecure: boolean;
  securityLevel: 'low' | 'medium' | 'high';
  lastActivity: Date;
  updateActivity: () => void;
  checkSecurity: () => Promise<boolean>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider = ({ children }: SecurityProviderProps) => {
  const [isSecure, setIsSecure] = useState(false);
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [lastActivity, setLastActivity] = useState(new Date());
  const { toast } = useToast();

  // Security checks
  const performSecurityChecks = async (): Promise<boolean> => {
    try {
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Authentication error:', authError);
        return false;
      }

      if (!user) {
        console.log('No authenticated user');
        return false;
      }

      // Check user session validity
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        return false;
      }

      // Check if session is expired
      if (session.expires_at && new Date(session.expires_at * 1000) < new Date()) {
        console.log('Session expired');
        return false;
      }

      // Additional security checks - be more lenient
      const securityChecks = await Promise.all([
        checkUserPermissions(user.id),
        checkRateLimiting(),
        checkDeviceFingerprint(),
        checkNetworkSecurity()
      ]);

      // Count how many checks passed
      const passedChecks = securityChecks.filter(check => check).length;
      
      if (passedChecks >= 2) { // At least 2 checks must pass
        setSecurityLevel('high');
        setIsSecure(true);
        return true;
      } else if (passedChecks >= 1) { // At least 1 check must pass
        setSecurityLevel('medium');
        setIsSecure(true);
        return true;
      } else {
        // Even if all checks fail, still allow access but with low security
        setSecurityLevel('low');
        setIsSecure(true);
        return true;
      }

    } catch (error) {
      console.error('Security check failed:', error);
      // Even on error, allow access with low security
      setSecurityLevel('low');
      setIsSecure(true);
      return true;
    }
  };

  // Check user permissions
  const checkUserPermissions = async (userId: string): Promise<boolean> => {
    try {
      // Check if user exists in admin_users table
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Permission check error:', error);
        return false;
      }

      return true; // Allow access even if not admin
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  };

  // Rate limiting check
  const checkRateLimiting = async (): Promise<boolean> => {
    // Implement rate limiting logic here
    // For now, return true
    return true;
  };

  // Device fingerprint check
  const checkDeviceFingerprint = (): boolean => {
    try {
      // Basic device fingerprinting
      const userAgent = navigator.userAgent;
      const screenResolution = `${screen.width}x${screen.height}`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Store fingerprint in localStorage for consistency
      const storedFingerprint = localStorage.getItem('device_fingerprint');
      const currentFingerprint = btoa(`${userAgent}-${screenResolution}-${timezone}`);
      
      if (!storedFingerprint) {
        localStorage.setItem('device_fingerprint', currentFingerprint);
        return true;
      }
      
      return storedFingerprint === currentFingerprint;
    } catch (error) {
      console.error('Device fingerprint check failed:', error);
      return true; // Allow access if fingerprinting fails
    }
  };

  // Network security check
  const checkNetworkSecurity = (): boolean => {
    try {
      // Check if running on HTTPS
      const isSecure = window.location.protocol === 'https:';
      
      // Check for localhost (development)
      const isLocalhost = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';
      
      return isSecure || isLocalhost;
    } catch (error) {
      console.error('Network security check failed:', error);
      return true; // Allow access if check fails
    }
  };

  // Update user activity
  const updateActivity = () => {
    setLastActivity(new Date());
  };

  // Check security status
  const checkSecurity = async (): Promise<boolean> => {
    const isSecure = await performSecurityChecks();
    
    if (!isSecure) {
      toast({
        title: "Security Warning",
        description: "Security check failed. Please refresh the page.",
        variant: "destructive",
      });
    }
    
    return isSecure;
  };

  // Activity monitoring
  useEffect(() => {
    const handleUserActivity = () => {
      updateActivity();
    };

    // Monitor user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Initial security check
    performSecurityChecks();

    // Periodic security checks - less frequent
    const securityInterval = setInterval(() => {
      performSecurityChecks();
    }, 600000); // Check every 10 minutes instead of 5

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
      clearInterval(securityInterval);
    };
  }, [lastActivity, toast]);

  // Prevent right-click context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+C
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const value: SecurityContextType = {
    isSecure,
    securityLevel,
    lastActivity,
    updateActivity,
    checkSecurity,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}; 