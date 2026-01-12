import { useMemo, useState, useCallback } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import type { SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';

import type { Title } from '@/features/titles/types/title.types';
import type { CalendarEvent } from '../types/calendar.types';
import { titleToCalendarEvent } from '../types/calendar.types';
import { TitleDetailsDialog } from './TitleDetailsDialog';
import { CreateTitleDialog } from './CreateTitleDialog';
import { Badge } from '@/components/ui/badge';

// Setup the localizer for react-big-calendar
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarViewProps {
  titles: Title[];
  onApprove?: (title: Title) => void;
  onReject?: (title: Title) => void;
  onEdit?: (title: Title) => void;
  onDelete?: (title: Title) => void;
  onCreate?: (date: Date) => void;
}

export function CalendarView({ titles, onApprove, onReject, onEdit, onDelete, onCreate }: CalendarViewProps) {
  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createDate, setCreateDate] = useState<Date | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Convert titles to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return titles.map(titleToCalendarEvent);
  }, [titles]);

  // Handle clicking on an event (title)
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedTitle(event.resource);
    setDetailsOpen(true);
  }, []);

  // Handle clicking on an empty slot (date without title)
  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    // Only handle single day clicks in month view
    if (slotInfo.action === 'click') {
      const hasEvent = events.some(
        (event) => format(event.start, 'yyyy-MM-dd') === format(slotInfo.start, 'yyyy-MM-dd')
      );

      if (!hasEvent && onCreate) {
        setCreateDate(slotInfo.start);
        setCreateOpen(true);
      }
    }
  }, [events, onCreate]);

  // Custom event style based on status
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const title = event.resource;
    return {
      style: {
        backgroundColor: undefined, // Let CSS handle it via data-status
      },
      className: `rbc-event-status-${title.status.toLowerCase()}`,
    };
  }, []);

  // Wrap handlers to close dialog after action
  const handleEditWithClose = useCallback((title: Title) => {
    setDetailsOpen(false);
    onEdit?.(title);
  }, [onEdit]);

  const handleDeleteWithClose = useCallback((title: Title) => {
    setDetailsOpen(false);
    onDelete?.(title);
  }, [onDelete]);

  const handleApproveWithClose = useCallback((title: Title) => {
    setDetailsOpen(false);
    onApprove?.(title);
  }, [onApprove]);

  const handleRejectWithClose = useCallback((title: Title) => {
    setDetailsOpen(false);
    onReject?.(title);
  }, [onReject]);

  // Custom event component to add data-status attribute
  const EventComponent = useCallback(({ event }: { event: CalendarEvent }) => {
    const statusConfig = {
      APPROVED: { label: 'Approved', variant: 'default' as const },
      PENDING: { label: 'Pending', variant: 'secondary' as const },
      REJECTED: { label: 'Rejected', variant: 'destructive' as const },
      DRAFT: { label: 'Draft', variant: 'outline' as const },
    };

    const title = event.resource;
    const truncateTitle = (text: string, maxLength: number = 50) => {
      if (text.length <= maxLength) return text;
      
      // Try to break at a colon or dash
      const colonIndex = text.indexOf(':');
      if (colonIndex > 0 && colonIndex < maxLength) {
        const firstLine = text.substring(0, colonIndex + 1);
        const secondLine = text.substring(colonIndex + 1).trim();
        return (
          <div className="space-y-1">
            <div className="font-semibold text-xs leading-tight">{firstLine}</div>
            <div className="text-[10px] leading-tight opacity-90">
              {secondLine.length > 25 ? secondLine.substring(0, 25) + '...' : secondLine}
            </div>
            <Badge variant={statusConfig[title.status].variant} className="text-[9px] h-4 px-1.5 mt-1">
              {statusConfig[title.status].label}
            </Badge>
          </div>
        );
      }
      
      // Otherwise, truncate at word boundary
      const truncated = text.substring(0, maxLength);
      const lastSpace = truncated.lastIndexOf(' ');
      return (
        <div className="space-y-1">
          <div className="font-semibold text-xs leading-tight">
            {lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated}...
          </div>
          <Badge variant={statusConfig[title.status].variant} className="text-[9px] h-4 px-1.5 mt-1">
            {statusConfig[title.status].label}
          </Badge>
        </div>
      );
    };

    return (
      <div data-status={title.status} className="px-1 py-0.5">
        {truncateTitle(event.title)}
      </div>
    );
  }, []);

  return (
    <>
      <div className="h-[700px] w-full">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month']}
          defaultView="month"
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          eventPropGetter={eventStyleGetter}
          components={{
            event: EventComponent,
          }}
          popup
        />
      </div>

      <TitleDetailsDialog
        title={selectedTitle}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onApprove={handleApproveWithClose}
        onReject={handleRejectWithClose}
        onEdit={handleEditWithClose}
        onDelete={handleDeleteWithClose}
      />

      <CreateTitleDialog
        date={createDate}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={(date) => onCreate?.(date)}
      />
    </>
  );
}
