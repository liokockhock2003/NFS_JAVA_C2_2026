import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import TicketDetail from '../components/TicketDetail.jsx';
import TicketList from '../components/TicketList.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import TicketFilterPanel from '../components/TicketFilterPanel.jsx';
import LoadingMessage from '../components/LoadingMessage.jsx';
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
    filters,
    loadTickets,
    setSearchText,
    setStatusFilter,
    selectTicket
  } = useTicketData();

  useEffect(() => {
    if (initialLoadRef.current) {
      return;
    }

    initialLoadRef.current = true;
    loadTickets();
  }, [loadTickets]);

  return (
    <>
      <section className="card welcome-card">
        <div>
          <p className="eyebrow">Protected ticket data</p>
          <h2>Tickets</h2>
          <p>Ticket list state now lives in a shared context managed by a reducer.</p>
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

      <TicketFilterPanel
        searchText={filters.searchText}
        statusFilter={filters.statusFilter}
        onSearchChange={setSearchText}
        onStatusChange={setStatusFilter}
      />

      {loading && <LoadingMessage message="Loading protected tickets..." />}
      {error && <ErrorMessage message={error} />}

      <section className="workspace-grid">
        <TicketList
          tickets={visibleTickets}
          selectedTicketId={selectedTicketId || selectedTicket?.id}
          onSelectTicket={(ticket) => selectTicket(ticket.id)}
        />
        <TicketDetail ticket={selectedTicket} />
      </section>
    </>
  );
}
