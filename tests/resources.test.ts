import { describe, expect, it } from 'bun:test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pluginBundleFiles, renderInstallFiles, writeRenderedFiles } from '../src/installers.ts';
import { readResources } from '../src/resources.ts';
import { validateResources } from '../src/validate.ts';
import type { Resource, Target } from '../src/types.ts';

const resource = (resources: Resource[], type: Resource['type'], id: string): Resource => {
  const found = resources.find((item) => item.type === type && item.id === id);
  if (!found) throw new Error(`missing test resource: ${type}/${id}`);
  return found;
};

const optionalAgent = {
  id: 'test-agent',
  type: 'agent',
  title: 'Test agent',
  description: 'Test optional specialist-agent installation paths.',
  path: 'agents/test-agent.md',
  content:
    '---\nname: test-agent\ndescription: Test optional agent installation.\n---\n\n# Test agent\n\nFollow the requested test workflow.\n',
  files: [],
} satisfies Resource;

describe('resources', () => {
  it('preserves source-defined resource names', async () => {
    const resources = await readResources();
    const reportSkillIds = [
      'compress-worklog',
      'docs-and-diagrams',
      'migration-parity-check',
      'parallel-agent-execution',
      'root-cause-investigation',
      'ui-visual-verification',
      'writing-tests',
    ];

    expect(resources).toHaveLength(28);
    for (const id of reportSkillIds) expect(resource(resources, 'skill', id)).toBeDefined();
    expect(resource(resources, 'skill', 'pyramid-communication')).toBeDefined();
    expect(resource(resources, 'command', 'verify')).toBeDefined();
    expect(resource(resources, 'prompt', 'review')).toBeDefined();

    expect(resources.some((item) => item.type === 'agent')).toBe(false);
    expect(resources.some((item) => item.id.startsWith('skill-'))).toBe(false);
    for (const removed of [
      'add-discord-notify',
      'agents-house-rules',
      'authentic-writing',
      'authentic-writing-tone',
      'domain-watcher',
      'instruction-architect',
      'observability-and-logging',
      'php-to-python-migration',
      'pyramid',
      'pyramid-rewrite',
      'pyramid-skill',
      'repository-scope-guardrails',
    ]) {
      expect(resources.some((item) => item.id === removed)).toBe(false);
    }
  });

  it('preserves complete skill folders', async () => {
    const resources = await readResources();
    const pyramid = resource(resources, 'skill', 'pyramid-communication');

    expect(pyramid.files.map((file) => file.path)).toEqual(['agents/openai.yaml']);
    expect(new TextDecoder().decode(pyramid.files[0]?.content)).toContain('$pyramid-communication');

    const files = renderInstallFiles('codex', [pyramid]);
    expect(files.map((file) => file.path)).toContain(
      '.agents/skills/pyramid-communication/agents/openai.yaml',
    );
  });

  it('passes resource structure and privacy validation', async () => {
    expect(await validateResources()).toEqual([]);
  });
});

