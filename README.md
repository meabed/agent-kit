# Agent Kit

Portable, hand-authored skills, commands, and prompts.

The root resource directories are the source of truth. The CLI adapts each resource to the native
workspace format supported by Claude Code, Codex, GitHub Copilot, Gemini CLI, OpenCode, Cline, Roo
Code, Windsurf, and Devin.

## Install

Preview a complete cross-agent install:

```sh
npx @meabed/skills install all --cwd . --dry-run
```

Install everything for one agent:

```sh
npx @meabed/skills install codex --cwd .
npx @meabed/skills install claude-code --cwd .
```

Select or exclude resources:

```sh
npx @meabed/skills install github-copilot --type skill --cwd .
npx @meabed/skills install all pyramid-communication --cwd .
npx @meabed/skills install all --exclude dependency-updater --cwd .
```

Build installable plugin bundles:

```sh
npx @meabed/skills plugin claude-code --out ./plugins
npx @meabed/skills plugin codex --out ./plugins
```

The installer skips different existing files unless `--force` is passed. Restart or reload the
target agent after installation.

## Catalog

- `commands/*.md` — manually invoked workflows and slash commands.
- `skills/<name>/SKILL.md` — progressively disclosed Agent Skills.
- `skills/<name>/agents/openai.yaml` — optional OpenAI UI metadata shipped with each skill.
- `prompts/*.prompt.md` — reusable prompt templates.
- `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` — native plugin manifests.

Resources are public and repository-neutral. Do not add personal instruction dumps, private paths,
contact details, credentials, internal endpoints, or transcript-mining artifacts.

## Develop

```sh
bun install
bun run validate
bun test
bun run typecheck
bun run lint
bun run fmt:check
bun run build
```

See [docs/README.md](docs/README.md) for authoring, installation, and adapter details.
