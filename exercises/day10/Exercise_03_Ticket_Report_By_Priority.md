# Day 10 Exercise 3: Create a Ticket Report by Priority

## Scenario

The support team also wants to know how many tickets are LOW, MEDIUM, or HIGH priority.

## Required Endpoint

```http
GET /api/v1/reports/tickets-by-priority
```

## Example Response

```json
[
  {
    "label": "HIGH",
    "count": 4
  },
  {
    "label": "MEDIUM",
    "count": 6
  },
  {
    "label": "LOW",
    "count": 2
  }
]
```

## Task

Add another method in your `TicketReportService`:

```java
public List<ReportCountResponse> countTicketsByPriority()
```

Then expose it through `ReportController`.

## Expected Evidence

Add this request to your `.http` file:

```http
GET http://localhost:8080/api/v1/reports/tickets-by-priority
Authorization: Bearer {{token}}
```

## Reflection Question

How could this report help a support manager decide where to assign staff?

A quick count of HIGH vs MEDIUM vs LOW tickets tells a manager where the pressure actually is without needing to read through every individual ticket. If HIGH-priority tickets are piling up, that's a signal to pull more staff onto them immediately, even if the total ticket count looks manageable overall. Tracked over time, this same report also shows whether staffing decisions are working — e.g. if the HIGH count shrinks after adding more agents, or keeps growing despite it, the manager gets a fast, objective signal instead of relying on gut feeling about how busy the team "seems."
