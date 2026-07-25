---
name: pg-explain
description: Read PostgreSQL EXPLAIN or EXPLAIN ANALYZE output and suggest query or index changes supported by the plan. Use for slow SQL, wrong row estimates, heavy disk or memory use, poor joins, or checking whether a change improved the real query plan.
---

# Analyze a PostgreSQL execution plan

Require the query, plan, PostgreSQL version, relevant schema and indexes, parameter values or data
shape, and whether `ANALYZE` was safely run. Treat plans without runtime data as estimates.

1. Read the plan as a tree. Identify the node that dominates actual time, loops, rows, or buffers;
   the visually largest cost is not always the bottleneck.
2. Compare estimated and actual rows at each important node. Flag material drift and explain whether
   stale statistics, correlation, skew, predicates, or parameterization could cause it.
3. Check access paths, join algorithms, sort or hash spills, repeated loops, heap fetches, filters,
   buffer reads, and parallelism.
4. Distinguish symptoms from causes. A sequential scan can be correct, and an index can be harmful
   on small or write-heavy tables.
5. Recommend the smallest testable change: statistics, query shape, one index, data model, or
   configuration. Include DDL only when schema and workload evidence support it.
6. State write, storage, lock, and maintenance costs of the recommendation.
7. Verify by rerunning the same representative plan and comparing runtime, rows, loops, buffers, and
   result correctness. Do not run `EXPLAIN ANALYZE` on destructive SQL or production workloads
   without explicit approval.

Return the bottleneck, evidence, proposed change, tradeoff, and verification plan.
