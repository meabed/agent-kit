---
description: Review a diff for consequential correctness, safety, and regression risks.
---

# Pre-PR review pass

Lead with `ship` or `hold` and the most consequential reason.

Review the diff for correctness, security, retry or idempotency safety, data loss, contract drift,
blast radius, and missing behavioral tests.

For each finding, return `path:line — severity — failure mode — smallest safe fix`. Include only
issues the author would act on. Do not include praise, nits, or speculative concerns without an
evidence path.

If there are no findings, say so and name any part of the change that could not be verified.
