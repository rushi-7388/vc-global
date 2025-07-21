import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Ruler, Layers, Crown, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ProductImageGalleryModal } from "./ProductImageGalleryModal";
import { cn } from "@/lib/utils";

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
  image_files: string[] | null;
  is_premium: boolean | null;
  category: {
    name: string;
    description: string | null;
  } | null;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard = ({ product, viewMode = 'grid' }: ProductCardProps) => {
  const [galleryOpen, setGalleryOpen] = useState(false);

  // Helper function to get the best available image URL
  const getProductImageUrl = () => {
    // First try image_urls (backward compatibility)
    if (product.image_urls && product.image_urls.length > 0) {
      return product.image_urls[0];
    }
    
    // Then try image_files (new system)
    if (product.image_files && product.image_files.length > 0) {
      // Construct URL from storage bucket
      const fileName = product.image_files[0];
      return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${fileName}`;
    }
    
    // Fallback to placeholder
    return "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=500";
  };

  const imageUrl = getProductImageUrl();

  // Helper function to get all product image URLs
  const getAllProductImageUrls = () => {
    let urls: string[] = [];
    if (product.image_urls && product.image_urls.length > 0) {
      urls = [...product.image_urls];
    }
    if (product.image_files && product.image_files.length > 0) {
      const base = import.meta.env.VITE_SUPABASE_URL + "/storage/v1/object/public/product-images/";
      urls = urls.concat(product.image_files.map((file) => `${base}${file}`));
    }
    if (urls.length === 0) {
      urls = [
        "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=500",
      ];
    }
    return urls;
  };
  const allImages = getAllProductImageUrls();

  if (viewMode === 'list') {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-card border-border">
        <div className="flex">
          {/* Image Section */}
          <div className="relative cursor-pointer flex-shrink-0" onClick={() => setGalleryOpen(true)}>
            <img
              src={imageUrl}
              alt={product.name}
              className="w-48 h-32 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {product.is_premium && (
              <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
            
            {product.category && (
              <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                {product.category.name}
              </Badge>
            )}
          </div>
          
          {/* Content Section */}
          <div className="flex-1 flex flex-col">
            <CardContent className="p-4 flex-1">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {/* {product.price_per_sqft && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-semibold text-primary">
                        ₹{product.price_per_sqft}/sqft
                      </span>
                    </div>
                  )} */}
                  
                  {product.origin_country && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{product.origin_country}</span>
                    </div>
                  )}
                  
                  {product.material_type && (
                    <div className="flex items-center">
                      <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{product.material_type}</span>
                    </div>
                  )}
                  
                  {product.thickness_mm && (
                    <div className="flex items-center">
                      <Ruler className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{product.thickness_mm}mm</span>
                    </div>
                  )}
                </div>
                
                {product.size_options && product.size_options.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Sizes: </span>
                    {product.size_options.join(', ')}
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="p-4 bg-muted/20">
              <Button asChild size="sm">
                <Link to={`/product/${product.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </div>
        </div>
        
        <ProductImageGalleryModal
          images={allImages}
          open={galleryOpen}
          onOpenChange={setGalleryOpen}
        />
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-card border-border">
      <div className="relative cursor-pointer" onClick={() => setGalleryOpen(true)}>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {product.is_premium && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
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
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            {/* {product.price_per_sqft && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price per sq ft:</span>
                <span className="font-semibold text-lg text-primary">
                  ₹{product.price_per_sqft}
                </span>
              </div>
            )} */}
            
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              {product.origin_country && (
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate">{product.origin_country}</span>
                </div>
              )}
              
              {product.material_type && (
                <div className="flex items-center">
                  <Layers className="h-3 w-3 mr-1" />
                  <span className="truncate">{product.material_type}</span>
                </div>
              )}
              
              {product.thickness_mm && (
                <div className="flex items-center">
                  <Ruler className="h-3 w-3 mr-1" />
                  <span>{product.thickness_mm}mm</span>
                </div>
              )}
              
              {product.finish_type && (
                <div className="flex items-center">
                  <span className="truncate">{product.finish_type}</span>
                </div>
              )}
            </div>
            
            {product.size_options && product.size_options.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Sizes: </span>
                {product.size_options.join(', ')}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/20">
        <Button asChild size="sm" className="w-full">
          <Link to={`/product/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
      <ProductImageGalleryModal
        images={allImages}
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
      />
    </Card>
  );
};
