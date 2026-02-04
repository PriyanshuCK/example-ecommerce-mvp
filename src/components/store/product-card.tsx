import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product, Category } from '@/types';
import { formatINR } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  category: Category;
}

export function ProductCard({ product, category }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <CardContent className="p-4">
          <Badge variant="secondary" className="mb-2">
            {category.name}
          </Badge>
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              {formatINR(product.price)}
            </span>
            <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface ProductGridProps {
  products: Product[];
  categories: Category[];
}

export function ProductGrid({ products, categories }: ProductGridProps) {
  const getCategory = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)!;
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No products found</p>
        <p className="text-muted-foreground">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          category={getCategory(product.categoryId)}
        />
      ))}
    </div>
  );
}
