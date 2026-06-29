# Agent prompt: Observability that makes failures inspectable

You are an AI coding agent working inside a real repository. Use this resource as an operating instruction for the current user request.

## What this is

Traceable logs, level control, test ids where they help, and no silent failure paths.

- Resource: Observability that makes failures inspectable
- Type: skill
- Site URL: https://mo.ca/ai/skill-observability-and-logging
- Source artifact: `skills/observability-and-logging/SKILL.md`
- Topics: skill

## How to use it

1. Read the user's current request and the nearest repo instructions before editing.
2. Apply the resource below as a workflow, command, prompt, skill, or repo rule according to its type.
3. Keep the change scoped to the user's request and the codebase's existing patterns.
4. Name the behavior, risk, or decision the resource is meant to protect.
5. Make the smallest useful edit, then run the focused check and the repo's normal verification gate.
6. Report what changed, what passed, and any risk that remains.

## Resource to apply

A skill for making behavior observable. It pushes structured, traceable logs, targeted test hooks,
and one non-negotiable rule: nothing fails or skips silently when the team will need that evidence
to protect a product path.

```md title="skills/observability-and-logging/SKILL.md"
---
name: observability-and-logging
description: Use when adding or improving logging, instrumentation, error handling, or observability. Triggers on 'add logging', 'make this debuggable', 'observability', silent-failure fixes.
---

Use when adding or improving logging, instrumentation, error handling, or observability. Triggers on 'add logging', 'make this debuggable', 'observability', silent-failure fixes.

Guidance:

- Detailed, easy-to-trace logs: section headers, structured + prefixed format, log-level control, toggleable verbosity.
- Add test ids on every UI element; build hooks for the paths that need proof; wire external observability (Sentry).
- Never fail or skip silently: make fallbacks, dev-key warnings, and skipped paths explicit. Surface errors instead of hiding them.
- Logs should let behavior be debugged and verified from real runs.
```

### No silent failures

The load-bearing rule is the third bullet: fallbacks, missing-key warnings, and skipped paths must be
visible. A path that quietly no-ops is a bug the team cannot see until production or support feels
it first.

### Logs as evidence

The goal of the structured, level-controlled logging is that behavior can be debugged and verified from real runs — the logs are the proof, not just a convenience.

<Principle title="A silent path is not a safe path">
  Missing config, skipped work, fallback behavior, and retry exhaustion should be visible. Quiet
  failure turns production into guesswork.
</Principle>

### What not to log

Observability is not permission to dump secrets, tokens, raw payloads, or personal data into logs.
The skill should make the path inspectable without making the system unsafe. Good logs identify the
operation, correlation id, state transition, and failure class. They do not expose private material.

For UI work, test ids belong where they make behavior verifiable. They should not replace accessible
labels, but they can make visual and end-to-end checks less brittle.

The useful balance is traceability without exposure: enough evidence for engineers and support to
understand behavior, never enough private material to create a second incident.
