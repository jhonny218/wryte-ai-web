import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Column } from "@tanstack/react-table";

interface SortableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  label: string;
}

export function SortableHeader<TData, TValue>({ column, label }: SortableHeaderProps<TData, TValue>) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="hover:bg-primary/10 hover:text-primary"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
