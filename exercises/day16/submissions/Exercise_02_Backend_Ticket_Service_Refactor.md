# Day 16 Exercise 2 - Backend Service Refactor (Submission)

> Project: **Asset Tracker**. The exercise's `TicketService` maps to my
> `AssetService` (`src/main/java/com/example/assettracker/service/AssetService.java`).
> Pattern used: **Generate → Explain → Test**.

## What was refactored

`createAsset()` and `updateAsset()` repeated the same low-level work: trimming
required fields, looking an asset up by id, normalising + validating status, and
checking for duplicate asset tags / serial numbers. That logic was extracted
into small private helpers so the public methods read like workflows.

New private helpers:

```java
private Asset  findAssetOrThrow(String id)
private void   verifyAssetTagIsUnique(String assetTag, Asset current)
private void   verifySerialNumberIsUnique(String serialNumber, Asset current)
private String normalizeRequired(String value)
private String normalizeStatus(String status)   // trims, upper-cases, validates
```

`normalizeOptional(...)` and `validateStatus(...)` already existed and were
kept; `normalizeStatus` now reuses `validateStatus`.

## Before / after

**Before** — `updateAsset` inlined lookup, trimming, status handling and two
duplicate checks:

```java
Asset asset = assetRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Asset " + id + " was not found"));

String assetTag = request.getAssetTag().trim();
String serialNumber = request.getSerialNumber().trim();
String status = request.getStatus().trim().toUpperCase();
validateStatus(status);

if (!asset.getAssetTag().equalsIgnoreCase(assetTag) && assetRepository.existsByAssetTag(assetTag)) {
    throw new DuplicateResourceException("Asset tag already exists: " + assetTag);
}
if (!asset.getSerialNumber().equalsIgnoreCase(serialNumber) && assetRepository.existsBySerialNumber(serialNumber)) {
    throw new DuplicateResourceException("Serial number already exists: " + serialNumber);
}
// ...setters...
```

**After** — the same steps, now named:

```java
Asset asset = findAssetOrThrow(id);

String assetTag = normalizeRequired(request.getAssetTag());
String serialNumber = normalizeRequired(request.getSerialNumber());
String status = normalizeStatus(request.getStatus());

verifyAssetTagIsUnique(assetTag, asset);
verifySerialNumberIsUnique(serialNumber, asset);
// ...setters...
```

The `current` parameter unifies the create and update duplicate checks:
`create` passes `null` (always check), `update` passes the loaded asset (skip
the check when the value is unchanged, case-insensitively) — identical to the
original conditional.

## What did NOT change

- Public method names / signatures (`createAsset`, `updateAsset`,
  `getAssetById`, `getAssets`, `getAssetsPaged`, `deleteAsset`).
- Endpoint URLs, request DTOs and the `AssetResponse` response shape.
- Exception types and messages: `ResourceNotFoundException`,
  `DuplicateResourceException`, `InvalidRequestException` — verbatim text.
- Validation order: status is validated before the duplicate checks, before any
  setter/save — same as before.
- Status normalisation: still trimmed, upper-cased, limited to
  `AVAILABLE / ASSIGNED / MAINTENANCE`.

## Test evidence

Compiles cleanly:

```text
$ ./mvnw -q -DskipTests compile
EXIT=0
```

HTTP behaviour to confirm the create / update / error paths are unchanged
(bearer token from login required; base URL `http://localhost:8080`):

```bash
# 1. Create — expect 201 Created + AssetResponse
curl -i -X POST http://localhost:8080/api/v1/assets \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"assetTag":"LAP-2026-777","name":"Test Laptop","category":"Laptop",
       "serialNumber":"SN-TEST-777","location":"HQ Floor 1"}'

# 2. Update — expect 200 OK + updated AssetResponse (status normalised to upper case)
curl -i -X PUT http://localhost:8080/api/v1/assets/$ID \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"assetTag":"LAP-2026-777","name":"Test Laptop","category":"Laptop",
       "serialNumber":"SN-TEST-777","status":"assigned","location":"HQ",
       "assignedTo":"user@example.com"}'

# 3. Duplicate tag — expect 409 Conflict "Asset tag already exists: ..."
curl -i -X POST http://localhost:8080/api/v1/assets \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"assetTag":"LAP-2026-777","name":"Dup","category":"Laptop",
       "serialNumber":"SN-OTHER","location":"HQ"}'

# 4. Invalid status on update — expect 400 Bad Request
#    "Status must be AVAILABLE, ASSIGNED or MAINTENANCE"
curl -i -X PUT http://localhost:8080/api/v1/assets/$ID \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"assetTag":"LAP-2026-777","name":"Test Laptop","category":"Laptop",
       "serialNumber":"SN-TEST-777","status":"BROKEN","location":"HQ"}'
```

> Note: running the four live calls needs MongoDB + the app running. The refactor
> is behaviour-preserving by construction (same order, same messages, same
> exceptions) and confirmed to compile; the commands above are the exact checks
> to run against a live instance.
