---
name: dependency-updater
description: Update dependencies safely and completely in a repository or workspace. Use for package upgrades, lockfile refreshes, dependency-bot batches, release-note migrations, or automated update workflows that must land only after the repository's real checks pass.
---

# Update dependencies

1. Read the repository instructions and identify the actual package manager, workspace layout,
   lockfiles, update policy, supported runtime, and required gates.
2. Inspect the current diff before changing anything. Preserve unrelated user upgrades and never
   downgrade a package merely to avoid migration work.
3. Group upgrades by dependency relationship and risk. Read first-party release notes for breaking
   or security-sensitive changes.
4. Update manifests and the canonical lockfile with the repository's package manager. Remove
   dependencies made obsolete by the migration.
5. Adapt callers, config, tests, generated inputs, CI, and docs directly to the current API. Do not
   add compatibility wrappers to preserve an obsolete interface unless the user requires them.
6. Run focused checks for changed integrations, then the full repository gate. Treat install
   warnings, peer conflicts, duplicate versions, and generated drift as findings rather than noise.
7. For automation, isolate each repository, use bounded concurrency, stop before commit or push when
   verification fails, and never print credentials.
8. Publish only when explicitly requested. Report versions changed, migration work, exact checks,
   unresolved advisories, and remaining release risk.
