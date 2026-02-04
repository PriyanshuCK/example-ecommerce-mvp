'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { Product, Category } from '@/types';
import { createProductAction, updateProductAction } from '@/app/dashboard/products/actions';
import { toast } from 'sonner';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  mode: 'create' | 'edit';
}

export function ProductForm({ product, categories, mode }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    
    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createProductAction(formData);
          toast.success('Product created successfully');
        } else {
          await updateProductAction(product!.id, formData);
          toast.success('Product updated successfully');
        }
        router.push('/dashboard/products');
        router.refresh();
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          toast.error(err.message);
        } else {
          setError('An error occurred');
          toast.error('An error occurred');
        }
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/products">
          <Button variant="ghost" className="gap-2 pl-0" type="button">
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Button>
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'create' ? 'Create Product' : 'Update Product'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={product?.name}
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                required
                defaultValue={product?.slug}
                placeholder="product-slug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={5}
                placeholder="Enter product description"
                defaultValue={product?.description}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                required
                defaultValue={product?.price}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                required
                defaultValue={product?.stock}
                placeholder="0"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select name="categoryId" required defaultValue={product?.categoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={product?.status || 'draft'}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                required
                defaultValue={product?.image}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
