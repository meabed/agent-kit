import { readFile } from 'node:fs/promises';

const manifestPaths = [
  'package.json',
  '.claude-plugin/plugin.json',
  '.codex-plugin/plugin.json',
] as const;

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

const releaseTag = process.env.RELEASE_TAG;
if (releaseTag && releaseTag !== `v${packageVersion}`) {
  fail(`release tag ${releaseTag} does not match package version v${packageVersion}`);
}

console.log(`ok: release metadata matches version ${packageVersion}`);
console.log(`summary: ${manifestPaths.length} manifests use version ${packageVersion}`);
console.log(`next steps: publish GitHub Release v${packageVersion} from this commit`);

async function readVersion(path: string): Promise<string> {
  const content = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
  const manifest: unknown = JSON.parse(content);

  if (!isRecord(manifest) || typeof manifest.version !== 'string' || !manifest.version.trim()) {
    fail(`${path} does not define a version`);
  }

  return manifest.version;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}
