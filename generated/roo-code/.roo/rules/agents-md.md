# AGENTS.md as the house-style file

One place for toolchain, code style, and repo invariants, with every other agent note pointing back to it.

CLAUDE.md is project memory; AGENTS.md is the contract. It's the one file that holds the toolchain, the commands, and the code style every agent and human must follow — so the rules live in exactly one place and never drift between tools.

```md title="AGENTS.md"
# AGENTS.md — the single source of truth for project rules.

CLAUDE.md and editor configs only point here. Keep this current;
put feature detail in docs/ and link it, never inline it.

## Commands

- install: `bun install` (CI uses --frozen-lockfile)
- check: `bun run typecheck && bun run lint && bun run format:check`
- run a job: `bun <file>.ts`

## Toolchain

bun (runtime + pm) · tsgo (typecheck) · oxlint · oxfmt.
Do NOT reintroduce npm/yarn, ts-node, eslint, or prettier —
they were removed on purpose.

## Code style

- Formatting is enforced by the formatter. Never hand-format — run format.
- Strict TypeScript. No `any`. Fix the type, don't cast it.
- Prefer runtime-native APIs over a dependency for the same job.

## Patterns

- One concern per file; add a job = file + script + workflow.
- Bounded concurrency for network fan-out, never unbounded Promise.all.
- A feature that needs a secret no-ops with a log line when it's absent.
```

### One file, everything else points to it

The rule that pays off most is the first line: CLAUDE.md, editor configs, and contributor docs only _reference_ AGENTS.md. The moment a rule is written twice it starts contradicting itself. Keeping conventions in one place means an agent and a teammate read the identical source.

### Name what was deliberately removed

"Do not reintroduce npm/yarn/eslint" stops the most common regression cold. An agent reaching for a familiar tool will happily re-add the thing you spent a day deleting. Recording the _intentional absences_, not just the current stack, is what makes a toolchain decision stick.

<Decision title="Make AGENTS.md canonical">
  Put repo rules in one file and make every other agent-facing note point to it. Duplication is how
  house style turns into folklore.
</Decision>
