---
name: writing-tests
description: Write or review tests that can catch real bugs. Use for unit, integration, API, or end-to-end tests, tests written before the code, tests for fixed bugs, failure cases, fragile mocks, or unsafe test cleanup.
---

# Write behavior-focused tests

Before writing a test, state the failure mode it protects. If the answer is only that an import,
typed value, export, or constant might not exist, leave that check to the compiler, schema, linter,
or build.

1. Inspect the existing test layers, fixtures, isolation model, and repository commands.
2. Choose the lowest layer that observes the real contract without duplicating implementation.
3. For a bug, write a regression test that fails for the reported behavior before applying the fix.
4. Cover the primary success path, meaningful negative cases, boundary values, permissions, retries,
   idempotency, serialization, and cleanup relevant to the risk.
5. Prefer realistic protocol or boundary doubles over mocks that only echo inputs. Avoid asserting
   internal call order unless that order is itself the contract.
6. Make data unique per test and clean up only what that test created. Never use an unbounded delete
   that can erase parallel test data.
7. Keep tests deterministic: control time, randomness, network, and asynchronous completion through
   the repository's established mechanisms.
8. Prove a new test can fail for the intended reason, then run the focused suite and required full
   gate.

Report pass counts, the behavior protected by each new or rewritten test, and important risk that
still lacks coverage.
