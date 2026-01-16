import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils/test-utils';
import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock react-big-calendar and dragAndDrop HOC
vi.mock('react-big-calendar', () => {
  type CalendarEvent = Record<string, unknown> & { id?: string | number; title?: string };
  type CalendarProps = {
    events?: CalendarEvent[];
    components?: { event?: (opts: { event: CalendarEvent }) => React.ReactNode };
    onSelectEvent?: (ev: CalendarEvent) => void;
    onSelectSlot?: (slot: Record<string, unknown>) => void;
    onEventDrop?: (payload: { event?: CalendarEvent; start?: Date; end?: Date }) => void;
    onNavigate?: (date: Date) => void;
  };

  const Calendar = (props: CalendarProps) => {
    const events = props.events || [];
    return (
      <div>
        <div data-testid="big-calendar">
          {events.map((ev) => (
            <div key={String(ev.id)} data-testid={`event-${String(ev.id)}`}>
              {/* render via custom event component if provided */}
              {props.components?.event ? props.components.event({ event: ev }) : <div>{String(ev.title ?? '')}</div>}
              <button data-testid={`select-event-${String(ev.id)}`} onClick={() => props.onSelectEvent?.(ev)} />
            </div>
          ))}
        </div>
        <button data-testid="slot-click" onClick={() => props.onSelectSlot?.({ action: 'click', start: new Date('2026-01-10') })} />
        <button data-testid="event-drop" onClick={() => props.onEventDrop?.({ event: events[0], start: new Date('2026-01-11'), end: new Date('2026-01-11') })} />
        <button data-testid="navigate" onClick={() => props.onNavigate?.(new Date('2026-02-01'))} />
      </div>
    );
  };

  return { Calendar, dateFnsLocalizer: () => ({}) };
});

vi.mock('react-big-calendar/lib/addons/dragAndDrop', () => ({
  __esModule: true,
  default: (C: unknown) => C,
  withDragAndDrop: (C: unknown) => C,
}));

import { CalendarView } from './CalendarView';
import type { Title } from '@/features/titles/types/title.types';

describe('CalendarView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders events and the EventComponent content (badge + truncated text)', async () => {
    const titles: Title[] = [
      {
        id: 't1',
        title: 'Long title: with subtitle and more content that should be truncated appropriately',
        status: 'APPROVED',
        scheduledDate: '2026-01-10',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Title,
    ];

    renderWithProviders(<CalendarView titles={titles} />);

    // Event should render via our mock calendar, and EventComponent renders the Badge with 'Approved'
    expect(await screen.findByTestId('event-t1')).toBeInTheDocument();
    expect(screen.getByText(/Approved/i)).toBeInTheDocument();
  });

  it('clicking an event opens the details dialog showing the title', async () => {
    const titles: Title[] = [
      {
        id: 't2',
        title: 'My Title',
        status: 'PENDING',
        scheduledDate: '2026-01-10',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Title,
    ];

    renderWithProviders(<CalendarView titles={titles} />);

    // Click the event select button
    await userEvent.click(await screen.findByTestId('select-event-t2'));

    // TitleDetailsDialog should render the title text inside the dialog
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'My Title' })).toBeInTheDocument();
  });

  it('clicking an empty slot opens create dialog and calls onCreateComplete', async () => {
    const titles: Title[] = [];
    const onCreate = vi.fn();
    const onCreateComplete = vi.fn();

    renderWithProviders(<CalendarView titles={titles} onCreate={onCreate} onCreateComplete={onCreateComplete} />);

    await userEvent.click(screen.getByTestId('slot-click'));

    // CreateTitleDialog should render
    expect(await screen.findByText(/Create Title for/i)).toBeInTheDocument();
    // onCreateComplete should have been called with a function
    expect(onCreateComplete).toHaveBeenCalled();
    const arg = onCreateComplete.mock.calls[0][0];
    expect(typeof arg).toBe('function');
  });

  it('does not open create dialog when isCreating is true', async () => {
    const titles: Title[] = [];
    const onCreate = vi.fn();

    renderWithProviders(<CalendarView titles={titles} onCreate={onCreate} isCreating={true} />);

    await userEvent.click(screen.getByTestId('slot-click'));

    expect(screen.queryByText(/Create Title for/i)).not.toBeInTheDocument();
  });

  it('calls onEventDrop with title id and new date when event is dropped', async () => {
    const titles: Title[] = [
      {
        id: 't3',
        title: 'Droppable',
        status: 'DRAFT',
        scheduledDate: '2026-01-10',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Title,
    ];

    const onEventDrop = vi.fn();
    renderWithProviders(<CalendarView titles={titles} onEventDrop={onEventDrop} />);

    await userEvent.click(screen.getByTestId('event-drop'));

    expect(onEventDrop).toHaveBeenCalledWith('t3', new Date('2026-01-11'));
  });

  it('uses external onNavigate when provided', async () => {
    const titles: Title[] = [];
    const onNavigate = vi.fn();
    renderWithProviders(<CalendarView titles={titles} onNavigate={onNavigate} />);

    await userEvent.click(screen.getByTestId('navigate'));

    expect(onNavigate).toHaveBeenCalledWith(new Date('2026-02-01'));
  });
});
 
