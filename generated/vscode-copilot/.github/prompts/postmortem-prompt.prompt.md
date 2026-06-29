---
name: postmortem-prompt
description: 'Turn the incident channel and system evidence into a timeline that names systems, never people.'
agent: agent
---

# Agent prompt: Postmortems from logs, not memory

You are an AI coding agent working inside a real repository. Use this resource as an operating instruction for the current user request.

## What this is

Turn the incident channel and system evidence into a timeline that names systems, never people.

- Resource: Postmortems from logs, not memory
- Type: prompt
- Site URL: https://mo.ca/ai/postmortem-prompt
- Topics: prompt

## How to use it

1. Read the user's current request and the nearest repo instructions before editing.
2. Apply the resource below as a workflow, command, prompt, skill, or repo rule according to its type.
3. Keep the change scoped to the user's request and the codebase's existing patterns.
4. Name the behavior, risk, or decision the resource is meant to protect.
5. Make the smallest useful edit, then run the focused check and the repo's normal verification gate.
6. Report what changed, what passed, and any risk that remains.

## Resource to apply

The hardest part of a postmortem is starting it while everyone is exhausted. This prompt drafts the timeline from the raw material so the team edits instead of staring at a blank page.

```md title="prompts/postmortem.md"
# Blameless postmortem

From the incident channel, logs, and alerts, draft a timeline.

Rules:

- newest event last, UTC timestamps
- name systems, never people
- separate trigger from root cause from contributing factors
- end with action items, each with an owner and a due date
```

### Systems, not people

The prompt is explicitly told to name services and never individuals. Blameless isn’t a nicety; it’s the only way people tell you what actually happened. The wording enforces the culture.

### Separate the three things

Trigger, root cause, and contributing factors get their own sections. Conflating them is how teams ship a “fix” that addresses the spark and ignores the gas leak.

<Principle title="A postmortem should improve the system">
  The output is not a story about blame. It is a sequence of facts, causes, contributing factors,
  and owned actions that make the next incident less likely or easier to inspect.
</Principle>

### What good output looks like

The draft should be boring enough to edit in a real meeting: timeline, customer impact, detection,
response, trigger, root cause, contributing factors, what worked, what failed, and actions with
owners. If the prompt cannot separate those sections, it will flatten the incident into a story that
feels tidy and teaches very little.

I also want the prompt to preserve uncertainty. "Unknown" is better than a confident invented cause.
The team can close the gap later with logs, deploy history, traces, or a follow-up investigation.

### Where action items come from

Actions should trace back to a contributing factor, detection gap, or response gap. "Be more careful"
does not count. Add a check, a runbook, an alert, a test, an owner, or a decision record.

That keeps the postmortem from becoming a ritual. The artifact should make the next failure less
likely, smaller, or easier to diagnose.
