import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import TicketDetail from '../components/TicketDetail.jsx';
import TicketList from '../components/TicketList.jsx';
import TicketDataControls from '../components/TicketDataControls.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import TicketFilterPanel from '../components/TicketFilterPanel.jsx';
import LoadingMessage from '../components/LoadingMessage.jsx';
import OptimisticStatusControls from '../components/OptimisticStatusControls.jsx';
import PaginationControls from '../components/PaginationControls.jsx';
import TicketSummaryCards from '../components/TicketSummaryCards.jsx';
import { useTicketData } from '../context/TicketDataContext.jsx';

export default function TicketsPage() {
  const initialLoadRef = useRef(false);

  const {
    tickets,
    visibleTickets,
    selectedTicket,
    selectedTicketId,
    loading,
    error,
    pageInfo,
    filters,
    cacheMessage,
    updatingId,
    loadTicketsPage,
    refreshTickets,
    setSearchText,
    setStatusFilter,
    selectTicket,
    changeTicketStatus
  } = useTicketData();

  useEffect(() => {
    if (initialLoadRef.current) {
      return;
    }

    initialLoadRef.current = true;
    loadTicketsPage();
  }, [loadTicketsPage]);

  return (
    <>
      <section className="card welcome-card">
        <div>
          <p className="eyebrow">Protected ticket data</p>
          <h2>Tickets</h2>
          <p>The list is paged by the backend, and filters narrow the records on the current page.</p>
        </div>
        <div className="action-row">
          <Link className="button-link" to="/app/tickets/new">Create Ticket</Link>
          {selectedTicket && (
            <Link className="button-link secondary" to={`/app/tickets/${selectedTicket.id}/edit`}>
              Edit Selected
            </Link>
          )}
        </div>
      </section>

      <TicketSummaryCards tickets={tickets} />

      <TicketDataControls
        pageInfo={pageInfo}
        cacheMessage={cacheMessage}
        loading={loading}
        onRefresh={refreshTickets}
        onPageSizeChange={(size) => loadTicketsPage({ page: 0, size })}
        onSortChange={(sortBy, direction) => loadTicketsPage({ page: 0, sortBy, direction })}
      />

      <TicketFilterPanel
        searchText={filters.searchText}
        statusFilter={filters.statusFilter}
        onSearchChange={setSearchText}
        onStatusChange={setStatusFilter}
      />

      {loading && <LoadingMessage message="Loading ticket page..." />}
      {error && <ErrorMessage message={error} />}

      <section className="workspace-grid">
        <TicketList
          tickets={visibleTickets}
          selectedTicketId={selectedTicketId || selectedTicket?.id}
          onSelectTicket={(ticket) => selectTicket(ticket.id)}
        />
        <div className="asset-list">
          <TicketDetail ticket={selectedTicket} />
          <OptimisticStatusControls
            ticket={selectedTicket}
            updatingId={updatingId}
            onStatusChange={changeTicketStatus}
          />
        </div>
      </section>

      <PaginationControls
        pageInfo={pageInfo}
        loading={loading}
        onPageChange={(page) => loadTicketsPage({ page })}
      />
    </>
  );
}
