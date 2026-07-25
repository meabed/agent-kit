# Installation Paths

The `@meabed/skills` command puts each file where the selected coding agent expects it.
The official `npx skills` command installs only `skills/*/SKILL.md`.

| Target           | Skills                 | Commands and prompts             | Specialist agents                 |
| ---------------- | ---------------------- | -------------------------------- | --------------------------------- |
| `claude-code`    | `.claude/skills/*/`    | `.claude/commands/*.md`          | `.claude/agents/*.md`             |
| `codex`          | `.agents/skills/*/`    | Installed as `.agents/skills/*/` | `.codex/agents/*.toml` plus skill |
| `github-copilot` | `.github/skills/*/`    | `.github/prompts/*.prompt.md`    | `.github/agents/*.md`             |
| `gemini-cli`     | `.gemini/skills/*/`    | `.gemini/commands/*.toml`        | `.gemini/agents/*.md`             |
| `opencode`       | `.opencode/skills/*/`  | `.opencode/commands/*.md`        | `.opencode/agents/*.md`           |
| `cline`          | `.cline/skills/*/`     | `.clinerules/workflows/*.md`     | Installed as `.cline/skills/*/`   |
| `roo-code`       | `.roo/skills/*/`       | `.roo/commands/*.md`             | Installed as `.roo/skills/*/`     |
| `devin`          | `.agents/skills/*/`    | Installed as `.agents/skills/*/` | Installed as `.agents/skills/*/`  |
| `all`            | Every skill path above | Every path, without duplicates   | Every agent path above            |

Skills keep their supporting files, including `agents/openai.yaml`, references, scripts, and
assets.

Use `npx @meabed/skills plugin <claude-code|codex> --out ./plugins` to create a complete plugin
folder. The Claude Code folder turns prompts into commands. The Codex folder turns commands,
prompts, and agent definitions into skills.
