import { describe, expect, it } from 'bun:test';
import { renderInstallFiles } from '../src/installers.ts';
import { readResources } from '../src/resources.ts';

describe('resources', () => {
  it('discovers hand-authored resources from root directories', async () => {
    const resources = await readResources();

    expect(
      resources.some((resource) => resource.type === 'command' && resource.id === 'audit'),
    ).toBe(true);
    expect(
      resources.some(
        (resource) => resource.type === 'skill' && resource.id === 'remove-trivial-tests',
      ),
    ).toBe(true);
    expect(
      resources.some((resource) => resource.type === 'prompt' && resource.id === 'review'),
    ).toBe(true);
    expect(
      resources.some(
        (resource) =>
          resource.type === 'agent' && resource.id === 'multi-agent-codebase-instructions',
      ),
    ).toBe(true);
  });

  it('maps resources to claude-code install paths', async () => {
    const resources = await readResources();
    const selected = resources.filter((resource) =>
      ['audit', 'remove-trivial-tests', 'multi-agent-codebase-instructions'].includes(resource.id),
    );
    const files = renderInstallFiles('claude-code', selected);
    const paths = files.map((file) => file.path).sort();

    expect(paths).toContain('.claude/commands/audit.md');
    expect(paths).toContain('.claude/skills/remove-trivial-tests/SKILL.md');
    expect(paths).toContain('.claude/agents/multi-agent-codebase-instructions.md');
  });
});
