import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useCategoriesQuery } from "@/hooks/useCategoriesQuery";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { FileUpload } from "./FileUpload";
import { UploadedFile } from "@/utils/fileUpload";

interface ProductFormProps {
  product?: any;
  onClose: () => void;
}

export const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_per_sqft: '',
    origin_country: '',
    material_type: '',
    size_options: '',
    finish_type: '',
    thickness_mm: '',
    is_premium: false,
    in_stock: true,
    category_id: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: categories } = useCategoriesQuery();
  const { toast } = useToast();

  useEffect(() => {
    if (product && categories && categories.length > 0) {
      // Try to find the correct category id
      let categoryId = product.category_id;
      if (!categoryId && product.category && product.category.id) {
        categoryId = product.category.id;
      }
      // If still not found, try to match by name (for legacy data)
      if (!categoryId && product.category && product.category.name) {
        const match = categories.find(cat => cat.name === product.category.name);
        if (match) categoryId = match.id;
      }
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price_per_sqft: product.price_per_sqft?.toString() || '',
        origin_country: product.origin_country || '',
        material_type: product.material_type || '',
        size_options: product.size_options?.join(', ') || '',
        finish_type: product.finish_type || '',
        thickness_mm: product.thickness_mm?.toString() || '',
        is_premium: product.is_premium || false,
        in_stock: product.in_stock !== false,
        category_id: categoryId || ''
      });

      // Convert existing image_urls to UploadedFile format for editing
      if (product.image_urls && product.image_urls.length > 0) {
        const existingFiles: UploadedFile[] = product.image_urls.map((url: string, index: number) => ({
          name: `existing-image-${index}`,
          url: url,
          size: 0,
          type: 'image/jpeg'
        }));
        setUploadedFiles(existingFiles);
      }
    }
  }, [product, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Validate that at least one image is uploaded
      if (uploadedFiles.length === 0) {
        throw new Error('Please upload at least one product image');
      }

      const productData = {
        name: formData.name,
        description: formData.description || null,
        price_per_sqft: formData.price_per_sqft ? parseFloat(formData.price_per_sqft) : null,
        origin_country: formData.origin_country || null,
        material_type: formData.material_type || null,
        size_options: formData.size_options ? formData.size_options.split(',').map(s => s.trim()) : null,
        finish_type: formData.finish_type || null,
        thickness_mm: formData.thickness_mm ? parseInt(formData.thickness_mm) : null,
        image_urls: uploadedFiles.map(file => file.url), // Store URLs for backward compatibility
        image_files: uploadedFiles.map(file => file.name), // Store file names for new system
        is_premium: formData.is_premium,
        in_stock: formData.in_stock,
        category_id: formData.category_id || null,
        created_by: user.id,
        updated_by: user.id
      };

      let error;
      if (product) {
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert(productData);
        error = insertError;
      }

      if (error) {
        console.error('Database error:', error);
        
        // Handle specific policy errors
        if (error.code === '42P17') {
          throw new Error('Database policy error. Please contact support.');
        } else if (error.code === '42501') {
          throw new Error('Permission denied. You may not have admin access.');
        } else {
          throw error;
        }
      }

      toast({
        title: "Success",
        description: `Product ${product ? 'updated' : 'created'} successfully!`,
      });
      
      onClose();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${product ? 'update' : 'create'} product. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per sq ft</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price_per_sqft}
                onChange={(e) => setFormData({ ...formData, price_per_sqft: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin">Origin Country</Label>
              <Input
                id="origin"
                value={formData.origin_country}
                onChange={(e) => setFormData({ ...formData, origin_country: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Material Type</Label>
              <Input
                id="material"
                value={formData.material_type}
                onChange={(e) => setFormData({ ...formData, material_type: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="finish">Finish Type</Label>
              <Input
                id="finish"
                value={formData.finish_type}
                onChange={(e) => setFormData({ ...formData, finish_type: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thickness">Thickness (mm)</Label>
              <Input
                id="thickness"
                type="number"
                value={formData.thickness_mm}
                onChange={(e) => setFormData({ ...formData, thickness_mm: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sizes">Size Options (comma separated)</Label>
              <Input
                id="sizes"
                value={formData.size_options}
                onChange={(e) => setFormData({ ...formData, size_options: e.target.value })}
                placeholder="e.g., 12x12, 24x24, 36x36"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* File Upload Component */}
          <FileUpload
            onFilesUploaded={handleFilesUploaded}
            existingFiles={uploadedFiles}
            maxFiles={5}
          />

          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="premium"
                checked={formData.is_premium}
                onCheckedChange={(checked) => setFormData({ ...formData, is_premium: !!checked })}
              />
              <Label htmlFor="premium">Premium Product</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="instock"
                checked={formData.in_stock}
                onCheckedChange={(checked) => setFormData({ ...formData, in_stock: !!checked })}
              />
              <Label htmlFor="instock">In Stock</Label>
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
              {isSubmitting ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
