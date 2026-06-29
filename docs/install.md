# Install And Export

Prefer explicit project-local installs.

```sh
npx @meabed/agent-kit list
npx @meabed/agent-kit show remove-trivial-tests
npx @meabed/agent-kit install remove-trivial-tests --to claude-code
```

The installer writes one file for one selected resource. If the destination already exists with
different content, it refuses to overwrite unless you pass `--force`.

Use `export` when preparing a repo or package:

```sh
npx @meabed/agent-kit export --to vscode-copilot --out .
npx @meabed/agent-kit export security-review --to opencode --out .
```

Use `generate` inside this repo:

```sh
bun run generate
```

`generate` rebuilds `generated/` and `registry.json` from `catalog/`, then formats those generated
artifacts so the checked-in output is deterministic.
