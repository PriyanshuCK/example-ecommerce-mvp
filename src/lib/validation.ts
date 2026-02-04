import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255, 'Name is too long'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  stock: z.number().int().min(0, 'Stock must be 0 or greater'),
  categoryId: z.string().uuid('Please select a category'),
  image: z.string().url('Please enter a valid URL'),
  status: z.enum(['active', 'inactive', 'draft']),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(255, 'Name is too long'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
