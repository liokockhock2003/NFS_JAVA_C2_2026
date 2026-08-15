# Day 16 Exercise 4 - Generate Then Harden Tests (Submission)

> Target: `frontend/src/utils/assetFormValidation.js`
> Tests: `frontend/src/utils/assetFormValidation.test.js` (11 tests, all passing).

## Required coverage (all present)

- **Required-field test** — `flags required identity fields on step 1` asserts
  the exact messages for `assetTag`, `name`, `category`, `serialNumber`.
- **Invalid status test** — `rejects an unknown status on step 2` checks a
  status outside `AVAILABLE / ASSIGNED / MAINTENANCE` yields
  `'Choose a valid status.'`.
- **Payload normalization test** — `trims required fields and nulls a blank
  assignee` and `trims and keeps a real assignee` verify trimming and the
  blank → `null` rule.

## What the AI draft looked like vs. what I changed

The AI first suggested tests like:

```js
it('validates the form', () => {
  const errors = validateAssetFormStep(form, 1);
  expect(errors).toBeTruthy();          // always true — {} is truthy
});

it('renders the wizard with all fields', () => { /* mounts the component */ });
```

Improvements I made when hardening:

1. **Assert exact messages, not just "an error exists."** `toBeTruthy()` on the
   errors object passes even when there are zero errors (`{}` is truthy). I
   assert the specific string per field, so a changed message fails the test.
2. **Test behaviour, not component structure.** The AI wanted to mount the
   wizard and query the DOM. I test the pure `validateAssetFormStep` /
   `normalizeAssetFormPayload` functions directly — faster, and it does not
   break when the JSX layout changes.
3. **Clear, intent-revealing test names.** `validates the form` became
   `rejects an asset tag that is not uppercase/number/hyphen` etc., so a failure
   report says what broke.
4. **Both sides of a rule.** For the optional assignee I assert the invalid case
   (`alice` → message) *and* the valid case (`alice@example.com` →
   `toBeUndefined()`), so the rule can't silently become "always invalid" or
   "always valid."
5. **Specific assertions.** `toEqual({})` for the valid path (no stray errors),
   and `toEqual({...})` on the full normalized payload rather than checking one
   field, so an accidental extra/missing field is caught.
6. **Dropped brittle/unrealistic cases** the AI added, e.g. asserting internal
   regex source or exact call counts — implementation details, not behaviour.

## Evidence

```text
$ npx vitest run   (node env, validation utility)
 Test Files  1 passed (1)
      Tests  11 passed (11)
```
