
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminProductList } from "@/components/AdminProductList";
import { ProductForm } from "@/components/ProductForm";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Navigate } from "react-router-dom";

const AdminProducts = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { data: isAdmin, isLoading } = useAdminCheck();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking permissions..." />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/products" replace />;
  }

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Product Management</h1>
            <p className="text-muted-foreground">Add, edit, and manage your products</p>
          </div>
          <Button onClick={handleAddProduct} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {showForm ? (
          <ProductForm 
            product={editingProduct} 
            onClose={handleCloseForm}
          />
        ) : (
          <AdminProductList onEditProduct={handleEditProduct} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminProducts;
