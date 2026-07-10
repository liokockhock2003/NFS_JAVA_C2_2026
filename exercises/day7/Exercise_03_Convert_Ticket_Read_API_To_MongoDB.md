# Day 7 Exercise 3: Convert Ticket Read API to MongoDB

## Objective

In this exercise, you will update your Support Desk API so the ticket read endpoints use MongoDB instead of an in-memory list.

---

## Current Situation

Your Day 6 API used a Java list to store ticket data temporarily.

Now your API should read ticket data from MongoDB.

---

## Endpoints to Update

Update these endpoints:

```text
GET /api/tickets
GET /api/tickets/{id}
```

---

## Task 1: Update TicketService

Update your `TicketService` so it uses `TicketRepository`.

The service should no longer depend on an in-memory list for reading tickets.

---

## Task 2: Return All Tickets from MongoDB

Update the method that returns all tickets.

It should retrieve ticket documents from MongoDB, then convert them into response DTOs.

---

## Task 3: Return One Ticket by ID

Update the method that returns one ticket by ID.

If the ticket exists, return the ticket response.

If the ticket does not exist, return a clear `404 Not Found` response using your existing exception-handling approach.

---

## Requirements

Your API must:

1. Read ticket data from MongoDB.
2. Return ticket response DTOs.
3. Keep the controller structure similar to Day 6.
4. Return `404 Not Found` for missing tickets.

---

## Testing

Use your `.http` file or API client to test:

```http
GET http://localhost:8080/api/tickets
```

Then test one existing ticket ID:

```http
GET http://localhost:8080/api/tickets/{id}
```

Then test a missing ticket ID:

```http
GET http://localhost:8080/api/tickets/000000000000000000000000
```

---

## Submission

Submit:

1. Updated `TicketService.java`
2. Updated `.http` test file
3. Short note explaining how you confirmed the data came from MongoDB

---

## Reminder

The controller should not contain database logic.

The controller receives requests.

The service handles application logic.

The repository talks to MongoDB.

---

## Verification Note

I confirmed the data came from MongoDB, not an in-memory list, in a few ways:

1. **The returned `id` is a real MongoDB ObjectId.** `GET /api/tickets` returned `"id": "6a508bce8515f64f3689e4e0"` — a 24-character hex ObjectId generated automatically by MongoDB. No `id` value like this is ever assigned anywhere in the Java code, so it could only have come from the database itself.
2. **The document content matches what I inserted manually via `mongosh`,** not the old hardcoded sample data from the Day 6 in-memory `TicketService` (`T001`, `title: "Cannot access email"`). The title, description, and `createdBy` fields returned by the API exactly match the document I inserted with `db.tickets.insertOne(...)` in Day 7 Exercise 1.
3. **The startup log shows a real, authenticated connection to MongoDB** — the Mongo driver logged `MongoClient ... credential=MongoCredential{... userName='support_desk_app', source='support_desk_db' ...}` and `Monitor thread successfully connected to server ... CONNECTED, ok=true` when the app started.
4. **`GET /api/tickets/000000000000000000000000` (a well-formed but non-existent ObjectId) correctly returns 404.** This only makes sense if the lookup is a real `findById` query against the database — that string was never part of any hardcoded ticket list.
