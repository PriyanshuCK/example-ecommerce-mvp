'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Trash2, Plus, Loader2, X, Check } from 'lucide-react';
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
import type { Category } from '@/types';
import { categorySchema, type CategoryFormData } from '@/lib/validation';
import { slugify } from '@/lib/utils';
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '@/app/dashboard/categories/actions';

interface CategoryManagerProps {
  categories: Category[];
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createForm = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  const editForm = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const handleCreate = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await createCategoryAction(formData);
      toast.success('Category created successfully');
      setIsCreating(false);
      createForm.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create category');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (categoryId: string, data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await updateCategoryAction(categoryId, formData);
      toast.success('Category updated successfully');
      setEditingId(null);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update category');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsSubmitting(true);
    try {
      await deleteCategoryAction(deleteId);
      toast.success('Category deleted successfully');
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (category: Category) => {
    editForm.reset(category);
    setEditingId(category.id);
  };

  const onNameChange = (name: string, form: typeof createForm | typeof editForm) => {
    form.setValue('slug', slugify(name));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Categories</CardTitle>
          <Button
            size="sm"
            onClick={() => setIsCreating(true)}
            disabled={isCreating}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create Form */}
        {isCreating && (
          <form
            onSubmit={createForm.handleSubmit(handleCreate)}
            className="border rounded-lg p-4 space-y-4 bg-muted/50"
          >
            <div className="space-y-2">
              <Label htmlFor="new-name">Name</Label>
              <Input
                id="new-name"
                {...createForm.register('name')}
                onChange={(e) => {
                  createForm.setValue('name', e.target.value);
                  onNameChange(e.target.value, createForm);
                }}
                placeholder="Category name"
              />
              {createForm.formState.errors.name && (
                <p className="text-sm text-red-600">
                  {createForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-slug">Slug</Label>
              <Input
                id="new-slug"
                {...createForm.register('slug')}
                placeholder="category-slug"
              />
              {createForm.formState.errors.slug && (
                <p className="text-sm text-red-600">
                  {createForm.formState.errors.slug.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-description">Description</Label>
              <Textarea
                id="new-description"
                {...createForm.register('description')}
                placeholder="Category description"
                rows={2}
              />
              {createForm.formState.errors.description && (
                <p className="text-sm text-red-600">
                  {createForm.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsCreating(false);
                  createForm.reset();
                }}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Check className="h-4 w-4 mr-2" />
                Create
              </Button>
            </div>
          </form>
        )}

        {/* Categories List */}
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
                {editingId === category.id ? (
                  <form
                    onSubmit={editForm.handleSubmit((data) =>
                      handleUpdate(category.id, data)
                    )}
                    className="flex-1 space-y-3"
                  >
                    <div className="space-y-2">
                      <Input
                        {...editForm.register('name')}
                        onChange={(e) => {
                          editForm.setValue('name', e.target.value);
                          onNameChange(e.target.value, editForm);
                        }}
                        placeholder="Category name"
                      />
                      {editForm.formState.errors.name && (
                        <p className="text-sm text-red-600">
                          {editForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <Input
                      {...editForm.register('slug')}
                      placeholder="Slug"
                    />

                    <Textarea
                      {...editForm.register('description')}
                      placeholder="Description"
                      rows={2}
                    />

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(null)}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button type="submit" size="sm" disabled={isSubmitting}>
                        {isSubmitting && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        <Check className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{category.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {category.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteId(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? Products in this category will become uncategorized.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
