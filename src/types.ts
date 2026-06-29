export const RESOURCE_TYPES = ['agent', 'command', 'prompt', 'skill'] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const TARGETS = [
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

export type Resource = {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  path: string;
  content: string;
};

export type RenderedFile = {
  path: string;
  content: string;
};

export type WriteResult = {
  written: string[];
  skipped: string[];
};
