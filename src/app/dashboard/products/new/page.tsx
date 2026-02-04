'use client';

import { ProductForm } from '@/components/dashboard/product-form';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
        <p className="text-muted-foreground">
          Add a new product to your store
        </p>
      </div>

      <ProductForm mode="create" />
    </div>
  );
}
