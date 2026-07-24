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

describe('resources', () => {
  it('discovers the curated hand-authored catalog', async () => {
    const resources = await readResources();

    expect(resources).toHaveLength(36);
    expect(resource(resources, 'command', 'verify')).toBeDefined();
    expect(resource(resources, 'command', 'pyramid')).toBeDefined();
    expect(resource(resources, 'prompt', 'pyramid-rewrite')).toBeDefined();
    expect(resource(resources, 'skill', 'authentic-writing')).toBeDefined();
    expect(resource(resources, 'skill', 'pyramid-communication')).toBeDefined();
    expect(resource(resources, 'skill', 'repository-scope-guardrails')).toBeDefined();
    expect(resource(resources, 'agent', 'instruction-architect')).toBeDefined();

    expect(resources.some((item) => item.id.startsWith('skill-'))).toBe(false);
    expect(resources.some((item) => item.id === 'add-discord-notify')).toBe(false);
    expect(resources.some((item) => item.id === 'agents-house-rules')).toBe(false);
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
  it('maps every resource kind to native target paths', async () => {
    const resources = await readResources();
    const selected = [
      resource(resources, 'command', 'audit'),
      resource(resources, 'prompt', 'pyramid-rewrite'),
      resource(resources, 'skill', 'pyramid-communication'),
      resource(resources, 'agent', 'instruction-architect'),
    ];

    const expected = new Map<Target, string[]>([
      [
        'claude-code',
        [
          '.claude/agents/instruction-architect.md',
          '.claude/commands/audit.md',
          '.claude/commands/pyramid-rewrite.md',
          '.claude/skills/pyramid-communication/SKILL.md',
        ],
      ],
      [
        'codex',
        [
          '.agents/skills/audit/SKILL.md',
          '.agents/skills/instruction-architect/SKILL.md',
          '.agents/skills/pyramid-communication/SKILL.md',
          '.agents/skills/pyramid-rewrite/SKILL.md',
          '.codex/agents/instruction-architect.toml',
        ],
      ],
      [
        'github-copilot',
        [
          '.github/agents/instruction-architect.md',
          '.github/prompts/audit.prompt.md',
          '.github/prompts/pyramid-rewrite.prompt.md',
          '.github/skills/pyramid-communication/SKILL.md',
        ],
      ],
      [
        'gemini-cli',
        [
          '.gemini/agents/instruction-architect.md',
          '.gemini/commands/audit.toml',
          '.gemini/commands/pyramid-rewrite.toml',
          '.gemini/skills/pyramid-communication/SKILL.md',
        ],
      ],
      [
        'opencode',
        [
          '.opencode/agents/instruction-architect.md',
          '.opencode/commands/audit.md',
          '.opencode/commands/pyramid-rewrite.md',
          '.opencode/skills/pyramid-communication/SKILL.md',
        ],
      ],
      [
        'cline',
        [
          '.cline/skills/instruction-architect/SKILL.md',
          '.cline/skills/pyramid-communication/SKILL.md',
          '.clinerules/workflows/audit.md',
          '.clinerules/workflows/pyramid-rewrite.md',
        ],
      ],
      [
        'roo-code',
        [
          '.roo/commands/audit.md',
          '.roo/commands/pyramid-rewrite.md',
          '.roo/skills/instruction-architect/SKILL.md',
          '.roo/skills/pyramid-communication/SKILL.md',
        ],
      ],
      [
        'windsurf',
        [
          '.windsurf/skills/instruction-architect/SKILL.md',
          '.windsurf/skills/pyramid-communication/SKILL.md',
          '.windsurf/workflows/audit.md',
          '.windsurf/workflows/pyramid-rewrite.md',
        ],
      ],
      [
        'devin',
        [
          '.agents/skills/audit/SKILL.md',
          '.agents/skills/instruction-architect/SKILL.md',
          '.agents/skills/pyramid-communication/SKILL.md',
          '.agents/skills/pyramid-rewrite/SKILL.md',
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
    expect(paths).toContain('.claude/commands/pyramid.md');
    expect(paths).toContain('.github/prompts/pyramid-rewrite.prompt.md');
    expect(paths).toContain('.gemini/commands/pyramid.toml');
    expect(paths).toContain('.opencode/agents/instruction-architect.md');
    expect(paths).toContain('.cline/skills/authentic-writing/SKILL.md');
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
    expect(paths).toContain('test-agent-kit/commands/pyramid-rewrite.md');
    expect(paths).toContain('test-agent-kit/skills/pyramid-communication/SKILL.md');
    expect(paths).toContain('test-agent-kit/skills/pyramid-communication/agents/openai.yaml');
    expect(paths).toContain('test-agent-kit/agents/instruction-architect.md');
  });

  it('builds a Codex plugin with the complete catalog adapted as skills', async () => {
    const files = await pluginBundleFiles('codex', 'test-agent-kit');
    const paths = files.map((file) => file.path);

    expect(paths).toContain('test-agent-kit/.codex-plugin/plugin.json');
    expect(paths).toContain('test-agent-kit/skills/pyramid/SKILL.md');
    expect(paths).toContain('test-agent-kit/skills/pyramid-rewrite/SKILL.md');
    expect(paths).toContain('test-agent-kit/skills/pyramid-communication/SKILL.md');
    expect(paths).toContain('test-agent-kit/skills/instruction-architect/SKILL.md');
  });
});
