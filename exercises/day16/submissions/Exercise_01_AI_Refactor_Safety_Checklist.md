# Day 16 Exercise 1 - AI Refactor Safety Checklist (Submission)

> Project: **Asset Tracker** (Spring Boot + MongoDB backend, React frontend).
> "Ticket" in the exercise maps to my Asset domain.

A short pre-flight checklist to run **before** pasting any code into an AI tool
and **before** accepting its suggestions.

- [ ] **Safe to share:** application source with no secrets — service and
      controller classes (`AssetService.java`, `AssetController.java`), React
      components/utilities (`AssetFormWizard.jsx`, `assetFormValidation.js`),
      DTOs and test files.
- [ ] **Safe to share:** the exercise brief and the public API shape
      (routes, request/response fields) so the AI knows what must stay stable.
- [ ] **Do NOT share:** `src/main/resources/application.properties` /
      `application-*.yml`, any `.env` file, or CI/deploy secrets.
- [ ] **Do NOT share:** `MONGODB_USERNAME`, `MONGODB_PASSWORD`, the Mongo
      connection string / auth database, or the JWT signing secret used by
      `JwtService`.
- [ ] **Remove before sharing:** any real bearer token, cookie, or
      `Authorization` header captured from a live login, and any real user email
      / personal data — replace with placeholders like `user@example.com`.
- [ ] **Remove before sharing:** internal hostnames, ports, and seed data that
      reveals real accounts (`UserDataSeeder`, `AssetDataSeeder`).
- [ ] **Behaviour that must NOT change:** public endpoint URLs and HTTP verbs,
      request DTO field names, and the `AssetResponse` response shape.
- [ ] **Behaviour that must NOT change:** validation rules and messages,
      duplicate-tag / duplicate-serial conflict handling, status normalisation
      (AVAILABLE / ASSIGNED / MAINTENANCE), and 401/403 auth handling.
- [ ] **Proof the refactor is safe (backend):** `mvn -q -DskipTests compile`
      succeeds, then HTTP checks — `POST /api/v1/assets` (create),
      `PUT /api/v1/assets/{id}` (update), a duplicate-tag conflict, and an
      invalid-status bad request — all return the same status and body as before.
- [ ] **Proof the refactor is safe (frontend):** unit tests for the extracted
      validation utility pass, and a manual smoke test confirms create + edit
      still work with identical inline error messages.
