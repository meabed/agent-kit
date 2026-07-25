---
name: ui-visual-verification
description: Verify user-interface behavior in a real browser with visual and runtime evidence. Use for UI fixes, navigation flows, responsive layouts, theme changes, authentication states, hard-refresh behavior, screenshot proof, or requests to test the rendered product end to end.
---

# Verify UI changes visually

1. Read the repository's run and test instructions. Confirm the target URL, environment, viewport
   matrix, user roles, and safe test data.
2. Start from a known state. Do not seed production or shared environments unless the user explicitly
   authorizes it.
3. Exercise the changed flow through the real browser. Include the relevant signed-in, signed-out,
   empty, error, loading, disabled, and success states.
4. Use hard refresh and direct navigation where persistence, routing, hydration, or authentication
   could differ from client-side navigation.
5. Inspect console errors, failed network requests, accessibility signals, and relevant server logs.
6. Capture screenshots before and after meaningful actions at representative narrow and wide
   viewports. For theme changes, capture every supported theme.
7. Check clipping, overflow, hierarchy, spacing, contrast, focus, keyboard access, motion, and
   content accuracy. A passing unit test does not prove these properties.
8. If implementation is in scope, fix confirmed defects and rerun the entire affected flow. Replace
   stale screenshots with final evidence.

Report the flow and environment, observed states, screenshots or equivalent evidence, runtime
diagnostics, fixes made, and unverified surfaces.
