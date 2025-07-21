import React, { memo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LazyImage } from '@/components/LazyImage';
import { ProductImageGalleryModal } from './ProductImageGalleryModal';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price_per_sqft: number | null;
  origin_country: string | null;
  material_type: string | null;
  size_options: string[] | null;
  finish_type: string | null;
  thickness_mm: number | null;
  image_urls: string[] | null;
  is_premium: boolean | null;
  category: {
    name: string;
    description: string | null;
  } | null;
}

interface OptimizedProductCardProps {
  product: Product;
}

const OptimizedProductCard = memo(({ product }: OptimizedProductCardProps) => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const imageUrl = product.image_urls?.[0] || "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=500";

  // Helper function to get all product image URLs
  const getAllProductImageUrls = () => {
    let urls: string[] = [];
    if (product.image_urls && product.image_urls.length > 0) {
      urls = [...product.image_urls];
    }
    if ((product as any).image_files && (product as any).image_files.length > 0) {
      const base = import.meta.env.VITE_SUPABASE_URL + "/storage/v1/object/public/product-images/";
      urls = urls.concat((product as any).image_files.map((file: string) => `${base}${file}`));
    }
    if (urls.length === 0) {
      urls = [
        "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=500",
      ];
    }
    return urls;
  };
  const allImages = getAllProductImageUrls();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0 cursor-pointer relative" onClick={() => setGalleryOpen(true)}>
        <LazyImage
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={() => console.log(`Failed to load image for ${product.name}`)}
        />
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
          {product.is_premium && (
            <Badge variant="secondary" className="ml-2 shrink-0">
              Premium
            </Badge>
          )}
        </div>
        
        {product.description && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="space-y-2 text-sm">
          {/* {product.price_per_sqft && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price per sq ft:</span>
              <span className="font-medium">₹{product.price_per_sqft}</span>
            </div>
          )} */}
          
          {product.material_type && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Material:</span>
              <span>{product.material_type}</span>
            </div>
          )}
          
          {product.origin_country && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Origin:</span>
              <span>{product.origin_country}</span>
            </div>
          )}
        </div>
      </CardContent>
      <ProductImageGalleryModal
        images={allImages}
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
      />
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return prevProps.product.id === nextProps.product.id &&
         prevProps.product.name === nextProps.product.name &&
         prevProps.product.price_per_sqft === nextProps.product.price_per_sqft;
});

OptimizedProductCard.displayName = 'OptimizedProductCard';

export { OptimizedProductCard };
