'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Tag } from 'lucide-react';
import { useProducts, useCategories } from '@/lib/hooks/use-storage';
import { formatINR, formatDate } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import NotFound from './not-found';
import type { Product, Category } from '@/types';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { products, isLoaded: productsLoaded, getProductBySlug } = useProducts();
  const { categories, isLoaded: categoriesLoaded, getCategoryById } = useCategories();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  const isLoaded = productsLoaded && categoriesLoaded;

  useEffect(() => {
    if (isLoaded && slug) {
      const foundProduct = getProductBySlug(slug);
      setProduct(foundProduct);
      if (foundProduct) {
        setCategory(getCategoryById(foundProduct.categoryId));
      }
    }
  }, [slug, isLoaded, getProductBySlug, getCategoryById]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product || product.status !== 'active') {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-3">
                {category?.name || 'Uncategorized'}
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-primary mb-6">
                {formatINR(product.price)}
              </p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                  <span className="capitalize">{product.status}</span>
                </div>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-8">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mt-auto pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Added on {formatDate(product.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <p className="text-muted-foreground">
            You might also be interested in these products from {category?.name}
          </p>
        </section>
      </main>
    </div>
  );
}
