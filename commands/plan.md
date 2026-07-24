---
description: Plan multi-step or ambiguous work before implementation.
argument-hint: <goal or change>
---

Produce an evidence-backed implementation plan without editing files.

1. Read the applicable repository instructions and inspect the live implementation.
2. Define the goal, in-scope surfaces, explicit exclusions, and acceptance evidence.
3. Trace affected callers, contracts, generated boundaries, tests, docs, and deployment concerns.
4. Sequence the smallest coherent implementation steps with files or modules, dependencies, and
   verification after each risky step.
5. Separate facts, assumptions, decisions, and unresolved questions.
6. Ask only for decisions that cannot be discovered safely and would materially change the result.
7. End with the full validation gate and the intended handoff.

Wait for confirmation when the user requested plan-first execution. Otherwise return the plan only.
