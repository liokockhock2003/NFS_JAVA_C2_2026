export default function TicketDataControls({
  pageInfo,
  loading,
  onRefresh,
  onPageSizeChange,
  onSortChange
}) {
  return (
    <section className="card">
      <div className="section-heading">
        <p className="eyebrow">Data layer</p>
        <h2>Server pagination controls</h2>
        <p>Page size, sort field and sort direction are sent to the paged backend endpoint.</p>
      </div>

      <div className="action-row">
        <label>
          Page size
          <select
            value={pageInfo.size}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </label>

        <label>
          Sort by
          <select
            value={pageInfo.sortBy}
            onChange={(event) => onSortChange(event.target.value, pageInfo.direction)}
          >
            <option value="createdAt">Created At</option>
            <option value="title">Title</option>
            <option value="category">Category</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </label>

        <label>
          Direction
          <select
            value={pageInfo.direction}
            onChange={(event) => onSortChange(pageInfo.sortBy, event.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      <div className="action-row form-actions">
        <button className="button-link" type="button" onClick={onRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh from backend'}
        </button>
      </div>
    </section>
  );
}
