import { SectionTitle } from '@/components/layout/section-title';
import { CalendarView } from '@/features/calendar';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { TitlesApi } from '@/features/titles/api/titles.api';
import { useCurrentOrganization } from '@/features/organization';
import { toast } from '@/hooks/useToast';
import { format } from 'date-fns';
import type { Title } from '@/features/titles/types/title.types';
import LoadingSpinner from '@/components/feedback/LoadingSpinner';
import { EditTitleSheet } from '@/features/titles/components/EditTitleSheet';
import { useState } from 'react';
import { useJobStatus } from '@/hooks/useJobStatus';
import { formatDate } from '@/hooks/useDateFormatter';
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

export default function CalendarPage() {
  const { data: organization, isLoading: isLoadingOrg } = useCurrentOrganization();
  const queryClient = useQueryClient();
  const [editingTitle, setEditingTitle] = useState<Title | null>(null);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [titleToDelete, setTitleToDelete] = useState<Title | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [creatingDate, setCreatingDate] = useState<string | null>(null);
  const [onDialogClose, setOnDialogClose] = useState<(() => void) | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11

  const { isPolling } = useJobStatus({
    jobId: currentJobId,
    enabled: !!currentJobId,
    onComplete: async () => {
      // Refetch titles to ensure data is fresh before closing dialog
      await queryClient.refetchQueries({ queryKey: ['calendar-titles', organization?.id, currentYear, currentMonth] });
      toast.success(`Title created successfully for ${creatingDate ? formatDate(creatingDate) : 'selected date'}!`);
      setCurrentJobId(null);
      setCreatingDate(null);
      // Close the dialog after data is refreshed
      if (onDialogClose) {
        onDialogClose();
        setOnDialogClose(null);
      }
    },
    onError: (error) => {
      toast.error(error || 'Failed to create title.');
      setCurrentJobId(null);
      setCreatingDate(null);
      // Close the dialog
      if (onDialogClose) {
        onDialogClose();
        setOnDialogClose(null);
      }
    },
  });

  // Fetch titles for current month
  const { data: titles = [], isLoading, error } = useQuery({
    queryKey: ['calendar-titles', organization?.id, currentYear, currentMonth],
    queryFn: async () => {
      try {
        const data = await TitlesApi.getCalendarTitles(organization!.id, currentYear, currentMonth);
        console.log('Calendar titles fetched:', data);
        return data;
      } catch (err) {
        console.error('Error fetching calendar titles:', err);
        throw err;
      }
    },
    enabled: !!organization?.id,
  });

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: ({ titleId, status }: { titleId: string; status: 'APPROVED' | 'REJECTED' }) =>
      TitlesApi.updateTitle(organization!.id, titleId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-titles', organization?.id, currentYear, currentMonth] });
    },
  });

  // Handler for approving a title
  const handleApprove = async (title: Title) => {
    try {
      await updateStatus({ titleId: title.id, status: 'APPROVED' });
      toast.success('Title approved successfully');
    } catch (error) {
      console.error('Failed to approve title:', error);
      toast.error('Failed to approve title. Please try again.');
    }
  };

  // Handler for rejecting a title
  const handleReject = async (title: Title) => {
    try {
      await updateStatus({ titleId: title.id, status: 'REJECTED' });
      toast.success('Title rejected successfully');
    } catch (error) {
      console.error('Failed to reject title:', error);
      toast.error('Failed to reject title. Please try again.');
    }
  };

  // Handler for editing a title
  const handleEdit = (title: Title) => {
    setEditingTitle(title);
    setEditSheetOpen(true);
  };

  // Handler for saving edits
  const handleSaveEdit = async (
    titleId: string,
    updates: Partial<Pick<Title, 'title' | 'scheduledDate'>>
  ) => {
    try {
      await TitlesApi.updateTitle(organization!.id, titleId, updates);
      toast.success('Title updated successfully');
      await queryClient.invalidateQueries({ queryKey: ['calendar-titles', organization?.id, currentYear, currentMonth] });
      setEditSheetOpen(false);
    } catch (error) {
      console.error('Failed to update title:', error);
      toast.error('Failed to update title. Please try again.');
      throw error;
    }
  };

  // Handler for event drop (drag and drop)
  const handleEventDrop = async (titleId: string, newDate: Date) => {
    try {
      const scheduledDate = format(newDate, 'yyyy-MM-dd');
      await TitlesApi.updateTitle(organization!.id, titleId, { scheduledDate });
      toast.success('Title moved successfully');
      
      // Invalidate both current month and potentially the new month if different
      const newYear = newDate.getFullYear();
      const newMonth = newDate.getMonth() + 1;
      
      await queryClient.refetchQueries({ queryKey: ['calendar-titles', organization?.id, currentYear, currentMonth] });
      
      // If moved to a different month, invalidate that month too
      if (newYear !== currentYear || newMonth !== currentMonth) {
        await queryClient.invalidateQueries({ queryKey: ['calendar-titles', organization?.id, newYear, newMonth] });
      }
    } catch (error) {
      console.error('Failed to move title:', error);
      toast.error('Failed to move title. Please try again.');
    }
  };

  // Handler for deleting a title
  const handleDelete = (title: Title) => {
    setTitleToDelete(title);
    setDeleteDialogOpen(true);
  };

  // Confirm delete handler
  const confirmDelete = async () => {
    if (!organization?.id || !titleToDelete) return;

    try {
      await TitlesApi.deleteTitle(organization.id, titleToDelete.id);
      toast.success(`Title "${titleToDelete.title}" deleted successfully`);
      await queryClient.invalidateQueries({ queryKey: ['calendar-titles', organization.id, currentYear, currentMonth] });
      setDeleteDialogOpen(false);
      setTitleToDelete(null);
    } catch (error) {
      console.error('Failed to delete title:', error);
      toast.error('Failed to delete title. Please try again.');
    }
  };

  // Handler for creating a new title
  const handleCreate = async (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    console.log('Create title for date:', dateStr);
    
    if (!organization?.id) {
      toast.error('Organization ID not found');
      return;
    }

    try {
      // Call API to create titles for the selected date
      const response = await TitlesApi.createTitles(organization.id, [dateStr]);
      console.log('Create titles response:', response);
      
      // Extract jobId from response
      const responseData = response as { jobId?: string; id?: string; data?: { id?: string } };
      const jobId = responseData?.jobId || responseData?.id || responseData?.data?.id;
      
      if (!jobId) {
        console.error('No jobId found in response:', response);
        toast.error('Failed to get job ID from server');
        return;
      }
      
      console.log('Setting job ID:', jobId);
      setCurrentJobId(jobId);
      setCreatingDate(dateStr);
      toast.info(`Creating title for ${formatDate(dateStr)}... Please wait.`);
    } catch (error) {
      console.error('Failed to create title:', error);
      toast.error('Failed to create title. Please try again.');
    }
  };

  if (isLoadingOrg || isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 w-[80%]">
        <SectionTitle title="Calendar" subtitle="View and manage your scheduled content." />
        <div className="mt-8 text-destructive text-center">
          <p>Failed to load calendar data.</p>
          <p className="text-sm mt-2">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 w-[90%]">
      <SectionTitle title="Calendar" subtitle="View and manage your scheduled content." />
      <div className="mt-8">
        <CalendarView
          titles={titles}
          onApprove={handleApprove}
          onReject={handleReject}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
          onEventDrop={handleEventDrop}
          isCreating={isPolling}
          onCreateComplete={(closeDialog) => setOnDialogClose(() => closeDialog)}
          currentDate={currentDate}
          onNavigate={setCurrentDate}
        />
      </div>

      <EditTitleSheet
        title={editingTitle}
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        onSave={handleSaveEdit}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Title</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{titleToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
