
-- Create a table for consultation requests
CREATE TABLE public.consultation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_date DATE,
  preferred_time TIME,
  consultation_type TEXT DEFAULT 'general',
  message TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for public to insert consultation requests
CREATE POLICY "Anyone can submit consultation requests" 
  ON public.consultation_requests 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for viewing consultation requests (you can add admin access later)
CREATE POLICY "Public can view own consultation requests" 
  ON public.consultation_requests 
  FOR SELECT 
  USING (true);
