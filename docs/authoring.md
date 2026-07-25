# Write Instructions

Write the instruction file you want an agent to use.

## Commands

Place slash commands in `commands/<name>.md`.

```md
---
description: Run a read-only audit and report concrete findings.
argument-hint: <scope>
---

Do NOT modify files.
Report findings as `path:line - issue - proposed fix`.
```

Write direct instructions to the agent. Keep each command focused on one task the user starts.

## Skills

Place skills in `skills/<name>/SKILL.md`.

```md
---
name: remove-trivial-tests
description: Find tests that cannot catch real bugs. Use when removing or rewriting weak tests.
---

# Remove trivial tests

Classify tests by behavior protected. Keep, rewrite, delete, or flag each one.
```

Use only `name` and `description` at the top of `SKILL.md`. The name must match the directory.
Say when the skill should be used in its description because agents read that line first.

Optional supporting files belong beside `SKILL.md` under `scripts/`, `references/`, `assets/`, or
product-specific `agents/` metadata. The installer copies the complete skill directory. Keep
`SKILL.md` under 500 lines and link directly to supporting material only when the task needs it.

## Prompts

Place reusable prompt files in `prompts/<name>.prompt.md`. Add a clear `description` at the top and
write the task directly.

## Agents

Place focused agent definitions in `agents/<name>.md`. The `name` must match the filename. Write a
clear description of when to use the agent, and keep its job narrow.

## Review Checklist

- Can an agent act on the file without guessing?
- Does it say what to inspect, change, and verify?
- Does it name the failure mode or decision it protects?
- Is it written as instructions rather than an article about agents?
- Is the skill body concise, with detail moved to supporting files only when needed?
- Is it free of filler, copied instructions, vague advice, and notes about where it came from?
- Is it safe to publish, with no private paths, contact details, secrets, internal systems, or
  copied private conversations?
- Does every name remain unique across commands, prompts, skills, and agents?
