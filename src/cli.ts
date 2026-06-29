#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { findRecipe, readCatalog } from './catalog.ts';
import { generateAll } from './generate.ts';
import { packageRoot } from './paths.ts';
import { renderRecipe, isTarget } from './renderers.ts';
import { syncSite } from './site-sync.ts';
import { validateCatalog } from './validate.ts';
import type { Recipe, RenderedFile, Target } from './types.ts';

type CliOptions = Record<string, string | boolean>;

const main = async (): Promise<void> => {
  const [command = 'help', ...rest] = process.argv.slice(2);

  switch (command) {
    case 'help':
    case '--help':
    case '-h':
      printHelp();
      return;
    case 'list':
      await listCommand();
      return;
    case 'show':
      await showCommand(rest);
      return;
    case 'generate':
      await generateCommand();
      return;
    case 'sync-site':
      await syncSiteCommand(rest);
      return;
    case 'validate':
      await validateCommand();
      return;
    case 'export':
      await exportCommand(rest);
      return;
    case 'install':
      await installCommand(rest);
      return;
    default:
      fail(`unknown command "${command}"`);
  }
};

const listCommand = async (): Promise<void> => {
  const recipes = await readCatalog();
  for (const recipe of recipes) {
    console.log(`${recipe.id}\t${recipe.type}\t${recipe.title}`);
  }
  console.log(`summary: ${recipes.length} resources`);
};

const showCommand = async (args: string[]): Promise<void> => {
  const id = requiredArg(args[0], 'show requires a resource id');
  const options = parseOptions(args.slice(1));
  const format = stringOption(options, 'format') ?? 'agent-prompt';
  const recipe = await requiredRecipe(id);

  if (format === 'recipe') {
    console.log(recipe.body);
    return;
  }

  const target = formatToTarget(format);
  console.log(renderRecipe(recipe, target).content);
};

const generateCommand = async (): Promise<void> => {
  const written = await generateAll();
  console.log(`ok: generated adapter files`);
  console.log(`summary: wrote ${written.length} files plus registry.json`);
};

const syncSiteCommand = async (args: string[]): Promise<void> => {
  const options = parseOptions(args);
  const site = stringOption(options, 'site') ?? '../site';
  const write = booleanOption(options, 'write');
  const result = await syncSite({ siteRoot: resolve(process.cwd(), site), write });

  if (!write) {
    console.log('summary: dry run, no files written');
    console.log(
      `next steps: rerun with --write to update ${result.recipes.length} catalog entries`,
    );
    return;
  }

  console.log(`ok: synced site AI resources`);
  console.log(`summary: wrote ${result.paths.length} catalog recipes`);
  console.log('next steps: run `bun run generate && bun run validate`');
};

const validateCommand = async (): Promise<void> => {
  const errors = await validateCatalog();
  if (errors.length) {
    for (const error of errors) console.error(`error: ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log('ok: catalog is valid');
};

const exportCommand = async (args: string[]): Promise<void> => {
  const first = args[0];
  const id = first && !first.startsWith('--') ? first : null;
  const options = parseOptions(id ? args.slice(1) : args);
  const target = requiredTarget(options);
  const out = resolve(process.cwd(), stringOption(options, 'out') ?? '.');
  const force = booleanOption(options, 'force');
  const recipes = id ? [await requiredRecipe(id)] : await readCatalog();
  const files = recipes.map((recipe) => renderRecipe(recipe, target));
  const result = await writeRenderedFiles(out, files, force);

  console.log(`ok: exported ${target}`);
  console.log(`summary: wrote ${result.written}; skipped ${result.skipped}`);
};

const installCommand = async (args: string[]): Promise<void> => {
  const id = requiredArg(args[0], 'install requires a resource id');
  const options = parseOptions(args.slice(1));
  const target = requiredTarget(options);
  const cwd = resolve(process.cwd(), stringOption(options, 'cwd') ?? '.');
  const force = booleanOption(options, 'force');
  const recipe = await requiredRecipe(id);
  const rendered = renderRecipe(recipe, target);
  const result = await writeRenderedFiles(cwd, [rendered], force);

  console.log(`ok: installed ${id} for ${target}`);
  console.log(`summary: wrote ${result.written}; skipped ${result.skipped}`);
};

const requiredRecipe = async (id: string): Promise<Recipe> => {
  const recipe = await findRecipe(id);
  if (recipe) return recipe;
  return fail(`resource not found: ${id}`);
};

const writeRenderedFiles = async (
  root: string,
  files: RenderedFile[],
  force: boolean,
): Promise<{ written: number; skipped: number }> => {
  let written = 0;
  let skipped = 0;

  for (const file of files) {
    const target = resolve(root, file.path);
    const current = existsSync(target) ? await readFile(target, 'utf8') : null;
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

const parseOptions = (args: string[]): CliOptions => {
  const options: CliOptions = {};
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]!;
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith('--')) {
      options[key] = true;
      continue;
    }
    options[key] = next;
    i += 1;
  }
  return options;
};

const requiredTarget = (options: CliOptions): Target => {
  const value = stringOption(options, 'to');
  if (!value) return fail('missing --to target');
  if (!isTarget(value)) return fail(`unsupported target "${value}"`);
  return value;
};

const formatToTarget = (format: string): Target => {
  if (format === 'claude-skill') return 'claude-code';
  if (format === 'vscode-prompt') return 'vscode-copilot';
  if (format === 'gemini-command') return 'gemini-cli';
  if (format === 'opencode-command') return 'opencode';
  if (format === 'cline-rule') return 'cline';
  if (format === 'roo-rule') return 'roo-code';
  if (format === 'codex-prompt') return 'codex';
  if (isTarget(format)) return format;
  return fail(`unsupported format "${format}"`);
};

const requiredArg = (value: string | undefined, message: string): string => {
  if (value) return value;
  return fail(message);
};

const stringOption = (options: CliOptions, key: string): string | undefined => {
  const value = options[key];
  return typeof value === 'string' ? value : undefined;
};

const booleanOption = (options: CliOptions, key: string): boolean => options[key] === true;

const printHelp = (): void => {
  console.log(`meabed-agent

Usage:
  meabed-agent list
  meabed-agent show <id> [--format agent-prompt|claude-skill|vscode-prompt|gemini-command|opencode-command|cline-rule|roo-rule|codex-prompt|recipe]
  meabed-agent install <id> --to <target> [--cwd .] [--force]
  meabed-agent export [id] --to <target> [--out .] [--force]
  meabed-agent sync-site --site ../site [--write]
  meabed-agent generate
  meabed-agent validate

Targets:
  agent-prompt, claude-code, codex, vscode-copilot, gemini-cli, opencode, cline, roo-code, windsurf-devin

Package root:
  ${packageRoot()}
`);
};

const fail = (message: string): never => {
  console.error(`error: ${message}`);
  process.exit(1);
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'unknown failure';
  console.error(`error: ${message}`);
  process.exit(1);
});
