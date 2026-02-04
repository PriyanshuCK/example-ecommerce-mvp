import { promises as fs } from 'fs';
import path from 'path';
import type { Product } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

interface ProductsData {
  products: Product[];
}

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readProductsFile(): Promise<ProductsData> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { products: [] };
  }
}

async function writeProductsFile(data: ProductsData): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(data, null, 2));
}

export async function getAllProducts(): Promise<Product[]> {
  const data = await readProductsFile();
  return data.products;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find(p => p.id === id) || null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find(p => p.slug === slug) || null;
}

export async function createProduct(product: Product): Promise<Product> {
  const data = await readProductsFile();
  data.products.push(product);
  await writeProductsFile(data);
  return product;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const data = await readProductsFile();
  const index = data.products.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  data.products[index] = {
    ...data.products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await writeProductsFile(data);
  return data.products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const data = await readProductsFile();
  const initialLength = data.products.length;
  data.products = data.products.filter(p => p.id !== id);
  
  if (data.products.length === initialLength) return false;
  
  await writeProductsFile(data);
  return true;
}

export async function seedProducts(products: Product[]): Promise<void> {
  await writeProductsFile({ products });
}
