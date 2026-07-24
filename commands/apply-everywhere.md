---
description: Apply a fix or pattern consistently across the whole codebase.
argument-hint: <pattern or naming change>
---

Apply the requested pattern consistently across the current repository.

1. Define the target precisely with a representative `path:line` example.
2. Search the complete in-scope tree and count every occurrence before editing.
3. Apply one repository-aligned solution to every valid occurrence. For a rename, include routes,
   files, types, variables, tests, forms, docs, diagrams, and comments.
4. Do not create aliases, compatibility layers, or legacy names unless the user explicitly requires
   them.
5. Treat sibling or reference repositories as read-only unless the request explicitly names them as
   write targets.
6. Do not edit generated SDKs, generated clients, generated UI primitives, or other protected
   artifacts. Fix their authored source or consumers and regenerate only through the repository's
   documented workflow.
7. Run the focused checks, then the repository's full gate when the sweep changes shared behavior.
8. Report the number of occurrences changed and every occurrence intentionally skipped with a reason.

Example trigger: "Sweep the naming across the repository, use one consistent term, remove the old
name completely, and check every occurrence."
