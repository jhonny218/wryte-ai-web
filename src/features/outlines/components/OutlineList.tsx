import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table/data-table";
import { createOutlineColumns } from "./outline-columns";
import { OutlinesApi } from "../api/outlines.api";
import { BlogsApi } from "@/features/blogs/api/blogs.api";
import type { Outline } from "../types/outline.types";
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
import { useJobStatus } from "@/features/jobs/hooks/useJobStatus";

type Props = {
  organizationId: string;
  onView: (outline: Outline) => void;
  onEdit: (outline: Outline) => void;
};

export function OutlineList({ organizationId, onView, onEdit }: Props) {
  const [statusFilter, setStatusFilter] = useState<Outline['status'] | "ALL">("ALL");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [rejectJobId, setRejectJobId] = useState<string | null>(null);
  const [rejectingTitle, setRejectingTitle] = useState<string | null>(null);

  const queryClient = useQueryClient();

  useJobStatus({
    jobId: rejectJobId,
    enabled: !!rejectJobId,
    onComplete: async () => {
      toast.success(`New outline created successfully${rejectingTitle ? ` for "${rejectingTitle}"` : ''}!`);
      await queryClient.refetchQueries({ queryKey: ['outlines', organizationId] });
      setRejectJobId(null);
      setRejectingTitle(null);
    },
    onError: (error) => {
      toast.error(error || 'Failed to create new outline.');
      setRejectJobId(null);
      setRejectingTitle(null);
    },
  });

  const { data: outlines = [] } = useQuery({
    queryKey: ["outlines", organizationId],
    queryFn: () => OutlinesApi.getOutlines(organizationId),
  });

  console.log("Outlines fetched:", outlines);

  const deleteMutation = useMutation({
    mutationFn: (outlineId: string) =>
      OutlinesApi.deleteOutline(organizationId, outlineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outlines", organizationId] });
      toast.success("Outline deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete outline");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ outlineId, status }: { outlineId: string; status: "APPROVED" | "REJECTED" }) =>
      OutlinesApi.updateOutline(organizationId, outlineId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outlines", organizationId] });
    },
    onError: () => {
      toast.error("Failed to update outline status");
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
      // Update outline status to APPROVED
      await updateStatusMutation.mutateAsync({ outlineId: id, status: "APPROVED" });
      
      // Create blog for the approved outline
      await BlogsApi.createBlog(id);
      
      toast.success("Outline approved and blog generation started");
    } catch (error) {
      console.error("Failed to approve outline:", error);
      toast.error("Failed to approve outline. Please try again.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const outline = outlines.find((o) => o.id === id);
      if (!outline || !outline.blogTitleId) {
        toast.error('Outline not found or missing blog title');
        return;
      }

      // Delete the current outline
      await OutlinesApi.deleteOutline(organizationId, id);
      
      // Create a new outline with the same blog title
      const response = await OutlinesApi.createOutlines(organizationId, outline.blogTitleId);
      
      console.log('Outline creation response:', response);
      
      // Extract jobId from response
      const jobId = response?.jobId;
      
      if (!jobId) {
        console.error('No jobId found in response:', response);
        toast.error('Failed to get job ID from server. Response: ' + JSON.stringify(response));
        return;
      }
      
      setRejectJobId(jobId);
      setRejectingTitle(outline.blogTitle?.title || null);
      toast.info('Outline rejected, generating new outline... Please wait.');
    } catch (error) {
      console.error('Failed to reject outline:', error);
      toast.error('Failed to reject outline. Please try again.');
    }
  };

  const filteredOutlines =
    statusFilter === "ALL"
      ? outlines
      : outlines.filter((outline) => outline.status === statusFilter);

  const columns = createOutlineColumns(
    (id) => {
      const outline = outlines.find((o) => o.id === id);
      if (outline) onView(outline);
    },
    (id) => {
      const outline = outlines.find((o) => o.id === id);
      if (outline) onEdit(outline);
    },
    handleDelete,
    handleApprove,
    handleReject
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Status: {statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as Outline['status'] | "ALL")}
            >
              <DropdownMenuRadioItem value="ALL">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="PENDING">Pending</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="APPROVED">Approved</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="REJECTED">Rejected</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="DRAFT">Draft</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DataTable
        columns={columns}
        data={filteredOutlines}
        defaultSortColumn="createdAt"
        defaultSortDesc={true}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
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
    </>
  );
}
