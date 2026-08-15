# Day 16 Asset Refactor Rationale

> The Day 16 exercises describe a generic "Support Desk Ticket" project. My
> project is the **Asset Tracker**, so "ticket" maps to "asset" throughout.
> This is the file the exercise calls `docs/day16-ticket-refactor-rationale.md`.

A reviewer should be able to read this and understand exactly what changed, what
stayed the same, and how we know it is safe.

## Files changed

| File | Change |
| --- | --- |
| `src/main/java/com/example/assettracker/service/AssetService.java` | Extracted repeated logic from `createAsset` / `updateAsset` into private helpers. |
| `frontend/src/utils/assetFormValidation.js` | **New.** Form validation + formatting rules moved out of the component. |
| `frontend/src/components/AssetFormWizard.jsx` | Now delegates validation/normalization/labelling to the utility. |
| `frontend/src/utils/assetFormValidation.test.js` | **New.** 11 unit tests for the utility. |

## What behaviour was preserved

- **API surface:** endpoint URLs, HTTP verbs, request DTOs and the
  `AssetResponse` shape are unchanged.
- **Error handling:** `ResourceNotFoundException` (missing id),
  `DuplicateResourceException` (duplicate asset tag / serial number) and
  `InvalidRequestException` (invalid status) still fire with identical messages.
- **Status rules:** still trimmed, upper-cased and limited to
  `AVAILABLE / ASSIGNED / MAINTENANCE`.
- **Frontend UX:** the wizard's steps, field names, inline error messages, review
  screen and create/edit flows look and behave exactly the same.

## What logic was extracted

**Backend (`AssetService`)**

- `findAssetOrThrow(id)` — the repeated find-by-id-or-404 lookup.
- `normalizeRequired(value)` — the repeated `.trim()` on required fields.
- `normalizeStatus(status)` — trim + upper-case + `validateStatus`.
- `verifyAssetTagIsUnique(tag, current)` / `verifySerialNumberIsUnique(serial, current)`
  — the duplicate checks, unified so `create` passes `null` (always check) and
  `update` passes the loaded asset (skip when unchanged).

**Frontend (`assetFormValidation.js`)**

- `validateAssetFormStep(formValues, step, reviewConfirmed)` — per-step rules.
- `normalizeAssetFormPayload(formValues)` — trimming + blank assignee → `null`.
- `formatAssetFormLabel(key)` — camelCase → spaced label on the review screen.

## Why the new version is easier to maintain

- The public service methods now read as workflows ("normalize inputs, check
  uniqueness, save") instead of a wall of trims and `if` checks.
- Validation rules live in one pure module that can be unit-tested in
  milliseconds without rendering the form or clicking through three steps.
- The duplicate-check rule exists once instead of being copy-pasted between
  create and update, so a future change can't drift between the two.

## Tests / requests run

- Backend: `./mvnw -q -DskipTests compile` → exit 0.
- Frontend: `assetFormValidation.test.js` → 11 passing (run in the `node`
  environment because this machine's `jsdom` build is broken — see risk below).
- Manual/HTTP (to run against a live instance): create, update, duplicate-tag
  409, invalid-status 400 — see `submissions/Exercise_02_Backend_Ticket_Service_Refactor.md`.

## Risks that still remain

- **Live HTTP checks not executed here.** The four curl checks need MongoDB + the
  running app; they are specified but were not run in this environment. The
  refactor is behaviour-preserving by construction and compiles.
- **Frontend suite can't run under the full jsdom config on this machine**
  (`jsdom@30` → `undici@8` vs Node 20.20.2: `webidl.util.markAsUncloneable is
  not a function`). This is a pre-existing environment issue affecting the
  day15 tests too, not caused by this refactor. The new tests are pure functions
  and pass in a `node` environment; on a compatible Node they run in the normal
  suite unchanged.
