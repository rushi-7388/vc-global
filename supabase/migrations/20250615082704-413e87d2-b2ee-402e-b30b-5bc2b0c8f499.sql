
-- Create a table for contact/reach out submissions
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  message TEXT,
  submission_type TEXT NOT NULL DEFAULT 'contact', -- 'contact', 'quote', 'reach_out'
  status TEXT DEFAULT 'new', -- 'new', 'read', 'responded'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for public to insert contact submissions
CREATE POLICY "Anyone can submit contact forms" 
  ON public.contact_submissions 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for viewing submissions (you can add admin access later)
CREATE POLICY "Public can view own submissions" 
  ON public.contact_submissions 
  FOR SELECT 
  USING (true);
