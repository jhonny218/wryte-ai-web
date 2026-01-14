import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Pencil, Trash2, Check, X, FileDown } from "lucide-react";
import type { Blog } from "@/features/blogs/types/blog.types";
import { SortableHeader } from "@/components/data-table/column-header";
import { formatDate } from "@/hooks/useDateFormatter";

const getStatusColor = (status: string) => {
  switch (status) {
    case "DRAFT":
      return "bg-gray-100 text-gray-800 border-gray-300";
    case "PUBLISHED":
      return "bg-green-100 text-green-800 border-green-300";
    case "SCHEDULED":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "ARCHIVED":
      return "bg-orange-100 text-orange-800 border-orange-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const createBlogColumns = (
  onView: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
  onExport: (id: string) => void,
  onApprove?: (id: string) => void,
  onReject?: (id: string) => void
): ColumnDef<Blog>[] => {
  return [
    {
      accessorKey: "outline.blogTitle.title",
      header: ({ column }) => <SortableHeader column={column} label="Title" />,
      cell: ({ row }) => (
        <div className="font-medium max-w-[300px]">
          {row.original.outline?.blogTitle?.title || row.original.blogOutlineId}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <SortableHeader column={column} label="Status" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant="outline" className={getStatusColor(status)}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "wordCount",
      header: ({ column }) => <SortableHeader column={column} label="Word Count" />,
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.getValue("wordCount")?.toLocaleString() || 0} words
        </div>
      ),
    },
    {
      accessorKey: "publishedAt",
      header: ({ column }) => <SortableHeader column={column} label="Published" />,
      cell: ({ row }) => {
        const publishedAt = row.getValue("publishedAt") as string | null;
        return (
          <div className="text-muted-foreground">
            {publishedAt ? formatDate(publishedAt) : "—"}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <SortableHeader column={column} label="Created" />,
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {formatDate(row.getValue("createdAt"))}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => <SortableHeader column={column} label="Updated" />,
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
        const isDraft = row.original.status === "DRAFT";
        return (
          <div className="flex items-center gap-1">
            {isDraft && onApprove && onReject && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onApprove(row.original.id)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
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
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Preview</TooltipContent>
            </Tooltip>
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
                  onClick={() => onExport(row.original.id)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <FileDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export</TooltipContent>
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
