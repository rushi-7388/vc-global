import { supabase } from '@/integrations/supabase/client';
import { UserBlockingSystem } from '@/utils/userBlocking';
import { SecurityMiddleware } from '@/utils/securityMiddleware';

// Enhanced authentication with security features
export class EnhancedAuth {
  private static instance: EnhancedAuth;
  private static sessionTimeout: number = 30 * 60 * 1000; // 30 minutes
  private static maxLoginAttempts: number = 5;
  private static lockoutDuration: number = 15 * 60 * 1000; // 15 minutes

  static getInstance(): EnhancedAuth {
    if (!EnhancedAuth.instance) {
      EnhancedAuth.instance = new EnhancedAuth();
    }
    return EnhancedAuth.instance;
  }

  // Enhanced sign in with security checks
  static async secureSignIn(email: string, password: string): Promise<{
    success: boolean;
    user?: any;
    error?: string;
    securityLevel: 'low' | 'medium' | 'high';
  }> {
    try {
      // 1. Pre-authentication security checks
      const preAuthChecks = await this.performPreAuthChecks(email);
      if (!preAuthChecks.success) {
        return {
          success: false,
          error: preAuthChecks.error,
          securityLevel: 'low'
        };
      }

      // 2. Rate limiting check
      const rateLimitKey = `login_${email}`;
      const isRateLimited = !(await SecurityMiddleware.checkRateLimit(
        email,
        'login',
        5, // 5 attempts
        300000 // 5 minutes
      ));

      if (isRateLimited) {
        await UserBlockingSystem.recordFailedLogin(email, 'Rate limit exceeded');
        return {
          success: false,
          error: 'Too many login attempts. Please try again later.',
          securityLevel: 'low'
        };
      }

      // 3. Check if user is blocked
      const blockedUsers = UserBlockingSystem.getBlockedUsers();
      const isBlocked = blockedUsers.some(user => user.email === email);
      
      if (isBlocked) {
        await UserBlockingSystem.recordFailedLogin(email, 'Blocked user attempt');
        return {
          success: false,
          error: 'This account has been blocked. Please contact support.',
          securityLevel: 'low'
        };
      }

      // 4. Network security check
      const networkSecurity = await this.checkNetworkSecurity();
      if (!networkSecurity.secure) {
        await SecurityMiddleware.logSecurityEvent('insecure_connection_attempt', undefined, {
          email,
          reason: networkSecurity.reason
        });
      }

      // 5. Attempt authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Record failed login attempt
        await UserBlockingSystem.recordFailedLogin(email, error.message);
        
        // Check if user should be blocked
        const failedAttempts = await this.getFailedLoginAttempts(email);
        if (failedAttempts >= this.maxLoginAttempts) {
          await UserBlockingSystem.blockUser(
            `temp_${Date.now()}`,
            email,
            'Multiple failed login attempts',
            'System'
          );
        }

        return {
          success: false,
          error: error.message,
          securityLevel: networkSecurity.secure ? 'medium' : 'low'
        };
      }

      if (data.user) {
        // 6. Post-authentication security setup
        const securitySetup = await this.setupPostAuthSecurity(data.user, email);
        
        // 7. Record successful login
        await UserBlockingSystem.recordSuccessfulLogin(data.user.id, email);
        
        // 8. Clear failed attempts
        await this.clearFailedLoginAttempts(email);

        return {
          success: true,
          user: data.user,
          securityLevel: securitySetup.securityLevel
        };
      }

      return {
        success: false,
        error: 'Authentication failed',
        securityLevel: 'low'
      };

    } catch (error) {
      console.error('Enhanced sign in error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
        securityLevel: 'low'
      };
    }
  }

  // Pre-authentication security checks
  private static async performPreAuthChecks(email: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // 1. Email validation
      if (!this.isValidEmail(email)) {
        return {
          success: false,
          error: 'Invalid email format'
        };
      }

      // 2. Check for suspicious patterns
      if (this.isSuspiciousEmail(email)) {
        await SecurityMiddleware.logSecurityEvent('suspicious_email_pattern', undefined, {
          email,
          pattern: 'suspicious_format'
        });
      }

      // 3. Device fingerprint validation
      const deviceCheck = this.validateDeviceFingerprint();
      if (!deviceCheck.valid) {
        await SecurityMiddleware.logSecurityEvent('device_fingerprint_mismatch', undefined, {
          email,
          reason: deviceCheck.reason
        });
      }

      // 4. Network security check
      const networkCheck = await this.checkNetworkSecurity();
      if (!networkCheck.secure) {
        return {
          success: false,
          error: 'Insecure connection detected. Please use HTTPS.'
        };
      }

      return { success: true };

    } catch (error) {
      console.error('Pre-auth checks failed:', error);
      return {
        success: false,
        error: 'Security validation failed'
      };
    }
  }

  // Network security validation
  private static async checkNetworkSecurity(): Promise<{
    secure: boolean;
    reason?: string;
  }> {
    try {
      // Check if using HTTPS
      const isHTTPS = window.location.protocol === 'https:';
      
      // Check for secure context
      const isSecureContext = window.isSecureContext;
      
      // Check for localhost (development)
      const isLocalhost = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';

      if (!isHTTPS && !isLocalhost) {
        return {
          secure: false,
          reason: 'Non-HTTPS connection'
        };
      }

      if (!isSecureContext && !isLocalhost) {
        return {
          secure: false,
          reason: 'Non-secure context'
        };
      }

      return { secure: true };

    } catch (error) {
      console.error('Network security check failed:', error);
      return {
        secure: false,
        reason: 'Security check failed'
      };
    }
  }

  // Device fingerprint validation
  private static validateDeviceFingerprint(): {
    valid: boolean;
    reason?: string;
  } {
    try {
      const userAgent = navigator.userAgent;
      const screenResolution = `${screen.width}x${screen.height}`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const language = navigator.language;
      
      const currentFingerprint = btoa(`${userAgent}-${screenResolution}-${timezone}-${language}`);
      const storedFingerprint = localStorage.getItem('device_fingerprint');
      
      if (!storedFingerprint) {
        // First time setup
        localStorage.setItem('device_fingerprint', currentFingerprint);
        return { valid: true };
      }
      
      if (storedFingerprint !== currentFingerprint) {
        return {
          valid: false,
          reason: 'Device fingerprint mismatch'
        };
      }
      
      return { valid: true };

    } catch (error) {
      console.error('Device fingerprint validation failed:', error);
      return {
        valid: false,
        reason: 'Fingerprint validation failed'
      };
    }
  }

  // Email validation
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Suspicious email pattern detection
  private static isSuspiciousEmail(email: string): boolean {
    const suspiciousPatterns = [
      /test\d*@/i,
      /admin\d*@/i,
      /user\d*@/i,
      /temp\d*@/i,
      /fake\d*@/i
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(email));
  }

  // Post-authentication security setup
  private static async setupPostAuthSecurity(user: any, email: string): Promise<{
    securityLevel: 'low' | 'medium' | 'high';
  }> {
    try {
      // 1. Set up secure session
      await this.setupSecureSession(user);

      // 2. Generate and store security tokens
      const securityTokens = await this.generateSecurityTokens(user.id);

      // 3. Set up activity monitoring
      this.setupActivityMonitoring(user.id);

      // 4. Determine security level
      const securityLevel = await this.determineSecurityLevel(user, email);

      return { securityLevel };

    } catch (error) {
      console.error('Post-auth security setup failed:', error);
      return { securityLevel: 'low' };
    }
  }

  // Setup secure session
  private static async setupSecureSession(user: any): Promise<void> {
    try {
      console.log('Setting up secure session for user:', user.email);
      
      // Store session info securely
      const sessionInfo = {
        userId: user.id,
        email: user.email,
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        securityLevel: 'high'
      };

      // Use sessionStorage for sensitive data (cleared when tab closes)
      sessionStorage.setItem('secure_session', JSON.stringify(sessionInfo));
      console.log('Secure session stored successfully');

      // Set up session timeout - temporarily disabled for debugging
      // this.setupSessionTimeout();

    } catch (error) {
      console.error('Secure session setup failed:', error);
    }
  }

  // Generate security tokens
  private static async generateSecurityTokens(userId: string): Promise<{
    sessionToken: string;
    csrfToken: string;
  }> {
    const sessionToken = crypto.randomUUID();
    const csrfToken = crypto.randomUUID();

    // Store tokens securely
    sessionStorage.setItem('session_token', sessionToken);
    sessionStorage.setItem('csrf_token', csrfToken);

    return { sessionToken, csrfToken };
  }

  // Setup activity monitoring
  private static setupActivityMonitoring(userId: string): void {
    try {
      console.log('Setting up activity monitoring');
      
      // Monitor user activity
      const activityHandler = () => {
        const sessionInfo = sessionStorage.getItem('secure_session');
        if (sessionInfo) {
          const session = JSON.parse(sessionInfo);
          session.lastActivity = new Date().toISOString();
          sessionStorage.setItem('secure_session', JSON.stringify(session));
          console.log('Activity detected, session updated');
          
          // Reset session timeout when activity is detected
          this.setupSessionTimeout();
        }
      };

      // Add event listeners for activity
      ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, activityHandler, { passive: true });
      });

      // Store handler reference for cleanup
      sessionStorage.setItem('activity_handler', 'active');
      console.log('Activity monitoring setup complete');
    } catch (error) {
      console.error('Failed to setup activity monitoring:', error);
    }
  }

  // Setup session timeout
  private static setupSessionTimeout(): void {
    // Disabled for debugging
    // try {
    //   // Clear any existing timeout
    //   const existingTimeout = sessionStorage.getItem('session_timeout');
    //   if (existingTimeout) {
    //     clearTimeout(parseInt(existingTimeout));
    //   }
    //
    //   console.log('Setting up session timeout for 30 minutes');
    //   const timeout = setTimeout(() => {
    //     console.log('Session timeout triggered after 30 minutes');
    //     // Only timeout if user is actually inactive
    //     const sessionInfo = sessionStorage.getItem('secure_session');
    //     if (sessionInfo) {
    //       const session = JSON.parse(sessionInfo);
    //       const lastActivity = new Date(session.lastActivity);
    //       const now = new Date();
    //       const timeSinceLastActivity = now.getTime() - lastActivity.getTime();
    //       const minutesSinceActivity = timeSinceLastActivity / (1000 * 60);
    //       console.log('Checking actual inactivity:', minutesSinceActivity, 'minutes');
    //       // Only timeout if actually inactive for 30+ minutes
    //       if (minutesSinceActivity >= 30) {
    //         console.log('User actually inactive for 30+ minutes, timing out');
    //         this.handleSessionTimeout();
    //       } else {
    //         console.log('User still active, resetting timeout');
    //         // Reset timeout for another 30 minutes
    //         this.setupSessionTimeout();
    //       }
    //     } else {
    //       console.log('No session info found, timing out');
    //       this.handleSessionTimeout();
    //     }
    //   }, this.sessionTimeout);
    //
    //   // Store timeout reference
    //   sessionStorage.setItem('session_timeout', timeout.toString());
    //   console.log('Session timeout set successfully');
    // } catch (error) {
    //   console.error('Failed to setup session timeout:', error);
    // }
  }

  // Handle session timeout
  private static async handleSessionTimeout(): Promise<void> {
    // Disabled for debugging
    // try {
    //   // Log timeout event
    //   await SecurityMiddleware.logSecurityEvent('session_timeout', undefined, {
    //     reason: 'Inactivity timeout'
    //   });
    //
    //   // Sign out user
    //   await supabase.auth.signOut();
    //
    //   // Clear secure data
    //   sessionStorage.clear();
    //
    //   // Redirect to login
    //   window.location.href = '/auth?timeout=true';
    //
    // } catch (error) {
    //   console.error('Session timeout handling failed:', error);
    // }
  }

  // Determine security level
  private static async determineSecurityLevel(user: any, email: string): Promise<'low' | 'medium' | 'high'> {
    try {
      let securityScore = 0;

      // Check if using HTTPS
      if (window.location.protocol === 'https:') securityScore += 2;

      // Check if device fingerprint matches
      const deviceCheck = this.validateDeviceFingerprint();
      if (deviceCheck.valid) securityScore += 2;

      // Check if user is admin
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (adminUser) securityScore += 1;

      // Check network security
      const networkCheck = await this.checkNetworkSecurity();
      if (networkCheck.secure) securityScore += 2;

      // Determine level based on score
      if (securityScore >= 6) return 'high';
      if (securityScore >= 3) return 'medium';
      return 'low';

    } catch (error) {
      console.error('Security level determination failed:', error);
      return 'low';
    }
  }

  // Get failed login attempts
  private static async getFailedLoginAttempts(email: string): Promise<number> {
    try {
      const attempts = localStorage.getItem(`failed_attempts_${email}`);
      return attempts ? parseInt(attempts) : 0;
    } catch (error) {
      return 0;
    }
  }

  // Clear failed login attempts
  private static async clearFailedLoginAttempts(email: string): Promise<void> {
    try {
      localStorage.removeItem(`failed_attempts_${email}`);
    } catch (error) {
      console.error('Failed to clear login attempts:', error);
    }
  }

  // Enhanced sign out with security cleanup
  static async secureSignOut(): Promise<void> {
    try {
      // 1. Log sign out event
      const sessionInfo = sessionStorage.getItem('secure_session');
      if (sessionInfo) {
        const session = JSON.parse(sessionInfo);
        await SecurityMiddleware.logSecurityEvent('user_signout', session.userId, {
          email: session.email,
          sessionDuration: Date.now() - new Date(session.loginTime).getTime()
        });
      }

      // 2. Clear all secure data
      sessionStorage.clear();
      localStorage.removeItem('device_fingerprint');

      // 3. Remove activity listeners
      this.cleanupActivityMonitoring();

      // 4. Sign out from Supabase
      await supabase.auth.signOut();

    } catch (error) {
      console.error('Secure sign out failed:', error);
    }
  }

  // Cleanup activity monitoring
  private static cleanupActivityMonitoring(): void {
    // Remove event listeners (they will be garbage collected)
    sessionStorage.removeItem('activity_handler');
    sessionStorage.removeItem('session_timeout');
  }

  // Check session status (for debugging)
  static checkSessionStatus(): {
    hasSupabaseSession: boolean;
    hasSecureSession: boolean;
    lastActivity: string | null;
    timeSinceActivity: number | null;
  } {
    try {
      const secureSession = sessionStorage.getItem('secure_session');
      const sessionData = secureSession ? JSON.parse(secureSession) : null;
      
      return {
        hasSupabaseSession: !!sessionData,
        hasSecureSession: !!secureSession,
        lastActivity: sessionData?.lastActivity || null,
        timeSinceActivity: sessionData?.lastActivity 
          ? (new Date().getTime() - new Date(sessionData.lastActivity).getTime()) / (1000 * 60)
          : null
      };
    } catch (error) {
      console.error('Session status check failed:', error);
      return {
        hasSupabaseSession: false,
        hasSecureSession: false,
        lastActivity: null,
        timeSinceActivity: null
      };
    }
  }

  // Validate current session
  static async validateCurrentSession(): Promise<{
    valid: boolean;
    user?: any;
    securityLevel: 'low' | 'medium' | 'high';
  }> {
    try {
      console.log('Validating current session...');
      
      // 1. Check Supabase session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        console.log('No Supabase session found');
        return { valid: false, securityLevel: 'low' };
      }

      console.log('Supabase session found for user:', session.user.email);

      // 2. Check secure session data
      const secureSession = sessionStorage.getItem('secure_session');
      if (!secureSession) {
        console.log('No secure session found, recreating...');
        // If no secure session but Supabase session exists, recreate secure session
        await this.setupSecureSession(session.user);
        const securityLevel = await this.determineSecurityLevel(session.user, session.user.email);
        return {
          valid: true,
          user: session.user,
          securityLevel
        };
      }

      const sessionData = JSON.parse(secureSession);
      const lastActivity = new Date(sessionData.lastActivity);
      const now = new Date();

      // 3. Check for inactivity timeout (only if more than 30 minutes)
      const timeSinceLastActivity = now.getTime() - lastActivity.getTime();
      const minutesSinceActivity = timeSinceLastActivity / (1000 * 60);
      
      console.log('Time since last activity:', minutesSinceActivity, 'minutes');
      
      // Be more lenient with session timeout - only timeout if more than 30 minutes AND user is actually inactive
      if (timeSinceLastActivity > this.sessionTimeout && minutesSinceActivity > 30) {
        console.log('Session timeout detected:', minutesSinceActivity, 'minutes');
        return { valid: false, securityLevel: 'low' };
      }

      // 4. Update last activity (only if session is still valid)
      sessionData.lastActivity = now.toISOString();
      sessionStorage.setItem('secure_session', JSON.stringify(sessionData));
      console.log('Session validated successfully');

      // 5. Determine security level
      const securityLevel = await this.determineSecurityLevel(session.user, sessionData.email);

      return {
        valid: true,
        user: session.user,
        securityLevel
      };

    } catch (error) {
      console.error('Session validation failed:', error);
      // Even on error, try to return valid if we have a Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('Returning valid session despite error');
        return { valid: true, user: session.user, securityLevel: 'low' };
      }
      return { valid: false, securityLevel: 'low' };
    }
  }
}

// Export convenience functions
export const secureSignIn = EnhancedAuth.secureSignIn.bind(EnhancedAuth);
export const secureSignOut = EnhancedAuth.secureSignOut.bind(EnhancedAuth);
export const validateCurrentSession = EnhancedAuth.validateCurrentSession.bind(EnhancedAuth);
export const checkSessionStatus = EnhancedAuth.checkSessionStatus.bind(EnhancedAuth); 