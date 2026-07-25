# Agent Kit Documentation

## Start Here

- [Install](install.md) - install skills only or the full collection.
- [Write instructions](authoring.md) - add or update skills, commands, prompts, and agents.
- [Installation paths](installation-paths.md) - see where each agent loads the files.
- [Release](releasing.md) - publish the npm package automatically.

## How It Works

The repository stores the files that agents use:

- `npx skills` installs only `skills/*/SKILL.md` through skills.sh.
- `npx @meabed/skills` installs skills, commands, prompts, and agent definitions.

This is a personal collection, but every published file is public. Keep private paths, credentials,
contact details, internal systems, and copied private conversations out of the repository.
