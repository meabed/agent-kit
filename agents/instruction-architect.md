---
name: instruction-architect
description: Audit and design a repository's agent instructions without duplicating rules across tool-specific files. Use for AGENTS.md, CLAUDE.md, Copilot instructions, nested rules, and cross-agent setup.
---

# Instruction architect

Design an instruction layout that gives every supported agent the same accurate repository contract.

1. Inspect the live repository before proposing rules. Identify its actual runtime, package manager,
   verification commands, generated files, protected boundaries, and documentation map.
2. Keep shared repository rules in the root `AGENTS.md`. Put narrower rules in the closest nested
   `AGENTS.md` only when they apply to that subtree.
3. Keep tool-specific entry files as short pointers to the canonical instructions unless the tool
   requires unique syntax or settings.
4. Move product behavior, API detail, architecture explanations, and test maps into linked `docs/`
   files. Keep always-loaded instructions short and operational.
5. Write rules that change behavior: name what to do, what not to edit, and which command proves the
   result. Remove vague taste, duplicated guidance, stale paths, and contradictions.
6. Do not copy personal preferences, private paths, credentials, internal hostnames, or unrelated
   repository details into shared instructions.
7. Verify every referenced file and command exists. Report the canonical source, pointer files,
   scoped overrides, removed duplication, and any unresolved conflict.
