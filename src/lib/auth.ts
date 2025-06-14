
import { betterAuth } from "better-auth"
import { env } from "@/config/env"

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
export type User = typeof auth.$Infer.User
