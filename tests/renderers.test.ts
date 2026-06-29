import { describe, expect, it } from 'bun:test';
import {
  renderClaudeCommand,
  renderGeminiCommand,
  renderRecipe,
  renderVsCodePrompt,
} from '../src/renderers.ts';
import type { Recipe } from '../src/types.ts';

const recipe: Recipe = {
  id: 'remove-trivial-tests',
  title: 'Remove trivial tests before they harden',
  summary: 'Replace shallow coverage with tests that can catch real regressions.',
  type: 'skill',
  topics: ['testing', 'skill'],
  body: 'Review tests and delete assertions that cannot fail for real regressions.',
  sourceArtifact: 'skills/remove-trivial-tests/SKILL.md',
  siteUrl: 'https://mo.ca/ai/remove-trivial-tests',
};

const commandRecipe: Recipe = {
  id: 'command-audit',
  title: 'Read-only audit with file:line findings',
  summary: 'A strict no-write pass that reports one concrete finding per line.',
  type: 'command',
  topics: ['command'],
  body: `Article wrapper.

\`\`\`md title="commands/audit.md"
---
description: Audit without edits
---

Read-only audit/recon. Do NOT modify any files.
\`\`\`
`,
  sourceArtifact: 'commands/audit.md',
};

describe('renderers', () => {
  it('renders target paths for installers', () => {
    expect(renderRecipe(recipe, 'claude-code').path).toBe(
      '.claude/skills/remove-trivial-tests/SKILL.md',
    );
    expect(renderRecipe(commandRecipe, 'claude-code').path).toBe(
      '.claude/commands/command-audit.md',
    );
    expect(renderRecipe(recipe, 'vscode-copilot').path).toBe(
      '.github/prompts/remove-trivial-tests.prompt.md',
    );
  });

  it('renders prompt frontmatter and agent instructions', () => {
    const prompt = renderVsCodePrompt(recipe);
    expect(prompt).toContain('name: remove-trivial-tests');
    expect(prompt).toContain('You are an AI coding agent working inside a real repository.');
  });

  it('renders Gemini commands as TOML', () => {
    const command = renderGeminiCommand(recipe);
    expect(command).toContain('description = ');
    expect(command).toContain('prompt = "# Agent prompt: Remove trivial tests before they harden');
  });

  it('extracts titled command artifacts for Claude slash commands', () => {
    const command = renderClaudeCommand(commandRecipe);
    expect(command).toContain('Read-only audit/recon. Do NOT modify any files.');
    expect(command).not.toContain('description: Audit without edits');
    expect(command).not.toContain('# Agent prompt:');
    expect(command).not.toContain('Article wrapper.');
  });
});
