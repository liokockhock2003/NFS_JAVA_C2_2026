async function parseJsonResponse(response) {
  const contentType = response.headers.get('content-type') ?? '';
  const body = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const message = body?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return body;
}

function authHeaders(token, extraHeaders = {}) {
  return {
    Authorization: `Bearer ${token}`,
    ...extraHeaders
  };
}

export async function fetchApiInfo() {
  const response = await fetch('/api/v1/info');
  return parseJsonResponse(response);
}

export async function loginRequest(email, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  return parseJsonResponse(response);
}

export async function fetchTickets(token) {
  const response = await fetch('/api/v1/tickets', {
    headers: authHeaders(token)
  });

  return parseJsonResponse(response);
}

export async function fetchTicketById(id, token) {
  const response = await fetch(`/api/v1/tickets/${id}`, {
    headers: authHeaders(token)
  });

  return parseJsonResponse(response);
}

export async function fetchReport(path, token) {
  const response = await fetch(path, {
    headers: authHeaders(token)
  });

  return parseJsonResponse(response);
}

export async function fetchTicketReports(token) {
  const [byStatus, byPriority] = await Promise.all([
    fetchReport('/api/v1/reports/tickets-by-status', token),
    fetchReport('/api/v1/reports/tickets-by-priority', token)
  ]);

  return { byStatus, byPriority };
}
