
import { Link } from "react-router-dom";
import { useCategoriesQuery } from "@/hooks/useCategoriesQuery";

export const CategoryNavigationFooter = () => {
  const { data: categories } = useCategoriesQuery();

  const getCategorySlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground mb-3">Product Categories</h3>
      {categories?.map((category) => (
        <Link 
          key={category.id}
          to={`/products/${getCategorySlug(category.name)}`}
          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
};
