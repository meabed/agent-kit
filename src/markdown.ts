import { splitFrontmatter } from './frontmatter.ts';
import type { Recipe } from './types.ts';

type Fence = {
  title: string | null;
  body: string;
};

export const stripFrontmatter = (raw: string): string => splitFrontmatter(raw).body.trim();

export const agentPromptMarkdown = (recipe: Recipe): string => {
  const context = [
    `- Resource: ${recipe.title}`,
    `- Type: ${recipe.type}`,
    recipe.siteUrl ? `- Site URL: ${recipe.siteUrl}` : null,
    recipe.sourceArtifact ? `- Source artifact: \`${recipe.sourceArtifact}\`` : null,
    recipe.topics.length ? `- Topics: ${recipe.topics.join(', ')}` : null,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');

  return `# Agent prompt: ${recipe.title}

You are an AI coding agent working inside a real repository. Use this resource as an operating instruction for the current user request.

## What this is

${recipe.summary}

${context}

## How to use it

1. Read the user's current request and the nearest repo instructions before editing.
2. Apply the resource below as a workflow, command, prompt, skill, or repo rule according to its type.
3. Keep the change scoped to the user's request and the codebase's existing patterns.
4. Name the behavior, risk, or decision the resource is meant to protect.
5. Make the smallest useful edit, then run the focused check and the repo's normal verification gate.
6. Report what changed, what passed, and any risk that remains.

## Resource to apply

${recipe.body.trim()}
`;
};

export const embeddedArtifact = (recipe: Recipe): string | null => {
  const fences = [...readFences(recipe.body)];
  if (!fences.length) return null;

  const source = recipe.sourceArtifact;
  if (source) {
    const matched = fences.find(
      (fence) => fence.title === source || fence.title?.endsWith(`/${source}`),
    );
    if (matched) return matched.body.trim();
  }

  const typed = fences.find((fence) => fence.title?.includes('/'));
  return typed?.body.trim() ?? null;
};

export const compactDescription = (value: string, limit = 180): string => {
  const cleaned = value.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= limit) return cleaned;

  const clipped = cleaned.slice(0, Math.max(0, limit - 3));
  const boundary = clipped.lastIndexOf(' ');
  const text = boundary > 80 ? clipped.slice(0, boundary) : clipped;
  return `${text}...`;
};

const readFences = function* (body: string): Generator<Fence> {
  const fencePattern = /^```([^\n]*)\n([\s\S]*?)^```/gm;
  for (const match of body.matchAll(fencePattern)) {
    const info = match[1] ?? '';
    const content = match[2] ?? '';
    yield {
      title: titleFromFenceInfo(info),
      body: content,
    };
  }
};

const titleFromFenceInfo = (info: string): string | null => {
  const match = /\btitle=(?:"([^"]+)"|'([^']+)')/.exec(info);
  return match?.[1] ?? match?.[2] ?? null;
};
