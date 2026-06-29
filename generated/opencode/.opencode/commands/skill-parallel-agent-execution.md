---
description: 'Plan first, split the work into disjoint surfaces, fan out, then reconcile and verify the whole result.'
---

# Agent prompt: Parallel agents with clean write scopes

You are an AI coding agent working inside a real repository. Use this resource as an operating instruction for the current user request.

## What this is

Plan first, split the work into disjoint surfaces, fan out, then reconcile and verify the whole result.

- Resource: Parallel agents with clean write scopes
- Type: skill
- Site URL: https://mo.ca/ai/skill-parallel-agent-execution
- Source artifact: `skills/parallel-agent-execution/SKILL.md`
- Topics: skill

## How to use it

1. Read the user's current request and the nearest repo instructions before editing.
2. Apply the resource below as a workflow, command, prompt, skill, or repo rule according to its type.
3. Keep the change scoped to the user's request and the codebase's existing patterns.
4. Name the behavior, risk, or decision the resource is meant to protect.
5. Make the smallest useful edit, then run the focused check and the repo's normal verification gate.
6. Report what changed, what passed, and any risk that remains.

## Resource to apply

A skill for parallelizing large or highly repetitive work across multiple agents. The safety mechanism is disjoint write ownership — no two agents ever edit the same files.

```md title="skills/parallel-agent-execution/SKILL.md"
---
name: parallel-agent-execution
description: Use when a task is large or a change repeats more than ~5 times and could be parallelized. Triggers on big migrations, repetitive sweeps.
---

Use when a task is large or a change repeats more than ~5 times and could be parallelized. Triggers on big migrations, repetitive sweeps.

Method:

1. Do exploration/planning first; map the full surface and decompose it.
2. Partition the work into disjoint write-ownership scopes (no two agents edit the same files).
3. Launch multiple parallel agents, one per scope, with crisp instructions.
4. Never revert another agent's edits; keep write scopes strictly disjoint.
5. Reconcile and run the full verification gate after all agents finish.
```

### Disjoint write scopes

Steps 2 and 4 are the whole safety model: partition the work so each agent owns a non-overlapping set of files, and never touch another agent's files. Overlapping writes are how parallel runs corrupt each other.

### Plan first, reconcile last

Exploration and decomposition come before any agent launches, and a single full verification gate runs once they all finish — so the parallelism speeds up the work without skipping the checks.

<Tradeoff title="Parallelism only helps with clean ownership">
  Multiple agents save time when their write scopes do not overlap. Without that partitioning, the
  merge work costs more than the parallelism saved.
</Tradeoff>

### Good split points

Good split points are content folders, generated consumers by package, route families, or test suites
with clear ownership. Bad split points are "frontend" and "backend" when both touch shared types.

The parent agent still owns the final read. Parallel work is only safe when somebody reconciles the
whole diff, runs the real gates, and checks that the pieces form one coherent change.
