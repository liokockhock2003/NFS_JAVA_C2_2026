# Day 8 Exercise 5: Query Behaviour and Troubleshooting

## Objective

Test how your Support Desk Ticket API behaves when users send unusual, incorrect, or edge-case query requests.

## Background

Real API users do not always send perfect requests.

They may:

* use the wrong status value
* request a page that has no data
* sort by the wrong field
* use a very large page size
* combine filters in a way your API does not fully support yet

As a backend developer, you must understand how your API behaves in these situations.

This exercise is not mainly about writing new features. It is about testing, observing, explaining, and thinking like a backend developer.

---

## Task

Add the following unusual query requests to your Day 8 `.http` file.

Run each request and record what happens.

You do not need to fix every issue today. The goal is to understand the current API behaviour and identify what could be improved later.

---

## Test 1: Invalid Status Value

```http
GET http://localhost:8080/api/tickets?status=INVALID
```

Observe:

* Does the API return an empty list?
* Does it return an error?
* What log message appears in the terminal?

---

## Test 2: Invalid Priority Value

```http
GET http://localhost:8080/api/tickets?priority=URGENT
```

Observe:

* Does your API support this priority?
* What response is returned?
* Should the API accept this value?

---

## Test 3: Page Number with No Records

```http
GET http://localhost:8080/api/tickets/paged?page=99&size=5
```

Observe:

* Does the API crash?
* Does it return an empty page?
* What does the page metadata show?

---

## Test 4: Very Large Page Size

```http
GET http://localhost:8080/api/tickets/paged?page=0&size=100
```

Observe:

* Does the API allow this?
* Should real APIs allow very large page sizes?
* What could go wrong if the page size is too large?

---

## Test 5: Unknown Sort Field

```http
GET http://localhost:8080/api/tickets/paged?page=0&size=5&sortBy=unknownField&direction=asc
```

Observe:

* Does the API return data?
* Does the sorting seem meaningful?
* Should the backend validate allowed sort fields?

---

## Test 6: Combined Filters

```http
GET http://localhost:8080/api/tickets?status=OPEN&priority=HIGH
```

Observe:

* Does your API apply both filters?
* Does it only apply one filter?
* Is this behaviour clear to the API user?

---

## Reflection Questions

Answer the following questions:

1. What happened when you used an invalid status?
2. What happened when you used an invalid priority?
3. What happened when you requested page 99?
4. What happened when you used an unknown sort field?
5. Why should an API limit page size?
6. Why should an API validate sort fields?
7. Does your current API support combined filters?
8. What log messages helped you understand what happened?
9. Which behaviour would you improve in a future version?

---

## Expected Learning

By the end of this exercise, you should understand that API development is not only about successful requests.

A good backend developer must also think about:

* invalid input
* edge cases
* unexpected query values
* clear API behaviour
* useful logs
* future improvements

---

## Submission

Submit:

1. Updated Day 8 `.http` file
2. Results from at least five unusual query requests
3. Short answers to the reflection questions
4. (Optional) What you would improve in the API later.

---

## Test Results

**Test 1 — `GET /api/tickets?status=INVALID`**
`200 OK`, body `[]`. No error thrown — `findByStatusIgnoreCase("INVALID")` is a perfectly valid query, it just matches nothing. Log: `Fetching tickets with status=INVALID, priority=null, category=null` then `Found 0 ticket(s)`.

**Test 2 — `GET /api/tickets?priority=URGENT`**
Same as above: `200 OK`, `[]`. `"URGENT"` isn't one of the priorities I actually use (`HIGH`/`MEDIUM`), but nothing stops a caller from sending it — there's no enum or allow-list, `priority` is just a plain `String`.

**Test 3 — `GET /api/tickets/paged?page=99&size=5`**
No crash. `200 OK` with `"content": [], "empty": true, "numberOfElements": 0, "totalElements": 5, "totalPages": 1, "number": 99`. Spring Data's `Pageable` happily computes an offset (495) way past the actual data and just returns an empty page — it doesn't clamp or error on an out-of-range page number.

**Test 4 — `GET /api/tickets/paged?page=0&size=100`**
Accepted with no complaint — `"size": 100"` in the response, even though only 5 documents exist (so all 5 came back). Nothing in the code currently caps `size`; a caller could request `size=1000000` and the app would just ask MongoDB for that many.

**Test 5 — `GET /api/tickets/paged?...&sortBy=unknownField&direction=asc`**
`200 OK`, all 5 tickets returned, but the order is meaningless — `unknownField` doesn't exist on any `Ticket` document, so MongoDB can't actually sort by it and effectively falls back to natural/insertion order. No error, no warning that the sort field was invalid.

**Test 6 — `GET /api/tickets?status=OPEN&priority=HIGH`**
This is the most important finding: it returned **all 5 tickets**, including one with `"priority": "MEDIUM"` ("Printer not responding"). The log line even shows both values were received (`status=OPEN, priority=HIGH`), but my `getTickets()` implementation only checks `status` first (`if (status != null) ... else if (priority != null) ...`) — so `priority=HIGH` was silently dropped once `status` was present. Combined filters are **not actually supported**, and the current behavior is misleading: it looks like it might be filtering on both, but it isn't.

---

## Reflection Answers

1. **What happened when you used an invalid status?** No error — `200 OK` with an empty array, because it's just a normal query that happens to match zero documents.
2. **What happened when you used an invalid priority?** Same behavior as invalid status — empty array, no validation, no error.
3. **What happened when you requested page 99?** No crash — an empty page with accurate metadata (`totalElements: 5`, `totalPages: 1`), so the client can tell it asked for a page beyond the data.
4. **What happened when you used an unknown sort field?** Still returns `200 OK` with all the data, but the "sort" is meaningless since the field doesn't exist on any document — no error is raised to say the field name was wrong.
5. **Why should an API limit page size?** An unbounded `size` lets a client request the entire collection in one call (or an enormous number like `size=1000000`), which defeats the purpose of pagination — it can spike memory usage, slow down the response, and put unnecessary load on both the database and the app for a single request.
6. **Why should an API validate sort fields?** Without validation, a typo or a field that doesn't exist silently produces an unsorted (or arbitrarily ordered) result instead of an error — the caller has no way to know their sort request was ignored, which is a confusing, hard-to-debug failure mode.
7. **Does your current API support combined filters?** No — confirmed by Test 6. Only the first non-null parameter in the `if/else if` chain (`status`, then `priority`, then `category`) is actually applied; the others are silently ignored even though they were received.
8. **What log messages helped you understand what happened?** The `Fetching tickets with status=OPEN, priority=HIGH, category=null` / `Found 5 ticket(s)` pair was the key one — it proved the service *received* both `status` and `priority`, which combined with the fact that a `MEDIUM`-priority ticket was still returned told me the filtering logic wasn't actually combining them.
9. **Which behaviour would you improve in a future version?**
   - Make `getTickets()` combine multiple non-null filters (e.g. build a MongoDB query dynamically with `Criteria`/`Query` in `MongoTemplate`, or add compound derived-query methods like `findByStatusIgnoreCaseAndPriorityIgnoreCase`) instead of only applying the first one.
   - Validate `status`/`priority` against a known set of allowed values and return `400 Bad Request` for anything else, instead of silently returning an empty list.
   - Cap `size` in `getPagedTickets()` (e.g. reject or clamp anything above 50-100) to prevent unbounded result sets.
   - Validate `sortBy` against an allow-list of real `Ticket` fields and return `400 Bad Request` for unknown fields, instead of silently producing a meaningless order.
