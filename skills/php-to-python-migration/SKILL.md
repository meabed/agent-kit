---
name: php-to-python-migration
description: Migrate PHP scripts or jobs to Python with behavior and artifact parity. Use for removing PHP from an in-scope workflow, reproducing generated output with golden fixtures, adopting uv-based Python tooling, or completing a hard cutover without maintaining two implementations.
---

# Migrate PHP behavior to Python

1. Read repository instructions and inventory every in-scope PHP entry point, dependency, invocation,
   deployment hook, generated artifact, test, and document.
2. Capture representative inputs, outputs, side effects, errors, ordering, encoding, time zones, and
   exit codes from the current implementation.
3. Create golden or contract fixtures at the observable boundary. Prove the comparison catches a
   deliberate mismatch before trusting it.
4. Use the repository's Python policy. When none exists, prefer current Python with `uv` for
   environments, dependencies, scripts, and lock management.
5. Choose mature standard-library or first-party ecosystem components where they reduce custom
   code. Do not introduce a framework unrelated to the job.
6. Implement the Python path directly. Preserve required behavior, document intentional changes,
   and avoid a long-lived dual-runtime adapter.
7. Switch callers, schedules, containers, CI, docs, and operations to Python. Remove obsolete PHP
   code and dependencies from the agreed surface.
8. Compare artifacts and runtime behavior on the same fixtures, then run the full repository gate
   and a safe end-to-end job invocation.

Report parity evidence, intentional differences, PHP removed, tooling added, and any environment not
tested.
