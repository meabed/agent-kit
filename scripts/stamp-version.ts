import { readFile, writeFile } from 'node:fs/promises';

const manifestPaths = [
  'package.json',
  '.claude-plugin/plugin.json',
  '.codex-plugin/plugin.json',
] as const;

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
  fail(`invalid semantic version "${version ?? ''}"`);
}

for (const path of manifestPaths) {
  const url = new URL(`../${path}`, import.meta.url);
  const manifest: unknown = JSON.parse(await readFile(url, 'utf8'));
  if (!isRecord(manifest)) fail(`${path} does not contain a JSON object`);

  manifest.version = version;
  await writeFile(url, `${JSON.stringify(manifest, null, 2)}\n`);
}

console.log(`ok: stamped release version ${version}`);
console.log(`summary: updated ${manifestPaths.length} package and plugin manifests`);
console.log('next steps: verify the release metadata and publish the package');

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}
