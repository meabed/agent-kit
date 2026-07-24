---
name: remove-trivial-tests
description: Audit branch-touched tests and remove or rewrite shallow coverage that cannot catch meaningful regressions. Use when reviewing AI-written tests, reducing brittle snapshots, cleaning mock-echo assertions, or classifying tests as keep, rewrite, delete, or flag.
---

# Remove trivial tests

Before editing, name the product, integration, permission, parsing, retry, data-write, or regression
behavior each touched test is intended to protect.

Give every test one verdict:

- **Keep:** it fails when meaningful behavior, a boundary, an integration, or a known regression
  breaks.
- **Rewrite:** it targets a useful risk but asserts structure, mocks, or incidental implementation
  instead of behavior.
- **Delete:** it only proves an import exists, a typed value is defined, a constant mirrors config, a
  mock returns its input, or a component renders without a user-visible outcome.
- **Flag:** the behavior matters, but the correct expectation or fixture cannot be discovered safely.

Do not use a coverage percentage as the verdict. Do not remove useful negative, permission,
idempotency, serialization, or integration coverage merely because it is expensive.

When rewriting, prefer the lowest test level that observes the real contract and use repository
fixtures or realistic boundary doubles. Keep teardown scoped to data created by the test; never wipe
parallel test data with an unbounded delete.

Run the narrow suite first and the repository gate required by the changed surface. Close with what
was removed, what was rewritten, the behavior each remaining test protects, and the risk still
uncovered.
