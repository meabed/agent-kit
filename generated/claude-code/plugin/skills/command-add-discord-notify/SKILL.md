---
name: command-add-discord-notify
description: 'This skill should be used when the user asks to apply "Add Discord notifications without breaking Slack", mentions "command-add-discord-notify", or needs this workflow: Find every Slack notification path, add the Discord twin, and keep the old channel working.'
version: 0.1.0
---

# Add Discord notifications without breaking Slack

Find every Slack notification path, add the Discord twin, and keep the old channel working.

## Instructions

A command that finds every place a Slack notification is wired and adds a parallel Discord notification next to it — across CI, scripts, and every repo. Discord is purely additive; Slack stays.

```md title="commands/add-discord-notify.md"
---
description: Add Discord webhook notifications (DISCORD_WEBHOOK_URL/DISCORD_BOT_TOKEN secret) alongside Slack everywhere it's used, across all repos. Use
---

Add Discord notifications alongside every existing Slack notification.

Steps:

1. Find all places Slack notifications are wired (CI workflows, scripts).
2. For each, add a parallel Discord notification using the official Discord action and DISCORD_WEBHOOK_URL / DISCORD_BOT_TOKEN secrets.
3. Mirror the existing Slack webhook pattern; wire BOTH success and failure paths, gated (e.g. `if: !cancelled()`).
4. Don't remove Slack — Discord is additive.
5. Report each file touched.
```

### Additive, not a migration

The key constraint is step 4: this is not a Slack-to-Discord swap. Both channels stay live, so a single missed wiring never drops a notification.

### Both success and failure paths

Wiring only the success path is the common mistake — failures are exactly when you most want the ping. Gating on a not-cancelled condition keeps the failure notification firing even when the job errors.

<Principle title="Notifications are part of the delivery loop">
  A new channel is not done when the happy path pings. Success, failure, cancellation, and missing
  secrets all need an intentional behavior.
</Principle>

### What makes it tricky

Notification wiring is usually scattered: reusable workflow, release job, deploy script, smoke test,
maybe a hand-written curl in one older repo. This command forces the agent to search all of it before
patching anything.

I also want the report to name every touched path because notification changes are easy to half-ship.
If Slack gets a failure ping and Discord only gets success, the new channel looks alive until the day
it matters.

## Verification

Before calling the task done, run the focused check for the files you changed and the repository's normal verification gate. Report what changed, what passed, and any risk that remains.
