import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { recipeToMarkdown } from './catalog.ts';
import { splitFrontmatter } from './frontmatter.ts';
import { catalogDir, packageRoot } from './paths.ts';
import { RECIPE_TYPES, type Recipe, type RecipeType } from './types.ts';

export const syncSite = async ({
  siteRoot,
  root = packageRoot(),
  write,
}: {
  siteRoot: string;
  root?: string;
  write: boolean;
}): Promise<{ recipes: Recipe[]; paths: string[] }> => {
  const contentDir = resolve(siteRoot, 'src/content/ai');
  const files = (await readdir(contentDir)).filter((file) => file.endsWith('.mdx')).sort();
  const recipes: Recipe[] = [];
  const paths: string[] = [];

  for (const file of files) {
    const absolutePath = join(contentDir, file);
    const raw = await readFile(absolutePath, 'utf8');
    const recipe = siteMdxToRecipe(raw, file, siteRoot);
    recipes.push(recipe);
    paths.push(join('catalog', recipe.id, 'recipe.md'));

    if (write) {
      const target = join(catalogDir(root), recipe.id, 'recipe.md');
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, recipeToMarkdown(recipe));
    }
  }

  return { recipes, paths };
};

export const siteMdxToRecipe = (raw: string, file: string, siteRoot: string): Recipe => {
  const { attrs, body } = splitFrontmatter(raw);
  const id = file.replace(/\.mdx$/, '');
  const topics = topicsFrom(attrs.topics);
  const type = typeFrom(attrs.meta, topics[0], attrs.kind);
  const sourceArtifact = stringFrom(attrs.source);
  const date = stringFrom(attrs.date);

  return {
    id,
    title: requiredString(attrs.title, `${file}: title`),
    summary: requiredString(attrs.dek, `${file}: dek`),
    type,
    topics,
    body: body.trim(),
    siteUrl: `https://mo.ca/ai/${id}`,
    sourcePath: relative(siteRoot, join(siteRoot, 'src/content/ai', file)),
    ...(date ? { date } : {}),
    ...(sourceArtifact ? { sourceArtifact } : {}),
  };
};

const topicsFrom = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
};

const typeFrom = (meta: unknown, topic: string | undefined, kind: unknown): RecipeType => {
  const candidate = stringFrom(meta) ?? topic ?? stringFrom(kind) ?? 'resource';
  if (isRecipeType(candidate)) return candidate;
  return 'resource';
};

const isRecipeType = (value: string): value is RecipeType =>
  RECIPE_TYPES.some((type) => type === value);

const requiredString = (value: unknown, field: string): string => {
  if (typeof value === 'string' && value.trim()) return value.trim();
  throw new Error(`Missing required site frontmatter: ${field}`);
};

const stringFrom = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;
