import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryFilter } from "@/components/CategoryFilter";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useCategoriesQuery } from "@/hooks/useCategoriesQuery";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const { data: categories, isLoading: categoriesLoading } = useCategoriesQuery();
  const { 
    data, 
    isLoading: productsLoading,
    error 
  } = useProductsQuery({
    categoryName: selectedCategory,
    page,
    pageSize,
  });

  const products = data?.products;
  const count = data?.count ?? 0;
  const totalPages = Math.ceil(count / pageSize);
  const isLoading = categoriesLoading || productsLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">All Products</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Browse our complete collection of premium tiles, marbles, and stones.
          </p>
        </div>

        {categories && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={(category) => {
              setSelectedCategory(category);
              setPage(1); // Reset to first page on category change
            }}
          />
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading products..." />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p>Failed to load products. Please try again later.</p>
          </div>
        ) : products && products.length > 0 ? (
          <>
            <ProductGrid products={products} />
            <div className="flex justify-center items-center space-x-4 mt-12">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Products;
