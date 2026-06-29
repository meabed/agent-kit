---
name: skill-migration-parity-check
description: 'Capture reference behavior, separate public from internal fields, and make the new path match what matters.'
agent: agent
---

# Agent prompt: Prove parity during a refactor

You are an AI coding agent working inside a real repository. Use this resource as an operating instruction for the current user request.

## What this is

Capture reference behavior, separate public from internal fields, and make the new path match what matters.

- Resource: Prove parity during a refactor
- Type: skill
- Site URL: https://mo.ca/ai/skill-migration-parity-check
- Source artifact: `skills/migration-parity-check/SKILL.md`
- Topics: skill

## How to use it

1. Read the user's current request and the nearest repo instructions before editing.
2. Apply the resource below as a workflow, command, prompt, skill, or repo rule according to its type.
3. Keep the change scoped to the user's request and the codebase's existing patterns.
4. Name the behavior, risk, or decision the resource is meant to protect.
5. Make the smallest useful edit, then run the focused check and the repo's normal verification gate.
6. Report what changed, what passed, and any risk that remains.

## Resource to apply

A skill for migrations and refactors where the behavior must not change. It captures the reference
branch's intended behavior, distinguishes contracts that must stay stable from internals that may
move, and verifies parity so users and downstream teams do not pay for an implementation cleanup.

```md title="skills/migration-parity-check/SKILL.md"
---
name: migration-parity-check
description: Use when migrating/refactoring and behavior must stay identical, or before implementing tricky logic (redirects, env hydration). Triggers on 'preserve behavior', 'parity with master'.
---

Use when migrating/refactoring and behavior must stay identical, or before implementing tricky logic (redirects, env hydration). Triggers on 'preserve behavior', 'parity with master'.

Method:

1. Study the master/reference branch to capture intended behavior; document it with a Mermaid diagram.
2. Distinguish external/public fields (must stay backward compatible) from internal fields (may change).
3. Implement, then verify parity: what works on master must work on the branch.
4. Validate against tests; add tests for the parity-critical paths.
```

### Capture behavior before you touch it

Step 1 documents what the reference branch actually does — often as a diagram — so "identical behavior" is measured against a written baseline rather than memory.

### Public versus internal

Step 2 is the judgment call that prevents both over- and under-constraining the refactor: external
fields must stay backward compatible for customers, clients, and integrations, while internal ones
are free to change. Tests then pin the parity-critical paths.

<Decision title="Prove the old behavior before replacing it">
  Parity work starts by writing down what the reference path actually does. Without that baseline,
  the migration becomes a debate about memory.
</Decision>

### What counts as proof

Proof can be fixture output, API snapshots, screenshots, generated artifacts, database rows, or
contract tests. It depends on what the old path promised to the caller.

The mistake is comparing implementation shape instead of behavior. A migration can change internals
freely if the public contract, edge cases, and failure behavior still match what the product already
promised.
