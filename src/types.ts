export const TARGETS = [
  'agent-prompt',
  'claude-code',
  'codex',
  'vscode-copilot',
  'gemini-cli',
  'opencode',
  'cline',
  'roo-code',
  'windsurf-devin',
] as const;

export type Target = (typeof TARGETS)[number];

export const RECIPE_TYPES = [
  'agent',
  'command',
  'config',
  'loop',
  'prompt',
  'resource',
  'skill',
  'tool',
  'workflow',
] as const;

export type RecipeType = (typeof RECIPE_TYPES)[number];

export type Recipe = {
  id: string;
  title: string;
  summary: string;
  type: RecipeType;
  topics: string[];
  body: string;
  date?: string;
  sourceArtifact?: string;
  siteUrl?: string;
  sourcePath?: string;
};

export type RenderedFile = {
  path: string;
  content: string;
};

export type WriteResult = {
  written: string[];
  skipped: string[];
};
