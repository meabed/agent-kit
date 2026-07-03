---
description: Run a read-only audit and report concrete findings with file paths and line numbers.
---

Read-only audit/recon. Do NOT modify any files.

Output contract:

- One finding per line: `path:line — observation — proposed fix`.
- Group by category/file; order by severity/impact H → M → L.
- Stay within a tight word budget (default ~350 words).
- End with a short top-N summary of the highest-impact items.

Include exact file paths and line numbers (or URLs). Be concrete; no speculation without evidence.
