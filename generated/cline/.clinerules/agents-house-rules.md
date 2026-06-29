---
paths:
  - '**'
---

# House rules agents can actually follow

The recurring repo rules: cleanup, stack, schemas, IDs, and CI, written as constraints an agent can check.

These are the recurring rules I keep repeating to agents, mined out of months of prompt history and condensed into one snippet. They are meant to be reviewed and merged into AGENTS.md so every agent and human reads the identical contract. Generic placeholders stand in for any internal repo or service names.

```md title="AGENTS.snippet.md"
<!-- Mined recurring rules — review and merge into AGENTS.md -->

## Refactoring & Cleanup

- No backward compatibility, no legacy code, no aliases, no compat shims. Make hard cuts.
- Fully remove old code paths, dead code, redundant wrappers, and leftovers — never preserve fallbacks.
- Migrate completely to the new approach; do not leave both old and new in place.

## Align With Reference Repos

- Mirror an existing reference sibling repo/module for structure, naming, auth, SDK generation, config, and shared setup.
- Reference repos: pick your own canonical sibling repos and adjust per project.
- Do not invent new approaches or deviate in generated/common files; only business logic may differ.
- Document any required deviation so I can decide.

## Simplicity & DRY

- Prefer the simplest clean solution; do not overcomplicate, bloat, or add spaghetti.
- No pass-through methods, single-use wrappers, redundant abstractions, or duplicated types.
- Reuse existing models/patterns; make the least code changes needed to achieve the task.

## Documentation Source of Truth

- AGENTS.md is the single canonical source for rules, code style, and code patterns — not product specs.
- CLAUDE.md and .github/copilot-instructions.md only point to AGENTS.md; never duplicate guidance.
- Product specs, api-flow, and testing details live in linked docs/.
- Maintain AGENTS.md across sessions: condense without losing meaning, remove contradictions, prune stale bullets.

## Dead Code & Cruft

- Aggressively remove dead code, unused schema fields, stale references, redundant types, and dead exports.
- Prefer deleting and consolidating over leaving cruft.
- Optimize data fetching to avoid over/under/duplicate fetching of large fields.

## Code Style & Conventions

- File/folder/component names: kebab-case. Never caps or camelCase for filenames.
- Named exports only. Single quotes, 2-space indent, trailing commas.
- Follow the repo's established module/component structure and CRUD/list/upsert patterns; do not deviate.

## Runtime & Tooling Preferences

- Prefer Bun native APIs over node built-ins and custom code: Bun.randomUUIDv7(), Bun.file I/O, bun:test + mock.module(), bunfig.toml, bun install/run, --hot dev.
- Prefer mature first-party / framework-native features over hand-rolled code; find a proper alternative instead of patching.
- Default migration target: bun + hono (away from yarn/jest/vitest/express) across build, docker, and GitHub Actions.

## Autonomy & Communication

- Keep going until fully done: close out all follow-ups, pending items, and cleanups before stopping.
- Don't pause to ask what to do next; proactively find and finish leftover work.
- Communicate tersely — just execute. No filler, no preamble.

## React Query

- Manage cache via invalidation/refetch; mutation hooks own their onSuccess/onError invalidation. No synthetic cache-busters or callback-in-variables.
- Invalidate only the queries the current page needs; use high stale times for big lists; deep-merge fetched detail into the store instead of refetching lists.
- Never create generic hook wrappers/compat shims. Implement per-hook React Query directly, following the reference repo.

## Readability

- Early returns over deep nesting; minimal branching.
- Use optional chaining and nullish coalescing; favor `a ?? b` over `a !== undefined ? a : b`.
- Favor inline expressions/ternaries over let-then-if/else-assign.
- Favor await/catch over try/catch where possible; use defensive data access so it doesn't crash.

## Renames

- A rename is a complete pass: routes, files, types, variables, tests, forms, docs, diagrams, comments.
- Use verb-noun endpoint/function names (count-documents, start, get).
- Leave no leftovers and no aliases.

## TypeScript

- No `any`, `as any`, `as unknown as X` chains, or `@ts-ignore`.
- Fix the type model upstream; use correct native library types (mongoose, graphql); infer from zod.
- Favor `satisfies` over casting.
- Do not invent, re-declare, re-export, or duplicate unnecessary types.

## Dependency Policy

- Always use the latest package versions and GitHub Actions; never downgrade my updated packages.
- Read release notes/changelogs before upgrading to plan migration steps.
- Replace heavy/legacy deps with lighter modern alternatives (e.g. lodash → es-toolkit); remove deprecated tooling.
- Bundle dependabot bumps into a single PR to develop.

## Naming Clarity

- Use clear, descriptive, contextful names; asc/desc not 1/-1; declarative endpoints (/mark-read not /read).
- Avoid confusing concept names; iterate until accurate.
- Keep names consistent across frontend, backend, SDK, and docs; never alias or change agreed terminology.

## Paired Repo & SDK Contract

- The paired repo (widget/backend) and the installed/generated SDK are the source of truth for contracts and schemas.
- When given an updated SDK/API, reflect the changes in code and flag backend issues for me to fix; don't hand-write or duplicate schemas.
- To learn context/patterns, review the last N commits in the specified related repo and reuse its approach.

## Config

- Everything configurable with sensible defaults so services run locally out of the box.
- Support all sources: params, env vars, JSON/TOML/YAML, persistent mounts. Drive config from config.ts.
- Inline config reads (don't assign every get to a variable). Gate behavior behind config/env flags; use profile/preset-based JSON.
- In tests/api-flow, mock config values and restore after.

## Scope Guardrails

- Make only the minimal, scoped changes requested. Don't change unrelated code, destroy architecture, or centralize/abstract things I didn't ask for.
- Never modify generated/protected artifacts (generated fetch client, theme files, token fallback); fix underlying types/references instead.
- Don't invent backend concepts (plans, fields) that don't exist; keep backend intact for frontend-only changes.

## Approved Stack

- Runtime/build: Bun + tsgo. Format/lint: oxfmt + oxlint (oxc). Remove tsc.
- API: Hono + Zod + OpenAPI + Scalar. Data: Mongoose/MongoDB, Redis. Queues: BullMQ/RabbitMQ/NATS.
- Observability: Sentry. HTTP/auth: ky, arctic.

## Schemas & SDK

- Reuse existing Zod/model schemas; never duplicate inline shapes.
- The installed/generated SDK is the source of truth for schemas — I regenerate locally, then you update code to match. Don't hand-write or re-write schemas.
- Document schemas with .describe() + examples so the OpenAPI spec can drive the frontend.

## Architecture Boundaries

- Single responsibility per module/service; don't place logic that belongs elsewhere (e.g. don't decode JWTs where it isn't this API's job — identity/permissions come from the workspace SDK, not local DB).
- Reuse existing modules/models/db; don't duplicate data layers.
- Offload heavy/expensive work off the request path to BullMQ/NATS workers.
- Keep solutions flexible/extensible without over-engineering.

## Infra & CI Conventions

- Expose services with Tailscale funnel, not ngrok; path = package.json/service name.
- Mirror existing repos' CI structure, commit hooks, OpenAPI generation/serving, release process, and naming. Don't invent new ways.
- Auto-install pre-commit hooks (husky-style) doing secret-scanning, lint, and type checks; wire the same checks into CI.
- Design infra workflows/playbooks to be idempotent and fault-tolerant.

## CRUD Modules

- Build CRUD as full separate pages (list, view, upsert) with one unified, scalable pattern. No modal editing, no combined pages.
- Path-based routing: /module/id (view), /module/id/edit (edit). No query-param routing.
- Loading skeletons cover only dynamic content; static titles/descriptions stay visible.
- Never show internal details (request URLs) in user-facing errors.

## Dependency Hygiene

- After removing code/features, prune now-unused dependencies from package.json as part of the same change.
- Treat dead deps as part of the migration's cleanup.

## CLI & Script UX

- Scripts/CLIs must print helpful output on BOTH success and failure, with explicit next-step guidance — never leave the user unsure if it worked.
- Document each command with example run commands at the top of the command file.
- Wire commands into package.json with short, memorable names.
- Write AI tool/prompt text to be directive and corrective, not merely prohibitive.

## IDs

- Use UUID v7 everywhere (Bun.randomUUIDv7()), never MongoDB ObjectId.
- Set `format: uuid` in schemas; map `_id` to `id`.

## Request Context

- Store request lifecycle data (userId, userIP, JWT) in AsyncLocalStorage (async_hooks); read from context rather than threading data through call chains.
- Forward the user JWT and IP headers on server-to-server SDK calls.
```

### Rules, not documentation

Every bullet here is a constraint an agent can check against a diff. They are deliberately phrased as hard cuts and negatives — "no compat shims", "never downgrade", "don't invent backend concepts" — because negative rules are easy to enforce and hard to misread.

### Merge, then prune

This is a mined snippet, not the final file. The intended workflow is to review each section, fold it into AGENTS.md, and over time condense without losing meaning — removing contradictions and stale bullets as the stack moves.

<Principle title="A rule file should change behavior">
  Keep the lines that an agent can check against a diff. Delete the lines that only describe taste,
  because taste does not protect the repo when the task gets messy.
</Principle>
