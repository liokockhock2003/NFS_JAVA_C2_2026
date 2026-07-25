import { useState } from 'react';
import Layout from './components/Layout.jsx';
import TicketList from './components/TicketList.jsx';
import TicketDetail from './components/TicketDetail.jsx';
import sampleTickets from './data/sampleTickets.js';

export default function App() {
  const [selectedTicket, setSelectedTicket] = useState(null);

  return (
    <Layout>
      <TicketList
        tickets={sampleTickets}
        selectedTicketId={selectedTicket?.id}
        onSelectTicket={setSelectedTicket}
      />
      <TicketDetail ticket={selectedTicket} />
    </Layout>
  );
}
