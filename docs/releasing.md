# Release

Push a conventional commit to `master`. The release workflow validates the repository, calculates
the next version, publishes `@meabed/skills` to npm, and creates the matching Git tag and GitHub
Release. GitHub remains the source for Skills CLI installations; npm distributes the complete
catalog CLI.

## Commit Policy

| Commit                                     | Release |
| ------------------------------------------ | ------- |
| `feat: ...`                                | Minor   |
| `fix: ...`                                 | Patch   |
| `perf:`, `refactor:`, `revert:`, `style:`  | Patch   |
| `build:`, `i18n:`                          | Patch   |
| `chore(deps): ...`                         | Patch   |
| `feat!: ...` or `BREAKING CHANGE: ...`     | Major   |
| `docs:`, `test:`, `ci:`, unscoped `chore:` | None    |

Semantic-release evaluates every commit since the latest `v<version>` tag and uses the highest
required release. Keep commit subjects in the form `type(optional-scope): summary`.

## One-Time Setup

Add an `NPM_TOKEN` repository secret under **Settings → Secrets and variables → Actions**. The token
must have publish access to the public `@meabed/skills` package. The workflow passes it to Bun as
`NPM_CONFIG_TOKEN` and never prints it.

The clean commit immediately before semantic-release was introduced must have the `v0.2.0`
baseline tag. This preserves the established `0.x` version line without exposing the older,
removed catalog as an installable release.

## Validate a Release

Run the normal gate:

```sh
bun run release:check
bun run validate
bun test
bun run typecheck
bun run lint
bun run fmt:check
bun run build
```

Preview semantic-release without publishing:

```sh
GITHUB_TOKEN="$(gh auth token)" bun run release:dry
```

You can also run the **Release** workflow manually. Its `dry-run` input defaults to `true`.

## Automatic Publication

On every push to `master`, `.github/workflows/release.yml`:

1. checks out the full Git history and installs locked dependencies with `bun ci`;
2. runs the release check and complete validation gate;
3. previews the npm package contents;
4. calculates the version from conventional commits;
5. stamps the version into `package.json` and both plugin manifests;
6. publishes the public package with `bun publish`;
7. creates the `v<version>` Git tag and GitHub Release.

Commits that do not require a release still run the full gate and then stop without publishing.
Do not edit versions manually, create release commits, or publish GitHub Releases by hand.

## Verify

After the workflow succeeds:

```sh
bun info @meabed/skills version
npx @meabed/skills list
```

Published versions are immutable. Fix a failed release and push a new conventional commit; do not
replace already published package contents.
