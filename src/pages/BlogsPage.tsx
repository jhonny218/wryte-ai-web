import { useState } from 'react';
import { SectionTitle } from '@/components/layout/section-title';
import { BlogList } from '@/features/blogs/components/BlogList';
import { BlogPreview } from '@/features/blogs/components/BlogPreview';
import { BlogEditor } from '@/features/blogs/components/BlogEditor';
import { BlogExport } from '@/features/blogs/components/BlogExport';
import type { Blog } from '@/features/blogs/types/blog.types';
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
import { BlogsApi } from '@/features/blogs/api/blogs.api';
import { toast } from 'sonner';
import { useCurrentOrganization } from '@/features/organization/hooks/useCurrentOrganization';
import LoadingSpinner from '@/components/feedback/LoadingSpinner';

export default function BlogsPage() {
  const { data: organization, isLoading: isLoadingOrg } = useCurrentOrganization();
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'edit' | 'export' | null>(null);
  const [deleteBlog, setDeleteBlog] = useState<Blog | null>(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (blogId: string) => {
      if (!organization) throw new Error('Organization not found');
      return BlogsApi.deleteBlog(organization.id, blogId);
    },
    onSuccess: () => {
      if (organization) {
        queryClient.invalidateQueries({ queryKey: ['blogs', organization.id] });
      }
      toast.success('Blog deleted successfully');
      setViewMode(null);
      setSelectedBlog(null);
    },
    onError: () => {
      toast.error('Failed to delete blog');
    },
  });

  const handleView = (blog: Blog) => {
    setSelectedBlog(blog);
    setViewMode('preview');
  };

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setViewMode('edit');
  };

  const handleExport = (blog: Blog) => {
    setSelectedBlog(blog);
    setViewMode('export');
  };

  const handleDelete = (blog: Blog) => {
    setDeleteBlog(blog);
  };

  const confirmDelete = () => {
    if (deleteBlog) {
      deleteMutation.mutate(deleteBlog.id);
      setDeleteBlog(null);
    }
  };

  const handlePreviewEdit = () => {
    setViewMode('edit');
  };

  const handlePreviewDelete = () => {
    if (selectedBlog) {
      setViewMode(null);
      handleDelete(selectedBlog);
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
      <SectionTitle title="Blogs" subtitle="Write, edit, and publish blog posts." />
      
      <div className="mt-8">
        <BlogList
          organizationId={organization.id}
          onView={handleView}
          onEdit={handleEdit}
          onExport={handleExport}
        />
      </div>

      <BlogPreview
        blog={selectedBlog}
        open={viewMode === 'preview'}
        onOpenChange={(open) => {
          if (!open) {
            setViewMode(null);
            setSelectedBlog(null);
          }
        }}
        onEdit={handlePreviewEdit}
        onDelete={handlePreviewDelete}
      />

      <BlogEditor
        blog={selectedBlog}
        organizationId={organization.id}
        open={viewMode === 'edit'}
        onOpenChange={(open) => {
          if (!open) {
            setViewMode(null);
            setSelectedBlog(null);
          }
        }}
        onSuccess={() => {
          setViewMode(null);
          setSelectedBlog(null);
        }}
      />

      <BlogExport
        blog={selectedBlog}
        open={viewMode === 'export'}
        onOpenChange={(open) => {
          if (!open) {
            setViewMode(null);
            setSelectedBlog(null);
          }
        }}
      />

      <AlertDialog
        open={deleteBlog !== null}
        onOpenChange={() => setDeleteBlog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog? This action cannot be undone.
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
