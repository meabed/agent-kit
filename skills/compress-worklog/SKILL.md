---
name: compress-worklog
description: Compress verbose work logs or session notes into a dense, resumable engineering record without losing decisions, commands, evidence, chronology, or unresolved work. Use for developer journals, handoffs, context compaction, and requests for maximum non-destructive compression.
---

# Compress a work log without losing signal

Preserve every fact needed to reconstruct the work:

- timestamps and chronological order;
- repository, branch, commit, issue, and file references;
- commands and meaningful results;
- observed failures and their causes;
- decisions, alternatives, and reasons;
- changes made and verification evidence;
- blockers, risks, and the exact resume point.

Remove greetings, repetition, conversational filler, speculative narration, and redundant prose.
Combine adjacent entries about the same subject. Use compact engineering language, but do not invent
abbreviations that make the record ambiguous.

Redact secret values, credentials, private contact details, and unnecessary personal identifiers.
Preserve the fact that a credential or private dependency existed and how it affected the work.

Keep the input's timestamp or branch heading convention when one exists. Otherwise use:

```md
## YYYY-MM-DD HH:MM UTC | branch-or-context
```

Within each block, order content as outcome, changes, evidence, decisions, and next step. Do not add
a preamble, commentary about the compression, or facts not present in the source.

Before returning, verify that a new engineer could resume the work without opening the original log.
