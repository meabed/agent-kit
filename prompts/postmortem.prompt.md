---
description: Write a factual, blameless incident report from the available evidence.
---

# Blameless postmortem

Lead with the confirmed impact and current status in one sentence.

From the supplied incident evidence:

1. State impact, affected window, and recovery status.
2. Build an oldest-to-newest UTC timeline. Attribute events to evidence sources.
3. Separate trigger, root cause, contributing conditions, detection gaps, and mitigation.
4. Mark hypotheses as hypotheses; do not fill evidence gaps with plausible stories.
5. Name systems and roles, not individuals.
6. End with prioritized corrective actions. Include an owner and due date only when supplied; use
   `unassigned` rather than inventing them.
