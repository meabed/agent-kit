# Release

The npm release workflow publishes `@meabed/skills` from a stable GitHub Release. GitHub remains
the source for Skills CLI installations; npm distributes the complete catalog CLI.

## One-Time Setup

Add an `NPM_TOKEN` repository secret under **Settings → Secrets and variables → Actions**. The token
must have publish access to the public `@meabed/skills` package. The workflow passes it to
`bun publish` through `NPM_CONFIG_TOKEN` and never prints it.

## Prepare a Release

1. Choose the next semantic version.
2. Set that version in:
   - `package.json`
   - `.claude-plugin/plugin.json`
   - `.codex-plugin/plugin.json`
3. Run the release check and full gate:

   ```sh
   bun run release:check
   bun run validate
   bun test
   bun run typecheck
   bun run lint
   bun run fmt:check
   bun run build
   bun publish --dry-run --access public
   ```

4. Review the dry-run package contents. Confirm that it contains the manifests, resources, release
   check, docs, README, and built `dist/cli.js`.
5. Commit and push the release changes.

## Publish

Create a GitHub Release from the release commit. Use a tag that exactly matches the package version
with a `v` prefix, such as `v0.2.0`.

Publishing the GitHub Release triggers `.github/workflows/npm-release.yml`. The workflow:

1. checks out the release tag;
2. installs the locked dependencies with `bun ci`;
3. verifies the tag and manifest versions;
4. runs validation, tests, typechecking, linting, formatting, and the build;
5. runs a package dry run; and
6. publishes the public package to npm with Bun.

Draft and prerelease GitHub Releases do not publish the npm package.

## Verify

After the workflow succeeds, verify the registry and executable:

```sh
bun info @meabed/skills version
npx @meabed/skills list
```

The published version is immutable. Prepare a new version instead of retrying with changed content
under an existing version.
