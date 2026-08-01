import { apiRequest } from './httpClient.js';

export async function fetchApiInfo() {
  return apiRequest('/api/v1/info');
}

export async function loginRequest(email, password) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password }
  });
}

export async function fetchTickets(token) {
  return apiRequest('/api/v1/tickets', { token });
}

export async function fetchTicketById(id, token) {
  return apiRequest(`/api/v1/tickets/${id}`, { token });
}

export async function createTicket(token, payload) {
  return apiRequest('/api/v1/tickets', {
    method: 'POST',
    token,
    body: payload
  });
}

export async function updateTicket(id, token, payload) {
  return apiRequest(`/api/v1/tickets/${id}`, {
    method: 'PUT',
    token,
    body: payload
  });
}

export async function fetchReport(path, token) {
  return apiRequest(path, { token });
}

export async function fetchTicketReports(token) {
  const [byStatus, byPriority] = await Promise.all([
    fetchReport('/api/v1/reports/tickets-by-status', token),
    fetchReport('/api/v1/reports/tickets-by-priority', token)
  ]);

  return { byStatus, byPriority };
}
