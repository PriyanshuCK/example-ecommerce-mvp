'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product, Category } from '@/types';
import { sampleProducts, sampleCategories } from '@/lib/sample-data';

const PRODUCTS_KEY = 'ecommerce_products';
const CATEGORIES_KEY = 'ecommerce_categories';
const INITIALIZED_KEY = 'ecommerce_initialized';

// Initialize data in localStorage if not already done
export function initializeStorage() {
  if (typeof window === 'undefined') return;
  
  const isInitialized = localStorage.getItem(INITIALIZED_KEY);
  if (!isInitialized) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(sampleProducts));
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(sampleCategories));
    localStorage.setItem(INITIALIZED_KEY, 'true');
  }
}

// Hook for managing products
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initializeStorage();
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (stored) {
      setProducts(JSON.parse(stored));
    }
    setIsLoaded(true);
  }, []);

  const saveProducts = useCallback((newProducts: Product[]) => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(newProducts));
    setProducts(newProducts);
  }, []);

  const getProductById = useCallback((id: string) => {
    return products.find(p => p.id === id) || null;
  }, [products]);

  const getProductBySlug = useCallback((slug: string) => {
    return products.find(p => p.slug === slug) || null;
  }, [products]);

  const createProduct = useCallback((product: Product) => {
    const newProducts = [...products, product];
    saveProducts(newProducts);
    return product;
  }, [products, saveProducts]);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    const newProducts = products.map(p => 
      p.id === id 
        ? { ...p, ...updates, updatedAt: new Date().toISOString() }
        : p
    );
    saveProducts(newProducts);
    return newProducts.find(p => p.id === id) || null;
  }, [products, saveProducts]);

  const deleteProduct = useCallback((id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    saveProducts(newProducts);
    return true;
  }, [products, saveProducts]);

  return {
    products,
    isLoaded,
    getProductById,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

// Hook for managing categories
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initializeStorage();
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (stored) {
      setCategories(JSON.parse(stored));
    }
    setIsLoaded(true);
  }, []);

  const saveCategories = useCallback((newCategories: Category[]) => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(newCategories));
    setCategories(newCategories);
  }, []);

  const getCategoryById = useCallback((id: string) => {
    return categories.find(c => c.id === id) || null;
  }, [categories]);

  const getCategoryBySlug = useCallback((slug: string) => {
    return categories.find(c => c.slug === slug) || null;
  }, [categories]);

  const createCategory = useCallback((category: Category) => {
    const newCategories = [...categories, category];
    saveCategories(newCategories);
    return category;
  }, [categories, saveCategories]);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    const newCategories = categories.map(c => 
      c.id === id ? { ...c, ...updates } : c
    );
    saveCategories(newCategories);
    return newCategories.find(c => c.id === id) || null;
  }, [categories, saveCategories]);

  const deleteCategory = useCallback((id: string) => {
    const newCategories = categories.filter(c => c.id !== id);
    saveCategories(newCategories);
    return true;
  }, [categories, saveCategories]);

  return {
    categories,
    isLoaded,
    getCategoryById,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
