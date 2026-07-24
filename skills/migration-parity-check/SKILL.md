---
name: migration-parity-check
description: Prove required behavioral parity during a refactor, language migration, provider change, or reimplementation. Use when matching a reference branch or sibling repository, preserving an external contract, replacing tricky logic, or explicitly checking parity before removing an old path.
---

# Prove migration parity

## Define the parity target

Name the exact reference: commit, branch, release, fixture set, deployed behavior, or read-only sibling
repository. Capture observable contracts, edge cases, errors, side effects, ordering, and generated
artifacts before changing code.

Treat sibling repositories as read-only unless the user explicitly includes them as write targets.
Do not infer that every internal detail must match. Separate:

- external behavior that must remain stable;
- intentional contract changes approved for the migration;
- internal implementation details free to change.

## Build evidence

Choose evidence at the boundary users or downstream systems observe: golden files, contract tests,
API responses, database effects, CLI output, screenshots, or generated artifacts. Add a failing
comparison before replacing risky logic when practical.

Implement the new path directly against the current contract. Do not add an alias or wrapper merely
to hide incomplete consumer migration. Remove the old path when the agreed cutover is complete.

## Verify

Run both implementations or compare the reference and replacement against identical fixtures.
Explain every difference as intended, irrelevant, or a defect. Run focused parity tests, the full
repository gate, and a live check when the migrated behavior has a running interface.

Return the parity matrix, intentional differences, removed legacy path, exact evidence, and
unverified risk.
