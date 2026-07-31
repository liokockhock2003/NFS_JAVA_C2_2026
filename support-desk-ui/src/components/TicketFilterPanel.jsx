export default function TicketFilterPanel({ searchText, statusFilter, onSearchChange, onStatusChange }) {
  return (
    <section className="filter-panel" aria-label="Ticket filters">
      <label>
        Search tickets
        <input
          type="search"
          placeholder="Search by title, category or reporter"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <label>
        Status
        <select value={statusFilter} onChange={(event) => onStatusChange(event.target.value)}>
          <option value="ALL">All</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
      </label>
    </section>
  );
}
