import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { packageRoot } from './paths.ts';
import { TARGETS, type RenderedFile, type Resource, type Target } from './types.ts';

export const isTarget = (value: string): value is Target =>
  TARGETS.some((target) => target === value);

export const renderInstallFiles = (target: Target, resources: Resource[]): RenderedFile[] =>
  resources.flatMap((resource) => renderResource(target, resource));

export const claudePluginFiles = async (root = packageRoot()): Promise<RenderedFile[]> => {
  const files: RenderedFile[] = [];
  for (const dir of ['.claude-plugin', 'commands', 'skills', 'agents']) {
    files.push(...(await readTree(join(root, dir), root)));
  }
  return files;
};

const renderResource = (target: Target, resource: Resource): RenderedFile[] => {
  switch (target) {
    case 'claude-code':
      return renderClaude(resource);
    case 'codex':
      return renderCodex(resource);
    case 'vscode-copilot':
      return [
        { path: `.github/prompts/${resource.id}.prompt.md`, content: promptContent(resource) },
      ];
    case 'gemini-cli':
      return [
        {
          path: `.gemini/commands/${resource.id}.toml`,
          content: `description = ${JSON.stringify(resource.description)}\nprompt = ${JSON.stringify(promptContent(resource))}\n`,
        },
      ];
    case 'opencode':
      return [{ path: `.opencode/commands/${resource.id}.md`, content: commandContent(resource) }];
    case 'cline':
      return [{ path: `.clinerules/${resource.id}.md`, content: ruleContent(resource) }];
    case 'roo-code':
      return [{ path: `.roo/rules/${resource.id}.md`, content: ruleContent(resource) }];
    case 'windsurf-devin':
      return [{ path: `.windsurf/rules/${resource.id}.md`, content: ruleContent(resource) }];
  }
};

const renderClaude = (resource: Resource): RenderedFile[] => {
  switch (resource.type) {
    case 'command':
      return [{ path: `.claude/commands/${resource.id}.md`, content: resource.content }];
    case 'skill':
      return [{ path: `.claude/skills/${resource.id}/SKILL.md`, content: resource.content }];
    case 'agent':
      return [{ path: `.claude/agents/${resource.id}.md`, content: resource.content }];
    case 'prompt':
      return [{ path: `.claude/commands/${resource.id}.md`, content: commandContent(resource) }];
  }
};

const renderCodex = (resource: Resource): RenderedFile[] => {
  switch (resource.type) {
    case 'command':
      return [{ path: `.agents/commands/${resource.id}.md`, content: resource.content }];
    case 'skill':
      return [{ path: `.agents/skills/${resource.id}/SKILL.md`, content: resource.content }];
    case 'agent':
      return [{ path: `.agents/agents/${resource.id}.md`, content: resource.content }];
    case 'prompt':
      return [{ path: `.agents/prompts/${resource.id}.prompt.md`, content: resource.content }];
  }
};

const promptContent = (resource: Resource): string => {
  if (resource.type === 'prompt') return resource.content;
  return `# ${resource.title}\n\n${resource.description}\n\n${resource.content.trim()}\n`;
};

const commandContent = (resource: Resource): string => {
  if (resource.type === 'command') return resource.content;
  return `---\ndescription: ${JSON.stringify(resource.description)}\n---\n\n${promptContent(resource)}`;
};

const ruleContent = (resource: Resource): string =>
  `# ${resource.title}\n\n${resource.description}\n\n${resource.content.trim()}\n`;

const readTree = async (dir: string, root: string): Promise<RenderedFile[]> => {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const files: RenderedFile[] = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await readTree(path, root)));
      continue;
    }
    if (!entry.isFile()) continue;
    files.push({
      path: relative(root, path),
      content: await readFile(path, 'utf8'),
    });
  }

  return files.sort((a, b) => a.path.localeCompare(b.path));
};

export const writeRenderedFiles = async (
  root: string,
  files: RenderedFile[],
  force: boolean,
): Promise<{ written: number; skipped: number }> => {
  let written = 0;
  let skipped = 0;

  for (const file of files) {
    const target = resolve(root, file.path);
    const current = await readFile(target, 'utf8').catch(() => null);
    if (current === file.content) {
      skipped += 1;
      continue;
    }
    if (current !== null && !force) {
      console.log(`skip: ${file.path} exists; use --force to overwrite`);
      skipped += 1;
      continue;
    }

    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, file.content);
    console.log(`write: ${file.path}`);
    written += 1;
  }

  return { written, skipped };
};

export const pluginBundleFiles = async (name: string): Promise<RenderedFile[]> => {
  const files = await claudePluginFiles();
  return files.map((file) => ({ path: join(name, file.path), content: file.content }));
};

export const defaultPluginName = (): string => basename(packageRoot());
