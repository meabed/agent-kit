---
description: Run every required check, fix related failures, and prove the change works.
argument-hint: <optional changed surface>
---

Prove the requested change works in the real repository and, when applicable, the running product.

1. Read the repository instructions and discover the actual focused and full-gate commands. Do not
   assume a framework or invent missing scripts.
2. Run the narrowest relevant test first. Fix in-scope failures and rerun until it passes.
3. Run the repository's complete required gate, normally including tests, typecheck, lint, format
   check, and build when those commands exist.
4. For a running UI, API, worker, CLI, or integration, also exercise the changed path through its
   real interface. Inspect relevant logs, browser diagnostics, responses, or persisted state.
   Automated tests alone are not sufficient when live behavior is in scope.
5. Do not mutate production, seed shared environments, or expose secrets unless the user explicitly
   authorized that action.
6. Distinguish failures caused by this change from pre-existing failures, but do not hide either.
7. Report exact commands, pass counts or exit status, live-check evidence, and any unverified risk.

Do not declare the work verified if a required gate or applicable live check did not run.
