import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TicketFormWizard from './TicketFormWizard.jsx';

describe('TicketFormWizard', () => {
  it('shows inline errors and does not submit when required fields are empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TicketFormWizard onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Create Ticket' }));

    expect(screen.getByText('Title is required.')).toBeInTheDocument();
    expect(screen.getByText('Description is required.')).toBeInTheDocument();
    expect(screen.getByText('Category is required.')).toBeInTheDocument();

    // Priority and Status default to valid values, so only the three text
    // fields can actually be empty on a fresh form.
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('clears a field error as soon as the user types in that field', async () => {
    const user = userEvent.setup();
    render(<TicketFormWizard onSubmit={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Create Ticket' }));
    expect(screen.getByText('Title is required.')).toBeInTheDocument();

    // The error renders inside the <label>, so match the start of the label
    // text rather than the whole string.
    await user.type(screen.getByLabelText(/^Title/), 'Printer jam');

    expect(screen.queryByText('Title is required.')).not.toBeInTheDocument();
    expect(screen.getByText('Category is required.')).toBeInTheDocument();
  });

  it('calls onSubmit with a trimmed payload when the form is valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TicketFormWizard onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Title'), '  Printer jam  ');
    await user.type(screen.getByLabelText('Category'), '  Hardware  ');
    await user.type(screen.getByLabelText('Description'), '  Paper stuck in tray 2  ');
    await user.selectOptions(screen.getByLabelText('Priority'), 'HIGH');
    await user.selectOptions(screen.getByLabelText('Status'), 'IN_PROGRESS');

    await user.click(screen.getByRole('button', { name: 'Create Ticket' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Printer jam',
      description: 'Paper stuck in tray 2',
      category: 'Hardware',
      priority: 'HIGH',
      status: 'IN_PROGRESS'
    });
  });

  it('shows a saving state on the button while submitting', () => {
    render(<TicketFormWizard onSubmit={vi.fn()} saving />);

    const button = screen.getByRole('button', { name: 'Saving...' });

    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('pre-fills the form and shows edit wording in edit mode', () => {
    render(
      <TicketFormWizard
        mode="edit"
        onSubmit={vi.fn()}
        initialValues={{
          title: 'VPN drops',
          description: 'Disconnects every few minutes.',
          category: 'Network',
          priority: 'HIGH',
          status: 'CLOSED'
        }}
      />
    );

    expect(screen.getByLabelText('Title')).toHaveValue('VPN drops');
    expect(screen.getByLabelText('Category')).toHaveValue('Network');
    expect(screen.getByLabelText('Priority')).toHaveValue('HIGH');
    expect(screen.getByLabelText('Status')).toHaveValue('CLOSED');
    expect(screen.getByRole('button', { name: 'Update Ticket' })).toBeInTheDocument();
  });

  it('shows a server error passed down from the page', () => {
    render(<TicketFormWizard onSubmit={vi.fn()} serverError="Ticket doesnotexist was not found" />);

    expect(screen.getByText('Ticket doesnotexist was not found')).toBeInTheDocument();
  });
});
