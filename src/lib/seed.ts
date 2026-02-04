import { seedProducts } from './data/products';
import { seedCategories } from './data/categories';
import { sampleProducts, sampleCategories } from './sample-data';

export async function seedDatabase() {
  try {
    await seedCategories(sampleCategories);
    console.log('✓ Categories seeded');
    
    await seedProducts(sampleProducts);
    console.log('✓ Products seeded');
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
