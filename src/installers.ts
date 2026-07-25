import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { formatFrontmatter, splitFrontmatter } from './frontmatter.ts';
import { packageRoot } from './paths.ts';
import { TARGETS, type RenderedFile, type Resource, type Target } from './types.ts';

type PluginEcosystem = 'claude-code' | 'codex';

type WriteOptions = {
  force: boolean;
  dryRun: boolean;
};

type WriteSummary = {
  written: number;
  skipped: number;
  planned: number;
};

const CONCRETE_TARGETS = TARGETS.filter((target) => target !== 'all');

export const isTarget = (value: string): value is Target =>
  TARGETS.some((target) => target === value);

export const isPluginEcosystem = (value: string): value is PluginEcosystem =>
  value === 'claude-code' || value === 'codex';

export const renderInstallFiles = (target: Target, resources: Resource[]): RenderedFile[] => {
  const files =
    target === 'all'
      ? CONCRETE_TARGETS.flatMap((concreteTarget) =>
          resources.flatMap((resource) => renderResource(concreteTarget, resource)),
        )
      : resources.flatMap((resource) => renderResource(target, resource));

  return uniqueFiles(files);
};

const renderResource = (target: Exclude<Target, 'all'>, resource: Resource): RenderedFile[] => {
  switch (target) {
    case 'claude-code':
      return renderClaude(resource);
    case 'codex':
      return renderCodex(resource);
    case 'github-copilot':
      return renderGitHubCopilot(resource);
    case 'gemini-cli':
      return renderGemini(resource);
    case 'opencode':
      return renderOpenCode(resource);
    case 'cline':
      return renderCline(resource);
    case 'roo-code':
      return renderRoo(resource);
    case 'devin':
      return renderPortableSkill('.agents/skills', resource);
  }
};

const renderClaude = (resource: Resource): RenderedFile[] => {
  switch (resource.type) {
    case 'command':
      return [{ path: `.claude/commands/${resource.id}.md`, content: resource.content }];
    case 'skill':
      return renderNativeSkill('.claude/skills', resource);
    case 'agent':
      return [{ path: `.claude/agents/${resource.id}.md`, content: resource.content }];
    case 'prompt':
      return [{ path: `.claude/commands/${resource.id}.md`, content: commandContent(resource) }];
  }
};

const renderCodex = (resource: Resource): RenderedFile[] => {
  const skill = renderPortableSkill('.agents/skills', resource);
  if (resource.type !== 'agent') return skill;
  return [
    ...skill,
    { path: `.codex/agents/${resource.id}.toml`, content: codexAgentContent(resource) },
  ];
};

const renderGitHubCopilot = (resource: Resource): RenderedFile[] => {
  switch (resource.type) {
    case 'skill':
      return renderNativeSkill('.github/skills', resource);
    case 'agent':
      return [{ path: `.github/agents/${resource.id}.md`, content: resource.content }];
    case 'command':
    case 'prompt':
      return [
        {
          path: `.github/prompts/${resource.id}.prompt.md`,
          content: promptFileContent(resource),
        },
      ];
  }
};

const renderGemini = (resource: Resource): RenderedFile[] => {
  switch (resource.type) {
    case 'skill':
      return renderNativeSkill('.gemini/skills', resource);
    case 'agent':
      return [
        {
          path: `.gemini/agents/${resource.id}.md`,
          content: agentMarkdownContent(resource, { name: resource.id, kind: 'local' }),
        },
      ];
    case 'command':
    case 'prompt':
      return [
        {
          path: `.gemini/commands/${resource.id}.toml`,
          content: geminiCommandContent(resource),
        },
      ];
  }
};

const renderOpenCode = (resource: Resource): RenderedFile[] => {
  switch (resource.type) {
    case 'skill':
      return renderNativeSkill('.opencode/skills', resource);
    case 'agent':
      return [
        {
          path: `.opencode/agents/${resource.id}.md`,
          content: agentMarkdownContent(resource, { mode: 'subagent' }),
        },
      ];
    case 'command':
    case 'prompt':
      return [{ path: `.opencode/commands/${resource.id}.md`, content: commandContent(resource) }];
  }
};

const renderCline = (resource: Resource): RenderedFile[] => {
  switch (resource.type) {
    case 'skill':
      return renderNativeSkill('.cline/skills', resource);
    case 'agent':
      return renderPortableSkill('.cline/skills', resource);
    case 'command':
    case 'prompt':
      return [
        {
          path: `.clinerules/workflows/${resource.id}.md`,
          content: commandContent(resource),
        },
      ];
  }
};

const renderRoo = (resource: Resource): RenderedFile[] => {
  switch (resource.type) {
    case 'skill':
      return renderNativeSkill('.roo/skills', resource);
    case 'agent':
      return renderPortableSkill('.roo/skills', resource);
    case 'command':
    case 'prompt':
      return [{ path: `.roo/commands/${resource.id}.md`, content: commandContent(resource) }];
  }
};

const renderNativeSkill = (base: string, resource: Resource): RenderedFile[] => [
  { path: `${base}/${resource.id}/SKILL.md`, content: resource.content },
  ...resource.files.map((file) => ({
    path: `${base}/${resource.id}/${file.path}`,
    content: file.content,
  })),
];

const renderPortableSkill = (base: string, resource: Resource): RenderedFile[] => {
  if (resource.type === 'skill') return renderNativeSkill(base, resource);
  return [
    {
      path: `${base}/${resource.id}/SKILL.md`,
      content: portableSkillContent(resource),
    },
  ];
};