describe('target adapters', () => {
  it('maps each supported resource type to target paths', async () => {
    const resources = await readResources();
    const selected = [
      resource(resources, 'command', 'audit'),
      resource(resources, 'prompt', 'review'),
      resource(resources, 'skill', 'pyramid-communication'),
      optionalAgent,
    ];

    const expected = new Map<Target, string[]>([
      [
        'claude-code',
        [
          '.claude/agents/test-agent.md',
          '.claude/commands/audit.md',
          '.claude/commands/review.md',
          '.claude/skills/pyramid-communication/SKILL.md',
        ],
      ],
      [
        'codex',
        [
          '.agents/skills/audit/SKILL.md',
          '.agents/skills/pyramid-communication/SKILL.md',
          '.agents/skills/review/SKILL.md',
          '.agents/skills/test-agent/SKILL.md',
          '.codex/agents/test-agent.toml',
        ],
      ],
      [
        'github-copilot',
        [
          '.github/agents/test-agent.md',
          '.github/prompts/audit.prompt.md',
          '.github/prompts/review.prompt.md',
          '.github/skills/pyramid-communication/SKILL.md',
        ],
      ],
      [
        'gemini-cli',
        [
          '.gemini/agents/test-agent.md',
          '.gemini/commands/audit.toml',
          '.gemini/commands/review.toml',
          '.gemini/skills/pyramid-communication/SKILL.md',
        ],
      ],
      [
        'opencode',
        [
          '.opencode/agents/test-agent.md',
          '.opencode/commands/audit.md',
          '.opencode/commands/review.md',
          '.opencode/skills/pyramid-communication/SKILL.md',
        ],
      ],
      [
        'cline',
        [
          '.cline/skills/pyramid-communication/SKILL.md',
          '.cline/skills/test-agent/SKILL.md',
          '.clinerules/workflows/audit.md',
          '.clinerules/workflows/review.md',
        ],
      ],
      [
        'roo-code',
        [
          '.roo/commands/audit.md',
          '.roo/commands/review.md',
          '.roo/skills/pyramid-communication/SKILL.md',
          '.roo/skills/test-agent/SKILL.md',
        ],
      ],
      [
        'windsurf',
        [
          '.windsurf/skills/pyramid-communication/SKILL.md',
          '.windsurf/skills/test-agent/SKILL.md',
          '.windsurf/workflows/audit.md',
          '.windsurf/workflows/review.md',
        ],
      ],
      [
        'devin',
        [
          '.agents/skills/audit/SKILL.md',
          '.agents/skills/pyramid-communication/SKILL.md',
          '.agents/skills/review/SKILL.md',
          '.agents/skills/test-agent/SKILL.md',
        ],
      ],
    ]);

    for (const [target, paths] of expected) {
      const rendered = renderInstallFiles(target, selected).map((file) => file.path);
      for (const path of paths) expect(rendered).toContain(path);
    }
  });

  it('deduplicates shared paths in an all-agent install', async () => {
    const resources = await readResources();
    const files = renderInstallFiles('all', resources);
    const paths = files.map((file) => file.path);

    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).toContain('.agents/skills/pyramid-communication/SKILL.md');
    expect(paths).toContain('.claude/commands/verify.md');
    expect(paths).toContain('.github/prompts/review.prompt.md');
    expect(paths).toContain('.gemini/commands/verify.toml');
    expect(paths).toContain('.opencode/commands/verify.md');
    expect(paths).toContain('.cline/skills/writing-tests/SKILL.md');
    expect(paths).toContain('.roo/commands/verify.md');
    expect(paths).toContain('.windsurf/workflows/verify.md');
  });

  it('preserves binary files in complete skill bundles', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agent-kit-test-'));
    const binary = Uint8Array.from([0, 255, 16, 128, 10]);
    const bundledSkill = {
      id: 'binary-skill',
      type: 'skill',
      title: 'Binary skill',
      description: 'Verify binary skill assets are copied without text decoding.',
      path: 'skills/binary-skill/SKILL.md',
      content:
        '---\nname: binary-skill\ndescription: Verify binary assets.\n---\n\n# Binary skill\n',
      files: [{ path: 'assets/sample.bin', content: binary }],
    } satisfies Resource;

    try {
      const files = renderInstallFiles('codex', [bundledSkill]);
      await writeRenderedFiles(root, files, { force: false, dryRun: false });
      const installed = await readFile(join(root, '.agents/skills/binary-skill/assets/sample.bin'));

      expect([...installed]).toEqual([...binary]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});

describe('plugin bundles', () => {
  it('builds a complete Claude Code plugin bundle', async () => {
    const files = await pluginBundleFiles('claude-code', 'test-agent-kit');
    const paths = files.map((file) => file.path);

    expect(paths).toContain('test-agent-kit/.claude-plugin/plugin.json');
    expect(paths).toContain('test-agent-kit/commands/review.md');
    expect(paths).toContain('test-agent-kit/skills/pyramid-communication/SKILL.md');
    expect(paths).toContain('test-agent-kit/skills/pyramid-communication/agents/openai.yaml');
    expect(paths.some((path) => path.startsWith('test-agent-kit/agents/'))).toBe(false);
  });

  it('builds a Codex plugin with the complete catalog adapted as skills', async () => {
    const files = await pluginBundleFiles('codex', 'test-agent-kit');
    const paths = files.map((file) => file.path);

    expect(paths).toContain('test-agent-kit/.codex-plugin/plugin.json');
    expect(paths).toContain('test-agent-kit/skills/verify/SKILL.md');
    expect(paths).toContain('test-agent-kit/skills/review/SKILL.md');
    expect(paths).toContain('test-agent-kit/skills/pyramid-communication/SKILL.md');
    expect(paths).toContain('test-agent-kit/skills/writing-tests/SKILL.md');
  });
});
