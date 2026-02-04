'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProductForm } from '@/components/dashboard/product-form';
import { useProducts } from '@/lib/hooks/use-storage';
import { Loader2 } from 'lucide-react';
import NotFound from './not-found';
import type { Product } from '@/types';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { products, isLoaded, getProductById } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (isLoaded && id) {
      const foundProduct = getProductById(id);
      setProduct(foundProduct);
    }
  }, [id, isLoaded, getProductById]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return <NotFound />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground">
          Update product details
        </p>
      </div>

      <ProductForm product={product} mode="edit" />
    </div>
  );
}
