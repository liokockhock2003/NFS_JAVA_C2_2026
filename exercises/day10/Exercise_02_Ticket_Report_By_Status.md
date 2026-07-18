# Day 10 Exercise 2: Create a Ticket Report by Status

## Scenario

A support manager wants a quick summary of how many tickets are currently open, in progress, or closed.

Instead of returning all tickets, your API should return a grouped count.

## Learning Objective

Use MongoDB aggregation to group documents and count records.

## Required Endpoint

```http
GET /api/v1/reports/tickets-by-status
```

## Example Response

```json
[
  {
    "label": "OPEN",
    "count": 5
  },
  {
    "label": "IN_PROGRESS",
    "count": 3
  },
  {
    "label": "CLOSED",
    "count": 2
  }
]
```

## Suggested Files

```text
ReportCountResponse.java
TicketReportService.java
ReportController.java
```

## Hint

The in-class demo used this pattern:

```java
Aggregation.group("status").count().as("count")
```

## Security Rule

Only logged-in users should be able to call report endpoints.

## Expected Evidence

Add this request to your `.http` file:

```http
GET http://localhost:8080/api/v1/reports/tickets-by-status
Authorization: Bearer {{token}}
```

## Reflection Question

Why is a grouped report endpoint better than asking the frontend to download all tickets and count them manually?

A grouped report endpoint pushes the counting work down to the database, which is exactly where it belongs. MongoDB's aggregation pipeline groups and counts documents server-side and only sends back a handful of small summary rows (one per status) — regardless of whether there are 10 tickets or 10 million. If the frontend had to count manually, it would need to download every single ticket document over the network just to compute a count, which wastes bandwidth, memory, and time, and gets dramatically worse as the dataset grows. It also means the counting logic (and any future changes to it, like adding a new status) lives in one place on the backend instead of being duplicated across every frontend client that needs the same summary.
