import { readdir, readFile } from 'node:fs/promises';
import { basename, join, relative } from 'node:path';
import { splitFrontmatter } from './frontmatter.ts';
import { packageRoot } from './paths.ts';
import { RESOURCE_TYPES, type Resource, type ResourceType } from './types.ts';

export const readResources = async (root = packageRoot()): Promise<Resource[]> => {
  const groups = await Promise.all([
    readCommands(root),
    readPrompts(root),
    readAgents(root),
    readSkills(root),
  ]);

  return groups.flat().sort(compareResources);
};

export const findResources = async (
  refs: string[],
  root = packageRoot(),
): Promise<{ resources: Resource[]; missing: string[] }> => {
  const all = await readResources(root);
  if (!refs.length) return { resources: all, missing: [] };

  const resources: Resource[] = [];
  const missing: string[] = [];

  for (const ref of refs) {
    const parsed = parseResourceRef(ref);
    const found = all.find(
      (resource) =>
        resource.id === parsed.id && (parsed.type === null || resource.type === parsed.type),
    );
    if (found) {
      resources.push(found);
      continue;
    }
    missing.push(ref);
  }

  return { resources, missing };
};

export const isResourceType = (value: string): value is ResourceType =>
  RESOURCE_TYPES.some((type) => type === value);

const readCommands = async (root: string): Promise<Resource[]> => {
  const dir = join(root, 'commands');
  const files = await markdownFiles(dir);
  return Promise.all(
    files.map(async (file) => {
      const content = await readFile(join(dir, file), 'utf8');
      const id = basename(file, '.md');
      const { attrs, body } = splitFrontmatter(content);
      const description = stringAttr(attrs.description) ?? titleize(id);
      return {
        id,
        type: 'command',
        title: titleFromBody(body, description),
        description,
        path: relative(root, join(dir, file)),
        content,
      } satisfies Resource;
    }),
  );
};

const readPrompts = async (root: string): Promise<Resource[]> => {
  const dir = join(root, 'prompts');
  const files = await readdir(dir).catch(() => []);
  return Promise.all(
    files
      .filter((file) => file.endsWith('.prompt.md'))
      .sort()
      .map(async (file) => {
        const content = await readFile(join(dir, file), 'utf8');
        const id = file.replace(/\.prompt\.md$/, '');
        const { attrs, body } = splitFrontmatter(content);
        return {
          id,
          type: 'prompt',
          title: titleFromBody(body, id),
          description: stringAttr(attrs.description) ?? titleFromBody(body, id),
          path: relative(root, join(dir, file)),
          content,
        } satisfies Resource;
      }),
  );
};

const readAgents = async (root: string): Promise<Resource[]> => {
  const dir = join(root, 'agents');
  const files = await markdownFiles(dir);
  return Promise.all(
    files.map(async (file) => {
      const content = await readFile(join(dir, file), 'utf8');
      const id = basename(file, '.md');
      const { attrs, body } = splitFrontmatter(content);
      return {
        id,
        type: 'agent',
        title: titleFromBody(body, id),
        description: stringAttr(attrs.description) ?? titleFromBody(body, id),
        path: relative(root, join(dir, file)),
        content,
      } satisfies Resource;
    }),
  );
};

const readSkills = async (root: string): Promise<Resource[]> => {
  const dir = join(root, 'skills');
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  return Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const path = join(dir, entry.name, 'SKILL.md');
        const content = await readFile(path, 'utf8');
        const { attrs, body } = splitFrontmatter(content);
        return {
          id: entry.name,
          type: 'skill',
          title: titleFromBody(body, entry.name),
          description: stringAttr(attrs.description) ?? titleFromBody(body, entry.name),
          path: relative(root, path),
          content,
        } satisfies Resource;
      }),
  );
};

const markdownFiles = async (dir: string): Promise<string[]> => {
  const files = await readdir(dir).catch(() => []);
  return files.filter((file) => file.endsWith('.md')).sort();
};

const titleFromBody = (body: string, fallback: string): string => {
  const heading = /^#\s+(.+)$/m.exec(body);
  if (heading?.[1]?.trim()) return heading[1].trim();
  return fallback.includes(' ') ? fallback : titleize(fallback);
};

const titleize = (value: string): string =>
  value
    .split('-')
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
    .join(' ');

const stringAttr = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

const parseResourceRef = (ref: string): { type: ResourceType | null; id: string } => {
  const [maybeType, maybeId] = ref.split('/');
  if (maybeType && maybeId && isResourceType(maybeType)) return { type: maybeType, id: maybeId };
  return { type: null, id: ref };
};

const compareResources = (a: Resource, b: Resource): number =>
  a.type.localeCompare(b.type) || a.id.localeCompare(b.id);
