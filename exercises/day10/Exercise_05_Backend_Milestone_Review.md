# Day 10 Exercise 5: Backend Milestone Review

## Scenario

You have completed the first backend milestone of the programme.

Your task is to review your Support Desk Ticket API and prove that the backend is ready for frontend integration.

## Checklist

Tick each item once completed:

```text
[x] Project runs successfully
[x] MongoDB connection works
[x] Ticket model uses @Document and @Id
[x] TicketRepository extends MongoRepository
[x] Basic CRUD endpoints work
[x] Filtering works
[x] Pagination works
[x] Sorting works
[x] Duplicate or validation errors return clear responses
[x] Register endpoint works
[x] Login endpoint returns JWT
[x] Protected endpoints reject missing token
[x] Protected endpoints accept valid token
[x] Versioned /api/v1 routes exist
[x] Report endpoint works
[x] API documentation endpoint exists
[x] .http file contains test evidence
```

## Submission

Submit:

1. Screenshot of successful login response.
2. Screenshot of protected endpoint working with token.
3. Screenshot of report endpoint response.
4. Screenshot of `/api/docs` response.
5. Updated `.http` file.

## Reflection Question

What is one thing you would improve before connecting this backend to React?

**CORS configuration.** I checked `SecurityConfig.java` and there is currently no `.cors(...)` setup at all. A React dev server runs on a different origin (e.g. `http://localhost:5173` for Vite or `http://localhost:3000` for Create React App) than this backend (`http://localhost:8080`), so without explicit CORS configuration, every request from the React app — including the login/register calls — will be blocked by the browser's same-origin policy before it even reaches the controller. This would be the very first blocker encountered the moment frontend integration starts, so it's the highest-priority fix before that work begins.