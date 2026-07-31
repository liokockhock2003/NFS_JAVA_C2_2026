import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import TicketFormWizard, { emptyTicketForm } from '../components/TicketFormWizard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { createTicket } from '../services/api.js';

export default function TicketFormPage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function handleSubmit(payload) {
    try {
      setSaving(true);
      setServerError('');
      setSuccessMessage('');

      await createTicket(token, { ...payload, createdBy: user?.email });
      setSuccessMessage('Ticket created successfully.');
    } catch (err) {
      setServerError(err.message || 'Could not save ticket.');
      console.error(err);
    } finally {
      setSaving(false);
    }
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
          {successMessage && (
            <button type="button" className="button-link" onClick={() => navigate('/app/tickets')}>
              View Tickets
            </button>
          )}
        </div>
      </section>

      <TicketFormWizard
        mode="create"
        initialValues={emptyTicketForm}
        onSubmit={handleSubmit}
        saving={saving}
        serverError={serverError}
        successMessage={successMessage}
      />
    </>
  );
}
