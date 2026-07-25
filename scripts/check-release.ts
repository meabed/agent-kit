import { readFile } from 'node:fs/promises';

const manifestPaths = [
  'package.json',
  '.claude-plugin/plugin.json',
  '.codex-plugin/plugin.json',
] as const;
const publishedResourcePaths = ['agents', 'commands', 'prompts', 'skills'] as const;

const versions = new Map<string, string>();

for (const path of manifestPaths) {
  versions.set(path, await readVersion(path));
}

const packageVersion = versions.get('package.json');
if (!packageVersion) fail('package.json does not define a version');
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(packageVersion)) {
  fail(`package.json has invalid semantic version "${packageVersion}"`);
}

for (const [path, version] of versions) {
  if (version !== packageVersion) {
    fail(`${path} version ${version} does not match package.json version ${packageVersion}`);
  }
}

const packageManifest = await readManifest('package.json');
const packageFiles = packageManifest.files;
if (!Array.isArray(packageFiles) || !packageFiles.every((value) => typeof value === 'string')) {
  fail('package.json files must be a list of paths');
}

for (const path of publishedResourcePaths) {
  if (!packageFiles.includes(path)) fail(`package.json files does not include ${path}`);
}

console.log(`ok: release metadata matches version ${packageVersion}`);
console.log(
  `summary: ${manifestPaths.length} manifests use version ${packageVersion}; ${publishedResourcePaths.length} resource directories are publishable`,
);
console.log('next steps: run the full validation gate before release');

async function readVersion(path: string): Promise<string> {
  const manifest = await readManifest(path);
  if (typeof manifest.version !== 'string' || !manifest.version.trim()) {
    fail(`${path} does not define a version`);
  }

  return manifest.version;
}

async function readManifest(path: string): Promise<Record<string, unknown>> {
  const content = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
  const manifest: unknown = JSON.parse(content);
  if (!isRecord(manifest)) fail(`${path} does not contain a JSON object`);
  return manifest;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}
