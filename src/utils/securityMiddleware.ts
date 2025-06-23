import { supabase } from '@/integrations/supabase/client';

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security middleware for API calls
export class SecurityMiddleware {
  private static instance: SecurityMiddleware;
  private blockedIPs: Set<string> = new Set();
  private suspiciousActivities: Map<string, number> = new Map();

  static getInstance(): SecurityMiddleware {
    if (!SecurityMiddleware.instance) {
      SecurityMiddleware.instance = new SecurityMiddleware();
    }
    return SecurityMiddleware.instance;
  }

  // Rate limiting
  static async checkRateLimit(userId: string, action: string, limit: number = 100, windowMs: number = 60000): Promise<boolean> {
    const key = `${userId}:${action}`;
    const now = Date.now();
    
    const current = rateLimitStore.get(key);
    
    if (!current || now > current.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (current.count >= limit) {
      return false;
    }
    
    current.count++;
    return true;
  }

  // Input sanitization
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // SQL injection prevention
  static validateSQLInput(input: string): boolean {
    const sqlKeywords = [
      'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 'EXEC', 'UNION',
      'OR', 'AND', 'WHERE', 'FROM', 'JOIN', 'HAVING', 'GROUP BY', 'ORDER BY'
    ];
    
    const upperInput = input.toUpperCase();
    return !sqlKeywords.some(keyword => upperInput.includes(keyword));
  }

  // XSS prevention
  static escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // CSRF protection
  static generateCSRFToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Validate CSRF token
  static validateCSRFToken(token: string, storedToken: string): boolean {
    return token === storedToken && token.length > 0;
  }

  // Device fingerprint validation
  static validateDeviceFingerprint(fingerprint: string): boolean {
    const storedFingerprint = localStorage.getItem('device_fingerprint');
    return fingerprint === storedFingerprint;
  }

  // Session validation
  static async validateSession(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return false;
      }

      // Check if session is expired
      if (session.expires_at && new Date(session.expires_at * 1000) < new Date()) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }

  // User permission validation
  static async validateUserPermission(userId: string, requiredPermission: string): Promise<boolean> {
    try {
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error || !adminUser) {
        return false;
      }

      // Check if user has required permission
      if (adminUser.role === 'super_admin') {
        return true;
      }

      // For now, assume all admin users have all permissions
      // This can be enhanced when the permissions column is added
      return true;
    } catch (error) {
      console.error('Permission validation failed:', error);
      return false;
    }
  }

  // Audit logging
  static async logSecurityEvent(event: string, userId?: string, details?: Record<string, unknown>): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('security_audit_log')
        .insert({
          event,
          user_id: userId,
          details: details ? JSON.stringify(details) : null,
          ip_address: await this.getClientIP(),
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Security logging failed:', error);
    }
  }

  // Get client IP (basic implementation)
  private static async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  }

  // Block suspicious IP
  static blockIP(ip: string): void {
    this.getInstance().blockedIPs.add(ip);
  }

  // Check if IP is blocked
  static isIPBlocked(ip: string): boolean {
    return this.getInstance().blockedIPs.has(ip);
  }

  // Record suspicious activity
  static recordSuspiciousActivity(userId: string): void {
    const count = this.getInstance().suspiciousActivities.get(userId) || 0;
    this.getInstance().suspiciousActivities.set(userId, count + 1);
    
    // Block user after 5 suspicious activities
    if (count >= 5) {
      this.blockUser(userId);
    }
  }

  // Block user
  static async blockUser(userId: string): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('blocked_users')
        .insert({
          user_id: userId,
          reason: 'Suspicious activity detected',
          blocked_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to block user:', error);
    }
  }

  // Check if user is blocked
  static async isUserBlocked(userId: string): Promise<boolean> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('blocked_users')
        .select('id')
        .eq('user_id', userId)
        .single();

      return !error && !!data;
    } catch (error) {
      return false;
    }
  }
}

// Secure API wrapper
export const secureApiCall = async <T>(
  apiFunction: () => Promise<T>,
  options: {
    requireAuth?: boolean;
    requirePermission?: string;
    rateLimit?: { limit: number; windowMs: number };
    userId?: string;
  } = {}
): Promise<T> => {
  const {
    requireAuth = true,
    requirePermission,
    rateLimit,
    userId
  } = options;

  try {
    // Check if user is blocked
    if (userId && await SecurityMiddleware.isUserBlocked(userId)) {
      throw new Error('User is blocked due to suspicious activity');
    }

    // Validate session
    if (requireAuth && !(await SecurityMiddleware.validateSession())) {
      throw new Error('Invalid session');
    }

    // Check rate limiting
    if (rateLimit && userId) {
      const isAllowed = await SecurityMiddleware.checkRateLimit(
        userId,
        'api_call',
        rateLimit.limit,
        rateLimit.windowMs
      );
      
      if (!isAllowed) {
        throw new Error('Rate limit exceeded');
      }
    }

    // Check permissions
    if (requirePermission && userId) {
      const hasPermission = await SecurityMiddleware.validateUserPermission(userId, requirePermission);
      
      if (!hasPermission) {
        throw new Error('Insufficient permissions');
      }
    }

    // Execute API call
    const result = await apiFunction();

    // Log successful API call
    await SecurityMiddleware.logSecurityEvent('api_call_success', userId);

    return result;
  } catch (error) {
    // Log failed API call
    await SecurityMiddleware.logSecurityEvent('api_call_failed', userId, { error: error instanceof Error ? error.message : 'Unknown error' });
    
    if (userId) {
      SecurityMiddleware.recordSuspiciousActivity(userId);
    }
    
    throw error;
  }
};

// Secure data validation
export const validateData = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone);
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}; 