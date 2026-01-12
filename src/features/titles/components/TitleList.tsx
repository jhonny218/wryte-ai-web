import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TitlesApi } from '../api/titles.api';
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
}

export const TitleList: React.FC<TitleListProps> = ({ organizationId }) => {
  const queryClient = useQueryClient();
  const [editingTitle, setEditingTitle] = useState<Title | null>(null);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [titleToDelete, setTitleToDelete] = useState<Title | null>(null);
  
  const { data: titles, isLoading, error } = useQuery({
    queryKey: ['titles', organizationId],
    queryFn: () => TitlesApi.getTitles(organizationId),
    enabled: !!organizationId,
  });

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: ({ titleId, status }: { titleId: string; status: 'APPROVED' | 'REJECTED' }) =>
      TitlesApi.updateTitle(organizationId, titleId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['titles', organizationId] });
    },
  });

  const handleApprove = useCallback(async (id: string) => {
    try {
      await updateStatus({ titleId: id, status: 'APPROVED' });
      toast.success('Title approved successfully');
    } catch (error) {
      console.error('Failed to approve title:', error);
      toast.error('Failed to approve title. Please try again.');
    }
  }, [updateStatus]);

  const handleReject = useCallback(async (id: string) => {
    try {
      await updateStatus({ titleId: id, status: 'REJECTED' });
      toast.success('Title rejected successfully');
    } catch (error) {
      console.error('Failed to reject title:', error);
      toast.error('Failed to reject title. Please try again.');
    }
  }, [updateStatus]);

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
    () => createTitleColumns(handleApprove, handleReject, handleEdit, handleDelete),
    [handleApprove, handleReject, handleEdit, handleDelete]
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
  );
};
