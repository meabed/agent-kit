# Install

Agent Kit supports two installation paths:

- Use the official Skills CLI for `skills/*/SKILL.md`.
- Use the `@meabed/skills` npm CLI for the complete catalog of skills, commands, prompts, agents,
  and plugin bundles.

## Skills CLI

Run the Skills CLI from the project that should receive the skills:

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

Add `--global` to install into user-level agent directories instead of the current project. Use
`--skill '*' --agent '*' --global --yes` for a non-interactive global installation of every skill
for every supported agent.

The Skills CLI clones `https://github.com/meabed/agent-kit`, discovers the skill directories, and
installs the selected skills. The repository appears on skills.sh automatically after its
installations are observed.

This repository also publishes a binary named `skills`. From inside the Agent Kit source checkout,
force the official Skills CLI package to avoid resolving the local binary:

```sh
npx --package=skills skills add meabed/agent-kit --list
```

## Complete Catalog CLI

Run the npm package without adding it to the receiving project:

```sh
npx @meabed/skills list
npx @meabed/skills show skill pyramid-communication
npx @meabed/skills install all --cwd . --dry-run
npx @meabed/skills install claude-code --cwd .
npx @meabed/skills install codex --cwd .
npx @meabed/skills install github-copilot --type skill --cwd .
npx @meabed/skills install all pyramid-communication --cwd .
npx @meabed/skills install all --exclude dependency-updater --cwd .
npx @meabed/skills plugin claude-code --out ./plugins
npx @meabed/skills plugin codex --out ./plugins
```

`--cwd` sets the project install root. Resource IDs select an allowlist, `--type` selects one
resource kind, and comma-separated `--exclude` removes resources from the selection. `--dry-run`
prints every planned path without writing. The installer skips different existing files unless
`--force` is passed.

`all` writes every supported native adapter. It deduplicates shared paths such as `.agents/skills`.
Use a specific target when the repository should carry configuration for only one agent.

Commands and prompts become native slash commands or workflows where the target supports them.
Where it does not, the adapter wraps them as Agent Skills so the workflow remains discoverable.

Plugin bundles are generated under the selected `--out` directory. The Claude bundle contains
commands, prompts-as-commands, and skills with supporting files. The Codex bundle exposes the
complete catalog as skills.

## Local Development

```sh
bun install
bun run validate
bun test
bun run typecheck
bun run lint
bun run fmt:check
bun run build
```
