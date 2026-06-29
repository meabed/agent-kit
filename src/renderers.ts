import {
  agentPromptMarkdown,
  compactDescription,
  embeddedArtifact,
  stripFrontmatter,
} from './markdown.ts';
import { TARGETS, type Recipe, type RenderedFile, type Target } from './types.ts';

export const isTarget = (value: string): value is Target =>
  TARGETS.some((target) => target === value);

export const renderRecipe = (recipe: Recipe, target: Target): RenderedFile => {
  switch (target) {
    case 'agent-prompt':
      return {
        path: `agent-prompts/${recipe.id}.prompt.md`,
        content: agentPromptMarkdown(recipe),
      };
    case 'claude-code':
      return renderClaudeCodeFile(recipe);
    case 'codex':
      return {
        path: `.agents/prompts/${recipe.id}.prompt.md`,
        content: agentPromptMarkdown(recipe),
      };
    case 'vscode-copilot':
      return {
        path: `.github/prompts/${recipe.id}.prompt.md`,
        content: renderVsCodePrompt(recipe),
      };
    case 'gemini-cli':
      return {
        path: `.gemini/commands/${recipe.id}.toml`,
        content: renderGeminiCommand(recipe),
      };
    case 'opencode':
      return {
        path: `.opencode/commands/${recipe.id}.md`,
        content: renderOpenCodeCommand(recipe),
      };
    case 'cline':
      return {
        path: `.clinerules/${recipe.id}.md`,
        content: renderRule(recipe, 'paths'),
      };
    case 'roo-code':
      return {
        path: `.roo/rules/${recipe.id}.md`,
        content: renderPlainRule(recipe),
      };
    case 'windsurf-devin':
      return {
        path: `.windsurf/rules/${recipe.id}.md`,
        content: renderRule(recipe, 'globs'),
      };
  }
};

export const renderClaudeSkill = (recipe: Recipe): string => {
  return `---
name: ${recipe.id}
description: ${yamlString(claudeSkillDescription(recipe))}
version: 0.1.0
---

# ${recipe.title}

${recipe.summary}

## Instructions

${recipe.body.trim()}

## Verification

Before calling the task done, run the focused check for the files you changed and the repository's normal verification gate. Report what changed, what passed, and any risk that remains.
`;
};

export const renderClaudeCommand = (recipe: Recipe): string => {
  const artifact = embeddedArtifactBody(recipe);
  const source = artifact ?? agentPromptMarkdown(recipe);

  return `---
description: ${yamlString(compactDescription(recipe.summary))}
argument-hint: [optional context]
---

${source.trim()}
`;
};

export const renderVsCodePrompt = (recipe: Recipe): string => `---
name: ${recipe.id}
description: ${yamlString(compactDescription(recipe.summary))}
agent: agent
---

${agentPromptMarkdown(recipe)}
`;

export const renderGeminiCommand = (
  recipe: Recipe,
): string => `description = ${jsonString(compactDescription(recipe.summary))}
prompt = ${jsonString(agentPromptMarkdown(recipe))}
`;

export const renderOpenCodeCommand = (recipe: Recipe): string => `---
description: ${yamlString(compactDescription(recipe.summary))}
---

${agentPromptMarkdown(recipe)}
`;

export const renderPlainRule = (recipe: Recipe): string => `# ${recipe.title}

${recipe.summary}

${recipe.body.trim()}
`;

export const renderRule = (recipe: Recipe, field: 'paths' | 'globs'): string => `---
${field}:
  - '**'
---

${renderPlainRule(recipe)}
`;

export const renderRegistry = (recipes: Recipe[]): string => {
  const registry = {
    name: '@meabed/agent-kit',
    generatedAt: new Date(0).toISOString(),
    resources: recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      summary: recipe.summary,
      type: recipe.type,
      topics: recipe.topics,
      date: recipe.date,
      sourceArtifact: recipe.sourceArtifact,
      siteUrl: recipe.siteUrl,
      sourcePath: recipe.sourcePath,
    })),
  };

  return `${JSON.stringify(registry, null, 2)}\n`;
};

export const renderClaudePluginManifest = (): string =>
  `${JSON.stringify(
    {
      name: 'meabed-agent-kit',
      displayName: 'Meabed Agent Kit',
      description: 'Prompts, skills, commands, and repo rules for coding agents.',
      version: '0.1.0',
      author: { name: 'Mohamed Meabed' },
      homepage: 'https://mo.ca/ai',
      repository: 'https://github.com/meabed/agent-kit',
      license: 'MIT',
    },
    null,
    2,
  )}\n`;

export const renderClaudeMarketplace = (): string =>
  `${JSON.stringify(
    {
      name: 'meabed-agent-kit',
      owner: { name: 'Mohamed Meabed' },
      description: 'Agent resources for engineering workflows.',
      plugins: [
        {
          name: 'meabed-agent-kit',
          source: './plugins/meabed-agent-kit',
          description: 'Prompts, skills, commands, and repo rules for coding agents.',
          version: '0.1.0',
          repository: 'https://github.com/meabed/agent-kit',
          tags: ['coding-agents', 'prompts', 'skills', 'engineering'],
        },
      ],
    },
    null,
    2,
  )}\n`;

export const renderGeminiExtensionManifest = (): string =>
  `${JSON.stringify(
    {
      name: 'meabed-agent-kit',
      version: '0.1.0',
      description: 'Prompts, commands, and skills for engineering agents.',
      contextFileName: 'GEMINI.md',
    },
    null,
    2,
  )}\n`;

export const isClaudeCommandLike = (recipe: Recipe): boolean =>
  recipe.type === 'command' || recipe.sourceArtifact?.startsWith('commands/') === true;

const renderClaudeCodeFile = (recipe: Recipe): RenderedFile => {
  if (isClaudeCommandLike(recipe)) {
    return {
      path: `.claude/commands/${recipe.id}.md`,
      content: renderClaudeCommand(recipe),
    };
  }

  return {
    path: `.claude/skills/${recipe.id}/SKILL.md`,
    content: renderClaudeSkill(recipe),
  };
};

const embeddedArtifactBody = (recipe: Recipe): string | null => {
  const artifact = embeddedArtifact(recipe);
  return artifact ? stripFrontmatter(artifact) : null;
};

const claudeSkillDescription = (recipe: Recipe): string =>
  compactDescription(
    `This skill should be used when the user asks to apply "${recipe.title}", mentions "${recipe.id}", or needs this workflow: ${recipe.summary}`,
    320,
  );

const jsonString = (value: string): string => JSON.stringify(value);

const yamlString = (value: string): string => `'${value.replaceAll("'", "''")}'`;
