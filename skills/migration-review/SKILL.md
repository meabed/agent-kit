---
name: migration-review
description: Review database schema migrations and backfills for safe production rollout. Use when a diff touches migrations, schema definitions, indexes, constraints, deploy order, data backfills, or rollback and forward-fix plans.
---

# Review production migrations

Start with a `pass` or `hold` recommendation and the decisive reason.

## Inspect the real environment

Identify the database engine and version, migration framework, table size and traffic assumptions,
transaction behavior, deployment order, and rollback or forward-fix policy. Do not apply
PostgreSQL-specific advice to another engine or assume a table is hot without evidence.

## Check the risk classes

- Compatibility between the old application, migration state, and new application during rollout.
- Locks, table rewrites, long transactions, and blocking validation.
- Index build strategy, uniqueness races, and write amplification.
- Backfill batching, resumability, idempotency, throttling, and observability.
- Constraint and default sequencing for existing rows.
- Generated schemas, SDKs, replicas, queues, and downstream consumers affected by the change.
- Failure recovery and the point after which rollback becomes unsafe.

Prefer expand-migrate-contract sequencing when temporary compatibility is required for a rolling
deploy. Do not preserve legacy fields indefinitely when the migration plan calls for a clean cut.

## Report

For each issue, return `path:line — failure mode — production impact — smallest safe change`. Name
the verification query or rehearsal needed. Do not execute against production or shared data without
explicit authorization.
