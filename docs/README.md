# Agent Kit Docs

## Start Here

- [Authoring](authoring.md) - how to write and review `catalog/<id>/recipe.md`
- [Adapter matrix](adapter-matrix.md) - which files each agent ecosystem consumes
- [Install and export](install.md) - CLI examples and write-safety behavior
- [Sync from meabed/site](sync-from-meabed-site.md) - how site posts become catalog entries

## Core Model

One resource lives in one canonical catalog entry. Adapters render that entry into the file shape an
agent expects. The repo intentionally avoids separate prompt, skill, and command silos because the
same resource often needs all three forms.
