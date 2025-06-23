import { betterAuth } from "better-auth"
import { env } from "@/config/env"
import { supabase } from '@/integrations/supabase/client';
import { UserBlockingSystem } from '@/utils/userBlocking';

export const auth = betterAuth({
  database: {
    provider: "postgres",
    url: `postgresql://postgres.${env.SUPABASE_URL.split('//')[1].split('.')[0]}:${env.SUPABASE_ANON_KEY}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID || "",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!env.GOOGLE_CLIENT_ID && !!env.GOOGLE_CLIENT_SECRET,
    },
  },
  advanced: {
    generateId: false,
  },
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user

export const signIn = async (email: string, password: string) => {
  try {
    // Check if user is blocked before attempting login
    const blockedUsers = UserBlockingSystem.getBlockedUsers();
    const isBlocked = blockedUsers.some(user => user.email === email);
    
    if (isBlocked) {
      await UserBlockingSystem.recordFailedLogin(email, 'Blocked user attempt');
      throw new Error('This account has been blocked. Please contact support.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Record failed login attempt
      await UserBlockingSystem.recordFailedLogin(email);
      throw error;
    }

    if (data.user) {
      // Record successful login
      await UserBlockingSystem.recordSuccessfulLogin(data.user.id, email);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error };
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    // Check if user is blocked before attempting registration
    const blockedUsers = UserBlockingSystem.getBlockedUsers();
    const isBlocked = blockedUsers.some(user => user.email === email);
    
    if (isBlocked) {
      await UserBlockingSystem.recordFailedLogin(email, 'Blocked user registration attempt');
      throw new Error('This email has been blocked. Please contact support.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      // Record failed registration attempt
      await UserBlockingSystem.recordFailedLogin(email, 'Registration failed');
      throw error;
    }

    if (data.user) {
      // Record successful registration
      await UserBlockingSystem.logSecurityEvent(data.user.id, email, 'registration_success', 'New user registration');
    }

    return { data, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('Get current user error:', error);
    return { user: null, error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    // Check if user is blocked before allowing password reset
    const blockedUsers = UserBlockingSystem.getBlockedUsers();
    const isBlocked = blockedUsers.some(user => user.email === email);
    
    if (isBlocked) {
      await UserBlockingSystem.recordFailedLogin(email, 'Blocked user password reset attempt');
      throw new Error('This account has been blocked. Please contact support.');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?reset=true`,
    });

    if (error) {
      await UserBlockingSystem.recordFailedLogin(email, 'Password reset failed');
      throw error;
    }

    // Record password reset request
    await UserBlockingSystem.logSecurityEvent(null, email, 'password_reset_requested', 'Password reset email sent');

    return { error: null };
  } catch (error) {
    console.error('Reset password error:', error);
    return { error };
  }
};
