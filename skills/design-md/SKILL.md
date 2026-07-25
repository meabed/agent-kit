---
name: design-md
description: Create or update design.md with clear rules for colors, type, spacing, motion, and components. Use when a project needs consistent user-interface guidance, when turning an existing design into written rules, or when checking work against those rules.
---

# Create and update design.md

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
