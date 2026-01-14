import { useState } from 'react';
import { SectionTitle } from '@/components/layout/section-title';
import { OutlineList } from '@/features/outlines/components/OutlineList';
import { OutlinePreview } from '@/features/outlines/components/OutlinePreview';
import { OutlineEditor } from '@/features/outlines/components/OutlineEditor';
import type { Outline } from '@/features/outlines/types/outline.types';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OutlinesApi } from '@/features/outlines/api/outlines.api';
import { toast } from 'sonner';
import { useCurrentOrganization } from '@/features/organization/hooks/useCurrentOrganization';
import LoadingSpinner from '@/components/feedback/LoadingSpinner';

export default function OutlinesPage() {
  const { data: organization, isLoading: isLoadingOrg } = useCurrentOrganization();
  const [selectedOutline, setSelectedOutline] = useState<Outline | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'edit' | null>(null);
  const [deleteOutline, setDeleteOutline] = useState<Outline | null>(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (outlineId: string) => {
      if (!organization) throw new Error('Organization not found');
      return OutlinesApi.deleteOutline(organization.id, outlineId);
    },
    onSuccess: () => {
      if (organization) {
        queryClient.invalidateQueries({ queryKey: ['outlines', organization.id] });
      }
      toast.success('Outline deleted successfully');
      setViewMode(null);
      setSelectedOutline(null);
    },
    onError: () => {
      toast.error('Failed to delete outline');
    },
  });

  const handleView = (outline: Outline) => {
    setSelectedOutline(outline);
    setViewMode('preview');
  };

  const handleEdit = (outline: Outline) => {
    setSelectedOutline(outline);
    setViewMode('edit');
  };

  const handleDelete = (outline: Outline) => {
    setDeleteOutline(outline);
  };

  const confirmDelete = () => {
    if (deleteOutline) {
      deleteMutation.mutate(deleteOutline.id);
      setDeleteOutline(null);
    }
  };

  const handlePreviewEdit = () => {
    setViewMode('edit');
  };

  const handlePreviewDelete = () => {
    if (selectedOutline) {
      setViewMode(null);
      handleDelete(selectedOutline);
    }
  };


  if (isLoadingOrg) {
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

  return (
    <div className="container mx-auto py-8 px-4 w-[90%]">
      <SectionTitle title="Outlines" subtitle="Create and edit content outlines." />
      
      <div className="mt-8">
        <OutlineList
          organizationId={organization.id}
          onView={handleView}
          onEdit={handleEdit}
        />
      </div>

      <OutlinePreview
        outline={selectedOutline}
        open={viewMode === 'preview'}
        onOpenChange={(open) => {
          if (!open) {
            setViewMode(null);
            setSelectedOutline(null);
          }
        }}
        onEdit={handlePreviewEdit}
        onDelete={handlePreviewDelete}
      />

      <OutlineEditor
        outline={selectedOutline}
        organizationId={organization.id}
        open={viewMode === 'edit'}
        onOpenChange={(open) => {
          if (!open) {
            setViewMode(null);
            setSelectedOutline(null);
          }
        }}
        onSuccess={() => {
          setViewMode(null);
          setSelectedOutline(null);
        }}
      />

      <AlertDialog
        open={deleteOutline !== null}
        onOpenChange={() => setDeleteOutline(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Outline</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this outline? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
