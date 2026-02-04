'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/store/product-grid';
import { ProductFilters } from '@/components/store/product-filters';
import { useProducts, useCategories } from '@/lib/hooks/use-storage';
import Fuse from 'fuse.js';
import { Loader2 } from 'lucide-react';

export function HomeContent() {
  const searchParams = useSearchParams();
  const { products, isLoaded: productsLoaded } = useProducts();
  const { categories, isLoaded: categoriesLoaded } = useCategories();
  const [filteredProducts, setFilteredProducts] = useState(products);

  const isLoaded = productsLoaded && categoriesLoaded;

  // Filter and sort products
  useEffect(() => {
    if (!isLoaded) return;

    let result = products.filter(p => p.status === 'active');

    // Apply category filter
    const category = searchParams.get('category');
    if (category && category !== 'all') {
      result = result.filter(p => p.categoryId === category);
    }

    // Apply search filter
    const search = searchParams.get('search');
    if (search) {
      const fuse = new Fuse(result, {
        keys: ['name', 'description'],
        threshold: 0.4,
      });
      result = fuse.search(search).map(r => r.item);
    }

    // Apply sorting
    const sort = searchParams.get('sort');
    if (sort && sort !== 'default') {
      switch (sort) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'newest':
          result.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
      }
    }

    setFilteredProducts(result);
  }, [products, searchParams, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">All Products</h1>
        <p className="text-muted-foreground">
          Discover our curated collection of quality products
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <ProductFilters categories={categories} />
          </div>
        </aside>

        <section className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <ProductGrid products={filteredProducts} categories={categories} />
        </section>
      </div>
    </>
  );
}
