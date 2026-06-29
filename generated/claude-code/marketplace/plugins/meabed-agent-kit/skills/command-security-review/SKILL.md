---
name: command-security-review
description: 'This skill should be used when the user asks to apply "Security review of the actual diff", mentions "command-security-review", or needs this workflow: A read-only pass over dependency bumps, auth changes, and CI edits, with a fixed checklist and findings format.'
version: 0.1.0
---

# Security review of the actual diff

A read-only pass over dependency bumps, auth changes, and CI edits, with a fixed checklist and findings format.

## Instructions

A command that runs a focused security review over the current diff without modifying anything. It targets the highest-risk surfaces — dependency bumps, credential and auth changes, and CI — against a fixed checklist.

```md title="commands/security-review.md"
---
description: Run a security-vulnerability review on dependency bumps, credential/auth-touching changes, and CI diffs following the defined method; return findings
---

Security-vulnerability review of the current diff. Do NOT modify anything.

Focus: dependency bumps, credential/auth-touching changes, CI diffs.
Checklist:

- GitHub Actions pinned to commit SHAs (not tags).
- Crypto uses WebCrypto over weaker primitives.
- No tracked secrets/keys/private keys committed to git.
- Injection, authz bypass, unsafe deserialization, SSRF in changed code.

Output: findings list (`path:line — issue — severity — fix`). If clean, explicitly state 'no vulnerabilities found' before proceeding.
```

### A fixed checklist beats a vibe

Naming the exact things to check — SHA-pinned actions, WebCrypto, no committed secrets, the usual injection and authz classes — keeps the review reproducible instead of dependent on what the model happens to notice.

### Say so when it's clean

Requiring an explicit "no vulnerabilities found" is deliberate: silence is ambiguous. A clean review should state that it's clean before the work moves on.

<Tradeoff title="Security review needs a narrow lens">
  A broad review sounds safer but usually becomes vague. A fixed checklist catches known risk
  classes and makes the result repeatable.
</Tradeoff>

### What evidence looks like

A useful security finding includes the exact changed line, the exploit or failure class, and the
smallest repair. "This looks risky" is not enough. The reviewer should be able to tell whether the
issue is a committed secret, an unpinned action, an authz gap, or a dependency behavior change.

I keep it read-only because security review should not quietly rewrite the patch while assessing it.
First produce the verdict. Then fix with a separate, auditable change.

## Verification

Before calling the task done, run the focused check for the files you changed and the repository's normal verification gate. Report what changed, what passed, and any risk that remains.
