import type { ColumnDef } from "@tanstack/react-table";
import { JobStatusBadge } from "@/features/jobs/components/JobStatusBadge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, Pencil, Trash2, X } from "lucide-react";
import type { Title } from "@/features/titles/types/title.types";
import { SortableHeader } from "@/components/data-table/column-header";
import { formatDate } from "@/hooks/useDateFormatter";

export const createTitleColumns = (
  onReject: (id: string) => void,
  onApprove: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<Title>[] => {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => <SortableHeader column={column} label="Title" />,
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("title")}</div>
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
      accessorKey: "scheduledDate",
      header: ({ column }) => <SortableHeader column={column} label="Scheduled Date" />,
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {formatDate(row.getValue("scheduledDate"))}
        </div>
      ),
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
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <div className="flex items-center gap-2">
            {status !== "APPROVED" && status !== "REJECTED" ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onReject(row.original.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reject</TooltipContent>
              </Tooltip>
            ) : (
              <div className="w-10 h-10" />
            )}
            {status !== "APPROVED" ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onApprove(row.original.id)}
                    className="text-green-600 hover:text-green-600"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Approve</TooltipContent>
              </Tooltip>
            ) : (
              <div className="w-10 h-10" />
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(row.original.id)}
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
