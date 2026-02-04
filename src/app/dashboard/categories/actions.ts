'use server';

import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { 
  createCategory as createCategoryDb, 
  updateCategory as updateCategoryDb,
  deleteCategory as deleteCategoryDb 
} from '@/lib/data/categories';
import { getCategoryBySlug } from '@/lib/data/categories';
import type { Category } from '@/types';
import { categorySchema } from '@/lib/validation';

export async function createCategoryAction(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
  };

  // Validate data
  const result = categorySchema.safeParse(data);
  if (!result.success) {
    throw new Error('Validation failed: ' + result.error.issues.map((e: { message: string }) => e.message).join(', '));
  }

  // Check for duplicate slug
  const existing = await getCategoryBySlug(data.slug);
  if (existing) {
    throw new Error('A category with this slug already exists');
  }

  const category: Category = {
    id: uuidv4(),
    ...data,
  };

  await createCategoryDb(category);
  
  revalidatePath('/dashboard');
  revalidatePath('/');
}

export async function updateCategoryAction(categoryId: string, formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
  };

  // Validate data
  const result = categorySchema.safeParse(data);
  if (!result.success) {
    throw new Error('Validation failed: ' + result.error.issues.map((e: { message: string }) => e.message).join(', '));
  }

  // Check for duplicate slug (excluding current category)
  const existing = await getCategoryBySlug(data.slug);
  if (existing && existing.id !== categoryId) {
    throw new Error('A category with this slug already exists');
  }

  await updateCategoryDb(categoryId, data);
  
  revalidatePath('/dashboard');
  revalidatePath('/');
}

export async function deleteCategoryAction(categoryId: string) {
  await deleteCategoryDb(categoryId);
  
  revalidatePath('/dashboard');
  revalidatePath('/');
}
