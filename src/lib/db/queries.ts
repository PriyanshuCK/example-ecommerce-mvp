import { db } from './index';
import { products, categories, users } from './schema';
import { eq, desc, asc, like, or, sql } from 'drizzle-orm';
import type { Product, Category, User } from '@/types';

// Helper to convert decimal price from string to number
function convertProductFromDB(product: any): Product {
  return {
    ...product,
    price: parseFloat(product.price),
  };
}

// Helper to convert Product to DB format (price as string)
function convertProductToDB(product: Product): any {
  return {
    ...product,
    price: product.price.toString(),
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const result = await db.select().from(products).orderBy(asc(products.createdAt));
  return result.map(convertProductFromDB);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const result = await db.select().from(products).where(eq(products.slug, slug));
  return result[0] ? convertProductFromDB(result[0]) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const result = await db.select().from(products).where(eq(products.id, id));
  return result[0] ? convertProductFromDB(result[0]) : null;
}

export async function createProduct(product: Product): Promise<Product> {
  const result = await db.insert(products).values(convertProductToDB(product)).returning();
  return convertProductFromDB(result[0]);
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null> {
  const dbUpdates: any = { ...updates, updatedAt: new Date() };
  if (updates.price !== undefined) {
    dbUpdates.price = updates.price.toString();
  }
  
  const result = await db
    .update(products)
    .set(dbUpdates)
    .where(eq(products.id, id))
    .returning();
  return result[0] ? convertProductFromDB(result[0]) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const result = await db.delete(products).where(eq(products.id, id)).returning();
  return result.length > 0;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const result = await db
    .select()
    .from(products)
    .where(
      or(
        like(products.name, `%${query}%`),
        like(products.description, `%${query}%`)
      )
    )
    .orderBy(asc(products.name));
  return result.map(convertProductFromDB);
}

export async function getAllCategories(): Promise<Category[]> {
  return db.select().from(categories).orderBy(asc(categories.name));
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const result = await db.select().from(categories).where(eq(categories.id, id));
  return result[0] || null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const result = await db.select().from(categories).where(eq(categories.slug, slug));
  return result[0] || null;
}

export async function createCategory(category: Category): Promise<Category> {
  const result = await db.insert(categories).values(category).returning();
  return result[0];
}

export async function updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<Category | null> {
  const result = await db
    .update(categories)
    .set(updates)
    .where(eq(categories.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const result = await db.delete(categories).where(eq(categories.id, id)).returning();
  return result.length > 0;
}

export async function getUserByEmail(email: string): Promise<any | null> {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0] || null;
}

export async function createUser(email: string, name: string, password: string): Promise<any> {
  const bcrypt = await import('bcrypt');
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await db.insert(users).values({
    email,
    name,
    passwordHash,
    role: 'admin',
    emailVerified: new Date(),
  }).returning();
  return result[0];
}

export async function verifyPassword(email: string, password: string): Promise<boolean> {
  const user = await getUserByEmail(email);
  if (!user) return false;

  const bcrypt = await import('bcrypt');
  return await bcrypt.compare(password, user.passwordHash);
}

export async function updateUserEmailVerified(email: string): Promise<void> {
  await db
    .update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.email, email));
}
