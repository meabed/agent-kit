import { readResources } from './resources.ts';
import { RESOURCE_TYPES, type Resource } from './types.ts';

export const validateResources = async (): Promise<string[]> => {
  const resources = await readResources();
  const errors: string[] = [];
  const seen = new Set<string>();

  for (const resource of resources) {
    errors.push(...validateResource(resource, seen));
  }

  for (const type of RESOURCE_TYPES) {
    if (!resources.some((resource) => resource.type === type)) {
      errors.push(`missing resource type: ${type}`);
    }
  }

  if (!resources.length) errors.push('no resources found');
  return errors;
};

const validateResource = (resource: Resource, seen: Set<string>): string[] => {
  const errors: string[] = [];
  const key = `${resource.type}/${resource.id}`;

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(resource.id)) {
    errors.push(`${key}: id must be kebab-case`);
  }
  if (seen.has(key)) errors.push(`${key}: duplicate resource`);
  seen.add(key);
  if (resource.title.length < 4) errors.push(`${key}: title is too short`);
  if (resource.description.length < 12) errors.push(`${key}: description is too short`);
  if (!resource.content.trim()) errors.push(`${key}: content is empty`);
  if (forbiddenOriginPattern.test(resource.content)) {
    errors.push(`${key}: remove publishing/origin references from the resource`);
  }

  return errors;
};

const forbiddenOriginPattern = /\b(mo\.ca|src\/content|siteUrl|sync-site)\b/i;
