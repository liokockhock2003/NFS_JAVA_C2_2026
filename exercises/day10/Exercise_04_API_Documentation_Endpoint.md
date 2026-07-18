# Day 10 Exercise 4: Create a Simple API Documentation Endpoint

## Scenario

Your API now has many endpoints. New developers need a quick way to see what endpoints exist and what each endpoint does.

## Required Endpoint

```http
GET /api/docs
```

## Task

Create a controller called:

```text
ApiDocsController
```

The endpoint should return a JSON list of important endpoints.

## Example Response

```json
{
  "application": "Support Desk Ticket API",
  "version": "v1",
  "baseUrl": "/api/v1",
  "endpoints": [
    {
      "method": "POST",
      "path": "/api/auth/register",
      "access": "Public",
      "description": "Register a new user."
    },
    {
      "method": "GET",
      "path": "/api/v1/tickets",
      "access": "USER or ADMIN",
      "description": "List support tickets."
    }
  ]
}
```

## Security Rule

This endpoint can be public:

```text
/api/docs/** permitAll
```

## Expected Evidence

Add this request to your `.http` file:

```http
GET http://localhost:8080/api/docs
```

## Reflection Question

Why is API documentation useful before frontend integration?

It gives frontend developers a single source of truth for exactly what's available — which endpoints exist, what HTTP method each one needs, and who's allowed to call it — without them needing to read backend source code or ask the backend team directly for every detail. This matters especially for the "access" field: a frontend developer building the ticket list screen needs to know upfront that `GET /api/v1/tickets` requires a logged-in USER or ADMIN token, so they build the login flow before the ticket screen, not after discovering a 401 by trial and error. It also reduces back-and-forth between teams and prevents integration surprises late in development, when endpoints turn out to need auth, or expect different fields, than the frontend assumed.
