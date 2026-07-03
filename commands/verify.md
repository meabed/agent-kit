---
description: Run the full verification gate and fix failures before calling the work done.
---

Run the full verification gate and report results.

Steps:

1. Run typecheck, lint, unit tests, api-flow (e2e), and build.
2. Fix every error until all gates pass 100%.
3. Report exact pass counts per gate: `typecheck 0 errors | unit X pass | api-flow Y pass | e2e Z pass | build ok`.
4. Only declare done when fully green; if anything fails, fix and re-run, don't stop to ask.
