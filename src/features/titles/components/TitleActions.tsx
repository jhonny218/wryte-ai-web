import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TitlesApi } from '../api/titles.api';
import { toast } from '@/hooks/useToast';
import { useQueryClient } from '@tanstack/react-query';
import { useJobStatus } from '../../jobs/hooks/useJobStatus';
import { Loader2 } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TitleActionsProps {
  organizationId: string;
  onStatusFilterChange?: (status: string) => void;
}

export const TitleActions: React.FC<TitleActionsProps> = ({ organizationId, onStatusFilterChange }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { job, isPolling } = useJobStatus({
    jobId: currentJobId,
    enabled: !!currentJobId,
    onComplete: () => {
      toast.success('Title(s) created successfully!');
      queryClient.invalidateQueries({ queryKey: ['titles', organizationId] });
      setCurrentJobId(null);
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error || 'Failed to create titles.');
      setCurrentJobId(null);
    },
  });

  const handleCreateTitles = async (date: string) => {
    try {
      const response = await TitlesApi.createTitles(organizationId, [date]);
      console.log('Create titles response:', response);
      
      // Extract jobId from response - check multiple possible structures
      const responseData = response as { jobId?: string; id?: string; data?: { id?: string } };
      const jobId = responseData?.jobId || responseData?.id || responseData?.data?.id;
      
      if (!jobId) {
        console.error('No jobId found in response:', response);
        toast.error('Failed to get job ID from server');
        return;
      }
      
      console.log('Setting job ID:', jobId);
      setCurrentJobId(jobId);
      toast.info('Creating title... Please wait.');
    } catch (error: unknown) {
      console.error('Error creating titles:', error);
      let message = 'Failed to create titles.';
      if (typeof error === 'string') {
        message = error;
      } else if (isErrorWithMessage(error)) {
        message = error.message;
      }

      function isErrorWithMessage(error: unknown): error is { message: string } {
        return (
          typeof error === 'object' &&
          error !== null &&
          'message' in error &&
          typeof (error as { message?: unknown }).message === 'string'
        );
      }

      toast.error(message);
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    onStatusFilterChange?.(value);
  };

  return (
    <div className="my-6 flex items-center justify-between gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Status: {statusFilter === 'ALL' ? 'All' : statusFilter}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup value={statusFilter} onValueChange={handleStatusFilterChange}>
            <DropdownMenuRadioItem value="ALL">All</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="APPROVED">Approved</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="PENDING">Pending</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="REJECTED">Rejected</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="DRAFT">Draft</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <Button onClick={() => setOpen(true)} disabled={isPolling}>
          {isPolling ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Title'
          )}
        </Button>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Title</AlertDialogTitle>
            <AlertDialogDescription>
              Pick a scheduled date for the new title. A single title will be created for the chosen date.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Scheduled date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-md border px-3 py-2 bg-background"
              disabled={isPolling}
            />
          </div>

          {isPolling && job && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing... {job.status === 'PENDING' ? 'Queued' : 'Generating title'}</span>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPolling}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleCreateTitles(selectedDate)} disabled={isPolling}>
              {isPolling ? 'Processing...' : 'Create'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
