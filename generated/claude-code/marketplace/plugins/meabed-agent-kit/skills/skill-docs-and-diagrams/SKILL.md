---
name: skill-docs-and-diagrams
description: 'This skill should be used when the user asks to apply "Docs and diagrams before the work is done", mentions "skill-docs-and-diagrams", or needs this workflow: Update the README, comments, Mermaid flows, and AGENTS.md decisions while the context is still fresh.'
version: 0.1.0
---

# Docs and diagrams before the work is done

Update the README, comments, Mermaid flows, and AGENTS.md decisions while the context is still fresh.

## Instructions

A skill that treats documentation as part of finishing a change, not an afterthought. It keeps docs, OpenAPI, configs, and comments from going stale and captures flows as Mermaid diagrams.

```md title="skills/docs-and-diagrams/SKILL.md"
---
name: docs-and-diagrams
description: Use when finishing a change that affects docs, or when asked to document/diagram architecture or workflows. Triggers on 'update the docs', 'add a diagram', 'document this'.
---

Use when finishing a change that affects docs, or when asked to document/diagram architecture or workflows. Triggers on 'update the docs', 'add a diagram', 'document this'.

Guidance:

- As part of finishing work, update all docs, READMEs, OpenAPI, configs, inline comments, and architecture notes so nothing is stale.
- Add Mermaid diagrams/flowcharts for data fetching, invalidations, and dependencies.
- Put a one-command install/start at the top of the README.
- Keep helpful inline comments; remove only excess/redundant ones.
- Persist agreed conventions/decisions into AGENTS.md / memory so they apply in future sessions and other repos.
```

### Docs ship with the code

The framing is that a change isn't done until the docs match it. Updating READMEs, OpenAPI, and comments in the same pass is what stops the slow drift into stale documentation.

### Persist the decisions

The last bullet is the multiplier: writing agreed conventions into AGENTS.md means they carry into future sessions and other repos, instead of being re-litigated every time.

<Principle title="Docs are part of the diff">
  If a change alters a workflow, API, or operating rule, the docs and diagrams should move in the
  same branch while the context is still fresh.
</Principle>

### What a good diagram does

A diagram should expose a boundary, a retry path, a dependency, or a decision point. It should not
decorate a README with boxes that repeat the paragraph above it.

For this site, that rule matters too. Mermaid belongs where the reader needs to see flow, ownership,
or failure mode. Otherwise the stronger move is a sharper paragraph.

## Verification

Before calling the task done, run the focused check for the files you changed and the repository's normal verification gate. Report what changed, what passed, and any risk that remains.
