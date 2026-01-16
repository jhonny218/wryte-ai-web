import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table/data-table";
import { createBlogColumns } from "./blog-columns";
import { BlogsApi } from "../api/blogs.api";
import type { Blog, BlogStatusType } from "../types/blog.types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

type Props = {
  organizationId: string;
  onView: (blog: Blog) => void;
  onEdit: (blog: Blog) => void;
  onExport: (blog: Blog) => void;
};

export function BlogList({ organizationId, onView, onEdit, onExport }: Props) {
  const [statusFilter, setStatusFilter] = useState<BlogStatusType | "ALL">("ALL");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: blogs = [] } = useQuery({
    queryKey: ["blogs", organizationId],
    queryFn: () => BlogsApi.getBlogs(organizationId),
  });

  const deleteMutation = useMutation({
    mutationFn: (blogId: string) =>
      BlogsApi.deleteBlog(organizationId, blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs", organizationId] });
      toast.success("Blog deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete blog");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ blogId, status }: { blogId: string; status: BlogStatusType }) =>
      BlogsApi.updateBlog(organizationId, blogId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs", organizationId] });
    },
    onError: () => {
      toast.error("Failed to update blog status");
    },
  });

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateStatusMutation.mutateAsync({ 
        blogId: id, 
        status: "PUBLISHED",
      });
      toast.success("Blog approved and published");
    } catch (error) {
      console.error("Failed to approve blog:", error);
      toast.error("Failed to approve blog. Please try again.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateStatusMutation.mutateAsync({ 
        blogId: id, 
        status: "ARCHIVED",
      });
      toast.success("Blog rejected and archived");
    } catch (error) {
      console.error("Failed to reject blog:", error);
      toast.error("Failed to reject blog. Please try again.");
    }
  };

  const filteredBlogs =
    statusFilter === "ALL"
      ? blogs
      : blogs.filter((blog) => blog.status === statusFilter);

  const columns = createBlogColumns(
    (id) => {
      const blog = blogs.find((b) => b.id === id);
      if (blog) onView(blog);
    },
    (id) => {
      const blog = blogs.find((b) => b.id === id);
      if (blog) onEdit(blog);
    },
    handleDelete,
    (id) => {
      const blog = blogs.find((b) => b.id === id);
      if (blog) onExport(blog);
    },
    handleApprove,
    handleReject
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" aria-label="Filter">
              <Filter className="mr-2 h-4 w-4" />
              Status: {statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as BlogStatusType | "ALL")}
            >
              <DropdownMenuRadioItem value="ALL">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="DRAFT">Draft</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="PUBLISHED">Published</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="SCHEDULED">Scheduled</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="ARCHIVED">Archived</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DataTable
        columns={columns}
        data={filteredBlogs}
        defaultSortColumn="createdAt"
        defaultSortDesc={true}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
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
    </>
  );
}
