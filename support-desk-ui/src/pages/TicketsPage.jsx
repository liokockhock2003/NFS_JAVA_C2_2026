import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import TicketDetail from '../components/TicketDetail.jsx';
import TicketList from '../components/TicketList.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import TicketFilterPanel from '../components/TicketFilterPanel.jsx';
import LoadingMessage from '../components/LoadingMessage.jsx';
import TicketSummaryCards from '../components/TicketSummaryCards.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchTickets } from '../services/api.js';
import { filterTickets } from '../utils/tickets.js';

export default function TicketsPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const filteredTickets = useMemo(
    () => filterTickets(tickets, searchText, statusFilter),
    [tickets, searchText, statusFilter]
  );

  useEffect(() => {
    let ignore = false;

    async function loadTickets() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchTickets(token);

        if (!ignore) {
          setTickets(data);
          setSelectedTicket(data[0] ?? null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Could not load protected ticket data.');
          console.error(err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadTickets();

    return () => {
      ignore = true;
    };
  }, [token]);

  useEffect(() => {
    if (filteredTickets.length === 0) {
      setSelectedTicket(null);
      return;
    }

    const selectedStillVisible = filteredTickets.some((ticket) => ticket.id === selectedTicket?.id);

    if (!selectedStillVisible) {
      setSelectedTicket(filteredTickets[0]);
    }
  }, [filteredTickets, selectedTicket]);

  if (loading) {
    return <LoadingMessage message="Loading protected tickets..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <>
      <section className="card welcome-card">
        <div>
          <p className="eyebrow">Protected ticket data</p>
          <h2>Tickets</h2>
          <p>View backend data, then use the Day 13 form wizard to create a new ticket.</p>
        </div>
        <div className="action-row">
          <Link className="button-link" to="/app/tickets/new">Create Ticket</Link>
        </div>
      </section>

      <TicketSummaryCards tickets={tickets} />
      <TicketFilterPanel
        searchText={searchText}
        statusFilter={statusFilter}
        onSearchChange={setSearchText}
        onStatusChange={setStatusFilter}
      />
      <section className="workspace-grid">
        <TicketList
          tickets={filteredTickets}
          selectedTicketId={selectedTicket?.id}
          onSelectTicket={setSelectedTicket}
        />
        <TicketDetail ticket={selectedTicket} />
      </section>
    </>
  );
}
