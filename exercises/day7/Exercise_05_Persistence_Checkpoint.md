# Day 7 Exercise 5: Persistence Checkpoint

## Objective

In this checkpoint, you will prove that your API now stores data permanently in MongoDB.

---

## Task

Follow these steps:

1. Start MongoDB.
2. Start your Spring Boot Support Desk API.
3. Create a new ticket using `POST /api/tickets`.
4. Confirm it appears using `GET /api/tickets`.
5. Stop your Spring Boot application.
6. Start your Spring Boot application again.
7. Run `GET /api/tickets` again.
8. Confirm the ticket is still there.

---

## Reflection Questions

Answer these questions:

1. What is the role of the repository?
2. What is the difference between `Ticket` and `TicketResponse`?
3. What does MongoDB store as the document ID?
4. Why should the controller not talk directly to MongoDB?

---

## Submission

Submit a short note containing:

1. Your test steps
2. The ID of the ticket you created
3. Confirmation that the ticket remained after restart
4. Answers to the reflection questions

## Short note

**Test steps:**

1. Confirmed MongoDB was already running on Windows (reachable from WSL via mirrored networking on `localhost:27017`).
2. Started the Spring Boot app with `MONGODB_USERNAME=support_desk_app MONGODB_PASSWORD=support_desk_app mvn spring-boot:run`.
3. Created a new ticket: `POST /api/tickets` with title "Printer not responding" → got back `201 Created`.
4. `GET /api/tickets` showed 3 tickets total, including the new one.
5. Fully killed the Spring Boot process (`kill -9`, port confirmed free).
6. Restarted the app the same way.
7. `GET /api/tickets` again → same 3 tickets returned, identical data.
8. `GET /api/tickets/6a50b3d29212a9c740c488b6` → `200 OK` with the exact ticket I created before the restart.

**ID of the ticket created:** `6a50b3d29212a9c740c488b6`