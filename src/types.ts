export const RESOURCE_TYPES = ['agent', 'command', 'prompt', 'skill'] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const TARGETS = [
  'all',
  'claude-code',
  'codex',
  'github-copilot',
  'gemini-cli',
  'opencode',
  'cline',
  'roo-code',
  'devin',
] as const;

export type Target = (typeof TARGETS)[number];

export type ResourceFile = {
  path: string;
  content: Uint8Array;
};

export type Resource = {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  path: string;
  content: string;
  files: ResourceFile[];
};

export type RenderedFile = {
  path: string;
  content: string | Uint8Array;
};

export type WriteResult = {
  written: string[];
  skipped: string[];
};
