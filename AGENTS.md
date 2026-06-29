# AGENTS.md - agent-kit

Canonical repo rules for this package. Keep long product notes and adapter detail in `docs/`; link
them here instead of duplicating them.

## Stack

Bun is the runtime, package manager, script runner, and test runner. Typecheck with `tsgo`
(`@typescript/native-preview`). Use `oxlint` and `oxfmt`. Do not add `typescript`, `tsc`,
`ts-node`, `tsx`, ESLint, Prettier, npm, pnpm, or Yarn.

## Commands

- `bun install`
- `bun run sync:site` - import/update catalog entries from `../site/src/content/ai`
- `bun run generate` - rebuild and format `generated/` and `registry.json`
- `bun run validate`
- `bun run test`
- `bun run typecheck`
- `bun run lint`
- `bun run fmt`
- `bun run build`

## Architecture

- `catalog/<id>/recipe.md` is canonical authored content.
- `generated/` is derived output. Regenerate it; do not hand-edit generated adapter files.
- `src/frontmatter.ts` owns the small YAML subset parser used by recipes and site MDX.
- `src/renderers.ts` owns ecosystem-specific output. Keep adapters pure and deterministic.
- `src/cli.ts` should remain a thin command router.
- `src/site-sync.ts` copies content from `meabed/site`; it must not modify the site repo.

## Code Style

- No `any`, `as any`, broad casts, or fake compatibility shims.
- Prefer inferred types, narrow guards, and `satisfies`.
- Use Node-compatible `node:*` APIs in published CLI code so `npx @meabed/agent-kit` works.
- Use Bun-specific APIs only in tests or development scripts where Node compatibility is irrelevant.
- Keep output operator-friendly: print `ok:`, `summary:`, and next steps. Never print secrets.
- Single quotes, 2 spaces, trailing commas, 100 width; defer to `oxfmt`.

## Content Rules

- Keep resource text concrete and action-oriented. It should tell an agent what to do, what to avoid,
  how to verify, and what risk remains.
- Do not invent proof, benchmarks, marketplace support, or tool behavior. Adapter claims should map
  to the docs in `docs/adapter-matrix.md`.
- Keep site articles and catalog entries in sync without removing content from the site.

## Verification

Run the narrow check first, then the full gate before committing:

```sh
bun run validate
bun run test
bun run typecheck
bun run lint
bun run fmt:check
bun run build
```
