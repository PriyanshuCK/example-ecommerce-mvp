import { Suspense } from 'react';
import { Header } from '@/components/header';
import { ProductGrid } from '@/components/store/product-grid';
import { ProductFilters } from '@/components/store/product-filters';
import { getAllProducts } from '@/lib/data/products';
import { getAllCategories } from '@/lib/data/categories';
import { seedDatabase } from '@/lib/seed';
import Fuse from 'fuse.js';

interface SearchParams {
  category?: string;
  sort?: string;
  search?: string;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  // Seed database on first load
  await seedDatabase();
  
  const products = await getAllProducts();
  const categories = await getAllCategories();
  
  let filteredProducts = products.filter(p => p.status === 'active');
  
  // Apply category filter
  if (params.category && params.category !== 'all') {
    filteredProducts = filteredProducts.filter(
      p => p.categoryId === params.category
    );
  }
  
  // Apply search filter with fuzzy matching
  if (params.search) {
    const fuse = new Fuse(filteredProducts, {
      keys: ['name', 'description'],
      threshold: 0.4,
    });
    filteredProducts = fuse.search(params.search).map(r => r.item);
  }
  
  // Apply sorting
  if (params.sort && params.sort !== 'default') {
    switch (params.sort) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        filteredProducts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">
            Discover our curated collection of quality products
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
                <ProductFilters categories={categories} />
              </Suspense>
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
      </main>
    </div>
  );
}
