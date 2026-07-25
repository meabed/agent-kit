---
name: agents-md
description: Create, audit, or simplify AGENTS.md instruction hierarchies for coding repositories. Use when adding repository guidance, consolidating duplicate agent rules, creating scoped instructions, or aligning Claude, Codex, Copilot, Gemini, and other agents around one source of truth.
---

# Create and update AGENTS.md

## Inspect before writing

Read the nearest existing instruction files, package metadata, scripts, CI workflows, generated-file
markers, and docs map. Record only facts verified in the live repository. Do not infer a preferred
toolchain or copy rules from another project without confirming they apply.

## Assign each instruction to one scope

- Put repository-wide commands, conventions, protected boundaries, and verification in root
  `AGENTS.md`.
- Put a narrower rule in a nested `AGENTS.md` only when it applies to that subtree.
- Keep tool-specific files as pointers to the canonical instructions unless unique tool syntax is
  required.
- Put product behavior, architecture detail, route maps, and long examples in linked documentation.
- Keep personal defaults and private machine details out of shared repository files.

## Write enforceable rules

State what the agent must do, what it must not edit, and how it proves the work. Prefer exact command
names and durable boundaries over taste or implementation details likely to drift. Remove
contradictions, stale paths, duplicated sections, temporary task notes, and rules already enforced
mechanically by the formatter or CI.

Keep always-loaded instructions compact. If the file grows, move task-specific workflows into
skills or docs and link them with clear routing guidance.

## Verify

Check that every command, path, and linked document exists. Confirm nested scopes do not contradict
root rules. Report the canonical file, scoped overrides, pointer files, removed duplication, and any
decision that still needs repository-owner input.
