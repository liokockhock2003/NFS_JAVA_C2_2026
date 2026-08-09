import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

/*
 * Shared test data.
 *
 * Every ticket needs createdBy, because filterTickets() reads
 * ticket.createdBy.toLowerCase() without guarding against undefined.
 *
 * The status counts are deliberately 4 OPEN / 2 IN_PROGRESS / 1 CLOSED so the
 * summary card totals (7, 4, 2, 1) are all different. Equal counts would make
 * getByText('1') match several cards at once.
 */
export const sampleTickets = [
  {
    id: 'T001',
    title: 'Cannot access email',
    description: 'Outlook rejects the password on every attempt.',
    category: 'Email',
    priority: 'HIGH',
    status: 'OPEN',
    createdBy: 'ferran@example.com',
    createdAt: '2026-08-01'
  },
  {
    id: 'T002',
    title: 'Laptop running slowly',
    description: 'Takes ten minutes to boot.',
    category: 'Hardware',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdBy: 'siti@example.com',
    createdAt: '2026-08-02'
  },
  {
    id: 'T003',
    title: 'Password reset request',
    description: 'Locked out after too many attempts.',
    category: 'Account',
    priority: 'LOW',
    status: 'CLOSED',
    createdBy: 'nurul@example.com',
    createdAt: '2026-08-03'
  },
  {
    id: 'T004',
    title: 'VPN connection drops',
    description: 'Disconnects every few minutes from home.',
    category: 'Network',
    priority: 'HIGH',
    status: 'OPEN',
    createdBy: 'raj@example.com',
    createdAt: '2026-08-04'
  },
  {
    id: 'T005',
    title: 'Printer not responding',
    description: 'Queue fills up but nothing prints.',
    category: 'Hardware',
    priority: 'LOW',
    status: 'OPEN',
    createdBy: 'amir@example.com',
    createdAt: '2026-08-05'
  },
  {
    id: 'T006',
    title: 'Monitor flickering',
    description: 'Screen flickers on the second display.',
    category: 'Hardware',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdBy: 'siti@example.com',
    createdAt: '2026-08-06'
  },
  {
    id: 'T007',
    title: 'New laptop request',
    description: 'Requesting a replacement for a broken device.',
    category: 'Hardware',
    priority: 'MEDIUM',
    status: 'OPEN',
    createdBy: 'ferran@example.com',
    createdAt: '2026-08-07'
  }
];

export function renderWithRouter(ui, options = {}) {
  const { route = '/', ...renderOptions } = options;

  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>,
    renderOptions
  );
}

// Writes the same shape AuthContext stores after a real login.
export function storeAdminAuth() {
  localStorage.setItem('supportDeskAuth', JSON.stringify({
    token: 'test-admin-token',
    tokenType: 'Bearer',
    expiresInMinutes: 60,
    user: {
      id: 'U001',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN'
    }
  }));
}

export function createJsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
