import { useState, useRef, useEffect } from 'react';
import { Search, X, Package, DollarSign } from 'lucide-react';
import { useProductSearch } from '@/hooks/useProductSearch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LazyImage } from './LazyImage';

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const ProductSearch = ({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "Search products...",
  className 
}: ProductSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: suggestions, isLoading } = useProductSearch({
    searchTerm: value,
    enabled: isOpen && value.trim().length > 0,
    limit: 6
  });

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && suggestions[focusedIndex]) {
            handleSuggestionClick(suggestions[focusedIndex]);
          } else {
            onSearch(value);
            setIsOpen(false);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, suggestions, value, onSearch]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(newValue.trim().length > 0);
    setFocusedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: any) => {
    onChange(suggestion.name);
    onSearch(suggestion.name);
    setIsOpen(false);
    setFocusedIndex(-1);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange('');
    onSearch('');
    setIsOpen(false);
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  const getImageUrl = (product: any) => {
    if (product.image_urls && product.image_urls.length > 0) {
      return product.image_urls[0];
    }
    if (product.image_files && product.image_files.length > 0) {
      return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${product.image_files[0]}`;
    }
    return '/placeholder.svg';
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <div className="flex items-center bg-background border border-input rounded-md shadow-sm px-3 py-2 focus-within:ring-2 focus-within:ring-primary transition-all">
          <Search className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(value.trim().length > 0)}
            className="bg-transparent outline-none w-full text-sm"
          />
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto mb-2"></div>
              Searching...
            </div>
          ) : suggestions && suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center gap-3",
                    focusedIndex === index && "bg-muted/50"
                  )}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-muted">
                    <LazyImage
                      src={getImageUrl(suggestion)}
                      alt={suggestion.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {suggestion.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {suggestion.category && (
                        <span className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {suggestion.category.name}
                        </span>
                      )}
                      {/* {suggestion.price_per_sqft && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ${suggestion.price_per_sqft}/sqft
                        </span>
                      )} */}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : value.trim().length > 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No products found for "{value}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}; 