# Authoring Catalog Recipes

Each resource lives at `catalog/<id>/recipe.md`.

```md
---
id: remove-trivial-tests
title: Remove trivial tests before they harden
summary: Replace shallow coverage with tests that can catch real regressions.
type: skill
topics: [testing, defensive-programming]
date: 2026-06-18
sourceArtifact: skills/remove-trivial-tests/SKILL.md
siteUrl: https://mo.ca/ai/remove-trivial-tests
sourcePath: src/content/ai/remove-trivial-tests.mdx
---

Resource body goes here.
```

## Rules

- `id` must be lowercase kebab-case.
- `title` and `summary` must explain the operational value in plain language.
- `type` should be one of `skill`, `command`, `prompt`, `workflow`, `agent`, `config`, `loop`, or
  `resource`.
- Body text should include concrete workflow steps, verification expectations, and real examples.
- If the article embeds a source artifact in a fenced code block, keep that block. Renderers can use
  it when producing a skill or command.

## Review Checklist

- Can an agent act on this without guessing the goal?
- Does it say what files or risks to inspect?
- Does it name the verification gate?
- Does it avoid generic advice like "write clean code"?
- Does it preserve the site link instead of moving the article out of `meabed/site`?
