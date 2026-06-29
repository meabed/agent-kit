---
name: skill-writing-tests
description: 'This skill should be used when the user asks to apply "Write tests that can actually fail", mentions "skill-writing-tests", or needs this workflow: Behavior checks, negative cases, regression coverage, and cleanup that keeps the next run honest.'
version: 0.1.0
---

# Write tests that can actually fail

Behavior checks, negative cases, regression coverage, and cleanup that keeps the next run honest.

## Instructions

A skill for writing and reviewing unit and end-to-end tests. It rejects coverage-padding filler and insists every test verifies real behavior — with one sharp rule about not wiping parallel test data.

```md title="skills/writing-tests/SKILL.md"
---
name: writing-tests
description: Use when writing or reviewing unit/api-flow (e2e) tests in this codebase. Triggers when adding tests, doing TDD, or fixing a bug that needs a regression test.
---

Use when writing or reviewing unit/api-flow (e2e) tests in this codebase. Triggers when adding tests, doing TDD, or fixing a bug that needs a regression test.

Guidance:

- Add real, meaningful tests that verify behavior; no filler/coverage-padding tests.
- Use TDD where applicable (write the failing test first).
- Cover positive AND negative cases and all branches explicitly.
- Prefer real mocks (real SSE/LLM responses, MSW) over hand-written manual mocks.
- Every bug fix gets a regression test that fails before the fix.
- Scope test-data deletion to the test file — never deleteMany with an empty filter (it wipes parallel test data).
- Report pass counts per suite when done.
```

### A regression test per bug

Every fix ships with a test that fails before it and passes after — the proof the bug is actually gone and a guard against its return.

### Don't wipe parallel data

The most operationally important rule: scope test-data deletion to the current test file. A delete-many with an empty filter wipes the data other suites are using in parallel, turning one bad teardown into a flood of unrelated failures.

<Decision title="Tests must protect behavior">
  A test that cannot fail for a meaningful regression is not harmless. It slows change and teaches
  the team to trust the wrong signal.
</Decision>

### What to delete

Delete tests that only assert imports exist, mocks echo inputs, or typed config has a key. Those are
compiler checks wearing a test name.

Replace them with behavior coverage where the product can actually regress: permissions, retries,
parsing, money math, data writes, API errors, and UI states users depend on.

## Verification

Before calling the task done, run the focused check for the files you changed and the repository's normal verification gate. Report what changed, what passed, and any risk that remains.
