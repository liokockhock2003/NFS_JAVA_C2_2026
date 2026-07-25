import { useEffect, useMemo, useState } from 'react';
import Layout from './components/Layout.jsx';
import TicketList from './components/TicketList.jsx';
import TicketDetail from './components/TicketDetail.jsx';
import TicketFilterPanel from './components/TicketFilterPanel.jsx';
import ApiInfoCard from './components/ApiInfoCard.jsx';
import sampleTickets from './data/sampleTickets.js';
import { fetchApiInfo } from './services/api.js';
import { filterTickets } from './utils/tickets.js';

export default function App() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [apiInfo, setApiInfo] = useState(null);
  const [loadingApi, setLoadingApi] = useState(true);
  const [apiError, setApiError] = useState('');

  const filteredTickets = useMemo(
    () => filterTickets(sampleTickets, searchText, statusFilter, priorityFilter),
    [searchText, statusFilter, priorityFilter]
  );

  useEffect(() => {
    let ignore = false;

    async function loadApiInformation() {
      try {
        setLoadingApi(true);
        setApiError('');

        const info = await fetchApiInfo();

        if (!ignore) {
          setApiInfo(info);
        }
      } catch (error) {
        if (!ignore) {
          setApiError(
            'Could not connect to backend. Start Spring Boot on port 8080 and try again.'
          );
          console.error(error);
        }
      } finally {
        if (!ignore) {
          setLoadingApi(false);
        }
      }
    }

    loadApiInformation();

    return () => {
      ignore = true;
    };
  }, []);

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
      <ApiInfoCard loading={loadingApi} error={apiError} apiInfo={apiInfo} />

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
