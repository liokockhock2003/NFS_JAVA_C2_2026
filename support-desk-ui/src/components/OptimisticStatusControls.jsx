const STATUSES = ['OPEN', 'IN_PROGRESS', 'CLOSED'];

export default function OptimisticStatusControls({ ticket, updatingId, onStatusChange }) {
  if (!ticket) {
    return null;
  }

  const isUpdating = updatingId === ticket.id;

  return (
    <section className="card">
      <div className="section-heading">
        <p className="eyebrow">Optimistic update</p>
        <h2>Quick status update</h2>
        <p>
          The UI updates immediately, then confirms with the backend. If the backend fails, it rolls back.
        </p>
      </div>
      <div className="action-row">
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            className={status === ticket.status ? 'button-link' : 'button-link secondary'}
            disabled={isUpdating || status === ticket.status}
            onClick={() => onStatusChange(ticket.id, status)}
          >
            {status}
          </button>
        ))}
      </div>
      {isUpdating && <p className="message loading-message">Saving status change...</p>}
    </section>
  );
}
