import { describe, it, expect } from 'vitest';
import { countByStatus, filterTickets } from './tickets.js';
import { sampleTickets } from '../test/testUtils.jsx';

describe('filterTickets', () => {
  it('filters by search text across title, category and createdBy', () => {
    const byTitle = filterTickets(sampleTickets, 'laptop', 'ALL');
    expect(byTitle.map((ticket) => ticket.id)).toEqual(['T002', 'T007']);

    const byCategory = filterTickets(sampleTickets, 'network', 'ALL');
    expect(byCategory.map((ticket) => ticket.id)).toEqual(['T004']);

    const byCreatedBy = filterTickets(sampleTickets, 'siti', 'ALL');
    expect(byCreatedBy.map((ticket) => ticket.id)).toEqual(['T002', 'T006']);
  });

  it('ignores case and surrounding spaces in the search text', () => {
    const result = filterTickets(sampleTickets, '  PRINTER  ', 'ALL');

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Printer not responding');
  });

  it('filters by status', () => {
    expect(filterTickets(sampleTickets, '', 'OPEN')).toHaveLength(4);
    expect(filterTickets(sampleTickets, '', 'IN_PROGRESS')).toHaveLength(2);

    const closed = filterTickets(sampleTickets, '', 'CLOSED');
    expect(closed).toHaveLength(1);
    expect(closed[0].id).toBe('T003');
  });

  it('applies search text and status together', () => {
    // "laptop" alone matches two tickets, so the status must narrow it to one.
    expect(filterTickets(sampleTickets, 'laptop', 'ALL')).toHaveLength(2);

    const result = filterTickets(sampleTickets, 'laptop', 'IN_PROGRESS');

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('T002');
  });

  it('returns every ticket when search is empty and status is ALL', () => {
    const result = filterTickets(sampleTickets, '', 'ALL');

    expect(result).toHaveLength(sampleTickets.length);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterTickets(sampleTickets, 'no-such-ticket', 'ALL')).toEqual([]);
  });
});

describe('countByStatus', () => {
  it('counts tickets for each status', () => {
    expect(countByStatus(sampleTickets, 'OPEN')).toBe(4);
    expect(countByStatus(sampleTickets, 'IN_PROGRESS')).toBe(2);
    expect(countByStatus(sampleTickets, 'CLOSED')).toBe(1);
  });

  it('returns 0 for a status no ticket uses', () => {
    expect(countByStatus(sampleTickets, 'ARCHIVED')).toBe(0);
  });
});
