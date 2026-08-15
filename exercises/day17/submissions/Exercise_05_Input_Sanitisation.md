# D17 Exercise 05 - Input Sanitisation (Submission)

> Project: **Asset Tracker**.

## Utility

`src/main/java/com/example/assettracker/util/InputSanitizer.java` — a final,
dependency-free helper class:

| Method | What it does | Example use |
|---|---|---|
| `trimToNull(value)` | Trim, then blank → `null` | optional `assignedTo` |
| `cleanText(value)` | Strip ISO control chars, then trim | `name`, `category`, `location` |
| `normalizeCode(value)` | `cleanText` + upper-case | `assetTag`, `serialNumber` |

Covers the four required behaviours:
1. **Trim** leading/trailing spaces — all three helpers.
2. **Empty → null** where appropriate — `trimToNull`.
3. **Remove control characters** from simple text — `cleanText`.
4. **Normalise code-like fields** — `normalizeCode` (trim + strip + upper-case).

## Important: sanitisation does not hide invalid input

These helpers only clean values that are *already allowed*. They never turn a
rejectable value into an accepted one — e.g. `cleanText` does not invent a
missing required field, and `normalizeCode` does not make an out-of-range status
valid. Rejection stays with validation (`@NotBlank`, the status/priority checks,
duplicate-key checks).

## Reflection

**1. What is validation?**
Deciding whether input is *acceptable* and rejecting it if not — e.g. required
fields present, status is one of `AVAILABLE/ASSIGNED/MAINTENANCE`, `assetTag`
unique. A failed validation returns an error (400/409), it does not "fix" data.

**2. What is sanitisation?**
Cleaning/normalising input that is otherwise acceptable so it is stored
consistently and safely — trimming spaces, dropping control characters,
upper-casing a code. It changes the value's *form*, not its *acceptability*.

**3. One example where input should be cleaned:**
A user pastes `"  lap-2026-001\n"` for the asset tag. `normalizeCode` trims it,
removes the newline and upper-cases it to `"LAP-2026-001"` so it matches the
unique index and lookups. The value was valid; it just needed tidying.

**4. One example where input should be rejected:**
A create request with `status = "BROKEN"` (or a missing `serialNumber`). No
amount of trimming makes it valid — it must be rejected with `400 Bad Request`.
Cleaning it into a guess would hide a real client error.
