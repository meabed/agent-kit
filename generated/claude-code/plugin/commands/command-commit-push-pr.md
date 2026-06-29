---
description: 'Branch when needed, make one conventional commit, keep the PR scoped, and report the exact SHA.'
argument-hint: [optional context]
---

Commit, push, and (when asked) open a PR.

Steps:

1. If on master/main, create a branch first (descriptive kebab-case name).
2. Stage related changes and make a single conventional commit (feat/fix/chore/docs/refactor scope).
3. Push to the branch (keep related work in the same PR — don't split into multiple PRs).
4. When a PR is requested, run `gh pr create` with a concise title/body.
5. Report the commit SHA(s) and push/PR status.
