import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Title } from "@/features/titles/types/title.types";
import { SortableHeader } from "@/components/data-table/column-header";

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

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const createTitleColumns = (
  onApprove: (id: string) => void,
  onReject: (id: string) => void
): ColumnDef<Title>[] => [
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
          variant="outline"
          size="sm"
          onClick={() => onReject(row.original.id)}
        >
          Reject
        </Button>
        <Button
          size="sm"
          onClick={() => onApprove(row.original.id)}
        >
          Approve
        </Button>
      </div>
    ),
  },
];
