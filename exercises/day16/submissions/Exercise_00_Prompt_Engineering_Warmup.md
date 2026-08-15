# Day 16 Exercise 0 - Prompt Engineering Warm-Up (Submission)

> Project note: my project is the **Asset Tracker** (Spring Boot + React). The
> exercise text says "Support Desk Ticket / TicketService"; I mapped that to my
> real service, `AssetService`, throughout.

## 1. Poor prompt (too vague)

```text
Clean up my asset service and make it better.
```

Why it is weak: no project context, no target file, no rules about what must
stay the same, no definition of "better", and no way to check the result. The
AI is free to rename methods, change endpoint behaviour, or alter response
shapes, and I would have no way to tell what it changed or whether it broke the
API.

## 2. Better developer prompt (structured)

```text
Context:
I am working on the Asset Tracker project (Spring Boot backend, MongoDB).
The class is src/main/java/com/example/assettracker/service/AssetService.java.
It exposes createAsset(), updateAsset(), getAssets(), getAssetById() and
deleteAsset(), which are called by AssetController / AssetV1Controller.

Task:
Refactor createAsset() and updateAsset() to remove repeated validation,
lookup and trimming logic by extracting small private helper methods
(findAssetOrThrow, normalizeRequired, normalizeStatus). Keep the refactor small.

Constraints:
- Do NOT change any public method name or signature.
- Do NOT change endpoint URLs, request DTOs or the AssetResponse shape.
- Duplicate asset tag / serial number must still throw DuplicateResourceException.
- Invalid status must still throw InvalidRequestException.
- Missing asset id must still throw ResourceNotFoundException.
- Status must still be normalised to upper case and limited to
  AVAILABLE, ASSIGNED, MAINTENANCE.

Expected output:
Updated AssetService.java only, plus a short before/after explanation of which
blocks moved into which helper. No changes to controllers, DTOs or config.

Tests:
It must still compile (mvn -q -DskipTests compile) and the existing HTTP flows
must behave the same: POST /api/v1/assets (create), PUT /api/v1/assets/{id}
(update), duplicate-tag conflict, and invalid-status bad request.

Review:
Call out any risk that the refactor could change behaviour, especially around
null/blank handling, case-insensitive duplicate checks, or the order in which
validation runs versus persistence.
```

## Why the second prompt is safer

- It **pins the exact file and methods**, so the AI cannot wander into
  controllers, security config or DTOs.
- It states an explicit **"must not change" contract** (URLs, DTO names,
  response shape, exception types), which turns vague "make it better" into a
  behaviour-preserving refactor.
- It defines **what "done" looks like** (specific helper methods, small diff)
  and **how it will be verified** (compile + the four HTTP flows), so the output
  is checkable instead of trusted blindly.
- It asks the AI to **surface risks** (null/blank, case-insensitivity, ordering)
  instead of silently making assumptions, which is where refactors usually break
  behaviour.
