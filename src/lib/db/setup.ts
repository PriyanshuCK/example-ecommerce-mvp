import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";
import bcrypt from "bcrypt";

config({ path: ".env.local" });

async function setupDatabase() {
  console.log("🚀 Setting up database...");
  
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    // Read migration SQL
    const migrationPath = join(process.cwd(), "drizzle", "0000_unique_alex_wilder.sql");
    const migrationSQL = readFileSync(migrationPath, "utf-8");
    
    // Split by statement-breakpoint and execute each statement
    const statements = migrationSQL
      .split("--> statement-breakpoint")
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    console.log(`📋 Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
      await sql.query(statement);
    }
    
    console.log("✅ Tables created successfully!");
    
    // Check if already seeded
    const existingUsers = await sql`SELECT * FROM users WHERE email = 'priyanshu@priyanshusharma.dev'`;
    
    if (existingUsers.length > 0) {
      console.log("✓ Database already seeded");
      return;
    }
    
    // Generate admin password
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specials = "!@#$%^&*";

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
    const adminPassword = chars.join("");

    console.log("\n" + "=".repeat(60));
    console.log("🔐 ADMIN CREDENTIALS - SAVE THESE!");
    console.log("=".repeat(60));
    console.log(`📧 Email:    priyanshu@priyanshusharma.dev`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log("=".repeat(60) + "\n");

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

    // Insert admin user
    await sql`
      INSERT INTO users (email, name, password_hash, role, email_verified)
      VALUES ('priyanshu@priyanshusharma.dev', 'Admin User', ${passwordHash}, 'admin', NOW())
    `;
    console.log("✓ Admin user created");

    // Insert categories
    await sql`
      INSERT INTO categories (name, slug, description) VALUES
      ('Electronics', 'electronics', 'Latest gadgets and electronic devices'),
      ('Clothing', 'clothing', 'Fashion and apparel for all occasions'),
      ('Home & Garden', 'home-garden', 'Everything for your home and garden'),
      ('Books', 'books', 'Physical and digital books')
    `;
    console.log("✓ Categories seeded");

    // Get category IDs
    const categoryRows = await sql`SELECT id, slug FROM categories`;
    const categoryMap = new Map(categoryRows.map((c: any) => [c.slug, c.id]));

    // Insert products
    await sql`
      INSERT INTO products (name, slug, description, price, stock, image, status, category_id) VALUES
      ('Wireless Headphones Pro', 'wireless-headphones-pro', 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals.', 2499, 25, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'active', ${categoryMap.get('electronics')}),
      ('Premium Cotton T-Shirt', 'premium-cotton-t-shirt', '100% organic cotton t-shirt with a comfortable fit. Available in multiple colors. Soft, breathable, and perfect for everyday wear.', 599, 100, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', 'active', ${categoryMap.get('clothing')}),
      ('Garden Tool Set Deluxe', 'garden-tool-set-deluxe', 'Complete garden tool set including trowel, cultivator, transplanter, weeder, and pruning shears. High-quality stainless steel with ergonomic handles.', 1299, 15, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80', 'active', ${categoryMap.get('home-garden')}),
      ('Bestseller Fiction Novel', 'bestseller-fiction-novel', 'A gripping tale of mystery and adventure that will keep you on the edge of your seat. Over 1 million copies sold worldwide.', 399, 50, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80', 'active', ${categoryMap.get('books')}),
      ('Smart Watch Series 5', 'smart-watch-series-5', 'Advanced fitness tracking, heart rate monitoring, GPS, and smartphone integration. Water-resistant up to 50 meters. Battery lasts up to 7 days.', 4999, 10, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', 'active', ${categoryMap.get('electronics')}),
      ('Denim Jacket Classic', 'denim-jacket-classic', 'Timeless denim jacket with a vintage wash. Durable construction with brass buttons and multiple pockets. A wardrobe essential.', 1899, 30, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80', 'active', ${categoryMap.get('clothing')})
    `;
    console.log("✓ Products seeded");

    console.log("\n✅ Database setup completed successfully!");
    console.log("🚀 You can now run: npm run dev");
    
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    process.exit(1);
  }
}

setupDatabase();
