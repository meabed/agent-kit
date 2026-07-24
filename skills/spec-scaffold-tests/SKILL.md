---
name: spec-scaffold-tests
description: Turn an agreed behavior specification into a minimal scaffold and failing behavioral tests before implementation. Use for TDD handoffs, contract-first features, idempotency or permission invariants, parser behavior, API boundaries, and tasks explicitly requesting spec then scaffold then tests.
---

# Convert a specification into executable boundaries

1. Read the applicable repository instructions and the agreed specification. Separate required
   behavior, explicit non-goals, open decisions, and acceptance evidence.
2. Stop for a material product decision the specification does not answer. Do not invent behavior
   merely to make a test writable.
3. Create only the smallest scaffold needed to expose the intended public boundary. Follow existing
   module, naming, schema, and test conventions.
4. Write tests that fail for the specified behavior before implementation. Cover the primary
   invariant, relevant negative cases, retry or concurrency behavior, and boundary errors.
5. Avoid filler tests that restate types, imports, constants, or mock wiring. Prefer observable
   contracts over internal call counts.
6. Prove the tests fail for the expected reason, not because the scaffold is malformed.
7. Implement logic only when the request includes implementation. Otherwise hand off the red suite
   with the exact command and the behavior each test encodes.
8. After implementation, run the focused tests and full required gate and confirm the original red
   failure is now green.
