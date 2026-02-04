'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import type { Product } from '@/types';
import { productSchema } from '@/lib/validation';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct as deleteProductFromDb,
  getProductBySlug
} from '@/lib/db/queries';

export async function createProductAction(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    stock: parseInt(formData.get('stock') as string),
    categoryId: formData.get('categoryId') as string,
    image: formData.get('image') as string,
    status: formData.get('status') as 'active' | 'inactive' | 'draft',
  };

  // Validate data
  const result = productSchema.safeParse(data);
  if (!result.success) {
    throw new Error('Validation failed: ' + result.error.issues.map((e: { message: string }) => e.message).join(', '));
  }

  // Check for duplicate slug
  const existing = await getProductBySlug(data.slug);
  if (existing) {
    throw new Error('A product with this slug already exists');
  }

  const product: Product = {
    id: uuidv4(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await createProduct(product);
  
  revalidatePath('/');
  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function updateProductAction(productId: string, formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    stock: parseInt(formData.get('stock') as string),
    categoryId: formData.get('categoryId') as string,
    image: formData.get('image') as string,
    status: formData.get('status') as 'active' | 'inactive' | 'draft',
  };

  // Validate data
  const result = productSchema.safeParse(data);
  if (!result.success) {
    throw new Error('Validation failed: ' + result.error.issues.map((e: { message: string }) => e.message).join(', '));
  }

  // Check for duplicate slug (excluding current product)
  const existing = await getProductBySlug(data.slug);
  if (existing && existing.id !== productId) {
    throw new Error('A product with this slug already exists');
  }

  await updateProduct(productId, data);
  
  revalidatePath('/');
  revalidatePath('/dashboard/products');
  revalidatePath(`/products/${data.slug}`);
  redirect('/dashboard/products');
}

export async function deleteProductAction(productId: string) {
  await deleteProductFromDb(productId);
  
  revalidatePath('/');
  revalidatePath('/dashboard/products');
}
