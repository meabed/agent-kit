---
description: Commit the completed work, push it, and open a pull request only when requested.
argument-hint: <optional branch or PR instructions>
---

Publish only the completed, in-scope work requested by the user.

1. Inspect the branch, status, diff, remote, and repository publication rules. Preserve unrelated
   user changes.
2. Run the required verification gate before committing.
3. Respect the requested branch and publication mode. Do not invent a branch or PR when the user
   explicitly requested direct publication, and do not push when publication was not requested.
4. Stage only files belonging to this task. Split commits only when the changes have genuinely
   independent purposes.
5. Write concise conventional commits that describe intent.
6. Push the exact commit to the intended remote. Create or update one PR only when requested.
7. Verify the local and remote commit IDs, then report the branch, commit SHA, push status, PR URL
   when applicable, and verification results.
