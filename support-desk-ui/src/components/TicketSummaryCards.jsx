import { countByStatus } from '../utils/tickets.js';

export default function TicketSummaryCards({ tickets }) {
  const total = tickets.length;
  const open = countByStatus(tickets, 'OPEN');
  const inProgress = countByStatus(tickets, 'IN_PROGRESS');
  const closed = countByStatus(tickets, 'CLOSED');

  return (
    <section className="summary-grid" aria-label="Ticket summary">
      <SummaryCard label="Total Tickets" value={total} />
      <SummaryCard label="Open" value={open} />
      <SummaryCard label="In Progress" value={inProgress} />
      <SummaryCard label="Closed" value={closed} />
    </section>
  );
}

function SummaryCard({ label, value }) {
  return (
    <article className="summary-card">
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}
