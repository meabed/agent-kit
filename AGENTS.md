# AGENTS.md - agent-kit

Canonical repo rules for this package. Keep long ecosystem notes in `docs/`; keep actual resources
in the root resource directories.

## Stack

Bun is the runtime, package manager, script runner, and test runner. Typecheck with `tsgo`
(`@typescript/native-preview`). Use `oxlint` and `oxfmt`. Do not add `typescript`, `tsc`,
`ts-node`, `tsx`, ESLint, Prettier, npm, pnpm, or Yarn.

## Commands

- `bun install`
- `bun run release:check`
- `bun run release:dry`
- `bun run validate`
- `bun test`
- `bun run typecheck`
- `bun run lint`
- `bun run fmt`
- `bun run build`

## Architecture

- `commands/*.md`, `skills/*/SKILL.md`, `prompts/*.prompt.md`, and `agents/*.md` are authored by
  hand and are the source of truth.
- `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` expose native plugin manifests.
- `src/resources.ts` discovers local resources.
- `src/installers.ts` maps complete resources into target-native workspace paths and plugin bundles.
- `src/cli.ts` stays a thin command router.
- `scripts/check-release.ts` keeps package and plugin versions aligned.
- `scripts/stamp-version.ts` stamps the semantic-release version into all published manifests.
- `.github/workflows/release.yml` validates `master`, publishes npm with Bun, and creates the GitHub
  tag and Release.
- No importer, renderer, or hidden source of truth for resource files.

## Code Style

- No `any`, `as any`, broad casts, or fake compatibility shims.
- Prefer inferred types, narrow guards, and `satisfies`.
- Use Node-compatible `node:*` APIs in published CLI code so `npx @meabed/skills` works.
- Keep output operator-friendly: print `ok:`, `summary:`, and next steps. Never print secrets.
- Single quotes, 2 spaces, trailing commas, 100 width; defer to `oxfmt`.

## Resource Rules

- Write resources as instructions for agents, not as articles about agents.
- Keep examples concrete and repo-real when possible.
- Commands should be immediately executable as slash-command instructions.
- Skills should use `SKILL.md` frontmatter with strong trigger descriptions.
- Skill directories may include `scripts/`, `references/`, `assets/`, and `agents/openai.yaml`; all
  bundled files must install with the skill.
- Keep resource IDs unique across commands, prompts, skills, and agents so installation paths do
  not collide.
- This is a personal collection, but every published file must be safe to share. Do not include
  private paths, contact details, credentials, internal systems, or copied conversation logs.
- Do not mention external publishing surfaces or import origins in resource files.

## Verification

Run the focused check first, then the full gate before committing:

```sh
bun run validate
bun test
bun run typecheck
bun run lint
bun run fmt:check
bun run build
```
