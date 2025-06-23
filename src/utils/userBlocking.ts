import { supabase } from '@/integrations/supabase/client';

export interface BlockedUser {
  id: string;
  user_id: string;
  email: string;
  reason: string;
  blocked_at: string;
  blocked_by: string;
}

export interface SecurityEvent {
  id: string;
  user_id: string | null;
  email: string | null;
  event_type: string;
  details: string;
  ip_address?: string;
  timestamp: string;
}

// Simple user blocking system
export class UserBlockingSystem {
  // Initialize with demo data if no data exists
  static initializeDemoData() {
    try {
      const hasEvents = localStorage.getItem('security_events');
      const hasBlockedUsers = localStorage.getItem('blocked_users');
      
      if (!hasEvents) {
        // Add some demo security events
        const demoEvents: SecurityEvent[] = [
          {
            id: '1',
            user_id: null,
            email: 'test@example.com',
            event_type: 'login_failed',
            details: 'Failed login attempt from IP: 192.168.1.100',
            timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
          },
          {
            id: '2',
            user_id: null,
            email: 'suspicious@example.com',
            event_type: 'suspicious_activity',
            details: 'Multiple rapid login attempts detected',
            timestamp: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
          },
          {
            id: '3',
            user_id: 'demo-user-1',
            email: 'demo@example.com',
            event_type: 'login_success',
            details: 'Successful login',
            timestamp: new Date(Date.now() - 900000).toISOString() // 15 minutes ago
          },
          {
            id: '4',
            user_id: 'blocked-user-1',
            email: 'blocked@example.com',
            event_type: 'user_blocked',
            details: 'User blocked: Multiple failed login attempts',
            timestamp: new Date(Date.now() - 600000).toISOString() // 10 minutes ago
          }
        ];
        localStorage.setItem('security_events', JSON.stringify(demoEvents));
      }
      
      if (!hasBlockedUsers) {
        // Add a demo blocked user
        const demoBlockedUsers: BlockedUser[] = [
          {
            id: '1',
            user_id: 'blocked-user-1',
            email: 'blocked@example.com',
            reason: 'Multiple failed login attempts and suspicious activity',
            blocked_at: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
            blocked_by: 'Admin'
          }
        ];
        localStorage.setItem('blocked_users', JSON.stringify(demoBlockedUsers));
      }
    } catch (error) {
      console.error('Failed to initialize demo data:', error);
    }
  }

  // Block a user
  static async blockUser(userId: string, email: string, reason: string, blockedBy: string): Promise<boolean> {
    try {
      // Store blocked user in localStorage for now (since we don't have the blocked_users table yet)
      const blockedUsers = this.getBlockedUsersFromStorage();
      
      const blockedUser: BlockedUser = {
        id: Date.now().toString(),
        user_id: userId,
        email: email,
        reason: reason,
        blocked_at: new Date().toISOString(),
        blocked_by: blockedBy
      };
      
      blockedUsers.push(blockedUser);
      localStorage.setItem('blocked_users', JSON.stringify(blockedUsers));
      
      // Log the blocking event
      await this.logSecurityEvent(userId, email, 'user_blocked', `User blocked: ${reason}`);
      
      return true;
    } catch (error) {
      console.error('Failed to block user:', error);
      return false;
    }
  }

  // Unblock a user
  static async unblockUser(userId: string): Promise<boolean> {
    try {
      const blockedUsers = this.getBlockedUsersFromStorage();
      const updatedUsers = blockedUsers.filter(user => user.user_id !== userId);
      localStorage.setItem('blocked_users', JSON.stringify(updatedUsers));
      
      // Log the unblocking event
      await this.logSecurityEvent(userId, '', 'user_unblocked', 'User unblocked');
      
      return true;
    } catch (error) {
      console.error('Failed to unblock user:', error);
      return false;
    }
  }

  // Check if user is blocked
  static isUserBlocked(userId: string): boolean {
    const blockedUsers = this.getBlockedUsersFromStorage();
    return blockedUsers.some(user => user.user_id === userId);
  }

  // Get all blocked users
  static getBlockedUsers(): BlockedUser[] {
    return this.getBlockedUsersFromStorage();
  }

  // Get blocked users from localStorage
  private static getBlockedUsersFromStorage(): BlockedUser[] {
    try {
      const stored = localStorage.getItem('blocked_users');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get blocked users from storage:', error);
      return [];
    }
  }

  // Log security events
  static async logSecurityEvent(userId: string | null, email: string | null, eventType: string, details: string): Promise<void> {
    try {
      // Store security events in localStorage for now
      const events = this.getSecurityEventsFromStorage();
      
      const event: SecurityEvent = {
        id: Date.now().toString(),
        user_id: userId,
        email: email,
        event_type: eventType,
        details: details,
        timestamp: new Date().toISOString()
      };
      
      events.push(event);
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('security_events', JSON.stringify(events));
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  // Get security events
  static getSecurityEvents(): SecurityEvent[] {
    return this.getSecurityEventsFromStorage();
  }

  // Get security events from localStorage
  private static getSecurityEventsFromStorage(): SecurityEvent[] {
    try {
      const stored = localStorage.getItem('security_events');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get security events from storage:', error);
      return [];
    }
  }

  // Get security statistics
  static getSecurityStats() {
    const events = this.getSecurityEventsFromStorage();
    const blockedUsers = this.getBlockedUsersFromStorage();
    
    return {
      totalEvents: events.length,
      blockedUsers: blockedUsers.length,
      failedLogins: events.filter(e => e.event_type === 'login_failed').length,
      suspiciousActivities: events.filter(e => e.event_type === 'suspicious_activity').length,
      recentEvents: events.slice(-10).reverse()
    };
  }

  // Record failed login attempt
  static async recordFailedLogin(email: string, ipAddress?: string): Promise<void> {
    await this.logSecurityEvent(null, email, 'login_failed', `Failed login attempt from IP: ${ipAddress || 'unknown'}`);
  }

  // Record suspicious activity
  static async recordSuspiciousActivity(userId: string, email: string, activity: string): Promise<void> {
    await this.logSecurityEvent(userId, email, 'suspicious_activity', activity);
  }

  // Record successful login
  static async recordSuccessfulLogin(userId: string, email: string): Promise<void> {
    await this.logSecurityEvent(userId, email, 'login_success', 'Successful login');
  }
}

// Initialize demo data when the module is loaded
UserBlockingSystem.initializeDemoData(); 