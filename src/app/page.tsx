'use client';

import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Loader2 } from 'lucide-react';
import { HomeContent } from './home-content';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }>
          <HomeContent />
        </Suspense>
      </main>
    </div>
  );
}