const portableSkillContent = (resource: Resource): string => {
  const body = resourceBody(resource);
  const heading = /^#\s+/m.test(body) ? '' : `# ${resource.title}\n\n`;
  return `${formatFrontmatter({
    name: resource.id,
    description: resource.description,
  })}\n${heading}${body.trim()}\n`;
};

const commandContent = (resource: Resource): string => {
  if (resource.type === 'command') return resource.content;
  return `${formatFrontmatter({ description: resource.description })}\n${resourceBody(resource).trim()}\n`;
};

const promptFileContent = (resource: Resource): string =>
  `${formatFrontmatter({ description: resource.description })}\n${resourceBody(resource).trim()}\n`;

const geminiCommandContent = (resource: Resource): string =>
  `description = ${JSON.stringify(resource.description)}\nprompt = ${JSON.stringify(resourceBody(resource).trim())}\n`;

const agentMarkdownContent = (resource: Resource, extra: Record<string, string>): string =>
  `${formatFrontmatter({
    ...extra,
    description: resource.description,
  })}\n${resourceBody(resource).trim()}\n`;

const codexAgentContent = (resource: Resource): string =>
  `name = ${JSON.stringify(resource.id)}\ndescription = ${JSON.stringify(resource.description)}\ndeveloper_instructions = ${JSON.stringify(resourceBody(resource).trim())}\n`;

const resourceBody = (resource: Resource): string => splitFrontmatter(resource.content).body;

const uniqueFiles = (files: RenderedFile[]): RenderedFile[] => {
  const byPath = new Map<string, RenderedFile>();
  for (const file of files) {
    const existing = byPath.get(file.path);
    if (existing && !sameContent(existing.content, file.content)) {
      throw new Error(`conflicting rendered content for ${file.path}`);
    }
    byPath.set(file.path, file);
  }
  return [...byPath.values()].sort((a, b) => a.path.localeCompare(b.path));
};

export const writeRenderedFiles = async (
  root: string,
  files: RenderedFile[],
  options: WriteOptions,
): Promise<WriteSummary> => {
  let written = 0;
  let skipped = 0;
  let planned = 0;

  for (const file of uniqueFiles(files)) {
    const target = safeTarget(root, file.path);
    const current = await readFile(target).catch(() => null);
    if (current && sameContent(current, file.content)) {
      skipped += 1;
      continue;
    }
    if (current !== null && !options.force) {
      console.log(`skip: ${file.path} exists; use --force to overwrite`);
      skipped += 1;
      continue;
    }
    if (options.dryRun) {
      console.log(`plan: write ${file.path}`);
      planned += 1;
      continue;
    }

    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, file.content);
    console.log(`write: ${file.path}`);
    written += 1;
  }

  return { written, skipped, planned };
};

const sameContent = (left: string | Uint8Array, right: string | Uint8Array): boolean => {
  const leftBytes = typeof left === 'string' ? new TextEncoder().encode(left) : left;
  const rightBytes = typeof right === 'string' ? new TextEncoder().encode(right) : right;
  if (leftBytes.byteLength !== rightBytes.byteLength) return false;
  return leftBytes.every((byte, index) => byte === rightBytes[index]);
};

const safeTarget = (root: string, path: string): string => {
  const target = resolve(root, path);
  const localPath = relative(resolve(root), target);
  if (
    localPath === '..' ||
    localPath.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`)
  ) {
    throw new Error(`refusing to write outside install root: ${path}`);
  }
  return target;
};

export const pluginBundleFiles = async (
  ecosystem: PluginEcosystem,
  name: string,
  root = packageRoot(),
): Promise<RenderedFile[]> => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error('plugin name must be kebab-case');
  }

  const { readResources } = await import('./resources.ts');
  const resources = await readResources(root);
  const files =
    ecosystem === 'claude-code'
      ? resources.flatMap(renderClaudePluginResource)
      : resources.flatMap((resource) => renderPortableSkill('skills', resource));
  const manifestPath =
    ecosystem === 'claude-code'
      ? join(root, '.claude-plugin', 'plugin.json')
      : join(root, '.codex-plugin', 'plugin.json');
  const manifest = await namedManifest(manifestPath, name);

  return uniqueFiles([
    {
      path:
        ecosystem === 'claude-code'
          ? `${name}/.claude-plugin/plugin.json`
          : `${name}/.codex-plugin/plugin.json`,
      content: manifest,
    },
    ...files.map((file) => ({ path: `${name}/${file.path}`, content: file.content })),
  ]);
};

const renderClaudePluginResource = (resource: Resource): RenderedFile[] => {
  switch (resource.type) {
    case 'command':
      return [{ path: `commands/${resource.id}.md`, content: resource.content }];
    case 'prompt':
      return [{ path: `commands/${resource.id}.md`, content: commandContent(resource) }];
    case 'skill':
      return renderNativeSkill('skills', resource);
    case 'agent':
      return [{ path: `agents/${resource.id}.md`, content: resource.content }];
  }
};

const namedManifest = async (path: string, name: string): Promise<string> => {
  const raw = await readFile(path, 'utf8');
  const parsed: unknown = JSON.parse(raw);
  if (!isRecord(parsed)) throw new Error(`invalid plugin manifest: ${path}`);
  return `${JSON.stringify({ ...parsed, name }, null, 2)}\n`;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const defaultPluginName = (): string => basename(packageRoot());
