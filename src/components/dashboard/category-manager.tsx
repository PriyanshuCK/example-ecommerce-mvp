'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { categorySchema } from '@/lib/validation';
import { slugify } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryManagerProps {
  categories: Category[];
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Categories ({categories.length})</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {categories.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No categories yet
            </p>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{category.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {category.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
