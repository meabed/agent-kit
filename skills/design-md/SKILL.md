---
name: design-md
description: Create or enforce a concise repository design contract for UI work. Use when authoring design.md, translating an existing visual system into agent-readable constraints, preventing generated UI drift, or reviewing implementation against tokens, typography, spacing, motion, and component boundaries.
---

# Maintain a design contract

## Derive the system

Inspect the implemented product, token files, component library, typography, responsive behavior,
and representative screens. Record the existing system; do not invent colors, fonts, radii, or brand
rules from personal taste.

## Keep the contract short

Define only decisions an implementation agent needs repeatedly:

- canonical tokens and where they live;
- typography roles and permitted variants;
- spacing, radius, border, elevation, and motion rules;
- component sources and generated or protected UI directories;
- responsive, dark-mode, accessibility, loading, empty, error, and focus-state expectations;
- a small list of observed failure patterns the product explicitly rejects.

Reference real tokens and components by path or symbol. Move long rationale and examples to linked
docs. Do not duplicate the same rule across `design.md`, `AGENTS.md`, and component documentation.

## Apply it

Use the real design-system components instead of hand-built lookalikes. Modify authored source, not
generated primitives. When a requested design intentionally departs from the current system, name
the deviation and get the required decision rather than silently rewriting the system.

## Verify

Inspect the rendered result at relevant viewport sizes and in every supported theme. Check contrast,
keyboard focus, overflow, state transitions, density, and visual hierarchy. Update the contract only
when a durable rule would have prevented a confirmed miss.
