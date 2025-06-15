
import { ProductCard } from "@/components/ProductCard";

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
