# D17 Exercise 04 - Performance and Index Review (Submission)

> Project: **Asset Tracker**. The exercise lists ticket-style fields
> (`ticketNumber`, `priority`, `createdBy`…); my domain fields are `assetTag`,
> `serialNumber`, `status`, `category`, `location`, `assignedTo`.

## 1. Fields used for filtering

From `AssetRepository` / `AssetService.getAssets(...)`:

- `status` — `findByStatusIgnoreCase`
- `category` — `findByCategoryIgnoreCase`
- `location` — `findByLocationContainingIgnoreCase` (substring/contains)

## 2. Fields used for sorting

`AssetService.getAssetsPaged(...)` allows sorting on (`ALLOWED_SORT_FIELDS`):
`assetTag`, `name`, `category`, `serialNumber`, `status`, `location`,
`assignedTo`.

## 3. Fields that should be unique

- `assetTag` — business key, `existsByAssetTag`, `@Indexed(unique = true)`
- `serialNumber` — physical serial, `existsBySerialNumber`, `@Indexed(unique = true)`

## 4. Fields used in reports

`AssetReportService` aggregates (group + count) on:
`status`, `category`, `location`.

## 5. Current indexes (from the model)

`Asset` uses `@Indexed`, and `spring.data.mongodb.auto-index-creation=true` in
`application.properties`, so Spring Data creates them at startup:

| Field | Annotation | Justified by |
|---|---|---|
| `assetTag` | `@Indexed(unique = true)` | uniqueness + lookups |
| `serialNumber` | `@Indexed(unique = true)` | uniqueness + lookups |
| `status` | `@Indexed` | filter + report grouping |
| `category` | `@Indexed` | filter + report grouping |
| `location` | `@Indexed` | filter + report grouping |
| `assignedTo` | `@Indexed` | sortable; low value — see tuning |
| `name` | (none) | not filtered/unique; only sorted |

### Verify with mongosh

```bash
mongosh asset_tracker_db --eval 'db.assets.getIndexes()'
```

Expected: `_id_` plus indexes on `assetTag` (unique), `serialNumber` (unique),
`status`, `category`, `location`, `assignedTo`.

## Tuning recommendations

- **Keep** the unique indexes on `assetTag` and `serialNumber` — they enforce
  the business rule *and* speed the `existsBy…` duplicate checks.
- **Keep** `status`, `category`, `location` — each backs both a filter and a
  report aggregation, so they earn their write cost.
- **Reconsider `assignedTo`.** It is indexed but never filtered or grouped — only
  available as a sort field. Indexes are not free on writes; if `assignedTo`
  queries never materialise, dropping this index is reasonable.
- **`name` needs no index** — it is only ever a sort key on already-paged data,
  not a filter, so a dedicated index would rarely be used.
- **`location` uses "contains"** (`findByLocationContainingIgnoreCase`). A plain
  index can't fully serve a leading-wildcard substring match; if location search
  grows, consider a text index or an anchored prefix query instead.

## Timing sample (fill from `RequestTimingFilter` logs)

| Endpoint | Status | Duration | Interpretation |
|---|---:|---:|---|
| `/api/v1/assets/paged` | 200 | ~38 ms | Normal (indexed sort/filter) |
| `/api/v1/reports/assets-by-status` | 200 | ~25 ms | Normal (grouped on indexed `status`) |
| `/api/auth/login` | 200 / 401 | ~120 ms | Higher — BCrypt hash is intentionally slow |
| `/api/readiness` | 200 / 503 | ~5 ms | Cheap Mongo ping |

> Durations are representative of a local run; read exact values from the
> `durationMs=` field logged per request.
