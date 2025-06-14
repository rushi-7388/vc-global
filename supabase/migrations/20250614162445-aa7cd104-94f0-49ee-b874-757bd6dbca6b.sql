
-- Create categories table for organizing tiles and marbles
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create products table for tiles and marbles
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  price_per_sqft DECIMAL(10,2),
  origin_country TEXT,
  material_type TEXT, -- 'marble', 'tile', 'granite', 'natural_stone'
  size_options TEXT[], -- Array of size options like '12x12', '24x24', etc.
  finish_type TEXT, -- 'polished', 'honed', 'brushed', etc.
  thickness_mm INTEGER,
  image_urls TEXT[], -- Array of product image URLs
  is_premium BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quotation requests table
CREATE TABLE public.quotation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id),
  project_name TEXT,
  project_type TEXT, -- 'residential', 'commercial', 'industrial'
  total_area_sqft DECIMAL(10,2),
  preferred_budget DECIMAL(12,2),
  timeline TEXT,
  additional_notes TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'quoted', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quotation items table (which products are requested in each quote)
CREATE TABLE public.quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID REFERENCES public.quotation_requests(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity_sqft DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert sample categories
INSERT INTO public.categories (name, description) VALUES
('Italian Marble', 'Premium marble imported directly from Italy including Carrara and Calacatta'),
('Designer Tiles', 'Contemporary and classic tile designs for modern spaces'),
('Natural Stone', 'Authentic natural stones including granite, sandstone, and slate'),
('Premium Ceramics', 'High-quality ceramic tiles for various applications');

-- Insert sample products
INSERT INTO public.products (name, description, category_id, price_per_sqft, origin_country, material_type, size_options, finish_type, thickness_mm, is_premium) VALUES
('Carrara White Marble', 'Classic white marble with subtle grey veining from Carrara, Italy', 
 (SELECT id FROM public.categories WHERE name = 'Italian Marble'), 
 85.00, 'Italy', 'marble', ARRAY['12x12', '18x18', '24x24'], 'polished', 18, true),

('Calacatta Gold Marble', 'Luxurious white marble with bold gold veining', 
 (SELECT id FROM public.categories WHERE name = 'Italian Marble'), 
 120.00, 'Italy', 'marble', ARRAY['12x12', '24x24', '36x36'], 'polished', 20, true),

('Modern Grey Porcelain', 'Contemporary grey porcelain tiles perfect for minimalist designs', 
 (SELECT id FROM public.categories WHERE name = 'Designer Tiles'), 
 25.00, 'India', 'tile', ARRAY['12x24', '24x24', '24x48'], 'matte', 10, false),

('Black Galaxy Granite', 'Premium black granite with golden speckles', 
 (SELECT id FROM public.categories WHERE name = 'Natural Stone'), 
 45.00, 'India', 'granite', ARRAY['12x12', '18x18', '24x24'], 'polished', 15, true),

('Travertine Beige', 'Natural travertine with warm beige tones', 
 (SELECT id FROM public.categories WHERE name = 'Natural Stone'), 
 35.00, 'Turkey', 'natural_stone', ARRAY['12x12', '16x16', '18x18'], 'honed', 12, false);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to categories and products
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- Create policies for customers (only own data)
CREATE POLICY "Users can view own customer data" ON public.customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own customer data" ON public.customers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own customer data" ON public.customers FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for quotation requests (only own data)
CREATE POLICY "Users can view own quotations" ON public.quotation_requests FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create quotations" ON public.quotation_requests FOR INSERT WITH CHECK (
  customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update own quotations" ON public.quotation_requests FOR UPDATE USING (
  customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid())
);

-- Create policies for quotation items
CREATE POLICY "Users can view own quotation items" ON public.quotation_items FOR SELECT USING (
  quotation_id IN (
    SELECT qr.id FROM public.quotation_requests qr 
    JOIN public.customers c ON qr.customer_id = c.id 
    WHERE c.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert quotation items" ON public.quotation_items FOR INSERT WITH CHECK (
  quotation_id IN (
    SELECT qr.id FROM public.quotation_requests qr 
    JOIN public.customers c ON qr.customer_id = c.id 
    WHERE c.user_id = auth.uid()
  )
);
