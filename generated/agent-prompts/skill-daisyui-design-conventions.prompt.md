# Agent prompt: DaisyUI and Tailwind without visual drift

You are an AI coding agent working inside a real repository. Use this resource as an operating instruction for the current user request.

## What this is

Use the real components, match the reference theme, and verify every page in light and dark.

- Resource: DaisyUI and Tailwind without visual drift
- Type: skill
- Site URL: https://mo.ca/ai/skill-daisyui-design-conventions
- Source artifact: `skills/daisyui-design-conventions/SKILL.md`
- Topics: skill

## How to use it

1. Read the user's current request and the nearest repo instructions before editing.
2. Apply the resource below as a workflow, command, prompt, skill, or repo rule according to its type.
3. Keep the change scoped to the user's request and the codebase's existing patterns.
4. Name the behavior, risk, or decision the resource is meant to protect.
5. Make the smallest useful edit, then run the focused check and the repo's normal verification gate.
6. Report what changed, what passed, and any risk that remains.

## Resource to apply

A skill for UI and styling work in a DaisyUI/Tailwind codebase. Its central rule: never hand-mimic components — add the real package and use its classes, and verify everything in both themes.

```md title="skills/daisyui-design-conventions/SKILL.md"
---
name: daisyui-design-conventions
description: Use when building or styling UI in this codebase. Triggers on UI/component/styling work, DaisyUI/Tailwind, theme checks.
---

Use when building or styling UI in this codebase. Triggers on UI/component/styling work, DaisyUI/Tailwind, theme checks.

Guidance:

- Use REAL DaisyUI/Tailwind components: add the actual package and use its class names + iconify icons. Never approximate or hand-mimic components.
- Match the look and theme of the reference project exactly. No custom fonts. Keep existing templates close to the original.
- Verify every page and component in BOTH light and dark themes: contrast, spacing, margins, padding, borders, alignment.
- For high-end visual design, defer to dedicated design skills; polish without over-designing.
```

### Real components, not lookalikes

Hand-mimicked components drift from the design system on the first edit. Adding the actual package and using its class names keeps everything consistent with the framework's updates and the rest of the app.

### Both themes, every time

Light-only verification is how dark-mode contrast bugs ship. Checking spacing, borders, and contrast in both themes for every page catches them before they reach a user.

<Decision title="Use the system, then verify it">
  Real framework components reduce visual drift, but they do not remove the need to inspect the page
  in both themes and at the sizes people actually use.
</Decision>

### What "matching" means

Matching the reference theme means spacing, density, radius, border weight, and state behavior, not
only the right class names. A correct component can still feel wrong if the surrounding rhythm drifts.

The skill is deliberately conservative. Use the framework for speed, then verify the rendered page
with screenshots so the design system stays real instead of theoretical.
