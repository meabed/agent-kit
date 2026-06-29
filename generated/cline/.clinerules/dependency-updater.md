---
paths:
  - '**'
---

# Dependency updates that only land green

A scheduled job bumps packages, runs the repo checks, and pushes only when the branch earns it.

Manual dependency bumps rot the moment you stop doing them. This is the job I schedule instead: it walks a list of repos, updates every `package.json` to latest, runs the project's own checks, and pushes a single commit per repo — but only when the build stays green.

```ts title="update-deps.ts"
type Repo = { remote: string; branch: string; verify?: string[] };

async function updateRepo({ remote, branch, verify = [] }: Repo) {
  const dir = `/tmp/dep-update/${slug(remote)}`;
  await $`git clone --depth 1 -b ${branch} ${remote} ${dir}`;

  // bump every package.json in the tree, skipping node_modules
  for (const pkg of new Bun.Glob('**/package.json').scanSync({ cwd: dir })) {
    if (pkg.includes('node_modules')) continue;
    await $`bunx npm-check-updates -u`.cwd(dirname(`${dir}/${pkg}`));
  }
  await $`bun install`.cwd(dir);

  // the repo's OWN checks decide whether the bump ships
  for (const cmd of ['bun run typecheck', 'bun run test', ...verify]) {
    await $`${{ raw: cmd }}`.cwd(dir); // throws on failure → repo skipped
  }

  await $`git -C ${dir} commit -am "chore: update dependencies"`;
  await $`git -C ${dir} push origin ${branch}`;
}
```

### Let the repo's own checks be the gate

The job doesn't decide whether an upgrade is safe — the repo does. It runs that project's `typecheck` and `test` before it pushes, so a breaking bump fails loudly in the runner and never reaches `main`. A repo with no tests gets no safety net, which is itself useful signal.

### One commit per repo, on a schedule

Running daily at a quiet hour with a single `chore: update dependencies` commit keeps drift small enough to review at a glance. Small frequent bumps are reversible; the once-a-quarter mega-upgrade is the one that pages you.

<Tradeoff title="Frequent small updates need real checks">
  A daily updater is only calmer if each repo can reject a bad bump. Without meaningful gates, the
  automation just ships uncertainty faster.
</Tradeoff>
