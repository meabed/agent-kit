---
name: design-md
description: 'This skill should be used when the user asks to apply "design.md for keeping generated UI on-system", mentions "design-md", or needs this workflow: The short token and component contract that stops agent-built UI from drifting into visual noise.'
version: 0.1.0
---

# design.md for keeping generated UI on-system

The short token and component contract that stops agent-built UI from drifting into visual noise.

## Instructions

Hand an agent a UI task with no guardrails and you get gradients, emoji, and a fourth shade of blue. design.md is the short list that keeps generated UI on-system.

```md title="design.md"
# design.md — the house visual system.

tokens: use var(--\*) only. Never a raw hex.
type: Geist for UI, JetBrains Mono for code + wordmark.
radius: 8 buttons, 12 cards, 999 chips.
motion: 180ms, cubic-bezier(.2,0,0,1). Fades only.

## never

- gradients as a section background
- emoji in product UI
- a second accent color
```

### Name the nevers

The most useful half of this file is the “never” block. Gradients, emoji, a second accent — the exact tropes a model reaches for by default. Naming them up front is cheaper than catching them in review.

### Point at tokens

“Use var(--\*) only” turns a thousand color decisions into zero. The agent stops inventing values and starts composing from the system, which is the whole point of having one.

<Decision title="Design rules belong in the repo">
  If the agent has to infer the visual system from screenshots every time, it will drift. A small
  design.md makes the boring choices explicit.
</Decision>

### What belongs in it

The useful version is short and enforceable: tokens, typography, radius, spacing, motion, empty-state
rules, and the list of visual habits the product does not allow. It should name real components, not
abstract taste.

For this site, that means Geist for prose, JetBrains Mono for code and paths, tokenized light/dark
surfaces, quiet cards, title-strip controls on code and Mermaid, and hero animation that stays behind
the text. The file should help an agent make fewer decisions, not give it a larger menu.

### How to review it

When a generated UI drifts, update the rule that would have stopped it. A design guide that never
changes becomes decorative. A design guide that changes after real misses becomes part of the
engineering loop.

## Verification

Run the focused check for the files changed, then the repository normal verification gate. Report what changed, what passed, and any remaining risk.
