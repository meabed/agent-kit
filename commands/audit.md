---
description: Inspect a repository without changing it and report clear findings with file locations.
argument-hint: <scope or question>
---

Run a read-only audit. Do not modify files, external systems, issues, pull requests, or messages.

Output contract:

- One finding per line: `path:line — observation — proposed fix`.
- Group by category or file and order findings by impact: high, medium, low.
- Separate confirmed evidence from inference.
- Omit praise and low-value style commentary.
- End with the highest-impact findings and the remaining uncertainty.

Use repository-relative paths. Cite external sources with direct links when external research is part
of the request.
