# Product Variants Implementation Guide

## 🎯 **Overview**

Your products now support **Size + Color variants** with individual stock tracking. This is the proper e-commerce structure for inventory management.

---

## 📊 **Database Structure**

### **Two-Table System:**

```
products (Parent Product)
├── id
├── name: "Saree Soie Premium"
├── base_price: 299.99
├── description
├── images[]
└── category

product_variants (Size + Color Combinations)
├── id
├── product_id (FK to products)
├── sku: "SAREE-SOIE-M-RED"
├── size: "M"
├── color: "Rouge"
├── color_hex: "#FF0000"
├── price: 299.99 (or NULL = use base_price)
├── stock_quantity: 15
├── image_url (optional, color-specific)
└── active
```

### **How It Works:**

1. **Parent Product** = General info (name, description, base price)
2. **Variants** = Each size/color combo with its own:
   - SKU for tracking
   - Stock quantity
   - Optional price override
   - Optional color-specific image

---

## 🚀 **Setup Instructions**

### **Step 1: Run the Variants Schema (5 min)**

```bash
1. Open file: docs/database-schema-with-variants.sql
2. Copy ALL content
3. Paste in Supabase SQL Editor
4. Click "Run"
5. Verify tables created:
   - products ✓
   - product_variants ✓
   - orders ✓
   - order_tracking ✓
   - inventory_reservations ✓
```

### **Step 2: Add Your First Product (10 min)**

```sql
-- 1. Insert parent product
INSERT INTO products (name, description, base_price, category, images)
VALUES (
  'Saree Soie Premium',
  'Saree traditionnel en soie pure avec broderie dorée',
  299.99,
  'Sarees',
  ARRAY['https://picsum.photos/400/533?random=1']
)
RETURNING id; -- Copy this ID!

-- 2. Insert variants (replace 'YOUR-PRODUCT-ID' with ID from step 1)
INSERT INTO product_variants (product_id, sku, size, color, color_hex, stock_quantity, image_url)
VALUES
-- Small sizes
('YOUR-PRODUCT-ID', 'SAREE-SOIE-S-RED', 'S', 'Rouge', '#FF0000', 10, 'https://picsum.photos/400/533?random=1'),
('YOUR-PRODUCT-ID', 'SAREE-SOIE-S-BLUE', 'S', 'Bleu', '#0000FF', 8, 'https://picsum.photos/400/533?random=2'),
('YOUR-PRODUCT-ID', 'SAREE-SOIE-S-GREEN', 'S', 'Vert', '#00FF00', 5, 'https://picsum.photos/400/533?random=3'),

-- Medium sizes
('YOUR-PRODUCT-ID', 'SAREE-SOIE-M-RED', 'M', 'Rouge', '#FF0000', 15, 'https://picsum.photos/400/533?random=1'),
('YOUR-PRODUCT-ID', 'SAREE-SOIE-M-BLUE', 'M', 'Bleu', '#0000FF', 12, 'https://picsum.photos/400/533?random=2'),
('YOUR-PRODUCT-ID', 'SAREE-SOIE-M-GREEN', 'M', 'Vert', '#00FF00', 10, 'https://picsum.photos/400/533?random=3'),

-- Large sizes
('YOUR-PRODUCT-ID', 'SAREE-SOIE-L-RED', 'L', 'Rouge', '#FF0000', 20, 'https://picsum.photos/400/533?random=1'),
('YOUR-PRODUCT-ID', 'SAREE-SOIE-L-BLUE', 'L', 'Bleu', '#0000FF', 18, 'https://picsum.photos/400/533?random=2'),
('YOUR-PRODUCT-ID', 'SAREE-SOIE-L-GREEN', 'L', 'Vert', '#00FF00', 15, 'https://picsum.photos/400/533?random=3');
```

---

## 💻 **Using Variants in Your App**

### **Services Created:**

1. **`variantsService.ts`** ✅ (NEW!)
   - Get product with variants
   - Get available sizes/colors
   - Check stock
   - Get variant by ID/SKU

### **Example Usage:**

