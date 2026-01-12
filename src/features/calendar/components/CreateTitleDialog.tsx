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
import { Loader2 } from 'lucide-react';

interface CreateTitleDialogProps {
  date: Date | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (date: Date) => void;
  isCreating?: boolean;
}

export function CreateTitleDialog({ date, open, onOpenChange, onCreate, isCreating = false }: CreateTitleDialogProps) {
  if (!date) return null;

  const handleCreate = () => {
    onCreate(date);
    // Don't close the dialog immediately - let polling complete first
  };

  return (
    <AlertDialog open={open} onOpenChange={isCreating ? undefined : onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create Title for {format(date, 'MMMM d, yyyy')}</AlertDialogTitle>
          <AlertDialogDescription>
            {isCreating ? (
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating title... Please wait.</span>
              </div>
            ) : (
              'Would you like to generate a title for this date? This will use the AI to create content based on your organization\'s settings.'
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isCreating}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleCreate} disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Title'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
