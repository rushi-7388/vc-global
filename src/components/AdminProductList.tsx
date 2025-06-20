
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import { useOptimizedProductsQuery } from "@/hooks/useOptimizedProductsQuery";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdminProductListProps {
  onEditProduct: (product: any) => void;
}

export const AdminProductList = ({ onEditProduct }: AdminProductListProps) => {
  const { data: products, isLoading, refetch } = useOptimizedProductsQuery();
  const [deleteProduct, setDeleteProduct] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!deleteProduct) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', deleteProduct.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });
      
      refetch();
      setDeleteProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading products..." />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">No products found. Add your first product to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative">
              {product.image_urls && product.image_urls[0] ? (
                <img
                  src={product.image_urls[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <Eye className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              
              {product.is_premium && (
                <Badge className="absolute top-2 left-2 bg-primary">
                  Premium
                </Badge>
              )}
              
              {!product.in_stock && (
                <Badge variant="destructive" className="absolute top-2 right-2">
                  Out of Stock
                </Badge>
              )}
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
              
              {product.description && (
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}
              
              <div className="space-y-2 mb-4 text-sm">
                {product.price_per_sqft && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">₹{product.price_per_sqft}/sq ft</span>
                  </div>
                )}
                
                {product.material_type && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Material:</span>
                    <span>{product.material_type}</span>
                  </div>
                )}
                
                {product.origin_country && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Origin:</span>
                    <span>{product.origin_country}</span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEditProduct(product)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeleteProduct(product)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteProduct?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
