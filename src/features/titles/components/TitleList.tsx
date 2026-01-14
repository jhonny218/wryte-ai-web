import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TitlesApi } from '../api/titles.api';
import { OutlinesApi } from '@/features/outlines/api/outlines.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/feedback/LoadingSpinner';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FileText } from 'lucide-react';
import { DataTable } from '@/components/data-table/data-table';
import { createTitleColumns } from './title-columns';
import { EditTitleSheet } from './EditTitleSheet';
import { toast } from '@/hooks/useToast';
import { useCallback, useMemo, useState } from 'react';
import type { Title } from '../types/title.types';
import { JobPoller } from '@/features/jobs/components/JobPoller';
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

interface TitleListProps {
  organizationId: string;
  statusFilter?: string;
}

export const TitleList: React.FC<TitleListProps> = ({ organizationId, statusFilter = 'ALL' }) => {
  const queryClient = useQueryClient();
  const [editingTitle, setEditingTitle] = useState<Title | null>(null);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [titleToDelete, setTitleToDelete] = useState<Title | null>(null);
  const [pendingJobs, setPendingJobs] = useState<Array<{ jobId: string; date: string }>>([]);

  const handleJobComplete = useCallback(async (jobId: string) => {
    const job = pendingJobs.find(j => j.jobId === jobId);
    if (job) {
      toast.success(`New title created successfully for ${formatDate(job.date)}!`);
      await queryClient.refetchQueries({ queryKey: ['titles', organizationId] });
      setPendingJobs(prev => prev.filter(j => j.jobId !== jobId));
    }
  }, [pendingJobs, queryClient, organizationId]);

  const handleJobError = useCallback((jobId: string) => {
    toast.error('Failed to create new title.');
    setPendingJobs(prev => prev.filter(j => j.jobId !== jobId));
  }, []);
  
  const { data: titlesData, isLoading, error } = useQuery({
    queryKey: ['titles', organizationId],
    queryFn: () => TitlesApi.getTitles(organizationId),
    enabled: !!organizationId,
  });

  const titles = useMemo(() => {
    if (!titlesData) return [];
    if (statusFilter === 'ALL') return titlesData;
    return titlesData.filter(title => title.status === statusFilter);
  }, [titlesData, statusFilter]);

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: ({ titleId, status }: { titleId: string; status: 'APPROVED' | 'REJECTED' }) =>
      TitlesApi.updateTitle(organizationId, titleId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['titles', organizationId] });
    },
  });

  const handleApprove = useCallback(async (id: string) => {
    try {
      // Update title status to APPROVED
      await updateStatus({ titleId: id, status: 'APPROVED' });
      
      // Create outline for the approved title
      await OutlinesApi.createOutlines(organizationId, id);
      
      toast.success('Title approved and outline creation started');
    } catch (error) {
      console.error('Failed to approve title:', error);
      toast.error('Failed to approve title. Please try again.');
    }
  }, [updateStatus, organizationId]);

  const handleReject = useCallback(async (id: string) => {
    try {
      const title = titles?.find((t) => t.id === id);
      if (!title?.scheduledDate) return;

      // Delete the current title
      await TitlesApi.deleteTitle(organizationId, id);
      
      // Create a new title with the same scheduled date
      const response = await TitlesApi.createTitles(organizationId, [title.scheduledDate]);
      
      // Extract jobId from response
      const responseData = response as { jobId?: string; id?: string; data?: { id?: string } };
      const jobId = responseData?.jobId || responseData?.id || responseData?.data?.id;
      
      if (!jobId) {
        console.error('No jobId found in response:', response);
        toast.error('Failed to get job ID from server');
        return;
      }
      
      // Add this job to the pending jobs list
      setPendingJobs(prev => [...prev, { jobId, date: title.scheduledDate! }]);
      toast.info('Title rejected, generating new title... Please wait.');
    } catch (error) {
      console.error('Failed to reject title:', error);
      toast.error('Failed to reject title. Please try again.');
    }
  }, [titles, organizationId]);

  const handleEdit = useCallback((id: string) => {
    const title = titles?.find((t) => t.id === id);
    if (title) {
      setEditingTitle(title);
      setEditSheetOpen(true);
    }
  }, [titles]);

  const handleDelete = useCallback((id: string) => {
    const title = titles?.find((t) => t.id === id);
    if (!title) return;

    setTitleToDelete(title);
    setDeleteDialogOpen(true);
  }, [titles]);

  const confirmDelete = useCallback(async () => {
    if (!titleToDelete) return;

    try {
      await TitlesApi.deleteTitle(organizationId, titleToDelete.id);
      toast.success('Title deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['titles', organizationId] });
      setDeleteDialogOpen(false);
      setTitleToDelete(null);
    } catch (error) {
      console.error('Failed to delete title:', error);
      toast.error('Failed to delete title. Please try again.');
    }
  }, [titleToDelete, organizationId, queryClient]);

  const handleSaveEdit = async (
    titleId: string,
    updates: Partial<Pick<Title, 'title' | 'scheduledDate'>>
  ) => {
    try {
      await TitlesApi.updateTitle(organizationId, titleId, updates);
      toast.success('Title updated successfully');
      await queryClient.invalidateQueries({ queryKey: ['titles', organizationId] });
    } catch (error) {
      console.error('Failed to update title:', error);
      toast.error('Failed to update title. Please try again.');
      throw error;
    }
  };

  const columns = useMemo(
    () => createTitleColumns(handleReject, handleApprove, handleEdit, handleDelete),
    [handleReject, handleApprove, handleEdit, handleDelete]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState
            title="Error loading titles"
            description="There was a problem loading the titles. Please try again."
            icon={FileText}
          />
        </CardContent>
      </Card>
    );
  }

  if (!titles || titles.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState
            title="No titles yet"
            description="Generate your first batch of titles to get started."
            icon={FileText}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Job Pollers - hidden components that poll for job status */}
      {pendingJobs.map(({ jobId, date }) => (
        <JobPoller
          key={jobId}
          jobId={jobId}
          date={date}
          onComplete={handleJobComplete}
          onError={handleJobError}
        />
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Generated Titles</CardTitle>
          <CardDescription>
            {titles.length} {titles.length === 1 ? 'title' : 'titles'} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={titles}
            defaultSortColumn="scheduledDate"
            defaultSortDesc={true}
          />
        </CardContent>

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
      </Card>
    </>
  );
};
