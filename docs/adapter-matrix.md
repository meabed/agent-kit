# Adapter Matrix

The `@meabed/skills` CLI installs hand-authored files into common coding-agent workspace paths.
The official Skills CLI uses its own agent-path adapters and installs only `skills/*/SKILL.md`.

| Target           | Skills                       | Commands and prompts                | Specialist agents                  |
| ---------------- | ---------------------------- | ----------------------------------- | ---------------------------------- |
| `claude-code`    | `.claude/skills/*/`          | `.claude/commands/*.md`             | `.claude/agents/*.md`              |
| `codex`          | `.agents/skills/*/`          | Adapted to `.agents/skills/*/`      | `.codex/agents/*.toml` plus skill  |
| `github-copilot` | `.github/skills/*/`          | `.github/prompts/*.prompt.md`       | `.github/agents/*.md`              |
| `gemini-cli`     | `.gemini/skills/*/`          | `.gemini/commands/*.toml`           | `.gemini/agents/*.md`              |
| `opencode`       | `.opencode/skills/*/`        | `.opencode/commands/*.md`           | `.opencode/agents/*.md`            |
| `cline`          | `.cline/skills/*/`           | `.clinerules/workflows/*.md`        | Adapted to `.cline/skills/*/`      |
| `roo-code`       | `.roo/skills/*/`             | `.roo/commands/*.md`                | Adapted to `.roo/skills/*/`        |
| `windsurf`       | `.windsurf/skills/*/`        | `.windsurf/workflows/*.md`          | Adapted to `.windsurf/skills/*/`   |
| `devin`          | `.agents/skills/*/`          | Adapted to `.agents/skills/*/`      | Adapted to `.agents/skills/*/`     |
| `all`            | Union of every adapter above | Union, with duplicate paths removed | Union of native and skill adapters |

Every native skill install includes supporting files such as `agents/openai.yaml`, references,
scripts, and assets.

The root manifests make the skill catalog recognizable as Claude Code and Codex plugin source.
Use `skills plugin <claude-code|codex> --out ./plugins` to create a self-contained bundle. The
generated Claude bundle also adapts prompt resources into plugin commands; the generated Codex
bundle adapts non-skill resources into skills.
