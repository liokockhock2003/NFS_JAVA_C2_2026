# Day 5 Exercise 5.1 - HTTP Investigation (Submission)

Mock API tested: `rest-basics/mock-api.js` running at `http://localhost:8081`.
All requests were sent while the server was running and the real responses are recorded below.

---

## 1. Investigation Table

| # | Method | URL | Status Code | Response Type | What Happened? |
|---|---|---|---:|---|---|
| 1 | GET | `/api/course-offerings` | 200 | List | Success. Returned a JSON **array** of all course offerings (CO001, CO002). A read request that succeeded. |
| 2 | GET | `/api/course-offerings/CO001` | 200 | Single object | Success. Returned the **one** course offering whose id is CO001. The id existed, so the server found and returned it. |
| 3 | GET | `/api/course-offerings/CO999` | 404 | Error object | Failed. No offering has id CO999, so the server returned a **Not Found** error object: `{ "message": "Course offering CO999 was not found" }`. |
| 4 | POST | `/api/course-offerings` | 201 | Single object | Success. A valid body was sent, so the server **created** a new offering (auto-id CO003, status OPEN) and returned the created item. 201 = Created. |
| 5 | POST | `/api/course-offerings` | 400 | Error object | Failed. The body had empty fields and capacity 0, so **validation failed**. The server returned a 400 Bad Request with an `errors` array listing every invalid field. |

### Raw evidence (status codes captured with curl)

- Request 1 -> `HTTP 200`, body is a JSON array of 2 offerings.
- Request 2 -> `HTTP 200`, body is a single JSON object (CO001).
- Request 3 -> `HTTP 404`, body `{ "message": "Course offering CO999 was not found" }`.
- Request 4 -> `HTTP 201`, body is the new object with `"id": "CO003"`, `"status": "OPEN"`.
- Request 5 -> `HTTP 400`, body `{ "message": "Validation failed", "errors": [ courseTitle, instructorName, startDate, capacity ] }`.

---

## 2. Answers to the Five Questions

**1. Which request returned a successful list response?**
Request 1 - `GET /api/course-offerings`. It returned status **200** with a JSON **array** (list) of all course offerings.

**2. Which request returned a not-found response?**
Request 3 - `GET /api/course-offerings/CO999`. The id did not exist, so the server returned status **404** with an error object explaining the offering was not found.

**3. Which request returned a validation error?**
Request 5 - `POST /api/course-offerings` with empty fields and capacity 0. The server returned status **400 (Bad Request)** with a `Validation failed` message and an `errors` array naming each invalid field.

**4. What is the difference between a successful response and an error response?**
A **successful response** uses a 2xx status code (200 for a read, 201 for a create) and its body contains the **real data** the client asked for or created (a list or a single object). An **error response** uses a 4xx status code (404, 400) and its body contains an **error object** - a `message` (and sometimes an `errors` list) explaining *why* it failed, not the requested data. In short: success = "here is your data"; error = "here is what went wrong."

**5. Why is the status code important for frontend developers?**
The status code lets the frontend decide **what to do without having to read/guess the body**. For example: on **200/201** show the data or a success message; on **404** show a "not found" page; on **400** highlight the invalid form fields using the `errors` list; on **500** show a generic "something went wrong" message. It is a fast, standard signal for whether the request worked, so the UI can react correctly (show data, show an error, retry, or redirect).

---

## 3. Reflection

One thing I understand better about REST now is that **the status code and the response body work together as one message**. The status code is a quick, standardised summary of the outcome (success vs. which kind of failure), while the body carries the details - either the requested data or a structured explanation of the error. The same URL and method can succeed or fail depending on the data (e.g. CO001 gives 200 but CO999 gives 404, and a POST gives 201 when valid but 400 when not), so REST is really a predictable "conversation" where the client reads the status code first and then the body.
