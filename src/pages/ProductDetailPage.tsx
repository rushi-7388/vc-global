import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select(
            `
            *,
            category:categories(name)
          `
          )
          .eq("id", id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err: any) {
        setError("Failed to fetch product details. " + err.message);
        console.error("Fetch product error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading Product..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          Product Not Found
        </h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => window.history.back()} className="mt-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const images =
    product.image_files?.map((file: string) => getPublicUrl(file)) || [];

  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            {images.length > 0 ? (
              <img
                src={images[0]}
                alt={product.name}
                className="w-full h-auto rounded-lg shadow-lg object-cover aspect-square"
              />
            ) : (
              <div className="w-full h-auto rounded-lg bg-muted flex items-center justify-center aspect-square">
                <span>No Image</span>
              </div>
            )}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {images.slice(1, 5).map((img: string, index: number) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-auto rounded-md object-cover aspect-square cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                {product.is_premium && (
                  <Badge className="bg-primary">Premium</Badge>
                )}
                {!product.in_stock && (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
                {product.category && (
                  <Badge variant="secondary">{product.category.name}</Badge>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-primary">
                {product.name}
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              {product.description}
            </p>
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold mb-4">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-muted-foreground">Price</div>
                <div>₹{product.price_per_sqft}/sq ft</div>

                <div className="font-medium text-muted-foreground">Origin</div>
                <div>{product.origin_country}</div>

                <div className="font-medium text-muted-foreground">
                  Material
                </div>
                <div>{product.material_type}</div>

                <div className="font-medium text-muted-foreground">Finish</div>
                <div>{product.finish_type}</div>

                <div className="font-medium text-muted-foreground">
                  Thickness
                </div>
                <div>{product.thickness_mm} mm</div>

                <div className="font-medium text-muted-foreground">Sizes</div>
                <div>{product.size_options?.join(", ")}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage; 