import { promises as fs } from 'fs';
import path from 'path';
import type { Category } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

interface CategoriesData {
  categories: Category[];
}

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readCategoriesFile(): Promise<CategoriesData> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(CATEGORIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { categories: [] };
  }
}

async function writeCategoriesFile(data: CategoriesData): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(CATEGORIES_FILE, JSON.stringify(data, null, 2));
}

export async function getAllCategories(): Promise<Category[]> {
  const data = await readCategoriesFile();
  return data.categories;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const categories = await getAllCategories();
  return categories.find(c => c.id === id) || null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getAllCategories();
  return categories.find(c => c.slug === slug) || null;
}

export async function createCategory(category: Category): Promise<Category> {
  const data = await readCategoriesFile();
  data.categories.push(category);
  await writeCategoriesFile(data);
  return category;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  const data = await readCategoriesFile();
  const index = data.categories.findIndex(c => c.id === id);
  
  if (index === -1) return null;
  
  data.categories[index] = {
    ...data.categories[index],
    ...updates,
  };
  
  await writeCategoriesFile(data);
  return data.categories[index];
}

export async function deleteCategory(id: string): Promise<boolean> {
  const data = await readCategoriesFile();
  const initialLength = data.categories.length;
  data.categories = data.categories.filter(c => c.id !== id);
  
  if (data.categories.length === initialLength) return false;
  
  await writeCategoriesFile(data);
  return true;
}

export async function seedCategories(categories: Category[]): Promise<void> {
  await writeCategoriesFile({ categories });
}
