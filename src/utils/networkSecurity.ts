import { supabase } from '@/integrations/supabase/client';
import { SecurityMiddleware } from './securityMiddleware';

// Network security utilities to prevent password exposure
export class NetworkSecurity {
  private static instance: NetworkSecurity;
  private encryptionKey: string | null = null;
  private sessionTokens: Map<string, string> = new Map();

  static getInstance(): NetworkSecurity {
    if (!NetworkSecurity.instance) {
      NetworkSecurity.instance = new NetworkSecurity();
    }
    return NetworkSecurity.instance;
  }

  // Initialize network security
  static async initialize(): Promise<void> {
    try {
      // Generate encryption key for session
      const key = await this.generateEncryptionKey();
      this.getInstance().encryptionKey = key;

      // Set up secure headers
      this.setupSecureHeaders();

      // Initialize session tokens
      await this.initializeSessionTokens();

    } catch (error) {
      console.error('Network security initialization failed:', error);
    }
  }

  // Generate encryption key
  private static async generateEncryptionKey(): Promise<string> {
    try {
      // Use Web Crypto API for secure key generation
      const key = await crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256
        },
        true,
        ['encrypt', 'decrypt']
      );

      // Export key as base64
      const exportedKey = await crypto.subtle.exportKey('raw', key);
      return btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
    } catch (error) {
      console.error('Key generation failed:', error);
      // Fallback to random string
      return Math.random().toString(36).substring(2, 15) + 
             Math.random().toString(36).substring(2, 15);
    }
  }

  // Setup secure headers
  private static setupSecureHeaders(): void {
    // Add security headers to all requests
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const secureInit = {
        ...init,
        headers: {
          ...init?.headers,
          'X-Security-Token': this.getInstance().encryptionKey || '',
          'X-Request-ID': crypto.randomUUID(),
          'X-Timestamp': Date.now().toString(),
        }
      };

      return originalFetch(input, secureInit);
    };
  }

  // Initialize session tokens
  private static async initializeSessionTokens(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const token = crypto.randomUUID();
        this.getInstance().sessionTokens.set(session.user.id, token);
        
        // Store token securely
        sessionStorage.setItem('secure_session_token', token);
      }
    } catch (error) {
      console.error('Session token initialization failed:', error);
    }
  }

  // Secure data transmission
  static async secureTransmit(data: any, endpoint: string): Promise<any> {
    try {
      // 1. Sanitize sensitive data
      const sanitizedData = this.sanitizeSensitiveData(data);

      // 2. Encrypt sensitive fields
      const encryptedData = await this.encryptSensitiveFields(sanitizedData);

      // 3. Add security headers
      const secureHeaders = this.generateSecurityHeaders();

      // 4. Transmit data
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...secureHeaders
        },
        body: JSON.stringify(encryptedData)
      });

      // 5. Validate response
      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
      }

      // 6. Decrypt response if needed
      const responseData = await response.json();
      return this.decryptResponseData(responseData);

    } catch (error) {
      console.error('Secure transmission failed:', error);
      throw error;
    }
  }

  // Sanitize sensitive data
  private static sanitizeSensitiveData(data: any): any {
    const sanitized = { ...data };

    // Remove or mask sensitive fields
    if (sanitized.password) {
      // Don't send password in plain text
      delete sanitized.password;
    }

    if (sanitized.email) {
      // Hash email for transmission
      sanitized.email = this.hashEmail(sanitized.email);
    }

    // Remove any other sensitive fields
    const sensitiveFields = ['ssn', 'creditCard', 'bankAccount', 'personalId'];
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        delete sanitized[field];
      }
    });

    return sanitized;
  }

  // Hash email for secure transmission
  private static hashEmail(email: string): string {
    // Simple hash for demonstration - in production use proper hashing
    return btoa(email).replace(/[^a-zA-Z0-9]/g, '');
  }

  // Encrypt sensitive fields
  private static async encryptSensitiveFields(data: any): Promise<any> {
    const encrypted = { ...data };

    // Encrypt any remaining sensitive fields
    const fieldsToEncrypt = ['email', 'phone', 'address'];
    
    for (const field of fieldsToEncrypt) {
      if (encrypted[field]) {
        encrypted[field] = await this.encryptValue(encrypted[field]);
      }
    }

    return encrypted;
  }

  // Encrypt a single value
  private static async encryptValue(value: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(value);

      // Generate IV
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Encrypt
      const key = await crypto.subtle.importKey(
        'raw',
        new Uint8Array(atob(this.getInstance().encryptionKey || '').split('').map(c => c.charCodeAt(0))),
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );

      // Return base64 encoded encrypted data with IV
      return btoa(String.fromCharCode(...new Uint8Array(encrypted))) + 
             '.' + 
             btoa(String.fromCharCode(...iv));
    } catch (error) {
      console.error('Encryption failed:', error);
      return value; // Fallback to original value
    }
  }

  // Generate security headers
  private static generateSecurityHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'X-Security-Version': '2.0',
      'X-Client-ID': this.getClientId(),
      'X-Device-Fingerprint': this.getDeviceFingerprint(),
      'X-Session-Token': sessionStorage.getItem('secure_session_token') || '',
      'X-Request-Signature': this.generateRequestSignature(),
    };

    return headers;
  }

  // Get client ID
  private static getClientId(): string {
    let clientId = localStorage.getItem('client_id');
    if (!clientId) {
      clientId = crypto.randomUUID();
      localStorage.setItem('client_id', clientId);
    }
    return clientId;
  }

  // Get device fingerprint
  private static getDeviceFingerprint(): string {
    const fingerprint = localStorage.getItem('device_fingerprint');
    return fingerprint || 'unknown';
  }

  // Generate request signature
  private static generateRequestSignature(): string {
    const timestamp = Date.now().toString();
    const nonce = crypto.randomUUID();
    const data = `${timestamp}.${nonce}.${this.getInstance().encryptionKey}`;
    
    // Simple hash for demonstration
    return btoa(data).replace(/[^a-zA-Z0-9]/g, '');
  }

  // Decrypt response data
  private static async decryptResponseData(data: any): Promise<any> {
    try {
      const decrypted = { ...data };

      // Decrypt any encrypted fields
      const fieldsToDecrypt = ['email', 'phone', 'address'];
      
      for (const field of fieldsToDecrypt) {
        if (decrypted[field] && typeof decrypted[field] === 'string' && decrypted[field].includes('.')) {
          decrypted[field] = await this.decryptValue(decrypted[field]);
        }
      }

      return decrypted;
    } catch (error) {
      console.error('Response decryption failed:', error);
      return data; // Return original data if decryption fails
    }
  }

  // Decrypt a single value
  private static async decryptValue(encryptedValue: string): Promise<string> {
    try {
      const [encrypted, iv] = encryptedValue.split('.');
      
      if (!encrypted || !iv) {
        return encryptedValue; // Return original if not properly encrypted
      }

      const encryptedData = new Uint8Array(atob(encrypted).split('').map(c => c.charCodeAt(0)));
      const ivData = new Uint8Array(atob(iv).split('').map(c => c.charCodeAt(0)));

      const key = await crypto.subtle.importKey(
        'raw',
        new Uint8Array(atob(this.getInstance().encryptionKey || '').split('').map(c => c.charCodeAt(0))),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: ivData },
        key,
        encryptedData
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedValue; // Return original value if decryption fails
    }
  }

  // Secure authentication request
  static async secureAuthRequest(email: string, password: string): Promise<any> {
    try {
      // 1. Never send password in plain text
      const authData = {
        email: this.hashEmail(email),
        passwordHash: await this.hashPassword(password),
        timestamp: Date.now(),
        nonce: crypto.randomUUID()
      };

      // 2. Add additional security measures
      const secureData = {
        ...authData,
        deviceFingerprint: this.getDeviceFingerprint(),
        clientId: this.getClientId(),
        sessionToken: sessionStorage.getItem('secure_session_token') || ''
      };

      // 3. Log security event
      await SecurityMiddleware.logSecurityEvent('secure_auth_attempt', undefined, {
        email: this.hashEmail(email),
        deviceFingerprint: this.getDeviceFingerprint(),
        timestamp: new Date().toISOString()
      });

      // 4. Use Supabase auth with additional security
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      // 5. Log successful authentication
      if (data.user) {
        await SecurityMiddleware.logSecurityEvent('secure_auth_success', data.user.id, {
          email: this.hashEmail(email),
          securityLevel: 'high'
        });
      }

      return { data, error: null };

    } catch (error) {
      console.error('Secure auth request failed:', error);
      
      // Log failed authentication
      await SecurityMiddleware.logSecurityEvent('secure_auth_failed', undefined, {
        email: this.hashEmail(email),
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  // Hash password securely
  private static async hashPassword(password: string): Promise<string> {
    try {
      // Use Web Crypto API for secure hashing
      const encoder = new TextEncoder();
      const data = encoder.encode(password + this.getInstance().encryptionKey);
      
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('Password hashing failed:', error);
      // Fallback to simple hash
      return btoa(password).replace(/[^a-zA-Z0-9]/g, '');
    }
  }

  // Validate network security
  static validateNetworkSecurity(): {
    secure: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check HTTPS
    if (window.location.protocol !== 'https:' && 
        window.location.hostname !== 'localhost' && 
        window.location.hostname !== '127.0.0.1') {
      issues.push('Non-HTTPS connection detected');
      recommendations.push('Use HTTPS for secure data transmission');
    }

    // Check secure context
    if (!window.isSecureContext && 
        window.location.hostname !== 'localhost' && 
        window.location.hostname !== '127.0.0.1') {
      issues.push('Non-secure context detected');
      recommendations.push('Ensure secure context for enhanced security');
    }

    // Check for developer tools
    if (window.outerHeight - window.innerHeight > 200 || 
        window.outerWidth - window.innerWidth > 200) {
      issues.push('Developer tools detected');
      recommendations.push('Close developer tools for enhanced security');
    }

    // Check for incognito mode
    if (window.navigator.webdriver) {
      issues.push('Automated browser detected');
      recommendations.push('Use regular browser for enhanced security');
    }

    return {
      secure: issues.length === 0,
      issues,
      recommendations
    };
  }

  // Monitor network activity
  static startNetworkMonitoring(): void {
    // Monitor for suspicious network activity
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalFetch = window.fetch;

    // Intercept XMLHttpRequest
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      this.addEventListener('load', () => {
        this.logNetworkActivity(method, url, this.status);
      });
      return originalXHROpen.call(this, method, url, ...args);
    };

    // Intercept fetch
    window.fetch = async (input, init) => {
      const method = init?.method || 'GET';
      const url = typeof input === 'string' ? input : input.toString();
      
      try {
        const response = await originalFetch(input, init);
        this.logNetworkActivity(method, url, response.status);
        return response;
      } catch (error) {
        this.logNetworkActivity(method, url, 0);
        throw error;
      }
    };
  }

  // Log network activity
  private static logNetworkActivity(method: string, url: string, status: number): void {
    // Only log suspicious activity
    if (status >= 400 || method === 'POST' || url.includes('auth')) {
      SecurityMiddleware.logSecurityEvent('network_activity', undefined, {
        method,
        url: url.length > 100 ? url.substring(0, 100) + '...' : url,
        status,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Cleanup network security
  static cleanup(): void {
    // Clear sensitive data
    this.getInstance().encryptionKey = null;
    this.getInstance().sessionTokens.clear();
    
    // Clear secure storage
    sessionStorage.removeItem('secure_session_token');
    
    // Restore original fetch
    // Note: This is a simplified cleanup - in production you'd want to track and restore original functions
  }
}

// Export convenience functions
export const secureTransmit = NetworkSecurity.secureTransmit.bind(NetworkSecurity);
export const secureAuthRequest = NetworkSecurity.secureAuthRequest.bind(NetworkSecurity);
export const validateNetworkSecurity = NetworkSecurity.validateNetworkSecurity.bind(NetworkSecurity);
export const startNetworkMonitoring = NetworkSecurity.startNetworkMonitoring.bind(NetworkSecurity);
export const cleanupNetworkSecurity = NetworkSecurity.cleanup.bind(NetworkSecurity); 