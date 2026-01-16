import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Pencil, Trash2, Check, X } from "lucide-react";
import type { Outline } from "@/features/outlines/types/outline.types";
import { SortableHeader } from "@/components/data-table/column-header";
import { formatDate } from "@/hooks/useDateFormatter";
import { JobStatusBadge } from "@/features/jobs/components/JobStatusBadge";

export const createOutlineColumns = (
  onView: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
  onApprove: (id: string) => void,
  onReject: (id: string) => void
): ColumnDef<Outline>[] => {
  return [
    {
      accessorKey: "blogTitle.title",
      header: ({ column }) => <SortableHeader column={column} label="Title" />,
      cell: ({ row }) => (
        <div className="font-medium max-w-[300px]">
          {row.original.blogTitle?.title || row.original.blogTitleId}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <SortableHeader column={column} label="Status" />,
      cell: ({ row }) => (
        <JobStatusBadge status={row.getValue("status") as string} />
      ),
    },
    {
      accessorKey: "seoKeywords",
      header: "Keywords",
      cell: ({ row }) => {
        const keywords = (row.getValue("seoKeywords") as string[]) || [];
        return (
          <div className="flex gap-1 flex-wrap max-w-[250px]">
            {keywords.slice(0, 3).map((keyword, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {keywords.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{keywords.length - 3}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <SortableHeader column={column} label="Created At" />,
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {formatDate(row.getValue("createdAt"))}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => <SortableHeader column={column} label="Updated At" />,
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {formatDate(row.getValue("updatedAt"))}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const isPending = row.original.status === "PENDING";
        return (
          <div className="flex items-center gap-1">
            {isPending && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onApprove(row.original.id)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      aria-label="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Approve</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onReject(row.original.id)}
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      aria-label="Reject"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reject</TooltipContent>
                </Tooltip>
              </>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(row.original.id)}
                  aria-label="View"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(row.original.id)}
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(row.original.id)}
                  className="text-destructive hover:text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
  ];
};
