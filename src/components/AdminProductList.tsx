import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import { useAdminProductsQuery } from "@/hooks/useAdminProductsQuery";
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
  const { data: products, isLoading, error, refetch } = useAdminProductsQuery();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const { toast } = useToast();

  console.log('Admin Products Data:', { products, isLoading, error });

  const handleDeleteClick = (product: any) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully.",
      });

      refetch();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // Helper function to get the best available image URL
  const getProductImageUrl = (product: any) => {
    // First try image_urls (backward compatibility)
    if (product.image_urls && product.image_urls.length > 0) {
      return product.image_urls[0];
    }
    
    // Then try image_files (new system)
    if (product.image_files && product.image_files.length > 0) {
      // Construct URL from storage bucket
      const fileName = product.image_files[0];
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      return data.publicUrl;
    }
    
    // Fallback to placeholder
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" text="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load products. Please try again.</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const imageUrl = getProductImageUrl(product);
          
          return (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative">
                {imageUrl ? (
                  <img
                    src={imageUrl}
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
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                  
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      ₹{product.price_per_sqft || 'N/A'}/sq ft
                    </span>
                    <span className="text-muted-foreground">
                      {product.category?.name || 'No Category'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {product.image_urls?.length || product.image_files?.length || 0} images
                    </span>
                    <span>
                      {new Date(product.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
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
                    onClick={() => handleDeleteClick(product)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone and will also remove all associated images.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
