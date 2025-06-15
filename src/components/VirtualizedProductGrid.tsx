
import { FixedSizeGrid as Grid } from 'react-window';
import { OptimizedProductCard } from '@/components/OptimizedProductCard';
import { useCallback } from 'react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price_per_sqft: number | null;
  origin_country: string | null;
  material_type: string | null;
  size_options: string[] | null;
  finish_type: string | null;
  thickness_mm: number | null;
  image_urls: string[] | null;
  is_premium: boolean | null;
  category: {
    name: string;
    description: string | null;
  } | null;
}

interface VirtualizedProductGridProps {
  products: Product[];
  containerWidth?: number;
  containerHeight?: number;
}

export const VirtualizedProductGrid = ({ 
  products, 
  containerWidth = 1200, 
  containerHeight = 800 
}: VirtualizedProductGridProps) => {
  const columnCount = Math.floor(containerWidth / 300); // 300px per card
  const rowCount = Math.ceil(products.length / columnCount);

  const Cell = useCallback(({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * columnCount + columnIndex;
    const product = products[index];

    if (!product) return null;

    return (
      <div style={{ ...style, padding: '8px' }}>
        <OptimizedProductCard product={product} />
      </div>
    );
  }, [products, columnCount]);

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No products found in this category.</p>
      </div>
    );
  }

  return (
    <Grid
      columnCount={columnCount}
      columnWidth={300}
      height={containerHeight}
      rowCount={rowCount}
      rowHeight={400}
      width={containerWidth}
    >
      {Cell}
    </Grid>
  );
};
