import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/integrations/supabase/types";

interface ProductGridProps {
  products?: Product[];
}

export const ProductGrid = ({ products = [] }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
