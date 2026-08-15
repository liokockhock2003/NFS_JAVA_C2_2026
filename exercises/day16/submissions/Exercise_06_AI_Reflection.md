# Day 16 Exercise 6 - AI-Assisted Coding Reflection (Submission)

**1. What did the AI assistant help you do faster?**
Mechanical extraction. It quickly proposed the helper method names and moved the
repeated trim/lookup/duplicate-check blocks out of `createAsset` / `updateAsset`,
and it drafted a first batch of unit tests for `assetFormValidation.js` so I had
something to harden instead of starting from a blank file.

**2. What AI suggestion did you reject or change?**
- It initially wrote the duplicate check as two separate helpers that always
  queried the repository. That would have changed `updateAsset` behaviour
  (re-flagging an unchanged tag as a duplicate). I changed it to pass the current
  asset so the check is skipped when the value is unchanged, preserving the
  original conditional.
- It suggested tests using `expect(errors).toBeTruthy()` and mounting the whole
  component; I replaced those with exact-message assertions on the pure functions.

**3. Why should developers not accept generated code blindly?**
Generated code often *looks* right but changes edge-case behaviour — order of
validation, null/blank handling, case sensitivity, exact error messages. Those
are exactly the things an API contract depends on. Without reading it and testing
it, a "clean" refactor can silently break a duplicate check or a status rule.

**4. What private information should never be pasted into AI tools?**
Secrets and personal data: `application.properties` values, MongoDB
username/password and connection string, the JWT signing secret, real bearer
tokens/cookies from a live login, and real user emails or other PII. Share code
structure and public API shape, not credentials.

**5. What tests proved that your refactor preserved behaviour?**
- Backend: `./mvnw -q -DskipTests compile` (exit 0); the create/update/
  duplicate-409/invalid-status-400 HTTP checks documented in Exercise 02.
- Frontend: 11 unit tests in `assetFormValidation.test.js` (required fields,
  invalid status, asset-tag format, email-like assignee, review confirmation,
  payload normalization) — all passing.

**6. What part of AI-assisted refactoring still feels unclear?**
Knowing how far to trust a refactor without full end-to-end coverage. Compile +
unit tests catch a lot, but the truly convincing proof is running the live HTTP
flows and an E2E smoke test — and deciding how much of that is "enough" before
merging is still a judgement call.
