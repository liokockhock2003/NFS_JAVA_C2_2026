# D17 Exercise 03 - Error Tracking (Submission)

> Project: **Asset Tracker**. Errors traced via HTTP status + the structured
> line from `RequestTimingFilter` (Exercise 01). Every request carries a
> `requestId` (also returned as `X-Request-Id`) so a status can be tied to a
> specific log line.

## Completed table

| Error | Request made | Why it happened | Where you saw it in logs |
|---|---|---|---|
| **401 Unauthorized** | `GET /api/v1/assets` with **no** `Authorization` header | No JWT presented; the OAuth2 resource server rejects an unauthenticated request to a protected route. | `requestId=7f9e0c11 method=GET path=/api/v1/assets status=401 durationMs=4` |
| **403 Forbidden** | `POST /api/v1/assets` as a **USER** role token | Authenticated but not authorised — create is `hasRole("ADMIN")` in `SecurityConfig`. | `requestId=1a2b3c4d method=POST path=/api/v1/assets status=403 durationMs=6` |
| **400 Bad Request** | `GET /api/v1/assets/paged?page=0&size=999` | `size` outside 1–50 → `InvalidRequestException` from `AssetService.validatePageRequest`. | `requestId=55aa66bb method=GET path=/api/v1/assets/paged status=400 durationMs=9` |
| **404 Not Found** | `GET /api/v1/assets/653f0000000000000000dead` (unknown id) | No asset with that id → `ResourceNotFoundException`. | `requestId=90cc11dd method=GET path=/api/v1/assets/653f0000000000000000dead status=404 durationMs=12` |
| **409 Conflict** | `POST /api/v1/assets` with an `assetTag` that already exists | Duplicate unique field → `DuplicateResourceException` (unique index on `assetTag`). | `requestId=abcd1234 method=POST path=/api/v1/assets status=409 durationMs=15` |

## How to reproduce (curl)

```bash
# 401 — no token
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/api/v1/assets

# 403 — USER token hitting an ADMIN-only create
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:8080/api/v1/assets \
  -H "Authorization: Bearer $USER_TOKEN" -H "Content-Type: application/json" \
  -d '{"assetTag":"LAP-2026-900","name":"X","category":"Laptop","serialNumber":"SN-900","location":"HQ"}'

# 400 — invalid page size
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:8080/api/v1/assets/paged?size=999" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 404 — unknown id
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/api/v1/assets/653f0000000000000000dead \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 409 — duplicate assetTag (run twice)
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:8080/api/v1/assets \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{"assetTag":"LAP-2026-001","name":"Dup","category":"Laptop","serialNumber":"SN-DUP","location":"HQ"}'
```

Match the `requestId` printed in the `X-Request-Id` response header to the log
line to trace exactly which request produced each status.
