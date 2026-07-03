export type FrontmatterValue = string | string[] | boolean;

export type ParsedFrontmatter = {
  attrs: Record<string, FrontmatterValue>;
  body: string;
};

export const splitFrontmatter = (raw: string): ParsedFrontmatter => {
  if (!raw.startsWith('---\n') && !raw.startsWith('---\r\n')) {
    return { attrs: {}, body: raw };
  }

  const newline = raw.startsWith('---\r\n') ? '\r\n' : '\n';
  const end = raw.indexOf(`${newline}---${newline}`, 4);
  if (end === -1) return { attrs: {}, body: raw };

  const block = raw.slice(4, end);
  const body = raw.slice(end + `${newline}---${newline}`.length);
  return { attrs: parseFrontmatterBlock(block), body };
};

export const parseFrontmatterBlock = (block: string): Record<string, FrontmatterValue> => {
  const attrs: Record<string, FrontmatterValue> = {};
  let activeListKey: string | null = null;

  for (const rawLine of block.split(/\r?\n/)) {
    if (!rawLine.trim()) continue;

    const listItem = /^\s+-\s*(.+?)\s*$/.exec(rawLine);
    if (listItem && activeListKey) {
      const current = attrs[activeListKey];
      const list = Array.isArray(current) ? current : [];
      attrs[activeListKey] = [...list, parseScalar(listItem[1]!)];
      continue;
    }

    const pair = /^([A-Za-z0-9_-]+):(?:\s*(.*))?$/.exec(rawLine);
    if (!pair) continue;

    const key = pair[1]!;
    const rawValue = pair[2] ?? '';
    if (!rawValue.trim()) {
      attrs[key] = [];
      activeListKey = key;
      continue;
    }

    attrs[key] = parseValue(rawValue.trim());
    activeListKey = null;
  }

  return attrs;
};

export const formatFrontmatter = (attrs: Record<string, string | string[]>): string => {
  const lines = ['---'];

  for (const [key, value] of Object.entries(attrs)) {
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map(formatScalar).join(', ')}]`);
      continue;
    }
    lines.push(`${key}: ${formatScalar(value)}`);
  }

  lines.push('---');
  return `${lines.join('\n')}\n`;
};

const parseValue = (raw: string): FrontmatterValue => {
  if (raw.startsWith('[') && raw.endsWith(']')) {
    const inner = raw.slice(1, -1).trim();
    if (!inner) return [];
    return splitInlineArray(inner).map(parseScalar);
  }

  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return parseScalar(raw);
};

const parseScalar = (raw: string): string => {
  const trimmed = raw.trim();
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

const splitInlineArray = (raw: string): string[] => {
  const parts: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;

  for (const char of raw) {
    if ((char === '"' || char === "'") && quote === null) {
      quote = char;
      current += char;
      continue;
    }
    if (char === quote) {
      quote = null;
      current += char;
      continue;
    }
    if (char === ',' && quote === null) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
};

const formatScalar = (value: string): string => {
  if (/^[a-z0-9][a-z0-9./:_-]*$/i.test(value)) return value;
  return JSON.stringify(value);
};
