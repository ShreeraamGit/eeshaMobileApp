# Next.js Admin Dashboard Setup Guide

## 🎯 **Purpose**

The Next.js admin dashboard allows you to:
- Add/edit/delete products
- Upload product images
- Manage orders
- Update order status
- View analytics

---

## 📁 **Project Structure**

```
eesha-admin/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── products/
│   │   │   ├── page.tsx          # Products list
│   │   │   ├── new/
│   │   │   │   └── page.tsx      # Add product
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Edit product
│   │   ├── orders/
│   │   │   ├── page.tsx          # Orders list
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Order detail
│   │   ├── layout.tsx
│   │   └── page.tsx              # Dashboard home
│   ├── api/
│   │   ├── products/
│   │   │   └── route.ts
│   │   ├── orders/
│   │   │   └── route.ts
│   │   └── upload/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                       # Shadcn components
│   ├── products/
│   │   ├── ProductForm.tsx
│   │   └── ProductCard.tsx
│   ├── orders/
│   │   ├── OrderTable.tsx
│   │   └── OrderStatusBadge.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       └── Header.tsx
├── lib/
│   ├── supabase.ts              # Supabase client
│   └── utils.ts
├── public/
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 **Quick Setup (5 minutes)**

### **Step 1: Create Next.js Project**

```bash
# Navigate to your workspace
cd /Users/sharuja/Desktop/eeshaMobileApp

# Create Next.js app
npx create-next-app@latest eesha-admin --typescript --tailwind --app --no-src-dir

# Navigate to project
cd eesha-admin
```

### **Step 2: Install Dependencies**

```bash
# Core dependencies
npm install @supabase/supabase-js
npm install @supabase/auth-helpers-nextjs

# UI components (Shadcn)
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-label
npm install @radix-ui/react-select
npm install @radix-ui/react-toast

# Form handling
npm install react-hook-form zod @hookform/resolvers

# Image upload
npm install react-dropzone
```

### **Step 3: Setup Environment Variables**

Create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📝 **Key Files to Create**

### **1. Supabase Client (`lib/supabase.ts`)**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client with service role
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
```

### **2. Product Form Component**

```typescript
// components/products/ProductForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().min(0),
  category: z.string().optional(),
  stock_quantity: z.number().min(0),
  active: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm({
  product,
  onSuccess
}: {
  product?: any;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock_quantity: 0,
      active: true,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);

      let imageUrl = product?.image_url;

      // Upload image if new file selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Insert or update product
      const productData = {
        ...data,
        image_url: imageUrl,
      };

      if (product?.id) {
        await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);
      } else {
        await supabase
          .from('products')
          .insert(productData);
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Form fields here */}
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Product'}
      </button>
    </form>
  );
}
```

### **3. Products List Page**

```typescript
// app/(dashboard)/products/page.tsx
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function ProductsPage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products?.map((product) => (
          <div key={product.id} className="border rounded p-4">
            <img
              src={product.image_url || '/placeholder.png'}
              alt={product.name}
              className="w-full h-48 object-cover mb-4"
            />
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">€{product.price}</p>
            <p className="text-sm">Stock: {product.stock_quantity}</p>
            <Link
              href={`/products/${product.id}`}
              className="text-blue-600 text-sm mt-2 inline-block"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### **4. Orders Management**

```typescript
// app/(dashboard)/orders/page.tsx
import { supabase } from '@/lib/supabase';

export default async function OrdersPage() {
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Order #</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="px-6 py-4">{order.order_number}</td>
                <td className="px-6 py-4">{order.email}</td>
                <td className="px-6 py-4">€{order.total}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(order.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4">
                  <Link href={`/orders/${order.id}`} className="text-blue-600">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 🔐 **Authentication Setup**

```typescript
// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push('/');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```

---

## 🚀 **Deployment to Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Then deploy to production
vercel --prod
```

---

## 📋 **Development Checklist**

**Day 4 (Admin Dashboard Setup):**
- [ ] Create Next.js project
- [ ] Install dependencies
- [ ] Setup Supabase client
- [ ] Create auth pages (login)
- [ ] Build products list page
- [ ] Build add product form

**Day 12 (Orders Management):**
- [ ] Create orders list page
- [ ] Build order detail page
- [ ] Add mark as shipped button
- [ ] Implement status updates
- [ ] Add tracking number input

**Day 25 (Deployment):**
- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Test admin in production
- [ ] Add initial products

---

## 🎨 **Recommended UI Improvements**

1. **Use Shadcn UI components** for consistency
2. **Add image preview** before upload
3. **Implement bulk actions** for products
4. **Add filters** for orders (date, status)
5. **Create dashboard home** with stats

---

## 🔒 **Security Notes**

1. **Use Row Level Security** in Supabase
2. **Validate all inputs** server-side
3. **Use service role key** only in API routes
4. **Implement admin role check**
5. **Rate limit API endpoints**

---

## 📞 **Support Resources**

- **Next.js Docs**: https://nextjs.org/docs
- **Shadcn UI**: https://ui.shadcn.com
- **Supabase Docs**: https://supabase.com/docs
- **React Hook Form**: https://react-hook-form.com

---

## ✅ **Success Criteria**

By Day 4:
- [ ] Admin can login
- [ ] Admin can view products list
- [ ] Admin can add new product
- [ ] Product images upload successfully

By Day 12:
- [ ] Admin can view all orders
- [ ] Admin can see order details
- [ ] Admin can update order status
- [ ] Admin can add tracking number

By Day 25:
- [ ] Dashboard deployed to Vercel
- [ ] 10-20 products added
- [ ] All features working in production

---

**Next Step:** Run `npx create-next-app@latest eesha-admin` to get started!
