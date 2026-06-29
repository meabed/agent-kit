# Agent prompt: UI verification with real browser evidence

You are an AI coding agent working inside a real repository. Use this resource as an operating instruction for the current user request.

## What this is

Run user and guest flows, include hard refreshes, and keep screenshots as proof of what changed.

- Resource: UI verification with real browser evidence
- Type: skill
- Site URL: https://mo.ca/ai/skill-ui-visual-verification
- Source artifact: `skills/ui-visual-verification/SKILL.md`
- Topics: skill

## How to use it

1. Read the user's current request and the nearest repo instructions before editing.
2. Apply the resource below as a workflow, command, prompt, skill, or repo rule according to its type.
3. Keep the change scoped to the user's request and the codebase's existing patterns.
4. Name the behavior, risk, or decision the resource is meant to protect.
5. Make the smallest useful edit, then run the focused check and the repo's normal verification gate.
6. Report what changed, what passed, and any risk that remains.

## Resource to apply

A skill for verifying UI behavior end-to-end with visual proof. It drives the real app, runs both user and guest flows, and captures a screenshot at every step.

```md title="skills/ui-visual-verification/SKILL.md"
---
name: ui-visual-verification
description: Use when verifying UI behavior, navigation, or a fix end-to-end with visual proof. Triggers on 'verify the UI', 'test the flow', 'show me screenshots', hard-refresh checks.
---

Use when verifying UI behavior, navigation, or a fix end-to-end with visual proof. Triggers on 'verify the UI', 'test the flow', 'show me screenshots', hard-refresh checks.

Steps:

1. Drive the app with Playwright or Chrome DevTools MCP.
2. Run the full user AND guest flows, including hard refresh.
3. Capture a screenshot at every step as visual evidence.
4. Run seeders locally (and in prod when asked) to populate state.
5. Fix any bugs found, then re-run and re-screenshot before declaring done.
```

### Proof, not assertion

The screenshot at every step is the point: visual evidence that the flow actually works, instead of a claim that it should. Both the signed-in and guest paths get exercised.

### Hard refresh and re-run

Including a hard refresh catches hydration and state-restoration bugs that a soft navigation hides. And any fix loops back through the flow — re-run and re-screenshot — before the work is called done.

<Principle title="Screenshots are evidence, not decoration">
  UI work should leave behind proof that the real browser rendered the real state. A passing unit
  test cannot show clipped text, bad contrast, or a broken mobile layout.
</Principle>

### What to capture

Capture the state before and after the action, not only the final happy screen. Menus, hover-only
controls, empty states, and expanded panels are where UI bugs hide.

For theme work, capture light and dark. For layout work, capture at least one narrow viewport. The
point is to inspect the surface the user actually sees.
