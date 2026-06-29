---
paths:
  - '**'
---

# PHP to Python with golden-file parity

Move behavior across languages with fixture proof, uv tooling, and boring first-party libraries where they fit.

A skill for migrating PHP scripts to Python and writing new Python. It leaves zero PHP behind and proves equivalence with golden-file comparison against the old output.

```md title="skills/php-to-python-migration/SKILL.md"
---
name: php-to-python-migration
description: Use when migrating PHP scripts to Python or writing new Python in this codebase. Triggers on 'migrate this PHP to Python', 'no PHP', Python tooling questions.
---

Use when migrating PHP scripts to Python or writing new Python in this codebase. Triggers on 'migrate this PHP to Python', 'no PHP', Python tooling questions.

Steps & rules:

1. Migrate all PHP to Python; leave zero PHP in the codebase.
2. Verify identical generated output via TDD (golden-file compare old PHP output vs new Python output).
3. Use uv for ALL Python tooling, locally and on servers; use the latest Python version.
4. Prefer mature first-party/native Python libs (pydantic-ai, langgraph) over custom code.
5. Format generated Python/config files in readable multi-line object style (not single-line dicts).
```

### Golden-file parity

Step 2 makes the migration provable: capture the old PHP output, then assert the new Python produces byte-identical results. The migration is correct when the golden files match, not when it looks right.

### One toolchain, no PHP left

Standardizing on uv everywhere and leaving zero PHP behind avoids the half-migrated state where two runtimes coexist. Mature first-party libraries do the heavy lifting instead of hand-rolled code.

<Principle title="A migration needs a hard edge">
  The old runtime should disappear from the touched surface once parity is proven. Keeping both
  paths alive usually creates drift, not safety.
</Principle>

### What to compare

Golden files should capture the artifact users or downstream systems depend on: rendered config,
generated manifests, reports, API payloads, or CLI output. Comparing internal helper calls is weaker.

Once the output matches, the new Python path should own the job completely. That is how the migration
stays a migration instead of becoming two implementations of the same promise.
