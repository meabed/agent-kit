import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { RenderedFile, WriteResult } from './types.ts';

export const writeFiles = async (
  root: string,
  files: RenderedFile[],
  options: { force?: boolean } = {},
): Promise<WriteResult> => {
  const written: string[] = [];
  const skipped: string[] = [];

  for (const file of files) {
    const target = join(root, file.path);
    const current = await readFile(target, 'utf8').catch(() => null);
    if (current === file.content) {
      skipped.push(file.path);
      continue;
    }
    if (current !== null && !options.force) {
      skipped.push(`${file.path} (exists; use --force to overwrite)`);
      continue;
    }

    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, file.content);
    written.push(file.path);
  }

  return { written, skipped };
};

export const replaceGeneratedDir = async (root: string): Promise<void> => {
  await rm(root, { recursive: true, force: true });
  await mkdir(root, { recursive: true });
};
