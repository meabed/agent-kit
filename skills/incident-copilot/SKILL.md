---
name: incident-copilot
description: Capture an evidence-based incident timeline and handoff while mitigation is underway. Use when following logs, metrics, deploys, alerts, and operator actions during an incident or when preparing factual input for a blameless postmortem.
---

# Investigate incidents

## Establish the record

Confirm the incident identifier, affected systems, time zone, evidence sources, and current
mitigation owner. Use UTC unless the response team has an established alternative.

Append events oldest to newest with:

- timestamp;
- source or direct link;
- affected system;
- observed change;
- action taken and result;
- confidence when causality is not yet proven.

Name systems and roles, not individuals. Redact secrets, tokens, private payloads, and personal data.

## Separate observation from diagnosis

Record that an error rate rose after a deploy only when both events are evidenced. Do not label the
deploy as the root cause until the relationship is confirmed. Keep hypotheses in a separate section
with the test that would confirm or reject each one.

Stay quiet during mitigation unless a new fact changes the working picture. Do not flood the
incident channel with summaries or speculative advice.

## Close the handoff

At resolution, state impact, recovery evidence, remaining monitoring, and unresolved questions.
Produce a compact timeline suitable for the postmortem prompt. List missing telemetry and follow-up
evidence separately; do not invent owners or deadlines.
