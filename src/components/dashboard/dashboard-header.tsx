import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { MobileNav } from './mobile-nav';
import { Package, LayoutDashboard, Tags, Plus, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MobileNav />
          <Link href="/" className="flex items-center gap-2">
            <Store className="h-6 w-6" />
            <span className="font-bold text-xl hidden sm:inline">Store</span>
          </Link>
          <span className="text-muted-foreground hidden sm:inline">|</span>
          <Link href="/dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-semibold hidden sm:inline">Dashboard</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm">
              View Store
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
