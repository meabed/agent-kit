# Install

Use `npx` without adding the package to the target repo:

```sh
npx @meabed/skills list
npx @meabed/skills show skill pyramid-skill
npx @meabed/skills install all --cwd . --dry-run
npx @meabed/skills install claude-code --cwd .
npx @meabed/skills install codex --cwd .
npx @meabed/skills install github-copilot --type skill --cwd .
npx @meabed/skills install all pyramid-skill authentic-writing-tone --cwd .
npx @meabed/skills install all --exclude domain-watcher,dependency-updater --cwd .
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

Local development:

```sh
bun install
bun run validate
bun test
bun run typecheck
bun run lint
bun run fmt:check
bun run build
```
