import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products?: Product[];
  viewMode?: 'grid' | 'list';
}

export const ProductGrid = ({ products = [], viewMode = 'grid' }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "gap-6",
      viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
        : "flex flex-col space-y-4"
    )}>
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};
