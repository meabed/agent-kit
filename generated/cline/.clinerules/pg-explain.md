---
paths:
  - '**'
---

# Teach agents to read EXPLAIN

Give it the plan, get back the slow node, estimate drift, and the index worth testing.

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
