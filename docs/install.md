# Install

There are two installers:

- `npx skills` installs only Agent Skills from `skills/`.
- `npx @meabed/skills` installs the full personal collection: skills, commands, prompts, and agent
  definitions.

## Skills Only

Use the official skills.sh installer:

```sh
npx skills add meabed/agent-kit --list
npx skills add meabed/agent-kit
npx skills add meabed/agent-kit --all
```

Install one skill for selected agents:

```sh
npx skills add meabed/agent-kit \
  --skill pyramid-communication \
  --agent codex \
  --agent claude-code \
  --yes
```

Add `--global` to make skills available in every project:

```sh
npx skills add meabed/agent-kit \
  --skill '*' \
  --agent '*' \
  --global \
  --yes
```

The skills.sh installer reads `skills/*/SKILL.md`. It does not install the commands, prompts, or
agent definitions stored elsewhere in this repository.

From inside this repository, force the official installer so `npx` does not choose the local
`skills` command:

```sh
npx --package=skills skills add meabed/agent-kit --list
```

## Full Collection

Run the npm package without adding it to the project:

```sh
npx @meabed/skills list
npx @meabed/skills install all --cwd . --dry-run
npx @meabed/skills install all --cwd .
```

There are no standalone agent definitions yet. Files added under `agents/` will be included in the
npm package automatically.

Install for one agent:

```sh
npx @meabed/skills install claude-code --cwd .
npx @meabed/skills install codex --cwd .
npx @meabed/skills install github-copilot --cwd .
```

Install only one kind:

```sh
npx @meabed/skills install claude-code --type command --cwd .
npx @meabed/skills install codex --type skill --cwd .
npx @meabed/skills install github-copilot --type prompt --cwd .
npx @meabed/skills install claude-code --type agent --cwd .
```

Install one named item, or leave one out:

```sh
npx @meabed/skills install codex pyramid-communication --cwd .
npx @meabed/skills install all --exclude dependency-updater --cwd .
```

Useful options:

| Option            | Meaning                                         |
| ----------------- | ----------------------------------------------- |
| `--cwd <path>`    | Choose the project that receives the files      |
| `--type <kind>`   | Choose `skill`, `command`, `prompt`, or `agent` |
| `--exclude <ids>` | Leave out one or more comma-separated names     |
| `--dry-run`       | Print planned changes without writing files     |
| `--force`         | Replace different files that already exist      |

Without `--force`, the installer keeps existing files when their contents differ.

## Plugin Folders

Create a complete plugin folder:

```sh
npx @meabed/skills plugin claude-code --out ./plugins
npx @meabed/skills plugin codex --out ./plugins
```

The Claude Code folder contains commands, prompts as commands, skills, and agent definitions. The
Codex folder turns every item into a skill so Codex can load it.

## Where Files Go

Each agent uses different folders. For example:

- Claude Code commands go to `.claude/commands/`.
- Codex skills go to `.agents/skills/`.
- GitHub Copilot prompts go to `.github/prompts/`.
- Gemini CLI commands go to `.gemini/commands/`.

See [Installation paths](installation-paths.md) for the complete table.
