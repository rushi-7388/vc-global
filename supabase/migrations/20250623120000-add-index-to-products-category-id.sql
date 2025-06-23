-- To enhance query performance when filtering products by category,
-- this migration adds an index to the 'category_id' column in the 'products' table.
-- This is crucial for maintaining a responsive user experience as the product catalog grows.

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_id ON public.products(category_id); 