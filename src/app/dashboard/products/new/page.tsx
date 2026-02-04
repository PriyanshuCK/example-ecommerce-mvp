import { getAllCategories } from '@/lib/data/categories';
import { ProductForm } from '@/components/dashboard/product-form';

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
        <p className="text-muted-foreground">
          Add a new product to your store
        </p>
      </div>

      <ProductForm categories={categories} mode="create" />
    </div>
  );
}
