# Agent Kit

Reusable prompts, skills, commands, and repo rules for coding agents.

This repo is the distributable home for the AI resources published on
[mo.ca/ai](https://mo.ca/ai). The site keeps its articles. This package mirrors the operational
resource from each article into a catalog, validates it, and renders tool-specific adapters for
Claude Code, Codex, VS Code/Copilot, Gemini CLI, OpenCode, Cline, Roo Code, and Windsurf/Devin.

## Install

```sh
npx @meabed/agent-kit list
```

During local development:

```sh
bun install
bun run sync:site
bun run generate
bun run validate
```

## Commands

```sh
meabed-agent list
meabed-agent show remove-trivial-tests
meabed-agent show remove-trivial-tests --format claude-skill
meabed-agent export remove-trivial-tests --to vscode-copilot --out .
meabed-agent install remove-trivial-tests --to claude-code
meabed-agent sync-site --site ../site --write
meabed-agent generate
meabed-agent validate
```

## Repository Shape

- `catalog/<id>/recipe.md` is the source of truth for each reusable resource.
- `generated/` contains adapter output and can be regenerated from the catalog.
- `registry.json` is the machine-readable index.
- `src/` contains the CLI, parser, renderers, sync, and validation code.
- `docs/` explains authoring, adapter behavior, and install choices.

See [docs/README.md](docs/README.md) for the full map.
