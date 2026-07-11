# Day 8 Exercise 4: Query Test File and Notes

## Objective

Create evidence that your query, pagination, sorting, logging, and indexes work.

## Part A: Update your `.http` file

Your `.http` file must include tests for:

```text
GET /api/tickets
GET /api/tickets?status=OPEN
GET /api/tickets?priority=HIGH
GET /api/tickets?category=Email
GET /api/tickets/paged?page=0&size=5
GET /api/tickets/paged?page=1&size=5
GET /api/tickets/paged?page=0&size=5&sortBy=createdAt&direction=desc
```

## Part B: Write short notes

Answer these questions:

1. Which query parameters did you implement?
2. Which fields did you index?
3. Why should an API use pagination?
4. What log messages appear when you call the filtering endpoint?
5. What endpoint proves your sorting works?

## Submission

Submit:

1. Updated `.http` file
2. Short notes answering the five questions above

---

## Short Notes

1. **Which query parameters did you implement?**
   For `GET /api/tickets`: `status`, `priority`, `category` (each optional, only one applied at a time, falling back to all tickets if none are provided). For `GET /api/tickets/paged`: `page` (default `0`), `size` (default `5`), `sortBy` (default `createdAt`), `direction` (default `desc`).

2. **Which fields did you index?**
   `category`, `priority`, `status`, `createdBy`, and `createdAt` on the `Ticket` model, using `@Indexed`. None are unique — unlike `Asset`'s `assetTag`/`serialNumber`, these fields are meant to be shared across many tickets, so a unique index would be wrong here. I confirmed the indexes were actually created by temporarily enabling debug logging on the Mongo driver and seeing five `createIndexes` commands sent to `support_desk_db.tickets`, one per field.

3. **Why should an API use pagination?**
   Without it, `GET /api/tickets` would return every single ticket in the collection in one response — fine with 5 test tickets, but it wouldn't scale to a real support desk with thousands of tickets. Pagination keeps each response small and fast, reduces memory/bandwidth use on both the server and client, and lets the frontend show data incrementally (e.g. "page 2 of 40") instead of loading everything at once.

4. **What log messages appear when you call the filtering endpoint?**
   Calling `GET /api/tickets?priority=HIGH` produced:
   ```
   Fetching tickets with status=null, priority=HIGH, category=null
   Found 4 ticket(s)
   ```
   One log line before the query runs (showing exactly which filter values were received) and one after (showing how many results came back).

5. **What endpoint proves your sorting works?**
   `GET /api/tickets/paged?page=0&size=5&sortBy=title&direction=asc` — with tickets titled "Cannot access email" (×2) and "Printer not responding", the response returned them in that exact alphabetical order, confirming ascending sort works correctly. (Note: I avoided using `createdAt` as the clean example for this one — some of my test data has `createdAt` stored as a full Java `Date` string from an early manual `mongosh` insert, mixed with plain `YYYY-MM-DD` strings from later API-created tickets, which makes the sort order technically correct but confusing to eyeball as a demonstration. `title` sorting isn't affected by that and is unambiguous proof.)
