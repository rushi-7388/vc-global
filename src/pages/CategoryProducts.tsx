
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useOptimizedProductsQuery } from "@/hooks/useOptimizedProductsQuery";
import { useCategoriesQuery } from "@/hooks/useCategoriesQuery";

const CategoryProducts = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { data: categories, isLoading: categoriesLoading } = useCategoriesQuery();
  const category = categories?.find(cat => 
    cat.name.toLowerCase().replace(/\s+/g, '-') === categoryName?.toLowerCase()
  );
  
  const { data: products, isLoading: productsLoading } = useOptimizedProductsQuery(category?.id);

  const isLoading = categoriesLoading || productsLoading;

  // Map category names for display
  const getCategoryDisplayName = (name: string) => {
    const categoryMap: { [key: string]: string } = {
      'italian-marble': 'Italian Marble',
      'designer-tiles': 'Designer Tiles',
      'natural-stone': 'Natural Stone',
      'sanitary-product-and-bathroom-fittings': 'Sanitary Product and Bathroom Fittings'
    };
    return categoryMap[name] || name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const displayName = categoryName ? getCategoryDisplayName(categoryName) : 'Products';

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">{displayName}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {category?.description || `Explore our premium collection of ${displayName.toLowerCase()}.`}
            </p>
          </div>
          
          {isLoading ? (
            <LoadingSpinner size="lg" text="Loading products..." />
          ) : !category ? (
            <div className="text-center py-16">
              <p className="text-destructive text-lg">Category not found.</p>
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

export default CategoryProducts;
