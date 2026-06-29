# Adapter Matrix

`agent-kit` installs hand-authored files into common coding-agent workspace paths.

| Target           | Installed files                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------- |
| `claude-code`    | `.claude/commands/*.md`, `.claude/skills/*/SKILL.md`, `.claude/agents/*.md`                                |
| `codex`          | `.agents/commands/*.md`, `.agents/skills/*/SKILL.md`, `.agents/prompts/*.prompt.md`, `.agents/agents/*.md` |
| `vscode-copilot` | `.github/prompts/*.prompt.md`                                                                              |
| `gemini-cli`     | `.gemini/commands/*.toml`                                                                                  |
| `opencode`       | `.opencode/commands/*.md`                                                                                  |
| `cline`          | `.clinerules/*.md`                                                                                         |
| `roo-code`       | `.roo/rules/*.md`                                                                                          |
| `windsurf-devin` | `.windsurf/rules/*.md`                                                                                     |

The root `.claude-plugin/plugin.json` also makes this repository usable as a Claude Code plugin
directory. Use `skills plugin claude-code --out .` to copy a plugin bundle into another workspace.
