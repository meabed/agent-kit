# Agent Kit

Hand-authored prompts, skills, commands, agents, and plugin files for coding agents.

This repo is meant to be used directly. Edit the resource files by hand, review them like code, and
install them into a project with the CLI when you want the same workflows available to an agent.

## Use With npx

```sh
npx @meabed/skills list
npx @meabed/skills show skill remove-trivial-tests
npx @meabed/skills install claude-code --cwd .
npx @meabed/skills plugin claude-code --out ./plugins
```

Local development:

```sh
bun install
bun run validate
bun test
bun run typecheck
bun run lint
bun run build
```

## Repository Shape

- `commands/*.md` - slash-command prompts.
- `skills/<name>/SKILL.md` - reusable agent skills.
- `prompts/*.prompt.md` - copy/paste or editor prompt files.
- `agents/*.md` - subagent definitions.
- `.claude-plugin/plugin.json` - makes this repo usable as a Claude Code plugin root.
- `src/` - the installer CLI and validation code.
- `docs/` - short docs for authoring and installation.

## CLI

```sh
skills list
skills list --type skill
skills show command audit
skills install claude-code --cwd .
skills install codex --cwd .
skills plugin claude-code --out ./plugins
skills validate
```

The installer refuses to overwrite different files unless `--force` is passed.
