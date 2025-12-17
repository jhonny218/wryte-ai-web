import React from 'react';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nothing here yet',
  description = 'There is no content to show right now.',
  icon: Icon,
  action,
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 py-12">
      {Icon ? (
        <Icon className="text-muted-foreground h-12 w-12" />
      ) : (
        <div className="bg-muted/30 h-12 w-12 rounded-full" />
      )}

      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground max-w-[36rem] text-center text-sm">{description}</p>

      {action && (
        <Button onClick={action.onClick} variant={action.variant ?? 'default'}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
