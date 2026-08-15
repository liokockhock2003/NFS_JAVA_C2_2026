# D17 Exercise 01 - Structured Logs and Request Timing (Submission)

> Project: **Asset Tracker** (the exercise's "Support Desk API"). Endpoints use
> `/api/v1/assets` rather than `/tickets`.

## Filter

`src/main/java/com/example/assettracker/config/RequestTimingFilter.java`

It extends `OncePerRequestFilter` and runs at `HIGHEST_PRECEDENCE`, so the
timing covers the whole filter chain and each request is logged exactly once
(even across forwards/async). For every request it logs:

- `requestId` — an 8-char correlation id, also returned to the client as the
  `X-Request-Id` response header and put on the SLF4J MDC so any other log line
  during the request is correlated.
- `method`, `path` — HTTP method and request URI.
- `status` — response status code.
- `durationMs` — wall-clock duration, measured with `System.nanoTime()`.

## What is NOT logged (by design)

The filter only reads method, URI and status. It never reads the request body,
the `Authorization` header, cookies, the JWT, or any password/secret — so none
of those can leak into the logs.

## Safe log example

```text
requestId=ab12cd34 method=GET path=/api/v1/assets/paged status=200 durationMs=38
```

Another, for an auth failure — still no token or credentials in the line:

```text
requestId=7f9e0c11 method=POST path=/api/v1/assets status=401 durationMs=4
```
