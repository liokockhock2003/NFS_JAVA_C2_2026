# D17 Exercise 08 - .dockerignore, Secrets and Run (Submission)

> Project: **Asset Tracker**. Image `asset-tracker-api:day17` (the exercise's
> generic `support-desk-api:day17`).

## 1. `.dockerignore`

`/.dockerignore` excludes secrets and build noise from the image context,
covering all required entries (`.env`, `.env.*`, `!.env.example`, `secrets/`,
`target/`, `node_modules/`, `*.log`) plus `*.pem`/`*.key`, `frontend/`,
`.git/`, and `exercises/`/`docs/`.

## 2. `.env.example` (committed, placeholders only)

Tracked template with placeholder values — `APP_JWT_SECRET=...replace-me`,
expiry, and host port mappings. No real secret.

## 3. Local `.env` (created, NOT committed)

Created locally and confirmed ignored:

```bash
$ git check-ignore -v .env
.gitignore:74:*.env   .env      # matched by an ignore rule → never staged
```

It holds throwaway dev values only (a non-demo ≥32-char `APP_JWT_SECRET` and the
Mongo connection settings).

## 4. Docker run evidence

A local MongoDB (with auth) runs in a sibling container on a shared network; the
API container reads its config from `--env-file .env`:

```bash
docker network create day17-net
docker run -d --name mongo-day17 --network day17-net \
  -e MONGO_INITDB_ROOT_USERNAME=appuser -e MONGO_INITDB_ROOT_PASSWORD=apppass mongo:7

docker run -d --name asset-tracker-api-day17 --network day17-net \
  --env-file .env -e SPRING_PROFILES_ACTIVE=docker -p 8080:8080 \
  asset-tracker-api:day17
```

### 5. Health / readiness (real output)

```bash
$ curl -s http://localhost:8080/api/health
{ "status":"UP", "storage":"MongoDB", "service":"asset-tracker-api", ... }

$ curl -s http://localhost:8080/api/readiness
{
  "service":"asset-tracker-api",
  "status":"READY",
  "database":"CONNECTED",
  "assetCount":12
}
```
(`X-Request-Id` header is returned on every response — the timing filter.)

Screenshot:

![Docker run evidence — container up, health UP, readiness READY](docker%20run.png)

### 6. Docker logs — safe log example

```text
c.e.a.config.RequestTimingFilter : requestId=3466fda0 method=GET path=/api/health    status=200 durationMs=20
c.e.a.config.RequestTimingFilter : requestId=55fae0cb method=GET path=/api/readiness status=200 durationMs=5
c.e.a.config.RequestTimingFilter : requestId=ee349475 method=GET path=/api/health    status=200 durationMs=2
```

Verified nothing sensitive is logged:

```bash
$ docker logs asset-tracker-api-day17 | grep -cE "apppass|local-dev-only-jwt-secret|eyJhbGci"
0     # no real Mongo password, no JWT secret, no JWT token
```

The MongoDB driver prints its connection settings once at startup with the
password already redacted as `password=<hidden>`; the request logs contain only
method/path/status/duration.

Screenshot:

![Safe log example — RequestTimingFilter lines, no secrets](safe%20log.png)

## Why real secrets are not committed

- **A repo is forever and often public.** Anything committed lives in git history
  even after deletion, so a leaked DB password or JWT signing key can't be truly
  taken back — it must be rotated.
- **The JWT secret signs auth tokens.** Whoever has it can mint valid tokens and
  impersonate any user; the DB password grants direct data access.
- **Secrets differ per environment** (dev/staging/prod) and per developer, so
  they belong in runtime config (`--env-file .env`, orchestrator secrets), not in
  source. We commit only `.env.example` with placeholders so teammates know
  *which* variables to set, never the values. `.gitignore` (`.env`, `*.env`,
  `*.pem`, `*.key`, `secrets/`) and `.dockerignore` keep the real files out of
  both git and the image.
