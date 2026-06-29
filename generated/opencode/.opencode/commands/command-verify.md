---
description: 'Run typecheck, lint, tests, API flow, and build; keep fixing until the repo agrees.'
---

# Agent prompt: Verification gate before done

You are an AI coding agent working inside a real repository. Use this resource as an operating instruction for the current user request.

## What this is

Run typecheck, lint, tests, API flow, and build; keep fixing until the repo agrees.

- Resource: Verification gate before done
- Type: command
- Site URL: https://mo.ca/ai/command-verify
- Source artifact: `commands/verify.md`
- Topics: command

## How to use it

1. Read the user's current request and the nearest repo instructions before editing.
2. Apply the resource below as a workflow, command, prompt, skill, or repo rule according to its type.
3. Keep the change scoped to the user's request and the codebase's existing patterns.
4. Name the behavior, risk, or decision the resource is meant to protect.
5. Make the smallest useful edit, then run the focused check and the repo's normal verification gate.
6. Report what changed, what passed, and any risk that remains.

## Resource to apply

A command that runs the complete verification gate and refuses to call work done until every check is
green. It reports exact pass counts per gate so "done" means something to the team reviewing the
change and to the product path that will run it.

```md title="commands/verify.md"
---
description: Before considering work done, run typecheck, lint, unit tests, api-flow (e2e), and build; fix all errors and ensure everything passes 100%.
---

Run the full verification gate and report results.

Steps:

1. Run typecheck, lint, unit tests, api-flow (e2e), and build.
2. Fix every error until all gates pass 100%.
3. Report exact pass counts per gate: `typecheck 0 errors | unit X pass | api-flow Y pass | e2e Z pass | build ok`.
4. Only declare done when fully green; if anything fails, fix and re-run, don't stop to ask.
```

### Green or not done

Step 4 is the rule that matters: a partial pass is a failure. If a gate fails, the agent fixes it
and re-runs rather than pausing to ask whether it is good enough for the next engineer or customer.

### Report the counts

A line like `typecheck 0 errors | unit X pass | build ok` is the difference between a claim and a proof. The exact per-gate counts make the verification auditable at a glance.

<Decision title="Green is a state, not a feeling">
  Verification has to name the gates and their results. If a gate cannot run, that is part of the
  report, not a footnote after "done."
</Decision>

### The important failure mode

The dangerous phrase is "tests mostly pass." A repo is either in a verified state or it is not. If a
gate is flaky, missing, or too slow to run, the report should say that plainly and explain what was
checked instead so reviewers do not confuse confidence with coverage.

This command also keeps the agent from stopping at the first green-looking signal. Typecheck can pass
while build fails. Unit tests can pass while generated artifacts drift. The gate should match the
repo, not the agent's patience.
