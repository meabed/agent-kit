---
name: skill-docs-and-diagrams
description: 'Update the README, comments, Mermaid flows, and AGENTS.md decisions while the context is still fresh.'
agent: agent
---

# Agent prompt: Docs and diagrams before the work is done

You are an AI coding agent working inside a real repository. Use this resource as an operating instruction for the current user request.

## What this is

Update the README, comments, Mermaid flows, and AGENTS.md decisions while the context is still fresh.

- Resource: Docs and diagrams before the work is done
- Type: skill
- Site URL: https://mo.ca/ai/skill-docs-and-diagrams
- Source artifact: `skills/docs-and-diagrams/SKILL.md`
- Topics: skill

## How to use it

1. Read the user's current request and the nearest repo instructions before editing.
2. Apply the resource below as a workflow, command, prompt, skill, or repo rule according to its type.
3. Keep the change scoped to the user's request and the codebase's existing patterns.
4. Name the behavior, risk, or decision the resource is meant to protect.
5. Make the smallest useful edit, then run the focused check and the repo's normal verification gate.
6. Report what changed, what passed, and any risk that remains.

## Resource to apply

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
