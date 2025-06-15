
import React, { memo } from '@/components/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

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
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        {product.image_urls && product.image_urls.length > 0 ? (
          <img
            src={product.image_urls[0]}
            alt={product.name}
            className="w-full h-48 object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
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
          {product.price_per_sqft && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price per sq ft:</span>
              <span className="font-medium">₹{product.price_per_sqft}</span>
            </div>
          )}
          
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
    </Card>
  );
});

OptimizedProductCard.displayName = 'OptimizedProductCard';

export { OptimizedProductCard };
