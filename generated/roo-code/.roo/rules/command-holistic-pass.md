# Final cleanup pass before calling it done

Re-scan the whole project for leftovers, stale docs, missed simplifications, and rule violations.

This runs after the core change is done. It's a deliberate second loop over the entire project to
catch everything the focused work missed — half-done bits, follow-ups, stale docs, naming, and any
house-rule violations that would make the next teammate or customer-facing fix harder to trust.

```md title="commands/holistic-pass.md"
---
description: After completing the main work, take another holistic pass: look for cleanups, leftovers, follow-ups, re-org, re-architecture, simplification
---

Take a final holistic pass over the just-completed work.

Check the whole project for: leftovers/half-done work, follow-ups/TODOs, cleanup, re-org/re-architecture opportunities, simplification, stale comments/docs/diagrams, missed fields, naming issues, and AGENTS.md code-rule violations.

Fix what's safe and in-scope; for anything larger, report concrete next steps as a short ordered list. Don't declare complete until nothing is half-done.
```

### Mapped to a loop

This is a `loop` rather than a one-shot command: it iterates over the just-completed work as a whole, fixing what's safe and re-checking, and explicitly refuses to declare done while anything is half-finished.

### Zoom out after zooming in

Focused work leaves a wake — a renamed thing referenced in an old comment, a doc that no longer
matches, a field that was added but never wired. The holistic pass is the moment to widen the lens
and clean it up before the mismatch becomes a review delay, support mystery, or product regression.

<Principle title="Done includes the wake">
  A change is not finished while stale names, docs, tests, or half-wired fields still point to the
  old world. The final pass catches what focused implementation misses.
</Principle>

### What it usually finds

The good finds are small but real: a route label that still says the old name, a docs paragraph that
describes the previous flow, a test fixture missing the new field, or a dead helper left behind. The
benefit is not neatness for its own sake; it is a codebase the team can change without re-learning
old mistakes.

This pass is not permission to start a new architecture project. It is a cleanup loop around the
change that just happened. Bigger ideas become explicit follow-up, not surprise scope.
