# Example E-commerce MVP

A modern e-commerce store built with Next.js, featuring product management, category management, and a responsive storefront.

## Features

### Store Frontend
- **Product Listing**: Browse all products with responsive grid layout
- **Product Details**: View individual product information with images
- **Search & Filters**: 
  - Fuzzy search across product names and descriptions (Fuse.js)
  - Category filtering
  - Price sorting (low-high, high-low)
  - Name sorting (A-Z, Z-A)
  - Newest first
- **Responsive Design**: Fully mobile-responsive interface
- **Theme Support**: Light/Dark/System theme toggle

### Admin Dashboard (`/dashboard`)
- **Product Management**:
  - Create, Read, Update, Delete (CRUD) operations
  - Real-time form validation with Zod
  - Slug auto-generation from product name
  - Image preview from external URLs
  - Stock and price management
  - Product status (Active, Inactive, Draft)
  
- **Category Management**:
  - Create, edit, and delete categories
  - Slug auto-generation
  - Inline editing interface

- **Dashboard Overview**:
  - Total products count
  - Active products count
  - Total categories
  - Total inventory stock
  - Inventory value (INR)

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **Search**: Fuse.js (fuzzy search)
- **Theme**: next-themes (light/dark/system)
- **Icons**: Lucide React
- **Data Storage**: JSON files (local filesystem)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Store home page
│   ├── products/[slug]/   # Product detail pages
│   ├── dashboard/         # Admin dashboard
│   │   ├── page.tsx       # Dashboard overview
│   │   ├── products/      # Product CRUD
│   │   └── layout.tsx     # Dashboard layout
│   └── layout.tsx         # Root layout
├── components/
│   ├── store/             # Store components
│   ├── dashboard/         # Dashboard components
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── data/              # JSON data operations
│   ├── validation.ts      # Zod schemas
│   └── utils.ts           # Utility functions
├── types/                 # TypeScript types
└── data/                  # JSON storage
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm

### Installation

1. Navigate to the project:
```bash
cd example-ecommerce-mvp
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Access the Dashboard

Navigate to `/dashboard` to access the admin panel (no authentication required for this MVP).

## Data Model

### Product
```typescript
{
  id: string;           // UUID
  name: string;         // Product name
  slug: string;         // URL-friendly name
  description: string;  // Product description
  price: number;        // Price in INR
  stock: number;        // Inventory count
  categoryId: string;   // Reference to category
  image: string;        // External image URL
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
}
```

### Category
```typescript
{
  id: string;           // UUID
  name: string;         // Category name
  slug: string;         // URL-friendly name
  description: string;  // Category description
}
```

## Features Explained

### Backend Architecture (JSON-based)

Since this is an MVP without a database, we use JSON files for storage:

1. **File Operations**: Server-side file system operations using Node.js `fs/promises`
2. **Data Persistence**: JSON files stored in `src/data/`
3. **Seed Data**: Sample products and categories auto-populate on first load
4. **Server Actions**: Next.js 14 Server Actions for form submissions

### Key Design Decisions

1. **No Database**: JSON files for simplicity in MVP
2. **No Authentication**: Open dashboard for demo purposes
3. **External Images**: Stock photos from Unsplash via URLs
4. **Client-side Search**: Fuse.js for fuzzy search (no backend needed)
5. **Static Generation**: Pages pre-rendered at build time for performance

### Form Validation

- **Zod**: Runtime type validation with great error messages
- **React Hook Form**: Performance-optimized form handling
- **Real-time Validation**: Instant feedback as users type
- **Slug Auto-generation**: Automatic URL-friendly names from titles

### Theme System

- **next-themes**: Handles theme switching
- **Three Modes**: Light, Dark, System (follows OS preference)
- **Persistent**: Saves preference to localStorage
- **No Flash**: Prevents theme flash on page load

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Limitations (MVP)

1. **Data Persistence**: JSON files reset on each deployment (Vercel)
2. **No Authentication**: Dashboard is publicly accessible
3. **No Cart/Checkout**: Product showcase only
4. **Single Image**: Products have one image only
5. **No Real-time**: Changes require page refresh

## Future Enhancements

- [ ] PostgreSQL database with Drizzle ORM
- [ ] Authentication system (NextAuth.js)
- [ ] Shopping cart functionality
- [ ] Payment integration (Stripe)
- [ ] Image upload (Cloudinary/AWS S3)
- [ ] Rich text editor for descriptions
- [ ] Multiple product images
- [ ] Product variants (size, color)
- [ ] Order management
- [ ] User accounts
- [ ] Wishlist functionality
- [ ] Product reviews
- [ ] Analytics dashboard

## License

MIT License - feel free to use this as a starting point for your own projects!

## Credits

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Sample images from [Unsplash](https://unsplash.com/)
