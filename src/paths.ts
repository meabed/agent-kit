import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const packageRoot = () => resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const catalogDir = (root = packageRoot()) => resolve(root, 'catalog');

export const generatedDir = (root = packageRoot()) => resolve(root, 'generated');
