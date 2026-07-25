import { describe, expect, it } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { analyzeCommits } from '@semantic-release/commit-analyzer';

const root = resolve(import.meta.dirname, '..');
const releaseConfig: unknown = JSON.parse(await readFile(resolve(root, '.releaserc.json'), 'utf8'));

if (!isRecord(releaseConfig) || !Array.isArray(releaseConfig.plugins)) {
  throw new Error('release plugin configuration is missing');
}

const analyzerEntry = releaseConfig.plugins.find(
  (plugin) => Array.isArray(plugin) && plugin[0] === '@semantic-release/commit-analyzer',
);
if (!Array.isArray(analyzerEntry) || !isRecord(analyzerEntry[1])) {
  throw new Error('commit analyzer configuration is missing');
}

const analyzerOptions = analyzerEntry[1];

async function releaseType(...messages: string[]) {
  return analyzeCommits(analyzerOptions, {
    commits: messages.map((message, index) => ({ hash: String(index), message })),
    cwd: root,
    logger: { log: () => undefined },
  });
}

describe('release commit policy', () => {
  it.each([
    ['feat(skills): add a reusable workflow', 'minor'],
    ['fix(cli): preserve nested skill files', 'patch'],
    ['perf(cli): reduce resource discovery work', 'patch'],
    ['refactor(cli): simplify target mapping', 'patch'],
    ['revert: feat(skills): add an invalid workflow', 'patch'],
    ['style(cli): normalize operator output', 'patch'],
    ['build: bundle the executable', 'patch'],
    ['i18n: clarify agent-facing instructions', 'patch'],
    ['chore(deps): update semantic-release', 'patch'],
    ['feat(cli)!: remove an obsolete option', 'major'],
    ['fix(cli): replace an old format\n\nBREAKING CHANGE: old installs are unsupported', 'major'],
  ] as const)('classifies %s as %s', async (message, expected) => {
    expect(await releaseType(message)).toBe(expected);
  });

  it.each([
    'docs: clarify installation',
    'test: cover one target',
    'ci: update validation',
    'chore: tidy repository metadata',
  ])('does not publish for %s', async (message) => {
    expect(await releaseType(message)).toBeNull();
  });

  it('uses the highest release required by all commits', async () => {
    expect(await releaseType('fix(cli): repair install', 'feat(skills): add workflow')).toBe(
      'minor',
    );
  });
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
