---
name: root-cause-investigation
description: Find why a bug or failure happens before changing code. Use when values are wrong, behavior changed, failures come and go, a problem needs to be reproduced, or a visible symptom may come from a deeper issue.
---

# Investigate root causes

1. Restate the observed behavior, expected behavior, affected environment, frequency, and available
   evidence. Separate confirmed facts from assumptions.
2. Reproduce the failure through the narrowest real interface available. Preserve logs, inputs,
   outputs, timestamps, and version or commit context.
3. Trace the execution and data path end to end inside the current repository. Cite exact
   `path:line` evidence and inspect recent history when it can explain intent.
4. Read sibling or reference repositories only when they are relevant; do not modify them unless the
   request explicitly includes them.
5. Form competing hypotheses and run the cheapest discriminating check for each. Avoid changing
   timeouts, adding retries, swallowing errors, or broadening guards merely to make the symptom quiet.
6. Search the in-scope repository for the same failure pattern after confirming the mechanism.
7. State the root cause as a falsifiable chain: condition, mechanism, observed effect, and evidence.
8. If the user requested a fix, implement the smallest systemic correction and add a regression test
   that fails before it. Otherwise stop after diagnosis.
9. Reproduce the original path after the fix and run the required repository gate.

Return the root cause first, then evidence, ruled-out hypotheses, affected instances, and remaining
uncertainty.
