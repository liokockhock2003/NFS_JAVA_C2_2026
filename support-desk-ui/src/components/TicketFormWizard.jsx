import { useState } from 'react';
import ErrorMessage from './ErrorMessage.jsx';

const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'];
const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'CLOSED'];

export const emptyTicketForm = {
  title: '',
  description: '',
  category: '',
  priority: 'MEDIUM',
  status: 'OPEN'
};

export default function TicketFormWizard({
  mode = 'create',
  initialValues = emptyTicketForm,
  onSubmit,
  saving = false,
  serverError = '',
  successMessage = ''
}) {
  const [formValues, setFormValues] = useState({ ...emptyTicketForm, ...initialValues });

  const isEditMode = mode === 'edit';

  function updateField(fieldName, value) {
    setFormValues((current) => ({
      ...current,
      [fieldName]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      title: formValues.title.trim(),
      description: formValues.description.trim(),
      category: formValues.category.trim(),
      priority: formValues.priority,
      status: formValues.status
    };

    await onSubmit(payload);
  }

  return (
    <form className="card asset-form" onSubmit={handleSubmit} noValidate>
      <div className="section-heading">
        <p className="eyebrow">Day 13 form wizard</p>
        <h2>{isEditMode ? 'Update Ticket' : 'Create Ticket'}</h2>
        <p>Controlled inputs, stored in React state.</p>
      </div>

      {serverError && <ErrorMessage message={serverError} />}
      {successMessage && <p className="message success-message">{successMessage}</p>}

      <section className="form-grid" aria-label="Ticket details">
        <label htmlFor="title">
          Title
          <input
            id="title"
            value={formValues.title}
            onChange={(event) => updateField('title', event.target.value)}
          />
        </label>

        <label htmlFor="category">
          Category
          <input
            id="category"
            value={formValues.category}
            onChange={(event) => updateField('category', event.target.value)}
          />
        </label>

        <label htmlFor="priority">
          Priority
          <select
            id="priority"
            value={formValues.priority}
            onChange={(event) => updateField('priority', event.target.value)}
          >
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </label>

        <label htmlFor="status">
          Status
          <select
            id="status"
            value={formValues.status}
            onChange={(event) => updateField('status', event.target.value)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>

        <label htmlFor="description" className="form-grid-full">
          Description
          <textarea
            id="description"
            rows={4}
            value={formValues.description}
            onChange={(event) => updateField('description', event.target.value)}
          />
        </label>
      </section>

      <div className="form-actions">
        <button type="submit" className="button-link" disabled={saving}>
          {saving ? 'Saving...' : isEditMode ? 'Update Ticket' : 'Create Ticket'}
        </button>
      </div>
    </form>
  );
}
