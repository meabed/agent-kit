# Agent Kit Docs

## Start Here

- [Authoring](authoring.md) - how to write commands, skills, prompts, and agents by hand.
- [Adapter matrix](adapter-matrix.md) - where the CLI installs files for each target.
- [Install](install.md) - npx and local install examples.

## Core Model

The repo stores the actual resource files. The CLI reads the root directories, preserves complete
skill folders, and adapts each resource to paths and formats the target agent actually loads.

The distributable catalog contains reusable, public workflows only. Personal instruction dumps,
private paths, credentials, contact details, and transcript-mining artifacts do not belong here.
