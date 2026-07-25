import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout.jsx';
import TicketList from '../components/TicketList.jsx';
import TicketDetail from '../components/TicketDetail.jsx';
import TicketFilterPanel from '../components/TicketFilterPanel.jsx';
import sampleTickets from '../data/sampleTickets.js';
import { filterTickets } from '../utils/tickets.js';

export default function TicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const filteredTickets = useMemo(
    () => filterTickets(sampleTickets, searchText, statusFilter, priorityFilter),
    [searchText, statusFilter, priorityFilter]
  );

  useEffect(() => {
    if (filteredTickets.length === 0) {
      setSelectedTicket(null);
      return;
    }

    const selectedStillVisible = filteredTickets.some(
      (ticket) => ticket.id === selectedTicket?.id
    );

    if (!selectedStillVisible) {
      setSelectedTicket(filteredTickets[0]);
    }
  }, [filteredTickets, selectedTicket]);

  return (
    <Layout>
      <TicketFilterPanel
        searchText={searchText}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onSearchChange={setSearchText}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
      />

      <TicketList
        tickets={filteredTickets}
        selectedTicketId={selectedTicket?.id}
        onSelectTicket={setSelectedTicket}
      />
      <TicketDetail ticket={selectedTicket} />
    </Layout>
  );
}
