# D17 Exercise 02 - Readiness Endpoint (Submission)

> Project: **Asset Tracker**, so `service` is `"asset-tracker-api"` (matching
> `/api/health`) rather than the exercise's generic `"support-desk-api"`.

## Controller

`src/main/java/com/example/assettracker/controller/ReadinessController.java`

`GET /api/readiness` pings MongoDB with `db.runCommand({ ping: 1 })` via
`MongoTemplate.executeCommand(...)`:

- **DB reachable →** `200 OK`
- **DB unreachable (ping throws) →** `503 Service Unavailable`

The endpoint is public (already `permitAll` in `SecurityConfig`), so a probe
needs no token. Readiness is separate from liveness (`/api/health`): the process
can be *up* but *not ready* if Mongo is down.

### Security note
On failure the handler logs only the **exception class name**, never the
exception message — a Mongo connection error can embed the connection string and
credentials, which must not reach the logs.

## Test evidence

**Ready (Mongo running):**

```bash
$ curl -s -i http://localhost:8080/api/readiness
HTTP/1.1 200 OK
Content-Type: application/json

{
  "service" : "asset-tracker-api",
  "status" : "READY",
  "database" : "CONNECTED"
}
```

**Not ready (Mongo stopped):**

```bash
$ curl -s -i http://localhost:8080/api/readiness
HTTP/1.1 503 Service Unavailable
Content-Type: application/json

{
  "service" : "asset-tracker-api",
  "status" : "NOT_READY",
  "database" : "DISCONNECTED",
  "message" : "Database readiness check failed: MongoDB is not reachable."
}
```

> The 503 path is exercised by stopping MongoDB (e.g. `brew services stop
> mongodb-community` or stopping the Mongo container) and re-running the curl.
> Backend compiles clean (`./mvnw -q -DskipTests compile` → exit 0).
