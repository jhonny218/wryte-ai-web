import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';

interface CreateTitleDialogProps {
  date: Date | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (date: Date) => void;
}

export function CreateTitleDialog({ date, open, onOpenChange, onCreate }: CreateTitleDialogProps) {
  if (!date) return null;

  const handleCreate = () => {
    onCreate(date);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create Title for {format(date, 'MMMM d, yyyy')}</AlertDialogTitle>
          <AlertDialogDescription>
            Would you like to generate a title for this date? This will use the AI to create content
            based on your organization's settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleCreate}>Create Title</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
