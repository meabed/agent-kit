# Authoring

Write the actual resource file you want an agent to consume.

## Commands

Place slash commands in `commands/<name>.md`.

```md
---
description: Run a read-only audit and report concrete findings.
---

Do NOT modify files.
Report findings as `path:line - issue - proposed fix`.
```

## Skills

Place skills in `skills/<name>/SKILL.md`.

```md
---
name: remove-trivial-tests
description: This skill should be used when the user asks to remove shallow tests.
version: 0.1.0
---

# Remove trivial tests

Classify tests by behavior protected. Keep, rewrite, delete, or flag each one.
```

## Prompts

Place reusable prompt files in `prompts/<name>.prompt.md`.

## Agents

Place subagent definitions in `agents/<name>.md`.

## Review Checklist

- Can an agent act on the file without guessing?
- Does it say what to inspect, change, and verify?
- Does it name the failure mode or decision it protects?
- Is it free of filler, vague style advice, and origin notes?
