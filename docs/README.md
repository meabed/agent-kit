# Agent Kit Docs

## Start Here

- [Authoring](authoring.md) - how to write commands, skills, and prompts by hand.
- [Adapter matrix](adapter-matrix.md) - where the CLI installs files for each target.
- [Install](install.md) - skills.sh, npm CLI, and local install examples.
- [Release](releasing.md) - conventional commits, dry runs, and automatic npm publication.

## Core Model

The repo stores the actual resource files. The official Skills CLI installs `skills/*/SKILL.md`
directly from GitHub. The `@meabed/skills` npm CLI reads every root resource directory, preserves
complete skill folders, and adapts each resource to paths and formats the target agent actually
loads.

The distributable catalog contains reusable, public workflows only. Personal instruction dumps,
private paths, credentials, contact details, and transcript-mining artifacts do not belong here.
