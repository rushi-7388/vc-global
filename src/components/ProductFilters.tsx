import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

export interface FilterOptions {
  priceRange: [number, number];
  materialTypes: string[];
  sortBy: 'name' | 'price_low' | 'price_high' | 'newest' | 'oldest';
  inStockOnly: boolean;
}

interface ProductFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableMaterialTypes: string[];
  maxPrice: number;
  className?: string;
}

export const ProductFilters = ({
  filters,
  onFiltersChange,
  availableMaterialTypes,
  maxPrice,
  className
}: ProductFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const hasActiveFilters = 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < maxPrice ||
    filters.materialTypes.length > 0 ||
    filters.inStockOnly ||
    filters.sortBy !== 'name';

  const updateFilters = (updates: Partial<FilterOptions>) => {
    const newFilters = { ...localFilters, ...updates };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const defaultFilters: FilterOptions = {
      priceRange: [0, maxPrice],
      materialTypes: [],
      sortBy: 'name',
      inStockOnly: false
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const removeMaterialType = (materialType: string) => {
    updateFilters({
      materialTypes: localFilters.materialTypes.filter(mt => mt !== materialType)
    });
  };

  const toggleMaterialType = (materialType: string) => {
    const isSelected = localFilters.materialTypes.includes(materialType);
    updateFilters({
      materialTypes: isSelected 
        ? localFilters.materialTypes.filter(mt => mt !== materialType)
        : [...localFilters.materialTypes, materialType]
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {[
                filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0,
                filters.materialTypes.length,
                filters.inStockOnly ? 1 : 0,
                filters.sortBy !== 'name' ? 1 : 0
              ].reduce((a, b) => a + b, 0)} active
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              Clear all
            </Button>
          )}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {(filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) && (
            <Badge variant="outline" className="flex items-center gap-1">
              Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilters({ priceRange: [0, maxPrice] })}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.materialTypes.map(materialType => (
            <Badge key={materialType} variant="outline" className="flex items-center gap-1">
              {materialType}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeMaterialType(materialType)}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {filters.inStockOnly && (
            <Badge variant="outline" className="flex items-center gap-1">
              In Stock Only
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilters({ inStockOnly: false })}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}

      {/* Filter Options */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent className="space-y-6">
          {/* Sort By */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sort By</Label>
            <Select
              value={localFilters.sortBy}
              onValueChange={(value: FilterOptions['sortBy']) => updateFilters({ sortBy: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price_low">Price (Low to High)</SelectItem>
                <SelectItem value="price_high">Price (High to Low)</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Price Range: ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
            </Label>
            <Slider
              value={localFilters.priceRange}
              onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
              max={maxPrice}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>${maxPrice}</span>
            </div>
          </div>

          {/* Material Types */}
          {availableMaterialTypes.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Material Type</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableMaterialTypes.map(materialType => (
                  <div key={materialType} className="flex items-center space-x-2">
                    <Checkbox
                      id={materialType}
                      checked={localFilters.materialTypes.includes(materialType)}
                      onCheckedChange={() => toggleMaterialType(materialType)}
                    />
                    <Label htmlFor={materialType} className="text-sm font-normal">
                      {materialType}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* In Stock Only */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStockOnly"
              checked={localFilters.inStockOnly}
              onCheckedChange={(checked) => updateFilters({ inStockOnly: checked as boolean })}
            />
            <Label htmlFor="inStockOnly" className="text-sm font-normal">
              In Stock Only
            </Label>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}; 