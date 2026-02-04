import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { PackageX, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <PackageX className="h-24 w-24 text-muted-foreground" />
          <h1 className="text-4xl font-bold">Product Not Found</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link href="/">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Store
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
