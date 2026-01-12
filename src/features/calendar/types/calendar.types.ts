import type { Title } from '@/features/titles/types/title.types';

// Calendar event type extending Title for React Big Calendar
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Title; // Store the full title object
}

// Transform Title to CalendarEvent
export function titleToCalendarEvent(title: Title): CalendarEvent {
  const dateString = title.scheduledDate;
  
  // Parse date as local date for calendar display
  // Extract YYYY-MM-DD from the date string and create a local date
  let date: Date;
  if (dateString) {
    const match = dateString.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, year, month, day] = match;
      // Create date in local timezone at midnight
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      date = new Date();
    }
  } else {
    date = new Date();
  }
  
  return {
    id: title.id,
    title: title.title,
    start: date,
    end: date,
    resource: title,
  };
}
