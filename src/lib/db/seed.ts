import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon as createNeonClient } from '@neondatabase/serverless';
import * as schema from './schema';
import { sampleCategories, sampleProducts } from '../sample-data';
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  try {
    console.log('🌱 Seeding database...');

    // Load environment variables manually
    const envFile = path.join(process.cwd(), '.env.local');
    const envContent = await fs.readFile(envFile, 'utf-8');
    const envVars: Record<string, string> = {};

    envContent.split('\n').forEach(line => {
      const [key, ...value] = line.split('=');
      if (key && value.length > 0) {
        envVars[key.trim()] = value.join('=').trim();
      }
    });

    console.log('🔑 Database URL found:', !!envVars.DATABASE_URL);
    
    if (!envVars.DATABASE_URL) {
      throw new Error('DATABASE_URL not found in .env.local');
    }

    const neonClient = createNeonClient(envVars.DATABASE_URL);
    
    // Read and execute migration SQL
    console.log('📦 Running migrations...');
    const migrationFile = path.join(process.cwd(), 'drizzle', '0000_unique_alex_wilder.sql');
    const migrationSQL = await fs.readFile(migrationFile, 'utf-8');
    
    // Split migration into individual statements
    const statements = migrationSQL.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean);
    
    for (const statement of statements) {
      try {
        // Use query method for neon
        await neonClient.query(statement, []);
        console.log('✓ Executed:', statement.substring(0, 50) + '...');
      } catch (error: any) {
        // Ignore "already exists" errors
        if (error.message && (error.message.includes('already exists') || error.message.includes('Duplicate'))) {
          console.log('⚠️ Skipped (already exists):', statement.substring(0, 50) + '...');
        } else {
          console.log('⚠️ Warning:', error.message);
        }
      }
    }
    console.log('✅ Migrations applied successfully!');

    // Check if admin already exists using raw SQL
    console.log('🔍 Checking if admin exists...');
    const existingUsers = await neonClient.query(`SELECT * FROM "users" WHERE "email" = $1`, ['priyanshu@priyanshusharma.dev']);
    
    if (existingUsers.length > 0) {
      console.log('✓ Database already seeded');
      return;
    }

    // Generate admin password and hash it
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specials = '!@#$%^&*';

    const chars = [
      uppercase[Math.floor(Math.random() * uppercase.length)],
      lowercase[Math.floor(Math.random() * lowercase.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      specials[Math.floor(Math.random() * specials.length)],
      uppercase[Math.floor(Math.random() * uppercase.length)],
      lowercase[Math.floor(Math.random() * lowercase.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      specials[Math.floor(Math.random() * specials.length)],
    ];
    const adminPassword = chars.join('');

    console.log('🔐 Admin Password:', adminPassword);  
    
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);
    console.log('🔐 Password Hash:', passwordHash);

    // Insert admin user using raw SQL
    await neonClient.query(
      `INSERT INTO "users" ("email", "name", "password_hash", "role", "email_verified") 
       VALUES ($1, $2, $3, $4, $5)`,
      ['priyanshu@priyanshusharma.dev', 'Admin User', passwordHash, 'admin', new Date()]
    );
    console.log('✓ Admin user created');

    // Insert categories using raw SQL
    for (const category of sampleCategories) {
      await neonClient.query(
        `INSERT INTO "categories" ("id", "name", "slug", "description") 
         VALUES ($1, $2, $3, $4)`,
        [category.id, category.name, category.slug, category.description]
      );
    }
    console.log('✓ Categories seeded');

    // Insert products using raw SQL
    for (const product of sampleProducts) {
      await neonClient.query(
        `INSERT INTO "products" ("id", "name", "slug", "description", "price", "stock", "image", "status", "category_id", "created_at", "updated_at") 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          product.id, 
          product.name, 
          product.slug, 
          product.description, 
          product.price, 
          product.stock, 
          product.image, 
          product.status, 
          product.categoryId, 
          product.createdAt, 
          product.updatedAt
        ]
      );
    }
    console.log('✓ Products seeded');

    console.log('✅ Database seeded successfully!');
    console.log('📝 Save this password:', adminPassword);
    console.log('📧 Email: priyanshu@priyanshusharma.dev');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

main();
