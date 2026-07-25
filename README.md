# Agent Kit

[![skills.sh](https://skills.sh/b/meabed/agent-kit)](https://skills.sh/)
[![npm](https://img.shields.io/npm/v/@meabed/skills?label=npm)](https://www.npmjs.com/package/@meabed/skills)

Public, hand-authored skills, commands, and prompts for software agents.

## Quick Start

Run the official [Skills CLI](https://skills.sh/) from the project where you use your agent:

```sh
npx skills add meabed/agent-kit
```

The interactive installer lets you choose the skills, agents, installation scope, and copy or
symlink method. You do not need to clone this repository or add a package dependency.

To install every skill into every detected agent for the current project without prompts:

```sh
npx skills add meabed/agent-kit --all
```

To install every skill globally for every supported agent:

```sh
npx skills add meabed/agent-kit \
  --skill '*' \
  --agent '*' \
  --global \
  --yes
```

Restart or reload your agent after installation.

## Choose an Installer

| Need                                                    | Use                                 |
| ------------------------------------------------------- | ----------------------------------- |
| Install Agent Skills from GitHub through skills.sh      | `npx skills add meabed/agent-kit`   |
| Install skills for one project                          | Skills CLI without `--global`       |
| Install skills for every project                        | Skills CLI with `--global`          |
| Install commands, prompts, agents, and skills           | `npx @meabed/skills install`        |
| Build Claude Code or Codex plugin bundles               | `npx @meabed/skills plugin`         |
| Test this repository before the npm package is released | `bun src/cli.ts` from a local clone |

The Skills CLI installs only the Agent Skills under `skills/`. The `@meabed/skills` npm CLI
installs the repository's complete resource catalog.

## Install with Skills.sh

### Browse the catalog

List all skills without installing them:

```sh
npx skills add meabed/agent-kit --list
```

Skills.sh creates the repository page automatically after it processes installation telemetry.

### Install in the current project

Choose skills and agents interactively:

```sh
npx skills add meabed/agent-kit
```

Install all skills for Codex:

```sh
npx skills add meabed/agent-kit \
  --skill '*' \
  --agent codex \
  --yes
```

Install one skill for Codex and Claude Code:

```sh
npx skills add meabed/agent-kit \
  --skill pyramid-communication \
  --agent codex \
  --agent claude-code \
  --yes
```

Project installation is the default. The Skills CLI writes into agent directories under the
current project so the installed skills can be committed and shared with the team.

### Install globally

Add `--global` when skills should be available from every project:

```sh
npx skills add meabed/agent-kit \
  --skill pyramid-communication \
  --agent codex \
  --global \
  --yes
```

### Use a skill without installing it

Generate and run a skill prompt in a supported agent:

```sh
npx skills use meabed/agent-kit@pyramid-communication --agent codex
```

### Verify, update, or remove skills

```sh
npx skills list
npx skills update
npx skills remove pyramid-communication
```

The Skills CLI clones the public GitHub repository and discovers `skills/*/SKILL.md`. This
installation path does not depend on the `@meabed/skills` npm release.

## Install the Complete Catalog from npm

Use the npm CLI when you need this repository's commands, prompts, specialist agents, or plugin
adapters in addition to its Agent Skills. `npx` downloads and runs the CLI without adding it to the
receiving project's dependencies.

Preview a complete cross-agent installation:

```sh
npx @meabed/skills install all --cwd . --dry-run
```

Install the complete catalog for all supported agents:

```sh
npx @meabed/skills install all --cwd .
```

Install the complete catalog for one agent:

```sh
npx @meabed/skills install codex --cwd .
npx @meabed/skills install claude-code --cwd .
```

Select or exclude resources:

```sh
npx @meabed/skills list
npx @meabed/skills show skill pyramid-communication
npx @meabed/skills install github-copilot --type skill --cwd .
npx @meabed/skills install all pyramid-communication --cwd .
npx @meabed/skills install all --exclude dependency-updater --cwd .
```

Build self-contained plugin bundles:

```sh
npx @meabed/skills plugin claude-code --out ./plugins
npx @meabed/skills plugin codex --out ./plugins
```

Supported targets are `all`, `claude-code`, `codex`, `github-copilot`, `gemini-cli`, `opencode`,
`cline`, `roo-code`, `windsurf`, and `devin`.

`--cwd` sets the receiving project. Resource IDs form an allowlist, `--type` selects one resource
kind, and `--exclude` removes comma-separated resources. The installer skips different existing
files unless `--force` is passed.

## Run from a Local Clone

Use the source CLI to test unpublished changes:

```sh
git clone https://github.com/meabed/agent-kit.git
cd agent-kit
bun install
bun src/cli.ts list
bun src/cli.ts install all --cwd /path/to/project --dry-run
bun src/cli.ts install codex --cwd /path/to/project
```

## What Is Included

| Source                             | Purpose                                              |
| ---------------------------------- | ---------------------------------------------------- |
| `skills/<name>/SKILL.md`           | Agent Skills discovered by skills.sh and the npm CLI |
| `skills/<name>/agents/openai.yaml` | Optional OpenAI UI metadata for a skill              |
| `commands/*.md`                    | Manually invoked workflows and slash commands        |
| `prompts/*.prompt.md`              | Reusable prompt templates                            |
| `agents/*.md`                      | Optional specialist-agent definitions                |
| `.claude-plugin/plugin.json`       | Claude Code plugin manifest                          |
| `.codex-plugin/plugin.json`        | Codex plugin manifest                                |

The root resource directories are the source of truth. The npm CLI preserves complete skill
folders and adapts each resource to paths and formats the selected agent loads. See the
[adapter matrix](docs/adapter-matrix.md) for exact destinations.

Resources are public and repository-neutral. Do not add personal instruction dumps, private paths,
contact details, credentials, internal endpoints, or transcript-mining artifacts.

## Troubleshooting

### `npx skills` runs the wrong CLI in this source checkout

This package also exposes a local binary named `skills`. Force the official Skills CLI package when
running from the Agent Kit source directory:

```sh
npx --package=skills skills add meabed/agent-kit --list
```

Normal receiving projects do not have this local-package collision.

### The agent does not show a newly installed skill

Restart or reload the agent. Confirm the installation with `npx skills list`, then check that the
selected agent was included in the installation.

### The npm CLI skips an existing file

Run the installation with `--dry-run` first. Add `--force` only after reviewing the paths that will
be replaced.

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

## Release the npm Package

Publishing a stable GitHub Release runs
[`.github/workflows/npm-release.yml`](.github/workflows/npm-release.yml). The workflow verifies the
release version, runs the full Bun gate, previews the package, and publishes `@meabed/skills` to
npm.

Before publishing:

1. Set the same version in `package.json`, `.claude-plugin/plugin.json`, and
   `.codex-plugin/plugin.json`.
2. Run the development commands above.
3. Commit and push the changes.
4. Publish a GitHub Release tagged `v<version>`, such as `v0.2.0`.

The repository must provide an `NPM_TOKEN` Actions secret with publish access to
`@meabed/skills`. See [docs/releasing.md](docs/releasing.md) for the complete release contract.

See [docs/README.md](docs/README.md) for authoring, installation, adapter, and release details.
