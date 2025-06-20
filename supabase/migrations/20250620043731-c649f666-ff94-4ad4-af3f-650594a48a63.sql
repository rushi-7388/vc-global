
-- Create an admin users table to manage who can add/edit products
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to view admin users
CREATE POLICY "Admins can view admin users" ON public.admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

-- Policy to allow admins to manage admin users
CREATE POLICY "Admins can manage admin users" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

-- Update products table to add admin management fields
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- Update existing products policies to only show products created by admins
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products created by admins are viewable by everyone" ON public.products
  FOR SELECT USING (
    created_by IN (
      SELECT user_id FROM public.admin_users
    )
  );

-- Policy for admins to manage products
CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

-- Insert yourself as the first admin (replace with your actual email)
-- You'll need to sign up first, then run this with your actual email
-- INSERT INTO public.admin_users (user_id, email) 
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
