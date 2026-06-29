---
name: skill-root-cause-investigation
description: 'Find the exact source with file:line, name the systemic cause, and avoid masking symptoms with a patch.'
agent: agent
---

# Agent prompt: Root-cause investigation before edits

You are an AI coding agent working inside a real repository. Use this resource as an operating instruction for the current user request.

## What this is

Find the exact source with file:line, name the systemic cause, and avoid masking symptoms with a patch.

- Resource: Root-cause investigation before edits
- Type: skill
- Site URL: https://mo.ca/ai/skill-root-cause-investigation
- Source artifact: `skills/root-cause-investigation/SKILL.md`
- Topics: skill

## How to use it

1. Read the user's current request and the nearest repo instructions before editing.
2. Apply the resource below as a workflow, command, prompt, skill, or repo rule according to its type.
3. Keep the change scoped to the user's request and the codebase's existing patterns.
4. Name the behavior, risk, or decision the resource is meant to protect.
5. Make the smallest useful edit, then run the focused check and the repo's normal verification gate.
6. Report what changed, what passed, and any risk that remains.

## Resource to apply

A skill for diagnosing bugs, discrepancies, and flaky failures before any logic changes. It insists
on locating the exact source and the systemic cause rather than patching the symptom, so the team can
fix the product behavior instead of creating a quieter repeat incident.

```md title="skills/root-cause-investigation/SKILL.md"
---
name: root-cause-investigation
description: Use when diagnosing a bug, discrepancy, or intermittent/flaky failure before changing any logic. Triggers on 'why is this happening', 'find the root cause', wrong values, flaky tests.
---

Use when diagnosing a bug, discrepancy, or intermittent/flaky failure before changing any logic. Triggers on 'why is this happening', 'find the root cause', wrong values, flaky tests.

Method:

1. Investigate across frontend AND backend repos to locate the exact source/calculation. Quote exact code with file:line.
2. Check for discrepancies and reason about why the code exists or changed (incl. platform diffs like Android vs iOS).
3. For intermittent failures, find the systemic root cause; grep the whole codebase for the same pattern and fix all instances.
4. Never apply lazy fixes (e.g. bumping timeouts) to mask a symptom.
5. Only change logic once the root cause is confirmed; add a regression test.
```

### Confirm before you change

The discipline is in steps 4 and 5: no symptom-masking fixes like bumping a timeout, and no logic
change until the root cause is confirmed. The investigation precedes the edit because customers and
operators feel the behavior, not the local workaround.

### Fix the class, not the instance

For intermittent failures, the systemic cause usually recurs — so the method greps for the same pattern across the codebase and fixes every instance, then locks it in with a regression test.

<Decision title="Investigate before patching">
  A timeout bump or local guard can hide the symptom while leaving the real failure class in place.
  Find the source, then change the code.
</Decision>

### Evidence before edits

The output should include the smallest evidence chain: observed symptom, source line, why the code
behaves that way, customer or workflow impact, and the class of similar failures searched for.

Only then does the fix belong in the tree. That order keeps defensive programming from turning into
defensive guessing.
