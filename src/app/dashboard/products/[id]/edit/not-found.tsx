import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PackageX, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
      <PackageX className="h-16 w-16 text-muted-foreground" />
      <h1 className="text-3xl font-bold">Product Not Found</h1>
      <p className="text-muted-foreground text-lg max-w-md">
        The product you are looking for does not exist or has been removed.
      </p>
      <Link href="/dashboard/products">
        <Button className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
      </Link>
    </div>
  );
}
