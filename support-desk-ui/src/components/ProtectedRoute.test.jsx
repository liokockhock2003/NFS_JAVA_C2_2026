import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import ProtectedRoute from './ProtectedRoute.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import { storeAdminAuth } from '../test/testUtils.jsx';

function renderProtectedRoute(initialPath = '/app/tickets') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<h1>Login Page</h1>} />
          <Route
            path="/app/tickets"
            element={
              <ProtectedRoute>
                <h1>Protected Tickets</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  it('redirects a user without a token to the login page', () => {
    renderProtectedRoute();

    expect(screen.getByRole('heading', { name: 'Login Page' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Protected Tickets' })).not.toBeInTheDocument();
  });

  it('shows the protected ticket page when stored authentication exists', () => {
    storeAdminAuth();
    renderProtectedRoute();

    expect(screen.getByRole('heading', { name: 'Protected Tickets' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Login Page' })).not.toBeInTheDocument();
  });

  it('redirects when stored authentication has no token', () => {
    localStorage.setItem('supportDeskAuth', JSON.stringify({ user: { name: 'No Token' } }));
    renderProtectedRoute();

    expect(screen.getByRole('heading', { name: 'Login Page' })).toBeInTheDocument();
  });
});
