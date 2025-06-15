
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Products = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, description)
        `);
      
      if (error) throw error;
      return data || [];
    }
  });

  if (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Our Products</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our premium collection of tiles, marbles, and sanitary products. 
            Each piece is carefully selected to ensure the highest quality and aesthetic appeal.
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Loading products...</p>
          </div>
        ) : (
          <ProductGrid products={products || []} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Products;
