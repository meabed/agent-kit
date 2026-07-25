---
description: Check dependencies, sign-in rules, secrets, and automated build or release changes for security problems.
argument-hint: <optional diff or scope>
---

Run a read-only security review of the requested diff or scope. Do not modify files or external
systems.

Prioritize:

- Authentication, authorization, tenant and data boundaries.
- Injection, SSRF, unsafe deserialization, path traversal, and command execution.
- Credential exposure, secret handling, logging, and CI trust boundaries.
- Dependency and workflow provenance, including action pinning when required by repository policy.
- Cryptographic misuse and insecure randomness.
- Missing negative tests for security-critical behavior.

Report only actionable findings as `path:line — severity — issue — safe remediation`. Include a
short attack or failure path. If no finding survives review, state that no vulnerabilities were
found in the inspected scope and name any coverage limit.
