import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getProductBySlug } from '@/lib/db/queries';
import { getCategoryById } from '@/lib/db/queries';
import { formatINR, formatDate } from '@/lib/utils';
import { ArrowLeft, Package, Tag } from 'lucide-react';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product || product.status !== 'active') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <p className="text-muted-foreground">
            The product you are looking for does not exist.
          </p>
          <Link href="/">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const category = await getCategoryById(product.categoryId);

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
