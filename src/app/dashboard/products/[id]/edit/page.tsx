import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/data/products';
import { getAllCategories } from '@/lib/data/categories';
import { ProductForm } from '@/components/dashboard/product-form';

export const dynamicParams = true;

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  const categories = await getAllCategories();

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground">
          Update product details
        </p>
      </div>

      <ProductForm categories={categories} product={product} mode="edit" />
    </div>
  );
}
