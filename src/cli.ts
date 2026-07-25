#!/usr/bin/env node
import { resolve } from 'node:path';
import {
  isTarget,
  isPluginEcosystem,
  pluginBundleFiles,
  renderInstallFiles,
  writeRenderedFiles,
} from './installers.ts';
import { findResources, isResourceType, readResources } from './resources.ts';
import { validateResources } from './validate.ts';
import type { Resource, ResourceType, Target } from './types.ts';

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
      await listCommand(rest);
      return;
    case 'show':
      await showCommand(rest);
      return;
    case 'install':
      await installCommand(rest);
      return;
    case 'plugin':
      await pluginCommand(rest);
      return;
    case 'validate':
      await validateCommand();
      return;
    default:
      fail(`unknown command "${command}"`);
  }
};

const listCommand = async (args: string[]): Promise<void> => {
  const options = parseOptions(args);
  const type = optionalResourceType(options);
  const resources = (await readResources()).filter((resource) => !type || resource.type === type);

  for (const resource of resources) {
    console.log(`${resource.type}\t${resource.id}\t${resource.title}`);
  }
  console.log(`summary: ${resources.length} resources`);
};

const showCommand = async (args: string[]): Promise<void> => {
  const { refs } = splitArgs(args);
  const ref = resourceRefFromArgs(refs);

  const { resources, missing } = await findResources([ref]);
  if (missing.length) fail(`resource not found: ${missing.join(', ')}`);
  console.log(requiredResource(resources[0]).content);
};

const installCommand = async (args: string[]): Promise<void> => {
  const target = requiredTarget(args[0]);
  const { refs, options } = splitArgs(args.slice(1));
  const cwd = resolve(process.cwd(), stringOption(options, 'cwd') ?? '.');
  const force = booleanOption(options, 'force');
  const dryRun = booleanOption(options, 'dry-run');
  const type = optionalResourceType(options);
  const { resources, missing } = await findResources(refs);
  if (missing.length) fail(`resource not found: ${missing.join(', ')}`);

  const excluded = await excludedResources(options);
  const selected = resources.filter(
    (resource) => (!type || resource.type === type) && !excluded.has(resourceKey(resource)),
  );
  const files = renderInstallFiles(target, selected);
  const result = await writeRenderedFiles(cwd, files, { force, dryRun });

  console.log(`ok: ${dryRun ? 'planned' : 'installed'} ${target}`);
  console.log(
    `summary: ${selected.length} resources; wrote ${result.written}; planned ${result.planned}; skipped ${result.skipped}`,
  );
  console.log('next steps: restart or reload the target agent so it discovers the installed files');
};

const pluginCommand = async (args: string[]): Promise<void> => {
  const ecosystem = requiredPluginEcosystem(args[0]);

  const { options } = splitArgs(args.slice(1));
  const out = resolve(process.cwd(), stringOption(options, 'out') ?? '.');
  const name = stringOption(options, 'name') ?? 'meabed-agent-kit';
  const force = booleanOption(options, 'force');
  const dryRun = booleanOption(options, 'dry-run');
  const files = await pluginBundleFiles(ecosystem, name);
  const result = await writeRenderedFiles(out, files, { force, dryRun });

  console.log(`ok: ${dryRun ? 'planned' : 'wrote'} ${ecosystem} plugin bundle`);
  console.log(
    `summary: wrote ${result.written}; planned ${result.planned}; skipped ${result.skipped}`,
  );
  console.log(`next steps: add ${name} to a local ${ecosystem} plugin source and reload the agent`);
};

const validateCommand = async (): Promise<void> => {
  const errors = await validateResources();
  if (errors.length) {
    for (const error of errors) console.error(`error: ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log('ok: resources are valid');
};

const splitArgs = (args: string[]): { refs: string[]; options: CliOptions } => {
  const refs: string[] = [];
  const optionArgs: string[] = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]!;
    if (!arg.startsWith('--')) {
      refs.push(arg);
      continue;
    }
    optionArgs.push(arg);
    const next = args[i + 1];
    if (next && !next.startsWith('--')) {
      optionArgs.push(next);
      i += 1;
    }
  }

  return { refs, options: parseOptions(optionArgs) };
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

const requiredTarget = (value: string | undefined): Target => {
  if (!value) return fail('install requires a target');
  if (!isTarget(value)) return fail(`unsupported target "${value}"`);
  return value;
};

const requiredPluginEcosystem = (value: string | undefined): 'claude-code' | 'codex' => {
  if (!value || !isPluginEcosystem(value)) return fail('plugin requires claude-code or codex');
  return value;
};

const optionalResourceType = (options: CliOptions): ResourceType | null => {
  const value = stringOption(options, 'type');
  if (!value) return null;
  if (!isResourceType(value)) return fail(`unsupported resource type "${value}"`);
  return value;
};

const resourceRefFromArgs = (refs: string[]): string => {
  const [first, second] = refs;
  if (first && second && isResourceType(first)) return `${first}/${second}`;
  if (first) return first;
  return fail('show requires a resource id, for example: show skill/remove-trivial-tests');
};

const requiredResource = (resource: Resource | undefined): Resource => {
  if (resource) return resource;
  return fail('resource not found');
};

const stringOption = (options: CliOptions, key: string): string | undefined => {
  const value = options[key];
  return typeof value === 'string' ? value : undefined;
};

const booleanOption = (options: CliOptions, key: string): boolean => options[key] === true;

const excludedResources = async (options: CliOptions): Promise<Set<string>> => {
  const raw = stringOption(options, 'exclude');
  if (!raw) return new Set();
  const refs = raw
    .split(',')
    .map((ref) => ref.trim())
    .filter(Boolean);
  const { resources, missing } = await findResources(refs);
  if (missing.length) fail(`excluded resource not found: ${missing.join(', ')}`);
  return new Set(resources.map(resourceKey));
};

const resourceKey = (resource: Resource): string => `${resource.type}/${resource.id}`;

const printHelp = (): void => {
  console.log(`skills

Usage:
  skills list [--type skill|command|prompt|agent]
  skills show <id>
  skills show <type> <id>
  skills install <target> [id...] [--type skill|command|prompt|agent]
    [--exclude id,id] [--cwd .] [--force] [--dry-run]
  skills plugin <claude-code|codex> [--out ./plugins] [--name meabed-agent-kit]
    [--force] [--dry-run]
  skills validate

Targets:
  all, claude-code, codex, github-copilot, gemini-cli, opencode, cline,
  roo-code, devin

Examples:
  npx @meabed/skills list
  npx @meabed/skills install all --cwd . --dry-run
  npx @meabed/skills install codex --type skill --cwd .
  npx @meabed/skills plugin claude-code --out ./plugins
  npx @meabed/skills plugin codex --out ./plugins
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
