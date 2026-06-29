#!/usr/bin/env node
import { resolve } from 'node:path';
import {
  isTarget,
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
  const type = optionalResourceType(options);
  const { resources, missing } = await findResources(refs);
  if (missing.length) fail(`resource not found: ${missing.join(', ')}`);

  const selected = resources.filter((resource) => !type || resource.type === type);
  const files = renderInstallFiles(target, selected);
  const result = await writeRenderedFiles(cwd, files, force);

  console.log(`ok: installed ${target}`);
  console.log(
    `summary: ${selected.length} resources; wrote ${result.written}; skipped ${result.skipped}`,
  );
};

const pluginCommand = async (args: string[]): Promise<void> => {
  const ecosystem = args[0];
  if (ecosystem !== 'claude-code') fail('only claude-code plugin bundles are supported');

  const { options } = splitArgs(args.slice(1));
  const out = resolve(process.cwd(), stringOption(options, 'out') ?? '.');
  const name = stringOption(options, 'name') ?? 'meabed-agent-kit';
  const force = booleanOption(options, 'force');
  const files = await pluginBundleFiles(name);
  const result = await writeRenderedFiles(out, files, force);

  console.log('ok: wrote claude-code plugin bundle');
  console.log(`summary: wrote ${result.written}; skipped ${result.skipped}`);
  console.log(`next steps: point Claude Code at ${name} as a local plugin directory`);
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

const printHelp = (): void => {
  console.log(`skills

Usage:
  skills list [--type skill|command|prompt|agent]
  skills show <id>
  skills show <type> <id>
  skills install <target> [id...] [--type skill|command|prompt|agent] [--cwd .] [--force]
  skills plugin claude-code [--out ./plugins] [--name meabed-agent-kit] [--force]
  skills validate

Targets:
  claude-code, codex, vscode-copilot, gemini-cli, opencode, cline, roo-code, windsurf-devin

Examples:
  npx @meabed/skills list
  npx @meabed/skills install claude-code --cwd .
  npx @meabed/skills plugin claude-code --out ./plugins
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
