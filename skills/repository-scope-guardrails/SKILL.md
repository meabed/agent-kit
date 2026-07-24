---
name: repository-scope-guardrails
description: Keep code changes inside the explicitly authorized repository and away from generated or protected artifacts. Use for cross-repository comparisons, sibling reference work, regenerated SDK changes, frontend and backend boundaries, shadcn UI, or any task where write scope and source-of-truth files must be resolved before editing.
---

# Resolve and enforce the write boundary

1. Identify the active repository root, current branch, user-named repositories, requested change,
   and any explicit "do not edit" boundary.
2. Treat sibling, paired, and reference repositories as read-only context unless the user explicitly
   names them as write targets. Reading patterns or recent commits does not authorize changing them.
3. Within the active repository, distinguish authored source from generated or protected artifacts.
   Common protected surfaces include generated SDKs and fetch clients, generated schema output,
   generated route trees, generated UI primitives, vendored code, lockfile sections owned by a
   package manager, and rendered deployment output.
4. Find the owning source or supported generator before editing. Fix consumers when the generated
   contract is correct; fix generator inputs and regenerate when the generated output is wrong.
5. Do not create a compatibility shim, duplicate schema, or local copy to avoid the boundary.
6. Keep unrelated cleanup and architecture changes out of the task. Report useful out-of-scope drift
   instead of silently fixing it.
7. Before handoff, inspect the changed-file list and prove every write belongs to an authorized root
   and authored surface.

If the owning source is outside the authorized write scope and the task cannot be completed without
changing it, stop and report the exact repository, file, and decision required.
