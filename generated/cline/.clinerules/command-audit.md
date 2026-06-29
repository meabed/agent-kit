---
paths:
  - '**'
---

# Read-only audit with file:line findings

A strict no-write pass that reports one concrete finding per line, sorted by impact.

A command for research, recon, and audit work where the agent must not touch a single file. It enforces a tight output contract so findings stay concrete, actionable, and ranked by impact.

```md title="commands/audit.md"
---
description: For read-only research, recon, and audit tasks: do not modify any files. Report concrete, actionable findings with exact file paths and line
---

Read-only audit/recon. Do NOT modify any files.

Output contract:

- One finding per line: `path:line — observation — proposed fix`.
- Group by category/file; order by severity/impact H → M → L.
- Stay within a tight word budget (default ~350 words).
- End with a short top-N summary of the highest-impact items.

Include exact file paths and line numbers (or URLs). Be concrete; no speculation without evidence.
```

### No writes, no exceptions

The first line is the guardrail. An audit that quietly "fixes" things on the way mixes recon with change and makes the report untrustworthy.

### A contract for the output

Forcing one finding per line with a file:line and a proposed fix, sorted high-to-low impact, turns a wall of prose into a triage list. The word budget keeps it scannable; the top-N summary makes the highest-impact items impossible to miss.

<Principle title="Read-only means read-only">
  Audit mode earns trust by leaving the tree untouched. The output should be specific enough that a
  second pass can implement it without rediscovering the issue.
</Principle>

### When I use it

This is the right command when the question is still "what is wrong?" rather than "please fix this."
Architecture drift, repeated code smells, dead flags, stale docs, security-sensitive surfaces, and
CI oddities all benefit from a clean read-only pass.

The useful output should feel like a queue of implementable issues. If a finding cannot point to a
path, a line, an observable behavior, or a concrete fix, it probably belongs in notes, not in the
audit result.
