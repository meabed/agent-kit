---
description: Run a final holistic cleanup pass after the main work is complete.
---

Take a final holistic pass over the just-completed work.

Check the current repository for incomplete work, stale names, dead code, unused dependencies,
duplicated logic, unhandled states, stale docs or diagrams, missing tests, and violated repository
instructions.

Fix issues that are clearly part of the requested change. Do not expand into unrelated refactors or
write to sibling repositories. Report larger opportunities separately with evidence and expected
value.

Run the relevant checks again after cleanup. Do not call the task complete while an in-scope
follow-up remains unresolved.
