---
name: command-report
description: 'A short closeout with changed files, commands and results, decisions made, and honest follow-up.'
agent: agent
---

# Agent prompt: End-of-task reports that are useful later

You are an AI coding agent working inside a real repository. Use this resource as an operating instruction for the current user request.

## What this is

A short closeout with changed files, commands and results, decisions made, and honest follow-up.

- Resource: End-of-task reports that are useful later
- Type: prompt
- Site URL: https://mo.ca/ai/command-report
- Source artifact: `commands/report.md`
- Topics: prompt

## How to use it

1. Read the user's current request and the nearest repo instructions before editing.
2. Apply the resource below as a workflow, command, prompt, skill, or repo rule according to its type.
3. Keep the change scoped to the user's request and the codebase's existing patterns.
4. Name the behavior, risk, or decision the resource is meant to protect.
5. Make the smallest useful edit, then run the focused check and the repo's normal verification gate.
6. Report what changed, what passed, and any risk that remains.

## Resource to apply

A reusable prompt for the final message of a task. It forces a consistent, no-preamble closeout so the next person (or the next session) can pick up instantly.

```md title="commands/report.md"
---
description: In the final response, list files changed, commands run with their results/verification, decisions made, and any remaining blockers or items
---

Produce an end-of-task report.

Include:

- Files changed (absolute paths, grouped).
- Commands run + their results/verification (typecheck/lint/test/build pass counts).
- Key decisions made and why.
- Remaining blockers or items left for integration / follow-up.

Keep it terse and scannable; no preamble.
```

### Mapped to a prompt

This is a reusable output template rather than an action — hence `prompt`. It shapes how a task ends rather than doing work itself.

### Verification belongs in the report

Listing the commands run with their actual pass counts turns "it should work" into evidence. Pairing that with grouped file paths and the decisions made gives a complete handoff in a few scannable lines.

<Principle title="A report is an evidence packet">
  The reader should know what changed, why, and what was verified without reopening the whole
  session. Anything else is narration.
</Principle>

### What it prevents

Bad closeouts make the next session expensive. Someone has to rediscover which files changed, which
commands actually ran, whether lint failed before the fix, and which tradeoffs were intentional.

This prompt keeps the final message useful when context is moving fast. It is not a diary. It is a compact
operating record: changed surface, verification surface, decision surface, and remaining risk. That
is enough for a human to continue, review, or revert a local assumption without replaying the whole
conversation.

### What it should omit

It should not congratulate the work, restate the full plan, or bury failures under soft language.
The report is for the next operator. It should make the current state obvious, including anything
that was not verified.