```typescript
import { variantsService } from '@/services/api/variantsService';
import { useCartStore } from '@/store/cartStore';

// In Product Detail Screen:
const ProductDetailScreen = ({ productId }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const { addItem } = useCartStore();

  // 1. Load product with variants
  useEffect(() => {
    const loadProduct = async () => {
      const product = await variantsService.getProductWithVariants(productId);
      setProduct(product);
    };
    loadProduct();
  }, [productId]);

  // 2. When user selects size and color, find the variant
  useEffect(() => {
    if (selectedSize && selectedColor) {
      const variant = await variantsService.getVariant(
        productId,
        selectedSize,
        selectedColor
      );
      setSelectedVariant(variant);
    }
  }, [selectedSize, selectedColor]);

  // 3. Add to cart with variant info
  const handleAddToCart = () => {
    if (!selectedVariant) {
      Alert.alert('Veuillez sélectionner une taille et une couleur');
      return;
    }

    if (selectedVariant.stock_quantity === 0) {
      Alert.alert('Rupture de stock');
      return;
    }

    addItem({
      variant_id: selectedVariant.id,
      product_id: product.id,
      name: product.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      sku: selectedVariant.sku,
      price: selectedVariant.price || product.base_price,
      quantity: 1,
      image_url: selectedVariant.image_url || product.images[0],
      stock_quantity: selectedVariant.stock_quantity,
    });

    Alert.alert('Ajouté au panier!');
  };

  return (
    <View>
      {/* Size selector */}
      <Text>Taille:</Text>
      <FlatList
        horizontal
        data={product?.available_sizes}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedSize(item)}
            style={[
              styles.sizeButton,
              selectedSize === item && styles.selected
            ]}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Color selector */}
      <Text>Couleur:</Text>
      <FlatList
        horizontal
        data={product?.available_colors}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedColor(item.color)}
            style={[
              styles.colorButton,
              { backgroundColor: item.color_hex || '#ccc' },
              selectedColor === item.color && styles.selected
            ]}
          >
            <Text>{item.color}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Stock status */}
      {selectedVariant && (
        <Text>
          {selectedVariant.stock_quantity > 0
            ? `${selectedVariant.stock_quantity} en stock`
            : 'Rupture de stock'}
        </Text>
      )}

      {/* Price display */}
      <Text>
        €{selectedVariant?.price || product?.base_price}
      </Text>

      {/* Add to cart button */}
      <Button
        title="Ajouter au panier"
        onPress={handleAddToCart}
        disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
      />
    </View>
  );
};
```

---

## 🛒 **Cart with Variants**

### **Updated Cart Store:**

The cart now tracks variants instead of products:

```typescript
// OLD (before variants):
{
  product_id: '123',
  name: 'Saree',
  price: 299.99,
  quantity: 2
}

// NEW (with variants):
{
  variant_id: 'var-123',
  product_id: '123',
  name: 'Saree Soie Premium',
  size: 'M',
  color: 'Rouge',
  sku: 'SAREE-SOIE-M-RED',
  price: 299.99,
  quantity: 2,
  image_url: 'https://...',
  stock_quantity: 15
}
```

### **Cart Features:**

- ✅ Different variants of same product = separate cart items
- ✅ Same variant added twice = quantity increases
- ✅ Stock validation per variant
- ✅ Display size/color in cart
- ✅ Variant-specific images

---

## 📦 **Stock Management**

### **Automatic Stock Reduction:**

When order is paid, stock is automatically reduced:

```sql
-- This trigger runs automatically:
CREATE TRIGGER update_stock_on_payment
    AFTER UPDATE OF payment_status ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_after_payment();
```

### **Stock Check Function:**

```typescript
// Check if variant has enough stock
const hasStock = await variantsService.checkStock(variantId, quantity);

if (!hasStock) {
  Alert.alert('Stock insuffisant');
  return;
}
```

### **Low Stock Alerts:**

```typescript
// Get variants that need reordering
const lowStockItems = await variantsService.getLowStockVariants();

// Returns variants where: stock_quantity <= low_stock_threshold
lowStockItems.forEach(item => {
  console.log(`LOW STOCK: ${item.product_name} - ${item.sku}`);
});
```

---

## 🎨 **Admin Dashboard (Day 4)**

### **Product Management Flow:**

1. **Add Product:**
   ```typescript
   // Create parent product first
   const product = await supabase
     .from('products')
     .insert({
       name: 'New Saree',
       base_price: 299.99,
       category: 'Sarees'
     })
     .select()
     .single();

   // Then add variants
   const variants = [
     { product_id: product.id, sku: 'SAR-S-RED', size: 'S', color: 'Rouge', ... },
     { product_id: product.id, sku: 'SAR-M-RED', size: 'M', color: 'Rouge', ... },
   ];

   await supabase.from('product_variants').insert(variants);
   ```

