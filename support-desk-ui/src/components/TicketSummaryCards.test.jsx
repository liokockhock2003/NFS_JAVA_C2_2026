import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import TicketSummaryCards from './TicketSummaryCards.jsx';
import { sampleTickets } from '../test/testUtils.jsx';

describe('TicketSummaryCards', () => {
  it('renders a label for every status', () => {
    render(<TicketSummaryCards tickets={sampleTickets} />);

    const summary = screen.getByLabelText('Ticket summary');

    expect(within(summary).getByText('Total Tickets')).toBeInTheDocument();
    expect(within(summary).getByText('Open')).toBeInTheDocument();
    expect(within(summary).getByText('In Progress')).toBeInTheDocument();
    expect(within(summary).getByText('Closed')).toBeInTheDocument();
  });

  it('shows the correct count for each status', () => {
    render(<TicketSummaryCards tickets={sampleTickets} />);

    // sampleTickets is 7 tickets: 4 OPEN, 2 IN_PROGRESS, 1 CLOSED.
    expect(readCardValue('Total Tickets')).toBe('7');
    expect(readCardValue('Open')).toBe('4');
    expect(readCardValue('In Progress')).toBe('2');
    expect(readCardValue('Closed')).toBe('1');
  });

  it('recalculates when the ticket list changes', () => {
    const { rerender } = render(<TicketSummaryCards tickets={sampleTickets} />);
    expect(readCardValue('Open')).toBe('4');

    const closedOnly = sampleTickets.map((ticket) => ({ ...ticket, status: 'CLOSED' }));
    rerender(<TicketSummaryCards tickets={closedOnly} />);

    expect(readCardValue('Open')).toBe('0');
    expect(readCardValue('Closed')).toBe('7');
  });

  it('shows zeros for an empty ticket list', () => {
    render(<TicketSummaryCards tickets={[]} />);

    expect(readCardValue('Total Tickets')).toBe('0');
    expect(readCardValue('Open')).toBe('0');
  });
});

// Reads the number that belongs to one card, so a count is never confused
// with the same number shown on a different card.
function readCardValue(label) {
  const summary = screen.getByLabelText('Ticket summary');
  const card = within(summary).getByText(label).closest('article');

  return within(card).getByText(/^\d+$/).textContent;
}
