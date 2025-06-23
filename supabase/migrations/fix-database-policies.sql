-- Fix infinite recursion in admin_users policies
-- Run this in your Supabase SQL Editor

-- Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can manage admin users" ON public.admin_users;

-- Create simpler policies that don't cause recursion
-- Allow authenticated users to view admin_users (for admin check)
CREATE POLICY "Authenticated users can view admin_users" ON public.admin_users
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow users to insert themselves as admin (for first-time setup)
CREATE POLICY "Users can insert themselves as admin" ON public.admin_users
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow admins to update admin_users (but not themselves to avoid recursion)
CREATE POLICY "Admins can update other admin_users" ON public.admin_users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.user_id = auth.uid() AND au.id != admin_users.id
    )
  );

-- Allow admins to delete other admin_users (but not themselves)
CREATE POLICY "Admins can delete other admin_users" ON public.admin_users
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.user_id = auth.uid() AND au.id != admin_users.id
    )
  );

-- Fix products policies to be simpler and avoid recursion
DROP POLICY IF EXISTS "Products created by admins are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

-- Allow everyone to view products (public access)
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

-- Allow authenticated users to manage products (we'll control access via application logic)
CREATE POLICY "Authenticated users can manage products" ON public.products
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Insert the admin user if not exists
INSERT INTO public.admin_users (user_id, email, role)
SELECT id, email, 'admin'
FROM auth.users 
WHERE email = 'myplayer4560@gmail.com'
ON CONFLICT (user_id) DO NOTHING; 