2. **Update Stock:**
   ```typescript
   await supabase
     .from('product_variants')
     .update({ stock_quantity: 20 })
     .eq('id', variantId);
   ```

3. **View Low Stock:**
   ```typescript
   const lowStock = await variantsService.getLowStockVariants();
   // Display alert in admin dashboard
   ```

---

## ✅ **Testing Checklist**

### **Database Setup:**
- [ ] Schema deployed successfully
- [ ] Tables created (products, product_variants, orders, order_tracking)
- [ ] Triggers working (order number generation, stock updates)
- [ ] RLS policies active

### **Product with Variants:**
- [ ] Can add parent product
- [ ] Can add multiple variants (size/color combos)
- [ ] Each variant has unique SKU
- [ ] Stock tracked per variant
- [ ] Can query product with all variants

### **Mobile App:**
- [ ] Product detail shows size selector
- [ ] Product detail shows color selector
- [ ] Selected variant shows correct stock
- [ ] Can add variant to cart
- [ ] Cart shows size/color for each item
- [ ] Different variants = separate cart items
- [ ] Same variant = quantity increases

### **Stock Management:**
- [ ] Stock reduces when order is paid
- [ ] Out of stock variants can't be added to cart
- [ ] Low stock threshold works
- [ ] Can check variant stock availability

---

## 🔍 **Useful Queries**

### **Get Product with Variants:**
```sql
SELECT
    p.*,
    json_agg(
        json_build_object(
            'id', pv.id,
            'sku', pv.sku,
            'size', pv.size,
            'color', pv.color,
            'stock_quantity', pv.stock_quantity
        )
    ) as variants
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.id = 'your-product-id'
GROUP BY p.id;
```

### **Check Available Sizes:**
```sql
SELECT DISTINCT size
FROM product_variants
WHERE product_id = 'your-product-id'
AND active = true
AND stock_quantity > 0
ORDER BY size;
```

### **Get Low Stock Items:**
```sql
SELECT
    p.name,
    pv.sku,
    pv.size,
    pv.color,
    pv.stock_quantity,
    pv.low_stock_threshold
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
WHERE pv.stock_quantity <= pv.low_stock_threshold
AND pv.active = true;
```

---

## 🚨 **Common Issues & Solutions**

### **Issue: Duplicate variants**
```sql
-- Check for duplicates:
SELECT product_id, size, color, COUNT(*)
FROM product_variants
GROUP BY product_id, size, color
HAVING COUNT(*) > 1;

-- Unique constraint prevents this:
UNIQUE(product_id, size, color)
```

### **Issue: Stock goes negative**
```sql
-- Check constraint prevents this:
CHECK (stock_quantity >= 0)
```

### **Issue: Variant not found**
```typescript
// Always check if variant exists before adding to cart
const variant = await variantsService.getVariant(productId, size, color);
if (!variant) {
  Alert.alert('Cette combinaison n\'est pas disponible');
  return;
}
```

---

## 📊 **Data Example**

### **Parent Product:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Saree Soie Premium",
  "description": "Saree traditionnel en soie pure",
  "base_price": 299.99,
  "category": "Sarees",
  "images": ["https://example.com/saree.jpg"],
  "active": true
}
```

### **Variants:**
```json
[
  {
    "id": "variant-1",
    "product_id": "550e8400-e29b-41d4-a716-446655440000",
    "sku": "SAREE-SOIE-S-RED",
    "size": "S",
    "color": "Rouge",
    "color_hex": "#FF0000",
    "price": null, // uses base_price
    "stock_quantity": 10,
    "image_url": "https://example.com/saree-red.jpg"
  },
  {
    "id": "variant-2",
    "product_id": "550e8400-e29b-41d4-a716-446655440000",
    "sku": "SAREE-SOIE-M-BLUE",
    "size": "M",
    "color": "Bleu",
    "color_hex": "#0000FF",
    "price": 319.99, // custom price for this variant
    "stock_quantity": 15,
    "image_url": "https://example.com/saree-blue.jpg"
  }
]
```

---

## 🎯 **Next Steps**

1. **Today:** Run `database-schema-with-variants.sql`
2. **Today:** Add 1 test product with 3-5 variants
3. **Day 2:** Update ProductDetail screen to use variants
4. **Day 3:** Test cart with variants
5. **Day 4:** Build admin dashboard to manage variants

---

**Your inventory system is now production-ready!** 🚀
