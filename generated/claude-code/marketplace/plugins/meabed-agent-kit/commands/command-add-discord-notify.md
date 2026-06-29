---
description: 'Find every Slack notification path, add the Discord twin, and keep the old channel working.'
argument-hint: [optional context]
---

Add Discord notifications alongside every existing Slack notification.

Steps:

1. Find all places Slack notifications are wired (CI workflows, scripts).
2. For each, add a parallel Discord notification using the official Discord action and DISCORD_WEBHOOK_URL / DISCORD_BOT_TOKEN secrets.
3. Mirror the existing Slack webhook pattern; wire BOTH success and failure paths, gated (e.g. `if: !cancelled()`).
4. Don't remove Slack — Discord is additive.
5. Report each file touched.
