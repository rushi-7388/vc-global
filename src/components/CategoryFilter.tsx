
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
  onCategoryChange: (categoryId: string | null) => void;
}

export const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onCategoryChange(null)}
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
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-all",
            selectedCategory === category.id 
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
