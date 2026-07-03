# Day 5 Exercise 5.2 - REST API Design (Answer)

**System:** Event Booking System
**Resources identified:** `events` and `bookings`

---

## 1. API Specification Table

| Resource | Method | Endpoint | Purpose | Request Body Needed? | Success Status | Possible Error Status |
|---|---|---|---|---|---:|---:|
| Events | GET | `/api/events` | View all available events | No | 200 | 500 |
| Events | GET | `/api/events/{eventId}` | View details of one event | No | 200 | 404 |
| Bookings | POST | `/api/bookings` | Create a new booking for an event | Yes | 201 | 400, 404, 409 |
| Bookings | GET | `/api/bookings` | View all bookings | No | 200 | 500 |
| Bookings | GET | `/api/bookings/{bookingId}` | View one booking | No | 200 | 404 |
| Bookings | DELETE | `/api/bookings/{bookingId}` | Cancel a booking | No | 200 (or 204) | 404, 409 |

**Notes on the design choices:**
- Cancelling a booking is modelled as `DELETE /api/bookings/{bookingId}`, **not** an action URL like `/cancelBooking`. The resource is the booking; deleting it expresses "cancel".
- Creating a booking is `POST` to the **collection** (`/api/bookings`), and the server generates the new booking id. `201 Created` is returned because a new resource is made.
- Reading uses `GET`; a single item uses the id in the path (`/{id}`), a list uses the collection URL.

---

## 2. Request Body Planning Table

Only the create-booking endpoint needs a request body.

| Endpoint | Request Body Description |
|---|---|
| `POST /api/bookings` | The event to book and how many seats: `eventId` (which event), `customerName` (who is booking), and `quantity` (number of seats/tickets, a whole number greater than 0). The `bookingId`, `status`, and any timestamp are set by the server, not the client. |

The `GET` and `DELETE` endpoints need **no body** - all the information they require (the id) is in the URL path.

---

## 3. Error Planning Table

| Error Case | Related Endpoint | Suitable Status Code | Explanation |
|---|---|---:|---|
| Required field missing (e.g. no `eventId` or no `quantity`) | `POST /api/bookings` | 400 (Bad Request) | The client sent an incomplete/invalid body. 400 means the request itself is malformed, so the server rejects it and can return which fields are invalid. |
| Event does not exist | `GET /api/events/{eventId}` (and `POST /api/bookings` with a bad `eventId`) | 404 (Not Found) | The requested resource (or the event being booked) is not in the system, so the server cannot return or use it. |
| Booking does not exist | `GET` / `DELETE /api/bookings/{bookingId}` | 404 (Not Found) | The booking id in the URL does not match any stored booking. |
| Event is fully booked | `POST /api/bookings` | 409 (Conflict) | The request is valid, but it conflicts with the current state - there are no seats left, so the booking cannot be created. |
| Booking already cancelled | `DELETE /api/bookings/{bookingId}` | 409 (Conflict) | The booking exists but is already in a cancelled state, so cancelling again conflicts with its current state. |

(At least two error cases were required; five are listed above to cover the main categories.)

---

## 4. Why These Endpoint Names Follow REST Principles

My endpoint names follow REST because **each URL names a resource (a noun), not an action**:

- I use **collections and items**: `/api/events`, `/api/events/{eventId}`, `/api/bookings`, `/api/bookings/{bookingId}`. The URL says *what* the thing is, never *what to do* to it.
- The **HTTP method carries the action**, so I do not need verbs in the URL. `GET` reads, `POST` creates, `DELETE` removes. This is why "cancel a booking" becomes `DELETE /api/bookings/{bookingId}` instead of `/cancelBooking`, and "create a booking" becomes `POST /api/bookings` instead of `/createBooking`.
- The same URL supports **different methods** for different operations (e.g. `GET` vs `DELETE` on `/api/bookings/{bookingId}`), which keeps the API small and predictable.
- **Status codes communicate the outcome** in a standard way (200 read, 201 created, 400 bad input, 404 not found, 409 conflict), so a frontend can react without guessing.

This makes the API predictable and consistent: once you know the resources, you can guess the endpoints, and the method + status code tell you the rest.
