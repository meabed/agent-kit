---
description: Run a read-only security review of dependency, auth, credential, and CI changes.
---

Security-vulnerability review of the current diff. Do NOT modify anything.

Focus: dependency bumps, credential/auth-touching changes, CI diffs.
Checklist:

- GitHub Actions pinned to commit SHAs (not tags).
- Crypto uses WebCrypto over weaker primitives.
- No tracked secrets/keys/private keys committed to git.
- Injection, authz bypass, unsafe deserialization, SSRF in changed code.

Output: findings list (`path:line — issue — severity — fix`). If clean, explicitly state 'no vulnerabilities found' before proceeding.
