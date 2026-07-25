---
description: Write a conventional commit message and pull request description from the actual work.
---

# Commit + PR description

Lead with the change's outcome. From the staged diff, produce:

## commit subject

- Use `type(scope): summary` in imperative mood.
- Keep it at 72 characters or fewer with no trailing period.
- Choose from `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, or `chore`.

## PR body

- **Outcome** — one sentence stating what is now true.
- **Why** — the problem or requirement this addresses.
- **Changes** — two to four non-overlapping points, each with relevant evidence.
- **Verification** — exact commands and live checks actually run.
- **Risk** — blast radius, release controls, remaining uncertainty, and forward-fix path.

Describe intent and behavior, not a file-by-file diff. Do not invent issue links, test results, or
release evidence. Omit empty sections.
