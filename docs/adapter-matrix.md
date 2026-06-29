# Adapter Matrix

`agent-kit` renders one catalog recipe into the file shapes used by common coding-agent tools.

| Target           | Output                                                                                                                | Use                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `agent-prompt`   | `generated/agent-prompts/<id>.prompt.md`                                                                              | Portable copy/paste prompt                      |
| `claude-code`    | `.claude/skills/<id>/SKILL.md`, `.claude/commands/<id>.md` for command-like resources, plus plugin/marketplace output | Claude Code skills, slash commands, and plugins |
| `vscode-copilot` | `.github/prompts/<id>.prompt.md`                                                                                      | VS Code/Copilot prompt files                    |
| `gemini-cli`     | `.gemini/commands/<id>.toml` plus extension output                                                                    | Gemini CLI custom commands/extensions           |
| `opencode`       | `.opencode/commands/<id>.md`                                                                                          | OpenCode slash commands                         |
| `codex`          | `.agents/prompts/<id>.prompt.md`                                                                                      | Portable prompts for Codex workspaces           |
| `cline`          | `.clinerules/<id>.md`                                                                                                 | Cline workspace rules                           |
| `roo-code`       | `.roo/rules/<id>.md`                                                                                                  | Roo Code workspace rules                        |
| `windsurf-devin` | `.windsurf/rules/<id>.md`                                                                                             | Windsurf/Devin workspace rules                  |

Adapters are intentionally conservative. They render text and metadata; they do not install MCP
servers, hooks, or commands that execute code unless a future catalog entry explicitly owns that
behavior. Claude Code command-like resources are emitted as slash-command markdown; reusable
operating guidance is emitted as skills with trigger descriptions.
