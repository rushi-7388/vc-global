
// Environment configuration
export const env = {
  // Supabase Configuration
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url-here',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key-here',
  
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'V&C Global',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Contact Information
  COMPANY_EMAIL: import.meta.env.VITE_COMPANY_EMAIL || 'vcglobal1012@gmail.com',
  COMPANY_PHONE_1: import.meta.env.VITE_COMPANY_PHONE_1 || '+91 99786 06345',
  COMPANY_PHONE_2: import.meta.env.VITE_COMPANY_PHONE_2 || '+91 72650 55583',
  COMPANY_INSTAGRAM: import.meta.env.VITE_COMPANY_INSTAGRAM || '@vcglobal_',
  
  // Authentication Configuration
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
  
  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_CHAT_SUPPORT: import.meta.env.VITE_ENABLE_CHAT_SUPPORT === 'true',
};

// Validate required environment variables
const requiredEnvVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];

requiredEnvVars.forEach((envVar) => {
  if (!import.meta.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set in environment variables`);
  }
});
