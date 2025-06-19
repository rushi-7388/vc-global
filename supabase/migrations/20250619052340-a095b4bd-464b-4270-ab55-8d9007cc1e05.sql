
-- Update the products table to change "Premium Ceramics" to "Sanitary Product and Bathroom Fittings"
UPDATE products 
SET material_type = 'Sanitary Product and Bathroom Fittings' 
WHERE material_type = 'Premium Ceramics';

-- Update categories table if there's a "Premium Ceramics" category
UPDATE categories 
SET name = 'Sanitary Product and Bathroom Fittings',
    description = 'High-quality sanitary products and bathroom fittings for modern spaces'
WHERE name = 'Premium Ceramics';

-- If the category doesn't exist, create it
INSERT INTO categories (name, description) 
SELECT 'Sanitary Product and Bathroom Fittings', 'High-quality sanitary products and bathroom fittings for modern spaces'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Sanitary Product and Bathroom Fittings');
