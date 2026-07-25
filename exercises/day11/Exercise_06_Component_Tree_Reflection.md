# D11 Exercise 06 — Component Tree and Reflection

## Goal

Explain your React UI structure.

## Task

Draw or write your Support Desk component tree.

Example:

```text
App
├── Layout
│   └── AppHeader
├── TicketSummaryCards
├── ApiInfoCard
├── TicketFilterPanel
└── TicketWorkspace
    ├── TicketList
    │   ├── PriorityBadge
    │   └── StatusBadge
    └── TicketDetail
        ├── PriorityBadge
        └── StatusBadge
```

## Reflection questions

Answer briefly:

1. Which component owns the selected ticket state?
2. Which components receive props?
3. What does `useEffect` do in your app?
4. What loading state did you create?
5. What error state did you create?
6. What would change when you connect this UI to the protected backend API later?

## Submit

Your component tree and short reflection answers in Google Classroom.

---

## My Component Tree

This reflects the actual `support-desk-ui` code as built (`Layout` renders `AppHeader` plus whatever children `App` passes it, so `ApiInfoCard`/`TicketFilterPanel`/`TicketList`/`TicketDetail` all render inside `Layout`'s `<main>`):

```text
App
└── Layout
    ├── AppHeader
    ├── ApiInfoCard
    │   ├── LoadingMessage
    │   └── ErrorMessage
    ├── TicketFilterPanel
    ├── TicketList
    │   ├── EmptyState
    │   ├── PriorityBadge
    │   └── StatusBadge
    └── TicketDetail
        ├── EmptyState
        ├── PriorityBadge
        └── StatusBadge
```

## My Reflection Answers

1. **Which component owns the selected ticket state?**
   `App`. It holds `selectedTicket` via `useState(null)` and passes `selectedTicketId`/`onSelectTicket` down to `TicketList`, and the full `ticket` object down to `TicketDetail`. Neither of those components holds the state itself — they just read it or call back up to change it.

2. **Which components receive props?**
   Almost everything except `AppHeader`, which is fully static. `Layout` receives `children`. `TicketList` receives `tickets`, `selectedTicketId`, `onSelectTicket`. `TicketDetail` receives `ticket`. `TicketFilterPanel` receives `searchText`/`statusFilter`/`priorityFilter` plus their three `onChange` callbacks. `ApiInfoCard` receives `loading`/`error`/`apiInfo`. `StatusBadge` and `PriorityBadge` each receive their single value (`status`/`priority`). `EmptyState`, `LoadingMessage`, and `ErrorMessage` each just receive a `message`.

3. **What does `useEffect` do in your app?**
   Two separate effects in `App`. The first runs once on mount (empty dependency array) to call `fetchApiInfo()`, updating `loadingApi`/`apiError`/`apiInfo` as the request resolves — it also uses an `ignore` flag in its cleanup function so a state update can't fire after the component unmounts mid-request. The second effect re-runs whenever `filteredTickets` (or the current selection) changes, and automatically selects the first visible ticket if the previously selected one has been filtered out — this keeps the detail panel from showing a ticket that's no longer in the visible list.

4. **What loading state did you create?**
   `loadingApi`, a boolean in `App`, `true` while `fetchApiInfo()` is in flight and `false` once it resolves (success or failure). `ApiInfoCard` renders `LoadingMessage` while it's `true`.

5. **What error state did you create?**
   `apiError`, a string in `App`, set to a user-facing message ("Could not connect to backend. Start Spring Boot on port 8080 and try again.") when `fetchApiInfo()` throws — e.g. when the backend isn't running. `ApiInfoCard` renders `ErrorMessage` whenever it's non-empty.

6. **What would change when you connect this UI to the protected backend API later?**
   Several things: the ticket data would need to come from a real fetch (`GET /api/v1/tickets`) instead of the static `sampleTickets.js`, with its own loading/error state exactly like `ApiInfoCard` already demonstrates. Since that endpoint requires a JWT, the app would need somewhere to store the token after login (e.g. in state or `localStorage`) and attach `Authorization: Bearer <token>` to every protected request. A `401`/`403` response would need explicit handling — most likely redirecting to a login screen rather than just showing a generic error. Creating a ticket would become a real `POST` request instead of only updating local state, so `TicketDetail`/the list would need to reflect the server's response (including the real generated `id`) rather than assuming success immediately.
