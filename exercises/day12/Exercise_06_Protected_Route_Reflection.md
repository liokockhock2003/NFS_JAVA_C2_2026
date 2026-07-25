# Day 12 Exercise 6: Protected Route Reflection

## Goal

Explain what you built.

## Answer these questions

1. What is the role of `BrowserRouter`?
2. What is the difference between `Routes` and `Route`?
3. Why do we use `Outlet`?
4. What does `Navigate` do?
5. Why is frontend route protection not enough by itself?
6. Which backend endpoints still need to enforce security?

## Submit

A short written answer and screenshots of your routing flow.

---

## My Answers

1. **What is the role of `BrowserRouter`?**
   It wraps the whole app (in `main.jsx`) and gives every component inside access to routing — matching the current URL, navigating without a full page reload, and hooks like `useLocation`/`useNavigate`. It uses the browser's real History API (`pushState`/`popState`) under the hood, which is why the address bar updates and the back/forward buttons work correctly even though nothing is actually reloading from the server.

2. **What is the difference between `Routes` and `Route`?**
   `<Routes>` is the switchboard — it looks at the current URL and picks exactly one matching branch of `<Route>`s to render. `<Route>` is a single path-to-element mapping (or, when nested, a parent path plus a set of child paths, like our `/app` route containing `dashboard`/`tickets`/`reports`). A `<Route>` on its own does nothing — it only renders as part of the matching done by its enclosing `<Routes>`.

3. **Why do we use `Outlet`?**
   So `AppShell`'s header and nav stay mounted on screen while only the part that changes (the actual page content) swaps out. `<Outlet />` is the placeholder inside `AppShell` where React Router injects whichever child route currently matches (`DashboardPage`, `TicketsPage`, or `ReportsPage`). Without it, every page would have to re-render its own copy of the header/nav, and there'd be no way for the nested child routes to render "inside" the parent layout at all.

4. **What does `Navigate` do?**
   It's a declarative redirect — when React renders a `<Navigate to="..." />` element, it immediately changes the current location to that target (optionally replacing the current history entry with `replace`, and optionally attaching data via `state`), with no user click required. We use it in `ProtectedRoute` (bounce to `/login` when not authenticated, carrying the originally-requested page as `state`) and in `LoginPage` (bounce away from `/login` if already authenticated).

5. **Why is frontend route protection not enough by itself?**
   `ProtectedRoute` only controls what renders inside the browser — it's plain client-side JavaScript, and nothing stops someone from disabling JS, editing things in DevTools, or simply calling `/api/v1/tickets` directly with curl/Postman without ever loading the React app at all. The frontend check never even runs in that case. Real security has to be enforced on the server, since that's the only place that's actually in the request path no matter how the request was made. Frontend gating is a UX nicety — it avoids flashing protected content or showing a broken page — but it provides zero actual security on its own.

6. **Which backend endpoints still need to enforce security?**
   Every protected endpoint defined in `SecurityConfig.java` on the Java backend: `/api/tickets` and `/api/v1/tickets` (GET requires `USER`/`ADMIN`, POST requires `ADMIN` on the old route and `USER`/`ADMIN` on `/v1`), `/api/v1/reports/**` (requires `USER`/`ADMIN`), and the equivalent asset endpoints. These are enforced by Spring Security's JWT decoder validating the `Authorization: Bearer <token>` header on every single request, completely independent of whatever the React frontend does or doesn't check.
