import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getAllProducts } from '@/lib/db/queries';
import { getAllCategories } from '@/lib/db/queries';
import { formatINR, formatDate } from '@/lib/utils';

export default async function ProductsPage() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Uncategorized';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      draft: 'secondary',
      inactive: 'outline',
    };
    return (
      <Badge variant={variants[status] || 'default'} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">No products found</p>
                  <Link href="/dashboard/products/new">
                    <Button variant="outline" className="mt-4">
                      Create your first product
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 rounded overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                  <TableCell>{formatINR(product.price)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(product.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/products/${product.slug}`} target="_blank">
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/products/${product.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
