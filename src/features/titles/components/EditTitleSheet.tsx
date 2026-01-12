import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Title } from '../types/title.types';
import { toast } from '@/hooks/useToast';
import { useDateFormatter } from '@/hooks/useDateFormatter';

const editTitleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  scheduledDate: z.string().optional(),
});

type EditTitleFormData = z.infer<typeof editTitleSchema>;

interface EditTitleSheetProps {
  title: Title | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (titleId: string, updates: Partial<Pick<Title, 'title' | 'scheduledDate'>>) => Promise<void>;
}

export function EditTitleSheet({ title, open, onOpenChange, onSave }: EditTitleSheetProps) {
  const { toInputDate } = useDateFormatter();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditTitleFormData>({
    resolver: zodResolver(editTitleSchema),
  });

  // Reset form when title changes or sheet opens
  useEffect(() => {
    if (title && open) {
      reset({
        title: title.title,
        scheduledDate: toInputDate(title.scheduledDate),
      });
    }
  }, [title, open, reset, toInputDate]);

  if (!title) return null;

  const onSubmit = async (data: EditTitleFormData) => {
    try {
      await onSave(title.id, {
        title: data.title,
        scheduledDate: data.scheduledDate || undefined,
      });
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the parent component
      toast.error('Failed to save title. Please try again.');
      console.error('Failed to save title:', error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Edit Title</SheetTitle>
          <SheetDescription>
            Make changes to the title and scheduled date. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter title"
              {...register('title')}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduledDate">Scheduled Date</Label>
            <Input
              id="scheduledDate"
              type="date"
              {...register('scheduledDate')}
              className={errors.scheduledDate ? 'border-destructive' : ''}
            />
            {errors.scheduledDate && (
              <p className="text-sm text-destructive">{errors.scheduledDate.message}</p>
            )}
          </div>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
