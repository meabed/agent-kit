# Agent prompt: Teach agents to read EXPLAIN

You are an AI coding agent working inside a real repository. Use this resource as an operating instruction for the current user request.

## What this is

Give it the plan, get back the slow node, estimate drift, and the index worth testing.

- Resource: Teach agents to read EXPLAIN
- Type: skill
- Site URL: https://mo.ca/ai/pg-explain
- Topics: skill

## How to use it

1. Read the user's current request and the nearest repo instructions before editing.
2. Apply the resource below as a workflow, command, prompt, skill, or repo rule according to its type.
3. Keep the change scoped to the user's request and the codebase's existing patterns.
4. Name the behavior, risk, or decision the resource is meant to protect.
5. Make the smallest useful edit, then run the focused check and the repo's normal verification gate.
6. Report what changed, what passed, and any risk that remains.

## Resource to apply

Reading EXPLAIN (ANALYZE, BUFFERS) is a skill juniors take years to build. This packages the pattern: find the expensive node, check estimate-vs-actual drift, propose one concrete fix.

```md title="skills/pg-explain/SKILL.md"
# skill: pg-explain

description: Read EXPLAIN (ANALYZE, BUFFERS) and name the problem.

## input

The query + EXPLAIN (ANALYZE, BUFFERS) output.

## report

- the slowest node and why (seq scan? bad estimate? spill?)
- rows estimated vs actual — flag any >10x drift
- one index or rewrite that fixes it, with the DDL
```

### Estimate drift is the tell

Nine times in ten a slow query is the planner believing a wrong row estimate. The skill flags any node where estimated and actual rows differ by more than 10x, because that’s where a stale statistic or a missing index is hiding.

### One fix, with the DDL

It doesn’t hand back a lecture. It hands back the CREATE INDEX or the rewrite, ready to paste. If it can’t name a single fix, it says so instead of guessing.

<Tradeoff title="One fix beats a database lecture">
  Query review is useful when it names the slow node and the smallest change that improves it. Broad
  tuning advice usually hides the fact that nobody read the plan.
</Tradeoff>

### What the agent must not skip

The plan has to be read as a tree, not as a wall of text. Look for the node that actually consumed
time, then check whether the planner expected that many rows. A sequential scan is not automatically
bad. An index is not automatically good. The question is whether the access path matches the data
shape and the filter.

The output should also name how to verify the change: rerun `EXPLAIN (ANALYZE, BUFFERS)`, compare
actual rows and buffer reads, and confirm the new index does not only help one query while hurting
write-heavy paths. That is the difference between tuning and cargo-cult indexing.
