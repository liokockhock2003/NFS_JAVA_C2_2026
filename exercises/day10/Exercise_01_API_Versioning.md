# Day 10 Exercise 1: Add Versioned Ticket API Endpoints

## Scenario

Yesterday, you protected your Support Desk Ticket API with JWT authentication.
Today, you will improve the API structure by adding a versioned route.

Current route example:

```http
GET /api/tickets
```

New route example:

```http
GET /api/v1/tickets
```

## Learning Objective

By the end of this exercise, you should be able to explain why production APIs often use versioned routes such as `/api/v1`.

## Task

Create a new controller called:

```text
TicketV1Controller
```

Use this base path:

```java
@RequestMapping("/api/v1/tickets")
```

Reuse your existing `TicketService` methods.

## Required Endpoints

```http
GET  /api/v1/tickets
GET  /api/v1/tickets/{id}
POST /api/v1/tickets
```

## Security Rule

Update your security configuration so that:

```text
GET /api/v1/tickets/** requires USER or ADMIN
POST /api/v1/tickets requires USER or ADMIN
```

## Expected Evidence

Add requests to your `.http` file showing that:

1. `/api/v1/tickets` rejects requests without a token.
2. `/api/v1/tickets` works with a valid token.
3. The old `/api/tickets` endpoint still works if you keep it.

## Reflection Question

Why might a company keep both `/api/tickets` and `/api/v1/tickets` temporarily?

A company keeps both so existing clients (mobile apps, third-party integrations, frontend deployments that haven't been updated yet) don't break the moment a new API version ships. Not every client can be updated instantly — some might be on app stores with review delays, or owned by external partners who need advance notice. Keeping the old, unversioned route alive alongside the new `/v1` route gives everyone a migration window: new integrations are told to use `/api/v1/tickets` from day one, while existing consumers keep working against `/api/tickets` until they've had time to switch over. Once analytics show nothing is calling the old route anymore (or after an announced deprecation period), it can be safely removed. This is exactly why the old and new routes in this exercise are allowed to have *different* authorization rules too — versioning isn't just about the URL, it's about being able to evolve behavior (including security rules) without a "flag day" that forces every client to update simultaneously.
