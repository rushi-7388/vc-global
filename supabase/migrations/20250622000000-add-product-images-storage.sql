-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for product images
-- Allow public read access to product images
CREATE POLICY "Product images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated users to upload product images
CREATE POLICY "Authenticated users can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.uid() IS NOT NULL
);

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Users can update their uploaded product images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' 
  AND auth.uid() IS NOT NULL
);

-- Allow authenticated users to delete their uploaded images
CREATE POLICY "Users can delete their uploaded product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' 
  AND auth.uid() IS NOT NULL
);

-- Add a new column to track uploaded image files
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS image_files TEXT[] DEFAULT '{}';

-- Create a function to clean up orphaned images when products are deleted
CREATE OR REPLACE FUNCTION cleanup_product_images()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete associated images from storage when product is deleted
  IF OLD.image_files IS NOT NULL THEN
    DELETE FROM storage.objects 
    WHERE bucket_id = 'product-images' 
    AND name = ANY(OLD.image_files);
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically clean up images when products are deleted
DROP TRIGGER IF EXISTS cleanup_product_images_trigger ON public.products;
CREATE TRIGGER cleanup_product_images_trigger
  BEFORE DELETE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_product_images(); 