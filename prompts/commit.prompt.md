# Commit + PR description

From the staged diff, produce:

## commit subject

- conventional-commit form: type(scope): summary
- imperative mood, <= 72 chars, no trailing period
- type ∈ feat fix refactor perf docs test chore

## PR body

- **What** — one line per user-visible or behavioral change.
- **Why** — the problem this solves; link the issue.
- **How verified** — the exact commands/tests you ran.
- **Risk & release safety** — blast radius, flags, checks, and the forward-fix path.

Describe intent, never the diff. If nothing is risky, say so.
Omit any section that would be empty — don't pad.
