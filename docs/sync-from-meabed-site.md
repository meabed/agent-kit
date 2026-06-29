# Sync From meabed/site

The site remains the public article surface. This repo mirrors the operational resource so it can be
installed by agents and package managers.

```sh
bun run sync:site
bun run generate
bun run validate
```

`sync-site` reads `src/content/ai/*.mdx`, normalizes frontmatter into catalog metadata, and writes
`catalog/<slug>/recipe.md`. It does not edit the site repo.

Generated catalog fields:

- `id` from the MDX slug
- `title` from `title`
- `summary` from `dek`
- `type` from `meta`, first topic, or `kind`
- `topics` from `topics`
- `date` from `date`
- `sourceArtifact` from `source`
- `siteUrl` as `https://mo.ca/ai/<slug>`
- `sourcePath` as the source MDX path inside the site repo
