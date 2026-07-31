import { Link } from 'react-router';
import TicketFormWizard, { emptyTicketForm } from '../components/TicketFormWizard.jsx';

export default function TicketFormPage() {
  function handleSubmit(payload) {
    console.log('Ticket form values', payload);
  }

  return (
    <>
      <section className="card welcome-card">
        <div>
          <p className="eyebrow">Forms &amp; validation</p>
          <h2>Create a new ticket</h2>
          <p>The visual style is intentionally kept close to Day 12. Today focuses on form behaviour.</p>
        </div>
        <div className="action-row">
          <Link className="button-link secondary" to="/app/tickets">Back to Tickets</Link>
        </div>
      </section>

      <TicketFormWizard
        mode="create"
        initialValues={emptyTicketForm}
        onSubmit={handleSubmit}
      />
    </>
  );
}
