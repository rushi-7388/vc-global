import { supabase } from "@/integrations/supabase/client";

export const addCurrentUserAsAdmin = async () => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('No authenticated user found. Please sign in first.');
    }

    // Check if user is already an admin
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
      throw checkError;
    }

    if (existingAdmin) {
      return { success: true, message: 'User is already an admin.' };
    }

    // Add user as admin
    const { error: insertError } = await supabase
      .from('admin_users')
      .insert({
        user_id: user.id,
        email: user.email,
        role: 'admin'
      });

    if (insertError) {
      throw insertError;
    }

    return { success: true, message: 'Successfully added as admin!' };
  } catch (error) {
    console.error('Error adding admin user:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error occurred.' };
  }
}; 