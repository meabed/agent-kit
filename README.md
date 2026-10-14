# Agent Kit

[![skills.sh](https://skills.sh/b/meabed/agent-kit)](https://skills.sh/)
[![npm](https://img.shields.io/npm/v/@meabed/skills?label=npm)](https://www.npmjs.com/package/@meabed/skills)

My personal collection of reusable skills, commands, prompts, and agent instructions.

I keep them in one public repository so I can use the same instructions with Codex, Claude Code,
GitHub Copilot, Gemini CLI, and other coding agents.

## Choose What to Install

| What you want                      | Command                                    |
| ---------------------------------- | ------------------------------------------ |
| Skills only, through skills.sh     | `npx skills add meabed/agent-kit`          |
| Everything in this collection      | `npx @meabed/skills install all --cwd .`   |
| Everything for one supported agent | `npx @meabed/skills install codex --cwd .` |
| Preview the full install first     | `npx @meabed/skills install all --dry-run` |

The two commands are different:

- `npx skills` is the official [skills.sh](https://skills.sh/) installer. It installs only the
  folders under `skills/`.
- `npx @meabed/skills` is this repository's npm package. It installs skills, commands, prompts, and
  agent definitions.

## Install Skills with skills.sh

List the available skills:

```sh
npx skills add meabed/agent-kit --list
```

Choose skills and agents interactively:

```sh
npx skills add meabed/agent-kit
```

Install every skill into every detected agent:

```sh
npx skills add meabed/agent-kit --all
```

Install one skill for Codex and Claude Code:

```sh
npx skills add meabed/agent-kit \
  --skill pyramid-communication \
  --agent codex \
  --agent claude-code \
  --yes
```

Install skills globally so they are available in every project:

```sh
npx skills add meabed/agent-kit \
  --skill '*' \
  --agent '*' \
  --global \
  --yes
```

Use one skill without installing it:

```sh
npx skills use meabed/agent-kit@pyramid-communication --agent codex
```

Check, update, or remove installed skills:

```sh
npx skills list
npx skills update
npx skills remove pyramid-communication
```

Restart or reload the agent after installing a skill.

## Install the Full Collection from npm

The npm package contains:

- `skills/*/SKILL.md`
- `commands/*.md`
- `prompts/*.prompt.md`
- `agents/*.md` when agent definitions exist
- Claude Code and Codex plugin files

There are no standalone agent definitions yet. When files are added under `agents/`, the npm
package and installer will include them automatically.

List everything in the published package:

```sh
npx @meabed/skills list
```

Preview every file before writing it:

```sh
npx @meabed/skills install all --cwd . --dry-run
```

Install everything for all supported agents:

```sh
npx @meabed/skills install all --cwd .
```

Install everything for one agent:

```sh
npx @meabed/skills install claude-code --cwd .
npx @meabed/skills install codex --cwd .
```

Install only one kind of instruction:

```sh
npx @meabed/skills install claude-code --type command --cwd .
npx @meabed/skills install github-copilot --type prompt --cwd .
npx @meabed/skills install codex --type skill --cwd .
npx @meabed/skills install claude-code --type agent --cwd .
```

Install one named item or leave one out:

```sh
npx @meabed/skills install codex pyramid-communication --cwd .
npx @meabed/skills install all --exclude dependency-updater --cwd .
```

Show one item before installing it:

```sh
npx @meabed/skills show skill pyramid-communication
npx @meabed/skills show command audit
```

The installer skips an existing file when its contents differ. Review the path, then add `--force`
only when you want to replace it.

## Build Plugin Folders

Create a complete plugin folder for Claude Code or Codex:

```sh
npx @meabed/skills plugin claude-code --out ./plugins
npx @meabed/skills plugin codex --out ./plugins
```

The Claude Code plugin keeps commands as commands. The Codex plugin turns commands, prompts, and
agent definitions into skills so Codex can load them.

## Supported Agents

The full installer supports:

- Claude Code
- Codex
- GitHub Copilot
- Gemini CLI
- OpenCode
- Cline
- Roo Code
- Devin

Use `all` to install for every supported agent.

## How the Files Are Used

| Source file                | What it provides                           |
| -------------------------- | ------------------------------------------ |
| `skills/<name>/SKILL.md`   | Instructions an agent can load when needed |
| `commands/<name>.md`       | A task you start manually                  |
| `prompts/<name>.prompt.md` | A reusable prompt                          |
| `agents/<name>.md`         | Instructions for a focused helper agent    |

Each coding agent stores these files in different folders. The npm installer writes each item where
the selected agent expects it. When an agent supports only skills, the installer turns the command,
prompt, or agent definition into a `SKILL.md` file.

See the [installation path table](docs/installation-paths.md) for every destination.

## Run from a Local Clone

Use the source version before a change is published:

```sh
git clone https://github.com/meabed/agent-kit.git
cd agent-kit
bun install
bun src/cli.ts list
bun src/cli.ts install all --cwd /path/to/project --dry-run
```

## Keep Published Files Safe

This is a personal collection, but the repository and npm package are public. Do not add passwords,
tokens, private paths, personal contact details, internal service addresses, or copied private
conversations.

## Develop

```sh
bun install
bun run release:check
bun run validate
bun test
bun run typecheck
bun run lint
bun run fmt:check
bun run build
```

## Release

Every push to `master` runs the full check and then uses the commit message to decide whether to
publish:

- `fix:` publishes a patch.
- `feat:` publishes a minor version.
- `!` or `BREAKING CHANGE:` publishes a major version.
- `docs:`, `test:`, `ci:`, and plain `chore:` do not publish.

The workflow sets the version, publishes `@meabed/skills`, creates the Git tag, and creates the
GitHub Release. Do not edit versions or create releases by hand.

See [Release](docs/releasing.md) for setup and recovery details.

## More Documentation

- [Install](docs/install.md)
- [Write instructions](docs/authoring.md)
- [Installation paths](docs/installation-paths.md)
- [Release](docs/releasing.md)

### `npx skills` runs this package instead of the skills.sh installer

This repository also publishes a command named `skills`. From inside this source checkout, force
the official package:

```sh
npx --package=skills skills add meabed/agent-kit --list
```
