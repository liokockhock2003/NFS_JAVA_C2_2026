import StatusBadge from './StatusBadge.jsx';
import PriorityBadge from './PriorityBadge.jsx';
import EmptyState from './EmptyState.jsx';

export default function TicketDetail({ ticket }) {
  if (!ticket) {
    return <EmptyState message="Select a ticket to view more information." />;
  }

  return (
    <section className="card detail-card">
      <div className="section-heading row-heading">
        <div>
          <h2>{ticket.title}</h2>
          <p>{ticket.category}</p>
        </div>
        <div>
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      <dl className="detail-list">
        <div>
          <dt>Created By</dt>
          <dd>{ticket.createdBy}</dd>
        </div>
        <div>
          <dt>Created At</dt>
          <dd>{ticket.createdAt}</dd>
        </div>
      </dl>
    </section>
  );
}
