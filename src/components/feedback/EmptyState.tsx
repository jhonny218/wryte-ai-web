import React from 'react'
import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: LucideIcon
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'secondary'
  }
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
        <Icon className="h-12 w-12 text-muted-foreground" />
      ) : (
        <div className="h-12 w-12 rounded-full bg-muted/30" />
      )}

      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-center text-sm text-muted-foreground max-w-[36rem]">{description}</p>

      {action && (
        <Button onClick={action.onClick} variant={action.variant ?? 'default'}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
