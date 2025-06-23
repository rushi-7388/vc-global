import { supabase } from "@/integrations/supabase/client"

export const signIn = {
  email: async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }
}

export const signUp = {
  email: async ({ email, password, name }: { email: string; password: string; name: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    })
    if (error) throw error
    return data
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const useSession = () => {
  // This is a simplified hook - in a real app you'd want to use React hooks
  // For now, we'll use a basic implementation
  return {
    data: null,
    isPending: false
  }
}

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}
