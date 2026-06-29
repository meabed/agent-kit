import { describe, expect, it } from 'bun:test';
import { splitFrontmatter } from '../src/frontmatter.ts';

describe('frontmatter parser', () => {
  it('parses inline and block arrays', () => {
    const parsed = splitFrontmatter(`---
title: 'Security review'
topics: [command, security]
tags:
  - ci
  - auth
enabled: true
---
Body`);

    expect(parsed.attrs.title).toBe('Security review');
    expect(parsed.attrs.topics).toEqual(['command', 'security']);
    expect(parsed.attrs.tags).toEqual(['ci', 'auth']);
    expect(parsed.attrs.enabled).toBe(true);
    expect(parsed.body.trim()).toBe('Body');
  });
});
