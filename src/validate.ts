import { readResources } from './resources.ts';
import { splitFrontmatter } from './frontmatter.ts';
import { RESOURCE_TYPES, type Resource } from './types.ts';

export const validateResources = async (): Promise<string[]> => {
  const resources = await readResources();
  const errors: string[] = [];
  const seen = new Set<string>();
  const seenIds = new Set<string>();

  for (const resource of resources) {
    errors.push(...validateResource(resource, seen, seenIds));
  }

  for (const type of RESOURCE_TYPES) {
    if (!resources.some((resource) => resource.type === type)) {
      errors.push(`missing resource type: ${type}`);
    }
  }

  if (!resources.length) errors.push('no resources found');
  return errors;
};

const validateResource = (
  resource: Resource,
  seen: Set<string>,
  seenIds: Set<string>,
): string[] => {
  const errors: string[] = [];
  const key = `${resource.type}/${resource.id}`;
  const { attrs, body } = splitFrontmatter(resource.content);

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(resource.id)) {
    errors.push(`${key}: id must be kebab-case`);
  }
  if (seen.has(key)) errors.push(`${key}: duplicate resource`);
  seen.add(key);
  if (seenIds.has(resource.id)) errors.push(`${key}: id must be unique across resource types`);
  seenIds.add(resource.id);
  if (resource.title.length < 4) errors.push(`${key}: title is too short`);
  if (resource.description.length < 12) errors.push(`${key}: description is too short`);
  if (resource.description.length > 1024) errors.push(`${key}: description exceeds 1024 chars`);
  if (!resource.content.trim()) errors.push(`${key}: content is empty`);
  if (!body.trim()) errors.push(`${key}: instruction body is empty`);
  if (forbiddenOriginPattern.test(resource.content)) {
    errors.push(`${key}: remove publishing/origin references from the resource`);
  }
  if (privateMaterialPattern.test(resource.content)) {
    errors.push(`${key}: remove private paths, contact details, or credential material`);
  }
  if (articleWrapperPattern.test(resource.content)) {
    errors.push(`${key}: write direct agent instructions instead of an article wrapper`);
  }

  const description = stringAttr(attrs.description);
  if (!description) errors.push(`${key}: frontmatter description is required`);

  if (resource.type === 'skill') {
    if (stringAttr(attrs.name) !== resource.id) {
      errors.push(`${key}: frontmatter name must match the skill directory`);
    }
    const unexpected = Object.keys(attrs).filter((name) => !skillFrontmatterKeys.has(name));
    if (unexpected.length) {
      errors.push(`${key}: unsupported skill frontmatter: ${unexpected.join(', ')}`);
    }
    if (body.split(/\r?\n/).length > 500) errors.push(`${key}: SKILL.md exceeds 500 lines`);
    const metadata = resource.files.find((file) => file.path === 'agents/openai.yaml');
    if (!metadata) {
      errors.push(`${key}: missing agents/openai.yaml`);
    } else if (!decodeText(metadata.content).includes(`$${resource.id}`)) {
      errors.push(`${key}: agents/openai.yaml default prompt must mention $${resource.id}`);
    }
  }

  if (resource.type === 'agent' && stringAttr(attrs.name) !== resource.id) {
    errors.push(`${key}: frontmatter name must match the agent filename`);
  }

  for (const file of resource.files) {
    if (file.path.startsWith('/') || file.path.split(/[\\/]/).includes('..')) {
      errors.push(`${key}: bundled file escapes the skill directory: ${file.path}`);
    }
    if (!file.content.byteLength) errors.push(`${key}: bundled file is empty: ${file.path}`);
    if (isTextFile(file.path)) {
      const content = decodeText(file.content);
      if (forbiddenOriginPattern.test(content)) {
        errors.push(`${key}: remove publishing/origin references from ${file.path}`);
      }
      if (privateMaterialPattern.test(content)) {
        errors.push(`${key}: remove private or credential material from ${file.path}`);
      }
    }
  }

  return errors;
};

const forbiddenOriginPattern = /\b(mo\.ca|src\/content|siteUrl|sync-site)\b/i;
const privateMaterialPattern =
  /(?:\/Users\/|\/home\/[^/\s]+\/|[A-Za-z]:\\Users\\|BEGIN [A-Z ]*PRIVATE KEY|sk-[A-Za-z0-9_-]{16,}|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/;
const articleWrapperPattern = /(?:<(?:Decision|Principle|Tradeoff|Flow)\b|```md title=)/;
const skillFrontmatterKeys = new Set(['name', 'description']);
const textFilePattern =
  /(?:^|\/)(?:[^/.]+|\.[^/]+)$|\.(?:c|cc|conf|cpp|css|csv|go|h|hpp|html?|ini|java|js|json|jsx|md|mdx|mjs|py|rb|rs|sh|sql|svg|toml|ts|tsx|txt|ya?ml)$/i;

const stringAttr = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

const isTextFile = (path: string): boolean => textFilePattern.test(path);

const decodeText = (content: Uint8Array): string => new TextDecoder().decode(content);
