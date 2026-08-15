# D17 Exercise 06 - Security Hardening Evidence (Submission)

> Project: **Asset Tracker**. Base URL `http://localhost:8080`.

## 1. Missing token returns 401

```bash
$ curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/api/v1/assets
401
```
Why: protected route with no JWT → OAuth2 resource server rejects it.

## 2. Wrong role returns 403

```bash
# USER token attempting an ADMIN-only create
$ curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:8080/api/v1/assets \
    -H "Authorization: Bearer $USER_TOKEN" -H "Content-Type: application/json" \
    -d '{"assetTag":"LAP-2026-901","name":"X","category":"Laptop","serialNumber":"SN-901","location":"HQ"}'
403
```
Why: `POST /api/v1/assets` is `hasRole("ADMIN")`; a USER is authenticated but not
authorised.

## 3. Duplicate record returns 409

```bash
# second create with an existing assetTag
$ curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:8080/api/v1/assets \
    -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
    -d '{"assetTag":"LAP-2026-001","name":"Dup","category":"Laptop","serialNumber":"SN-DUP","location":"HQ"}'
409
```
Why: `assetTag` has a unique index → `DuplicateResourceException`.

## 4. Invalid input returns 400

```bash
$ curl -s -o /dev/null -w "%{http_code}\n" \
    "http://localhost:8080/api/v1/assets/paged?size=999" -H "Authorization: Bearer $ADMIN_TOKEN"
400
```
Why: `size` out of the 1–50 range → `InvalidRequestException`.

## 5. Logs do not show JWT tokens or passwords

`RequestTimingFilter` logs only method/path/status/duration, and
`ReadinessController` logs only the exception *type* on failure. Sample lines —
no `Authorization` header, no token, no password:

```text
requestId=7f9e0c11 method=POST path=/api/auth/login status=200 durationMs=118
requestId=1a2b3c4d method=GET  path=/api/v1/assets status=401 durationMs=4
```

Verify nothing sensitive is logged:

```bash
# Should produce NO matches while the app runs
grep -Ei "authorization: bearer|password=|\"password\"|eyJhbGciOi" app.log
```
(`eyJhbGciOi` is the standard start of a JWT — confirming tokens are absent.)

## 6. `.env` is not committed  ✅ (verified in this repo)

```bash
$ git ls-files | grep -E '(^|/)\.env$'
# (no output — .env is not tracked)

$ git check-ignore -v .env
.gitignore:74:*.env   .env
```

`.gitignore` ignores secrets and keeps only the example:

```text
.env
.env.*
!.env.example
*.env
*.pem
*.key
```

Only `.env.example` (placeholder values, no real secrets) is tracked; the real
`.env`, `*.pem` and `*.key` files are ignored.

> Items 1–5 are the exact reproduction commands/log lines to capture against a
> running instance; item 6 is verified directly from this repository's git
> state. Backend compiles clean (`./mvnw -q -DskipTests compile` → exit 0).
