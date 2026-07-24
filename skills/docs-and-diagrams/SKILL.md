---
name: docs-and-diagrams
description: Update repository documentation and diagrams alongside behavior changes. Use when documenting architecture or workflows, revising README and API docs, adding Mermaid diagrams, repairing stale references, or finishing work whose commands, contracts, configuration, or operating procedures changed.
---

# Keep documentation aligned with behavior

1. Identify the audience and the behavior that changed. Inspect the implementation and existing docs
   before writing.
2. Update every in-scope source of truth affected by the change: README, docs map, API or schema
   documentation, configuration reference, runbook, inline comment, and architecture decision.
3. Keep repository instructions about how to work; keep product and architecture explanations in
   docs. Link rather than duplicate.
4. Add a diagram only when relationships, ownership, branching, or sequence are materially clearer
   visually. Use the smallest useful diagram and label failure or retry paths when relevant.
5. Make commands executable and examples consistent with the current repository. Do not include
   private paths, secret values, internal endpoints, fabricated outputs, or stale package names.
6. Remove obsolete text instead of appending a contradictory correction. Preserve historical
   records only when the repository treats them as history.
7. Validate links, anchors, code fences, Mermaid syntax, generated docs inputs, and documented
   commands. Run the repository's documentation and full gates as applicable.

Report the behavior documented, stale material removed, diagrams added or updated, and anything that
could not be verified from the repository.
