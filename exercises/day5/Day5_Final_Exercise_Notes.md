# Day 5 Final Exercise - Booking Endpoints (Notes)

## Files changed
- `rest-basics/mock-api.js` - added the bookings resource and all booking logic.
- `rest-basics/requests.http` - added tests B1-B9 for the booking endpoints.

## Endpoints completed

| Method | Endpoint | Purpose | Status codes |
|---|---|---|---|
| GET | `/api/bookings` | View all bookings (empty `[]` at first) | 200 |
| GET | `/api/bookings/{id}` | View one booking | 200 found / 404 not found |
| POST | `/api/bookings` | Create a booking | 201 created / 400 invalid / 404 unknown event |
| DELETE | `/api/bookings/{id}` | **Challenge:** cancel a booking (soft delete) | 200 cancelled / 404 not found / 409 already cancelled |

## Logic implemented (Parts A-H + challenge)
- **A.** Added `let bookings = [];` (in-memory, cleared on restart).
- **B.** `validateBooking()` rejects missing `eventId`, `participantName`, `participantEmail`, and `seats` that is not a whole number > 0.
- **C/D.** GET all + GET one (404 with `Booking {id} was not found` when missing).
- **E.** POST creates a booking with auto id (`BK001`, `BK002`, ...) and `status: "CONFIRMED"`, returns 201.
- **F.** Unknown `eventId` returns 404 `Event {id} was not found`.
- **G.** Requesting more seats than `availableSeats` returns 400 `Not enough seats available`.
- **H.** On success, the event's `availableSeats` is reduced by the booked seats.
- **Challenge.** DELETE sets `status` to `"CANCELLED"` (keeps the booking in the array), adds the seats back to the event, and returns the updated booking. Cancelling an already-cancelled booking returns 409.

## Test results (verified by running the server)

| Test | Request | Result |
|---|---|---|
| B1 | GET all bookings (before any) | 200, body `[]` |
| B2 | POST valid booking (EV001, 2 seats) | 201; EV001 seats 120 -> 118 |
| H  | POST second booking (EV001, 3 seats) | 201; EV001 seats 118 -> 115 |
| B3 | GET `/api/bookings/BK001` | 200 |
| B4 | POST missing fields | 400 (validation failed) |
| B5 | POST eventId `EV999` | 404 (event not found) |
| B6 | POST 100 seats on EV002 (only 35) | 400 (not enough seats) |
| B7 | GET `/api/bookings/BK999` | 404 |
| B8 | DELETE `/api/bookings/BK001` | 200; status `CANCELLED`; 2 seats returned to EV001 |
| B8b | DELETE the same booking again | 409 (already cancelled) |

All minimum completion requirements and the challenge task are met.
