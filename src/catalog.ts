import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { formatFrontmatter, splitFrontmatter } from './frontmatter.ts';
import { catalogDir } from './paths.ts';
import { RECIPE_TYPES, type Recipe, type RecipeType } from './types.ts';

export const readCatalog = async (rootDir = catalogDir()): Promise<Recipe[]> => {
  const entries = await readdir(rootDir, { withFileTypes: true }).catch(() => []);
  const recipes: Recipe[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const filePath = join(rootDir, entry.name, 'recipe.md');
    const raw = await readFile(filePath, 'utf8').catch(() => null);
    if (raw === null) continue;
    recipes.push(recipeFromMarkdown(raw, filePath));
  }

  return recipes.sort((a, b) => a.id.localeCompare(b.id));
};

export const findRecipe = async (id: string, rootDir = catalogDir()): Promise<Recipe | null> => {
  const recipes = await readCatalog(rootDir);
  return recipes.find((recipe) => recipe.id === id) ?? null;
};

export const recipeFromMarkdown = (raw: string, filePath = 'recipe.md'): Recipe => {
  const { attrs, body } = splitFrontmatter(raw);
  const id = requireString(attrs.id, 'id', filePath);
  const title = requireString(attrs.title, 'title', filePath);
  const summary = requireString(attrs.summary, 'summary', filePath);
  const topics = readStringList(attrs.topics);
  const type = readRecipeType(attrs.type, topics[0], filePath);
  const date = readOptionalString(attrs.date);
  const sourceArtifact = readOptionalString(attrs.sourceArtifact);
  const siteUrl = readOptionalString(attrs.siteUrl);
  const sourcePath = readOptionalString(attrs.sourcePath);

  return {
    id,
    title,
    summary,
    type,
    topics,
    body: body.trim(),
    ...(date ? { date } : {}),
    ...(sourceArtifact ? { sourceArtifact } : {}),
    ...(siteUrl ? { siteUrl } : {}),
    ...(sourcePath ? { sourcePath } : {}),
  };
};

export const recipeToMarkdown = (recipe: Recipe): string => {
  const attrs: Record<string, string | string[]> = {
    id: recipe.id,
    title: recipe.title,
    summary: recipe.summary,
    type: recipe.type,
    topics: recipe.topics,
  };

  if (recipe.date) attrs.date = recipe.date;
  if (recipe.sourceArtifact) attrs.sourceArtifact = recipe.sourceArtifact;
  if (recipe.siteUrl) attrs.siteUrl = recipe.siteUrl;
  if (recipe.sourcePath) attrs.sourcePath = recipe.sourcePath;

  return `${formatFrontmatter(attrs)}\n${recipe.body.trim()}\n`;
};

export const catalogPathFor = (id: string, rootDir = catalogDir()): string =>
  resolve(rootDir, id, 'recipe.md');

const requireString = (value: unknown, field: string, filePath: string): string => {
  if (typeof value === 'string' && value.trim()) return value.trim();
  throw new Error(`${filePath}: missing required string frontmatter field "${field}"`);
};

const readOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

const readStringList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
};

const readRecipeType = (
  value: unknown,
  fallback: string | undefined,
  filePath: string,
): RecipeType => {
  const candidate = typeof value === 'string' && value ? value : (fallback ?? 'resource');
  if (isRecipeType(candidate)) return candidate;
  throw new Error(`${filePath}: unsupported recipe type "${candidate}"`);
};

const isRecipeType = (value: string): value is RecipeType =>
  RECIPE_TYPES.some((type) => type === value);
