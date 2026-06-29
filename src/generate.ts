import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { readCatalog } from './catalog.ts';
import { generatedDir, packageRoot } from './paths.ts';
import {
  isClaudeCommandLike,
  renderClaudeCommand,
  renderClaudeMarketplace,
  renderClaudePluginManifest,
  renderClaudeSkill,
  renderGeminiExtensionManifest,
  renderRecipe,
  renderRegistry,
} from './renderers.ts';
import type { Recipe, RenderedFile, Target } from './types.ts';
import { replaceGeneratedDir, writeFiles } from './output.ts';

export const generateAll = async (root = packageRoot()): Promise<string[]> => {
  const recipes = await readCatalog(join(root, 'catalog'));
  const outDir = generatedDir(root);
  await replaceGeneratedDir(outDir);

  const files = generatedFiles(recipes);
  const result = await writeFiles(outDir, files, { force: true });
  await writeRootFile(join(root, 'registry.json'), renderRegistry(recipes));
  return result.written;
};

export const generatedFiles = (recipes: Recipe[]): RenderedFile[] => {
  const files: RenderedFile[] = [];
  const simpleTargets = [
    'agent-prompt',
    'codex',
    'vscode-copilot',
    'gemini-cli',
    'opencode',
    'cline',
    'roo-code',
    'windsurf-devin',
  ] satisfies Target[];

  for (const recipe of recipes) {
    for (const target of simpleTargets) {
      files.push(prefixGenerated(target, renderRecipe(recipe, target)));
    }
  }

  files.push({
    path: 'claude-code/plugin/.claude-plugin/plugin.json',
    content: renderClaudePluginManifest(),
  });
  files.push({
    path: 'claude-code/marketplace/.claude-plugin/marketplace.json',
    content: renderClaudeMarketplace(),
  });
  files.push({
    path: 'claude-code/marketplace/plugins/meabed-agent-kit/.claude-plugin/plugin.json',
    content: renderClaudePluginManifest(),
  });
  files.push({
    path: 'gemini-cli/extension/gemini-extension.json',
    content: renderGeminiExtensionManifest(),
  });
  files.push({
    path: 'gemini-cli/extension/GEMINI.md',
    content:
      '# Meabed Agent Kit\n\nUse the installed commands and skills as engineering workflows. Prefer scoped edits, real verification, and concise reports.\n',
  });

  for (const recipe of recipes) {
    const claudeSkill = renderClaudeSkill(recipe);
    files.push({
      path: `claude-code/plugin/skills/${recipe.id}/SKILL.md`,
      content: claudeSkill,
    });
    files.push({
      path: `claude-code/marketplace/plugins/meabed-agent-kit/skills/${recipe.id}/SKILL.md`,
      content: claudeSkill,
    });
    if (isClaudeCommandLike(recipe)) {
      const claudeCommand = renderClaudeCommand(recipe);
      files.push({
        path: `claude-code/plugin/commands/${recipe.id}.md`,
        content: claudeCommand,
      });
      files.push({
        path: `claude-code/marketplace/plugins/meabed-agent-kit/commands/${recipe.id}.md`,
        content: claudeCommand,
      });
    }
    files.push({
      path: `gemini-cli/extension/commands/${recipe.id}.toml`,
      content: renderRecipe(recipe, 'gemini-cli').content,
    });
  }

  return files;
};

const prefixGenerated = (target: Target, file: RenderedFile): RenderedFile => {
  const folder = target === 'agent-prompt' ? 'agent-prompts' : target;
  const path = target === 'agent-prompt' ? file.path : `${folder}/${file.path}`;
  return { path, content: file.content };
};

const writeRootFile = async (path: string, content: string): Promise<void> => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
};
