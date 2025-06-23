import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryFilter } from "@/components/CategoryFilter";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { Footer } from "@/components/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { useOptimizedProductsQuery } from "@/hooks/useOptimizedProductsQuery";
import { useCategoriesQuery } from "@/hooks/useCategoriesQuery";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  console.log("🏠 Index Page Debug:", { selectedCategory });

  const { data: categories, isLoading: categoriesLoading } = useCategoriesQuery();
  const { data: products, isLoading: productsLoading } = useOptimizedProductsQuery(
    selectedCategory,
    4 
  );

  console.log("🏠 Index Page Products Debug:", {
    selectedCategory,
    productsCount: products?.length || 0,
    productsLoading,
    firstProductCategory: products?.[0]?.category?.name
  });

  const isLoading = categoriesLoading || productsLoading;

  return (
    <ErrorBoundary>
      <PerformanceMonitor />
      <div className="min-h-screen bg-background">
        <Header />
        <Hero />
        
        <section id="products" className="py-4 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4">
                Our Premium Collection
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover our exquisite range of Italian marbles, designer tiles, and natural stones. 
                Each piece is carefully selected to bring elegance and luxury to your spaces.
              </p>
            </div>

            {categories && (
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            )}

            {isLoading ? (
              <LoadingSpinner size="lg" text="Loading products..." />
            ) : products ? (
              <>
                <ProductGrid products={products} />
                <div className="text-center mt-12">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <Link to="/products">Show All Products</Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found.</p>
              </div>
            )}
          </div>
        </section>

        <AboutSection />
        <ServicesSection />
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Index;
