# Authoring

Write the actual resource file you want an agent to consume.

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

Write direct instructions to the agent. Keep one command focused on one manually invoked task.

## Skills

Place skills in `skills/<name>/SKILL.md`.

```md
---
name: remove-trivial-tests
description: Audit tests that cannot catch meaningful regressions. Use when removing shallow tests.
---

# Remove trivial tests

Classify tests by behavior protected. Keep, rewrite, delete, or flag each one.
```

Use only `name` and `description` in portable skill frontmatter. The name must match the directory.
Put trigger language in the description because agents see it before loading the body.

Optional supporting files belong beside `SKILL.md` under `scripts/`, `references/`, `assets/`, or
product-specific `agents/` metadata. The installer copies the complete skill directory. Keep
`SKILL.md` under 500 lines and link directly to supporting material only when the task needs it.

## Prompts

Place reusable prompt files in `prompts/<name>.prompt.md`. Include a `description` in frontmatter and
write the reusable task directly.

## Agents

Place specialist definitions in `agents/<name>.md`. Include `name` matching the filename and a
trigger-rich `description`. Keep the body narrow enough to translate safely to each target's agent
or skill format.

## Review Checklist

- Can an agent act on the file without guessing?
- Does it say what to inspect, change, and verify?
- Does it name the failure mode or decision it protects?
- Is it written as instructions rather than an article about agents?
- Is the skill body concise, with detail moved to supporting files only when needed?
- Is it free of filler, duplicate embedded resources, vague style advice, and origin notes?
- Is it free of personal paths, contact details, secrets, private systems, and user-specific rule
  dumps?
- Does every resource ID remain unique across commands, prompts, skills, and agents?
