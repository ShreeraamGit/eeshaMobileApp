import React from 'react';
import { FlatList, View, Dimensions } from 'react-native';
import { ProductCard } from './ProductCard';
import { UI_CONFIG, ECOMMERCE_CONFIG } from '@/config/constants';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  onProductPress: (product: Product) => void;
  numColumns?: number;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductPress,
  numColumns,
  showLoadMore = false,
  onLoadMore,
  loading = false,
  refreshing = false,
  onRefresh,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const gridConfig = ECOMMERCE_CONFIG.product.grid;

  // Determine number of columns based on screen width
  const getNumColumns = (): number => {
    if (numColumns) return numColumns;

    if (screenWidth >= UI_CONFIG.BREAKPOINTS.lg.min) {
      return gridConfig.columns.desktop;
    } else if (screenWidth >= UI_CONFIG.BREAKPOINTS.md.min) {
      return gridConfig.columns.tablet;
    } else {
      return gridConfig.columns.mobile;
    }
  };

  const columns = getNumColumns();

  // Calculate item width based on screen size and gaps
  const getItemWidth = (): number => {
    let gap: number;
    if (screenWidth >= UI_CONFIG.BREAKPOINTS.lg.min) {
      gap = gridConfig.gap.desktop;
    } else if (screenWidth >= UI_CONFIG.BREAKPOINTS.md.min) {
      gap = gridConfig.gap.tablet;
    } else {
      gap = gridConfig.gap.mobile;
    }

    const totalGaps = gap * (columns + 1); // gaps between items + margins
    return (screenWidth - totalGaps) / columns;
  };

  const itemWidth = getItemWidth();

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={{ width: itemWidth }}>
      <ProductCard
        product={item}
        onPress={onProductPress}
      />
    </View>
  );

  const getItemGap = () => {
    if (screenWidth >= UI_CONFIG.BREAKPOINTS.lg.min) {
      return gridConfig.gap.desktop;
    } else if (screenWidth >= UI_CONFIG.BREAKPOINTS.md.min) {
      return gridConfig.gap.tablet;
    } else {
      return gridConfig.gap.mobile;
    }
  };

  const gap = getItemGap();

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      numColumns={columns}
      key={columns} // Force re-render when columns change
      columnWrapperStyle={columns > 1 ? {
        justifyContent: 'space-between',
        paddingHorizontal: gap / 2,
      } : undefined}
      contentContainerStyle={{
        padding: gap / 2,
        gap: gap,
      }}
      showsVerticalScrollIndicator={false}
      onEndReached={showLoadMore ? onLoadMore : undefined}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={onRefresh}
      initialNumToRender={UI_CONFIG.PERFORMANCE_CONFIG.PRODUCT_LIST_INITIAL_RENDER}
      windowSize={UI_CONFIG.PERFORMANCE_CONFIG.PRODUCT_LIST_WINDOW_SIZE}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
    />
  );
};