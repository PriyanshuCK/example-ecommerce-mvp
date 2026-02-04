export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  image: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
  emailVerified: Date | null;
  createdAt: string;
}

export interface ProductWithCategory extends Product {
  category: Category;
}

export type ProductStatus = 'active' | 'inactive' | 'draft';

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';
}
