---
name: command-apply-everywhere
description: 'Find every occurrence, patch the full surface, and write the rule down so the drift does not come back.'
agent: agent
---

# Agent prompt: Fix the whole pattern, not one instance

You are an AI coding agent working inside a real repository. Use this resource as an operating instruction for the current user request.

## What this is

Find every occurrence, patch the full surface, and write the rule down so the drift does not come back.

- Resource: Fix the whole pattern, not one instance
- Type: command
- Site URL: https://mo.ca/ai/command-apply-everywhere
- Source artifact: `commands/apply-everywhere.md`
- Topics: command

## How to use it

1. Read the user's current request and the nearest repo instructions before editing.
2. Apply the resource below as a workflow, command, prompt, skill, or repo rule according to its type.
3. Keep the change scoped to the user's request and the codebase's existing patterns.
4. Name the behavior, risk, or decision the resource is meant to protect.
5. Make the smallest useful edit, then run the focused check and the repo's normal verification gate.
6. Report what changed, what passed, and any risk that remains.

## Resource to apply

A command for turning a one-off fix into a consistent sweep. Instead of patching the instance in
front of you, it finds every occurrence across the project, applies the same fix to all of them, and
records the new rule so the team and the product stop living with two versions of the same behavior.

```md title="commands/apply-everywhere.md"
---
description: Don't fix narrowly. Look holistically across the entire project for re-org, re-architecture, cleanup, simplification, consistency fixes, and
---

Apply a fix/pattern consistently across the entire codebase.

Steps:

1. Identify the target pattern/issue precisely (quote a representative example with file:line).
2. Grep/enumerate EVERY occurrence across all modules/tables/views/components — don't sample, don't take shortcuts.
3. Apply the fix uniformly to all of them, following established conventions.
4. Look for adjacent re-org/re-architecture/simplification/consistency wins surfaced by the sweep.
5. Update docs, AGENTS.md code rules, and patterns to reflect the change.
```

### Enumerate, don't sample

Step 2 is the whole point — "don't sample, don't take shortcuts." A fix that lands in some places
and not others is worse than no fix, because the inconsistency hides which behavior is correct for
the next engineer, support issue, or customer path.

### Capture the rule

Step 5 makes the sweep stick. Once a pattern is applied everywhere, recording it in AGENTS.md means the next agent enforces it instead of reintroducing the old shape.

<Decision title="Patch the pattern, not the example">
  When the same bug class appears twice, grep the whole surface before editing. A narrow fix is
  useful only after you know it is truly narrow.
</Decision>

### When it pays off

Use this for naming migrations, repeated config flags, generated-client fallout, shared UI behavior,
and old helper contracts that survived in more than one module. The command is overkill for a typo,
but it is exactly right when the same product behavior can now drift in multiple places.

The important evidence is the enumeration. Before editing, the agent should be able to say how many
matches exist and why each one is or is not in scope. That is what keeps a sweep from becoming a
drive-by refactor.
