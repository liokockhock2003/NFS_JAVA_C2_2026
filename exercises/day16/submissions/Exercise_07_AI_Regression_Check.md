# Day 16 Exercise 7 - AI Regression Check (Submission)

> Refactor under review: `AssetService` (backend) + Asset form validation
> extraction (frontend). Goal — prove the refactor did not change behaviour.

## Regression checklist

| # | Area | Check | Result |
| --- | --- | --- | --- |
| 1 | Login | `POST /api/auth/login` returns a token; UI stores it and redirects. | Unchanged — no auth code touched. |
| 2 | Protected asset list | `GET /api/v1/assets` with bearer token returns the list; without token → 401. | Unchanged — controller/security untouched. |
| 3 | Create asset form | 3-step wizard creates an asset; `POST /api/v1/assets` returns 201 + `AssetResponse`. | Same payload via `normalizeAssetFormPayload`. |
| 4 | Edit asset form | Wizard pre-fills and updates; `PUT /api/v1/assets/{id}` returns 200. | Same fields/order in `updateAsset`. |
| 5 | API request headers | `Authorization: Bearer <token>` still sent on protected calls. | Unchanged — httpClient untouched. |
| 6 | Validation rules | Same inline messages; asset-tag format, name length, status, email-like assignee. | Covered by 11 unit tests. |
| 7 | 401 handling | Missing/expired token → 401 and redirect to login. | Unchanged. |
| 8 | 403 handling | Forbidden action → 403 surfaced as an error message. | Unchanged. |
| 9 | Unit tests | `assetFormValidation.test.js` → 11 passing. | Pass (node env). |
| 10 | E2E / manual smoke | Login → list → create → edit round trip. | Manual checklist below. |

## One example of a risk AI identified

> "The `updateAsset` duplicate-tag check was originally conditional
> (`!current.equalsIgnoreCase(newTag) && existsByAssetTag(newTag)`). If the
> helper always calls `existsByAssetTag`, updating an asset **without changing
> its tag** would now throw `DuplicateResourceException` (409) — a behaviour
> change, because the asset's own tag exists in the database."

This was a real trap. The fix was to pass the loaded asset into
`verifyAssetTagIsUnique(tag, current)` and skip the DB check when the value is
unchanged (case-insensitively) — preserving the original conditional exactly.

## One check I used to confirm behaviour still works

Unit test asserting the unchanged-value path indirectly, plus the backend
compile and the targeted HTTP check for the edit path:

```bash
# Update an existing asset WITHOUT changing its tag → must be 200, not 409
curl -i -X PUT http://localhost:8080/api/v1/assets/$ID \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"assetTag":"LAP-2026-001","name":"Dell Laptop","category":"Laptop",
       "serialNumber":"SN-123","status":"AVAILABLE","location":"HQ"}'
# Expected: HTTP/1.1 200 OK  (no false duplicate conflict)
```

```text
$ ./mvnw -q -DskipTests compile   → exit 0
$ npx vitest run (assetFormValidation) → 11 passed
```
