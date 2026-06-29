---
description: 'Block locking DDL, unsafe deploy order, and unbatched backfills before a human has to catch them.'
---

# Agent prompt: Gate production migrations before review

You are an AI coding agent working inside a real repository. Use this resource as an operating instruction for the current user request.

## What this is

Block locking DDL, unsafe deploy order, and unbatched backfills before a human has to catch them.

- Resource: Gate production migrations before review
- Type: skill
- Site URL: https://mo.ca/ai/migration-review
- Topics: skill

## How to use it

1. Read the user's current request and the nearest repo instructions before editing.
2. Apply the resource below as a workflow, command, prompt, skill, or repo rule according to its type.
3. Keep the change scoped to the user's request and the codebase's existing patterns.
4. Name the behavior, risk, or decision the resource is meant to protect.
5. Make the smallest useful edit, then run the focused check and the repo's normal verification gate.
6. Report what changed, what passed, and any risk that remains.

## Resource to apply

Migrations deserve a clear ship/hold decision before a reviewer has to infer safety from a diff. This skill runs the moment a change touches db/migrations/\*\*, and it has veto power. It encodes the rules I would otherwise repeat in every review.

```md title="skills/migration-review/SKILL.md"
# skill: migration-review

description: Gate any change under db/migrations/\*\* before review.

## when

A diff touches db/migrations/\*\* or schema.sql.

## check

- safe to ship: the deploy order, checks, and forward-fix path are written down.
- no locking DDL on hot tables (orders, ledger, sessions).
- adds an index CONCURRENTLY; never a bare CREATE INDEX in a txn.
- backfills run in batches, off the request path.

## output

A pass / hold verdict, then file:line notes. No prose.
```

### Why a skill, not a prompt

A skill is addressable — the agent invokes it by name when a trigger matches, so I don’t have to remember to ask. The rules live in one file, version-controlled next to the code they protect.

### It only says pass or hold

No prose, no hedging. A verdict and file:line notes. If it can’t prove a migration is non-locking, batched, and safe to ship, it holds — and a human decides. Boring, predictable, exactly what you want guarding a schema.

<Principle title="Schema changes deserve a verdict">
  A migration review should end in pass or hold. If the deploy order, locks, batching, or checks are
  unclear, the safest output is a hold with file-line evidence.
</Principle>

### The questions it asks first

Can the old app and new app both survive the change? Does the migration lock a hot table? Is the
backfill bounded, resumable, and outside the request path? Are generated clients, API contracts, and
feature flags in the right order?

Those questions are boring until one is missing. Then a migration becomes a deploy incident. The
skill exists so the review starts with the failure classes that matter, not with whatever is easiest
to comment on.
