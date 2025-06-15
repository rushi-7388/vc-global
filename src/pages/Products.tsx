
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useProductsQuery } from "@/hooks/useProductsQuery";

const Products = () => {
  const { data: products, isLoading, error } = useProductsQuery();

  if (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <ErrorBoundary>
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
            <LoadingSpinner size="lg" text="Loading products..." />
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-destructive text-lg">Failed to load products. Please try again.</p>
            </div>
          ) : (
            <ProductGrid products={products || []} />
          )}
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Products;
