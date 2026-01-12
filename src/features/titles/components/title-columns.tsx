import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Pencil, Trash2, X } from "lucide-react";
import type { Title } from "@/features/titles/types/title.types";
import { SortableHeader } from "@/components/data-table/column-header";
import { formatDate } from "@/hooks/useDateFormatter";

const getStatusBadge = (status: string) => {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    APPROVED: 'default',
    PENDING: 'secondary',
    REJECTED: 'destructive',
    DRAFT: 'outline',
  };
  return (
    <Badge variant={variants[status] || 'outline'}>
      {status}
    </Badge>
  );
};

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
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onReject(row.original.id)}
            className="text-destructive hover:text-destructive"
            title="Reject"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onApprove(row.original.id)}
            className="text-green-600 hover:text-green-600"
            title="Approve"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original.id)}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(row.original.id)}
            className="text-destructive hover:text-destructive"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
};
