# Commit, push, and open the PR cleanly

Branch when needed, make one conventional commit, keep the PR scoped, and report the exact SHA.

A command for saving progress safely: branch if on main, make one clean conventional commit, push, and open a PR only when asked — without splitting related work across multiple PRs.

```md title="commands/commit-push-pr.md"
---
description: Commit and push when work is done (often, to save progress), to the same PR or directly to master/main. If on main, branch first, make a single commit
---

Commit, push, and (when asked) open a PR.

Steps:

1. If on master/main, create a branch first (descriptive kebab-case name).
2. Stage related changes and make a single conventional commit (feat/fix/chore/docs/refactor scope).
3. Push to the branch (keep related work in the same PR — don't split into multiple PRs).
4. When a PR is requested, run `gh pr create` with a concise title/body.
5. Report the commit SHA(s) and push/PR status.
```

### Never commit straight to main

Step 1 is the safety rail: if the agent finds itself on main, it branches first. The kebab-case name keeps the branch readable in the PR list.

### One PR for related work

Splitting a single concern across several PRs makes review harder, not easier. Keeping related changes in one branch and one PR is the default; the commit stays conventional so the history reads cleanly.

<Tradeoff title="A clean commit costs one final read">
  The agent has to inspect the staged diff before committing. That extra minute is cheaper than a PR
  title that misstates the work.
</Tradeoff>

### What it refuses

It should not bundle unrelated cleanup just because the files are nearby. It should not create a PR
body from memory. It should not push without telling you the branch, SHA, and PR URL.

The useful version turns local work into a reviewable artifact. The branch name, conventional commit,
and PR body all point at the same concern, so reviewers can trust the shape before they read the diff.
