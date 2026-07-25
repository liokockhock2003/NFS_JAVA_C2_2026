import { NavLink, Outlet } from 'react-router';
import AppHeader from './AppHeader.jsx';

export default function AppShell() {
  return (
    <div className="app-shell">
      <AppHeader />

      <nav className="app-nav" aria-label="Main navigation">
        <NavLink to="/app/dashboard">Dashboard</NavLink>
        <NavLink to="/app/tickets">Tickets</NavLink>
        <NavLink to="/app/reports">Reports</NavLink>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
