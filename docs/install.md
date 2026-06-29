# Install

Use `npx` without adding the package to the target repo:

```sh
npx @meabed/skills list
npx @meabed/skills install claude-code --cwd .
npx @meabed/skills install codex --cwd .
npx @meabed/skills plugin claude-code --out ./plugins
```

The installer skips existing files with different content unless `--force` is passed.

Local development:

```sh
bun install
bun run validate
bun test
bun run build
```
