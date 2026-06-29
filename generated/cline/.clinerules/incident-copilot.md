---
paths:
  - '**'
---

# Incident timelines while evidence is fresh

An agent follows logs and metrics during an incident so the timeline is accurate before context fades.

During an incident nobody has spare hands to take notes. A copilot watches the same signals you do and writes down what happened, with timestamps, while you fix it.

```yaml title="incident-copilot"
# incident-copilot
watch:
  - logs: service=checkout level>=error
  - metrics: p99_latency, error_rate, saturation
  - alerts: pagerduty incident feed

on_event: append to timeline (UTC, newest last)
  name the system, never the person

on_resolve: hand the timeline to prompts/postmortem.md
```

### Notes you didn’t have to take

The value is not real-time analysis — it is the record. When the incident closes, you have a timestamped account instead of a foggy memory and a scrollback you have to reconstruct.

### It feeds the postmortem

The copilot’s output is the exact input the postmortem prompt expects. Two tools, one pipeline: the incident produces its own writeup as a byproduct of being handled.

<Decision title="Capture the timeline while it is happening">
  The incident record should be built during the work, not reconstructed from memory after everyone
  is tired and the logs have rotated.
</Decision>

### Guardrails

The copilot should not diagnose beyond the evidence it can see. It can capture that checkout errors
spiked at 14:03 UTC, that a deployment happened at 13:58 UTC, and that p99 latency recovered after a
queue drain. It should not guess who caused it or invent a root cause before the team has one.

Useful incident assistance is boring: timestamp, source, system, observed change, link. That makes it
safe to hand into the postmortem prompt later. The model is there to preserve facts while humans make
the operational decisions.

### When it should stay quiet

During mitigation, the copilot should not flood the channel with theories. It should append concise
timeline entries and wait for clear evidence before naming relationships.

The best output is useful after the incident: what changed, when it changed, what recovered, and
which signals were missing. That is what turns the incident into better instrumentation and runbooks.
