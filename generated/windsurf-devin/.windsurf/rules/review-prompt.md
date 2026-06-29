---
globs:
  - '**'
---

# Staff-engineer review with a narrow charter

A terse review prompt for correctness, retry-safety, blast radius, and the smallest useful fix.

This is the prompt I reach for most. It turns a model into the reviewer I wish every PR got — no praise, no style nits, just the three things that matter.

```md title="prompts/review.md"
# Pre-PR review pass

You are a staff engineer reviewing a diff. Be terse.

Flag only: correctness, retry-safety, blast radius.
For each issue: file:line -> one-line fix. No praise, no nits.
End with a single ship / hold verdict and one sentence why.
```

### Constrain what it flags

Left open, a review bot comments on everything and you learn to ignore it. Naming the only three categories it may raise keeps signal high. Anything outside correctness, retry-safety, and blast radius is the human’s call.

### Force a verdict

Ending with a single ship / hold decision makes the output actionable. A review that won’t commit to a recommendation isn’t a review — it’s a vibe with bullet points.

<Decision title="Review bots need a narrow charter">
  Let humans own taste, naming, and product judgment. Ask the model to catch correctness,
  retry-safety, and blast-radius issues where a crisp finding can change the diff.
</Decision>

### What makes it useful

The prompt is intentionally hostile to noise. No praise. No "consider renaming." No broad refactor
ideas unless the diff creates a real risk. A useful finding should point to a file and line, describe
the failure class, and name the smallest fix.

This is especially helpful before opening a PR. The author still has context, the branch is still
cheap to change, and the model can do a focused pass for the classes humans miss when they are too
close to their own diff: retry behavior, partial failures, stale assumptions, missing guards, and
silent data drift.

### What it should ignore

The prompt should ignore taste unless taste creates a production defect. Naming, formatting, and
structure can wait for a human reviewer or a separate refactor pass.

That restraint is what makes the findings worth reading. A short hold verdict with two real bugs is
better than a long review that makes the author defend harmless choices.
