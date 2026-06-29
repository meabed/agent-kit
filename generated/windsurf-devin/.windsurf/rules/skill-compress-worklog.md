---
globs:
  - '**'
---

# Compress a worklog without losing signal

Turn messy session notes into a dense developer journal while preserving decisions, commands, and evidence.

A skill for turning verbose session notes into a dense, time-blocked developer journal. The rule that
defines it: compression is non-destructive — every fact, reference, and relationship survives so the
next engineer can resume the work without guessing what happened.

```md title="skills/compress-worklog/SKILL.md"
---
name: compress-worklog
description: Use when compressing or journaling work logs / session notes into a dense developer journal entry. Triggers on 'compress this log', 'journal this', 'maximum non-destructive compression'.
---

Use when compressing or journaling work logs / session notes into a dense developer journal entry. Triggers on 'compress this log', 'journal this', 'maximum non-destructive compression'.

Key steps & rules:

1. ZERO information loss: keep ALL facts, refs, verbs, relationships. Compression is non-destructive.
2. Drop articles/prepositions/filler; use developer shorthand (conf, env, MR, impl, perm, repo, deploy).
3. Group same-subject entries into one time-blocked entry.
4. Preserve the `## timestamp | branch` header format. Chronological order, oldest to newest.
5. No prose, no preamble, no commentary — output raw compressed signal only.
6. Include a short shorthand glossary as reference material in the skill.
```

### Compress the form, not the facts

The distinction at the core of this skill: drop articles, prepositions, and filler, but never drop a
fact, reference, or relationship. The output is shorter because the prose is gone, not because the
team lost the trail of decisions, commands, failures, or product context.

### Signal only

Rule 5 keeps the output usable as a log — raw compressed signal, no preamble or commentary — while the shorthand glossary makes the abbreviations decodable later.

<Principle title="Compression must not change the facts">
  A useful worklog gets denser without losing relationships, commands, branches, timestamps, or
  decisions. If a future reader cannot reconstruct the work, it was summarized too hard.
</Principle>

### Why it matters for long sessions

Long agent sessions lose value when the useful facts are buried in chat residue. Compression keeps
the audit trail small enough for a teammate to reuse without flattening cause and effect.

The output should still answer: what changed, what command proved it, what failed, what decision was
made, and where the next person should resume.
