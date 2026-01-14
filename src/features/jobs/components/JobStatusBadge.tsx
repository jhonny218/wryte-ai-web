import React from "react";
import { Badge } from "@/components/ui/badge";

type Props = {
  status?: string | null;
};

export const JobStatusBadge: React.FC<Props> = ({ status }) => {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    APPROVED: 'default',
    PENDING: 'secondary',
    REJECTED: 'destructive',
    DRAFT: 'outline',
  };

  const s = status ?? '';

  return (
    <Badge variant={variants[s] || 'outline'}>
      {s}
    </Badge>
  );
};

export default JobStatusBadge;
