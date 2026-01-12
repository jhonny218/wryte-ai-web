import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Calendar, CheckCircle2, XCircle, Pencil, Clock, Trash2 } from 'lucide-react';
import type { Title } from '@/features/titles/types/title.types';
import { formatDate } from '@/hooks/useDateFormatter';

interface TitleDetailsDialogProps {
  title: Title | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (title: Title) => void;
  onReject?: (title: Title) => void;
  onEdit?: (title: Title) => void;
  onDelete?: (title: Title) => void;
}

const statusConfig = {
  APPROVED: { label: 'Approved', variant: 'default' as const },
  PENDING: { label: 'Pending', variant: 'secondary' as const },
  REJECTED: { label: 'Rejected', variant: 'destructive' as const },
  DRAFT: { label: 'Draft', variant: 'outline' as const },
};

export function TitleDetailsDialog({
  title,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: TitleDetailsDialogProps) {
  if (!title) return null;

  const statusInfo = statusConfig[title.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-4 pb-4">
          <DialogTitle className="text-xl leading-tight">
            {title.title}
          </DialogTitle>
          <div className="flex flex-col gap-3">
            <Badge variant={statusInfo.variant} className="w-fit">
              {statusInfo.label}
            </Badge>
            {title.scheduledDate && (
              <DialogDescription className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Scheduled for {formatDate(title.scheduledDate, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </DialogDescription>
            )}
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-6 py-2">
          {title.aiGenerationContext && (
            <Card className="border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  AI Generation Context
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {title.aiGenerationContext}
                </p>
              </CardContent>
            </Card>
          )}

          {title.outline && (
            <Card className="border-l-4 border-l-secondary">
              <CardContent className="pt-6">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  Content Outline
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {title.outline}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Created {format(new Date(title.createdAt), 'MMM d, yyyy')}</span>
            </div>
            {title.updatedAt !== title.createdAt && (
              <>
                <span>•</span>
                <span>Updated {format(new Date(title.updatedAt), 'MMM d, yyyy')}</span>
              </>
            )}
          </div>
        </div>
        <Separator />

        <DialogFooter className="gap-3 sm:gap-3 flex-col sm:flex-row">
          <div className="flex gap-2 flex-1">
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(title)} className="gap-2 flex-1 sm:flex-initial">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" onClick={() => onDelete(title)} className="gap-2 flex-1 sm:flex-initial text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {onReject && title.status !== 'REJECTED' && (
              <Button variant="destructive" onClick={() => onReject(title)} className="gap-2 flex-1 sm:flex-initial">
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            )}
            {onApprove && title.status !== 'APPROVED' && (
              <Button onClick={() => onApprove(title)} className="gap-2 flex-1 sm:flex-initial">
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
