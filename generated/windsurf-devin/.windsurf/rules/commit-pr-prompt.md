---
globs:
  - '**'
---

# Commit and PR text from the real diff

A conventional commit subject and PR body that say what changed, why it matters, and how it was checked.

Most commit messages describe the file, not the change. This prompt reads the actual diff and writes the thing a reviewer wants: a tight subject, the reason behind it, and how to know it works — never a restatement of the code.

```md title="prompts/commit.md"
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
```

### Why over what

A diff already shows what changed; the reviewer's missing context is why. Forcing a one-line problem statement and an issue link turns the message into something useful six months later, when nobody remembers the Tuesday this shipped.

### Make verification a required field

The "how verified" section is the one people skip and the one that catches bugs. Naming the exact commands run — not "tested locally" — tells the reviewer what was and wasn't exercised, and turns the PR into a reproducible record instead of a promise.

<Principle title="PR text should survive the incident">
  Six months later, the useful PR says why the change existed, what risk it carried, and which
  checks proved it. The rest is decoration.
</Principle>

### What it must not invent

The prompt should never claim tests, rollout safety, or issue context that is not in the diff or the
session. If verification is missing, the PR body should say that plainly.

That honesty matters. A clean PR body can help a risky patch look smaller than it is. The wording has
to preserve uncertainty instead of polishing it away.
