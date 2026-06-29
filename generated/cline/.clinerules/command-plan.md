---
paths:
  - '**'
---

# Plan before touching the code

For large or ambiguous work: inspect first, write the steps, ask the blocking questions, then execute.

A command for the front of any large or ambiguous change: understand the surface, write a concrete plan, surface the open questions, and get confirmation before writing code.

```md title="commands/plan.md"
---
description: Plan multi-step migrations/features and share the plan before implementing larger or ambiguous changes; ask to clarify ambiguous items one by one
---

Produce a plan before implementing a large or ambiguous change.

Steps:

1. Analyze the codebase holistically to understand purpose, architecture, and the affected surface.
2. Draft a concrete step-by-step plan (files/modules touched, sequence, risks).
3. List ambiguous items and ask me to clarify them one by one; flag any logic gaps for me to decide.
4. Share the plan and wait for confirmation before implementing. Don't deviate from the agreed plan without discussing first.
```

### Clarify one question at a time

Step 3 asks to resolve ambiguity one item at a time rather than dumping a list of questions. It keeps the decisions crisp and the human in the loop on each fork.

### Agree, then build

The plan is a checkpoint, not a formality. Waiting for confirmation — and not deviating from the agreed plan without discussing first — is what prevents a large change from drifting away from intent halfway through.

<Decision title="Planning is for ambiguous blast radius">
  Small fixes should move. Large or blurry changes should stop long enough to name files, risks, and
  the decisions a human still owns.
</Decision>

### What good planning changes

A good plan shrinks surprise. It names the modules, the order, the tests, and the places where a
choice changes the outcome. It also tells the agent what not to touch, which is often the most
important part of a migration.

This command is not for tiny edits. It is for work where implementation before orientation would
create churn: generated SDK fallout, cross-repo parity, content rewrites, auth changes, schema moves,
and anything where "almost right" can make the codebase harder to trust.
