import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryName: string | null) => void;
}

export const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryFilterProps) => {
  console.log("🎨 CategoryFilter Debug:", {
    categories: categories.map(c => ({ id: c.id, name: c.name })),
    selectedCategory
  });

  const handleCategoryChange = (categoryName: string | null) => {
    console.log("🖱️ Category clicked:", categoryName);
    onCategoryChange(categoryName);
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => handleCategoryChange(null)}
        className={cn(
          "px-6 py-3 text-sm font-medium transition-all",
          selectedCategory === null 
            ? "bg-primary text-primary-foreground shadow-lg" 
            : "hover:bg-primary/10 hover:text-primary"
        )}
      >
        All Products
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.name ? "default" : "outline"}
          onClick={() => handleCategoryChange(category.name)}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-all",
            selectedCategory === category.name 
              ? "bg-primary text-primary-foreground shadow-lg" 
              : "hover:bg-primary/10 hover:text-primary"
          )}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};
