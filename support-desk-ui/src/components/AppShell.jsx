import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Day 13 Forms &amp; Validation</p>
          <h1>Support Desk UI</h1>
        </div>
        <div className="user-panel">
          <span>{user?.name}</span>
          <strong>{user?.role}</strong>
          <button type="button" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <nav className="app-nav" aria-label="Main navigation">
        <NavLink to="/app/dashboard">Dashboard</NavLink>
        <NavLink to="/app/tickets" end>Tickets</NavLink>
        <NavLink to="/app/tickets/new">Ticket Form</NavLink>
        <NavLink to="/app/reports">Reports</NavLink>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
