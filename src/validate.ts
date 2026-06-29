import { readCatalog } from './catalog.ts';
import { renderRecipe } from './renderers.ts';
import { TARGETS, type Recipe } from './types.ts';

export const validateCatalog = async (catalogRoot?: string): Promise<string[]> => {
  const recipes = await readCatalog(catalogRoot);
  const errors: string[] = [];
  const seen = new Set<string>();

  for (const recipe of recipes) {
    errors.push(...validateRecipe(recipe, seen));
    for (const target of TARGETS) {
      try {
        const rendered = renderRecipe(recipe, target);
        if (!rendered.content.trim()) errors.push(`${recipe.id}: ${target} rendered empty content`);
      } catch (error) {
        errors.push(`${recipe.id}: ${target} failed: ${messageFrom(error)}`);
      }
    }
  }

  if (!recipes.length) errors.push('catalog is empty');
  return errors;
};

const validateRecipe = (recipe: Recipe, seen: Set<string>): string[] => {
  const errors: string[] = [];

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(recipe.id)) {
    errors.push(`${recipe.id}: id must be kebab-case`);
  }
  if (seen.has(recipe.id)) errors.push(`${recipe.id}: duplicate id`);
  seen.add(recipe.id);
  if (recipe.title.length < 4) errors.push(`${recipe.id}: title is too short`);
  if (recipe.summary.length < 12) errors.push(`${recipe.id}: summary is too short`);
  if (!recipe.body.trim()) errors.push(`${recipe.id}: body is empty`);
  if (recipe.siteUrl && !recipe.siteUrl.startsWith('https://')) {
    errors.push(`${recipe.id}: siteUrl must be https`);
  }

  return errors;
};

const messageFrom = (error: unknown): string =>
  error instanceof Error ? error.message : 'unknown error';
