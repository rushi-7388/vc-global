import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductSearch } from "@/components/ProductSearch";
import { ProductFilters, FilterOptions } from "@/components/ProductFilters";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useCategoriesQuery } from "@/hooks/useCategoriesQuery";
import { useMaterialTypesQuery } from "@/hooks/useMaterialTypesQuery";
import { useMaxPriceQuery } from "@/hooks/useMaxPriceQuery";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Grid, List, Filter as FilterIcon } from "lucide-react";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 12;

  // Get data
  const { data: categories, isLoading: categoriesLoading } = useCategoriesQuery();
  const { data: materialTypes, isLoading: materialTypesLoading } = useMaterialTypesQuery();
  const { data: maxPrice, isLoading: maxPriceLoading } = useMaxPriceQuery();

  // Initialize filters
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 100],
    materialTypes: [],
    sortBy: 'name',
    inStockOnly: false
  });

  // Update price range when max price is loaded
  useEffect(() => {
    if (maxPrice && filters.priceRange[1] === 100) {
      setFilters(prev => ({
        ...prev,
        priceRange: [0, maxPrice]
      }));
    }
  }, [maxPrice, filters.priceRange]);

  const { 
    data, 
    isLoading: productsLoading,
    error 
  } = useProductsQuery({
    categoryName: selectedCategory,
    page,
    pageSize,
    search,
    filters,
  });

  const products = data?.products;
  const count = data?.count ?? 0;
  const totalPages = Math.ceil(count / pageSize);
  const isLoading = categoriesLoading || productsLoading || materialTypesLoading || maxPriceLoading;

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1);
  };

  const handleCategoryChange = (categoryName: string | null) => {
    setSelectedCategory(categoryName);
    setPage(1);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPage(1);
  };

  const resetAllFilters = () => {
    setSelectedCategory(null);
    setSearch("");
    setFilters({
      priceRange: [0, maxPrice || 100],
      materialTypes: [],
      sortBy: 'name',
      inStockOnly: false
    });
    setPage(1);
  };

  const hasActiveFilters = 
    selectedCategory || 
    search || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < (maxPrice || 100) ||
    filters.materialTypes.length > 0 ||
    filters.inStockOnly ||
    filters.sortBy !== 'name';

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

        {/* Search and Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <ProductSearch
              value={search}
              onChange={setSearch}
              onSearch={handleSearch}
              placeholder="Search products by name, description, or material..."
            />
          </div>

          {/* Category Filter */}
          {categories && (
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          )}

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Results Info */}
            <div className="text-sm text-muted-foreground">
              {!isLoading && (
                <>
                  {count} product{count !== 1 ? 's' : ''} found
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetAllFilters}
                      className="ml-2 text-xs"
                    >
                      Clear all filters
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <FilterIcon className="h-4 w-4" />
                Filters
              </Button>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && materialTypes && maxPrice && (
          <div className="mb-8 p-6 bg-muted/30 rounded-lg">
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              availableMaterialTypes={materialTypes}
              maxPrice={maxPrice}
            />
          </div>
        )}

        {/* Products Grid */}
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
            <ProductGrid 
              products={products} 
              viewMode={viewMode}
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
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
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              {hasActiveFilters 
                ? "No products match your current filters. Try adjusting your search criteria."
                : "No products found in this category."
              }
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={resetAllFilters}
                className="mt-4"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Products;
