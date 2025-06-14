
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Ruler, Layers, Crown, ShoppingCart } from "lucide-react";

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

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const imageUrl = product.image_urls?.[0] || "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=500";

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {product.is_premium && (
          <Badge className="absolute top-3 left-3 bg-yellow-500 text-white">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        )}
        
        {product.category && (
          <Badge variant="secondary" className="absolute top-3 right-3">
            {product.category.name}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="space-y-2 mb-4">
          {product.origin_country && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-blue-500" />
              Origin: {product.origin_country}
            </div>
          )}
          
          {product.thickness_mm && (
            <div className="flex items-center text-sm text-gray-600">
              <Layers className="h-4 w-4 mr-2 text-blue-500" />
              Thickness: {product.thickness_mm}mm
            </div>
          )}
          
          {product.size_options && product.size_options.length > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <Ruler className="h-4 w-4 mr-2 text-blue-500" />
              Sizes: {product.size_options.slice(0, 2).join(", ")}
              {product.size_options.length > 2 && "..."}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          {product.price_per_sqft && (
            <div>
              <span className="text-2xl font-bold text-blue-600">
                ₹{product.price_per_sqft}
              </span>
              <span className="text-sm text-gray-500 ml-1">/sq ft</span>
            </div>
          )}
          
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Quote
          </Button>
        </div>
        
        {product.finish_type && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Finish: {product.finish_type}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
