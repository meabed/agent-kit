---
name: daisyui-design-conventions
description: Build or review interfaces in repositories that already use DaisyUI and Tailwind CSS. Use for DaisyUI components, theme tokens, light and dark modes, Tailwind styling, visual parity, or replacing hand-built lookalikes with the repository's real component system.
---

# Keep DaisyUI interfaces on-system

1. Confirm the repository actually uses DaisyUI and identify its installed version, Tailwind
   version, theme configuration, component conventions, and icon source.
2. Reuse existing components, utilities, theme tokens, and layout patterns. Do not add DaisyUI to a
   repository that chose another design system unless the user explicitly requests that migration.
3. Use real DaisyUI component classes and supported variants instead of hand-mimicking a component.
   Keep custom CSS for product-specific behavior the framework does not provide.
4. Preserve the existing visual language: density, type scale, radius, border weight, state
   behavior, and responsive breakpoints. Do not introduce fonts, colors, gradients, or animation
   merely to make the page look different.
5. Modify authored components and configuration, not generated or protected UI primitives.
6. Implement complete states: loading, empty, error, success, disabled, focus, hover, and validation.
7. Verify representative pages at narrow and wide viewports in every supported theme. Check
   contrast, overflow, keyboard navigation, focus visibility, spacing, and alignment.
8. Capture visual evidence when the task requests parity or a user-visible fix, and rerun the flow
   after correcting any issue.
