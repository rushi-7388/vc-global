
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";

const Products = () => {
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
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Products;
