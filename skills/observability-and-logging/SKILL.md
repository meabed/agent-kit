---
name: observability-and-logging
description: Add or review logs, metrics, traces, error reporting, and test hooks that make real failures inspectable without exposing sensitive data. Use for silent failures, missing instrumentation, correlation IDs, log levels, Sentry-style reporting, or proving runtime behavior from logs.
---

# Make failures inspectable

1. Start from the operator or user question the telemetry must answer. Trace the relevant request,
   job, state transition, or dependency boundary.
2. Reuse the repository's logging and observability stack. Do not introduce a second framework for a
   local convenience.
3. Emit structured events with stable names, severity, operation, correlation identifier, state
   transition, duration, result, and classified failure where those fields are useful.
4. Make skipped work, fallback behavior, missing configuration, retry exhaustion, and partial
   failure visible. Avoid noisy success logs and duplicated stack traces.
5. Never log credentials, tokens, raw authorization headers, payment data, private payloads, or
   unnecessary personal information. Redact at the boundary and test the redaction.
6. Preserve accessible labels in UI tests; use stable test identifiers only where semantic selectors
   cannot prove the path reliably.
7. Keep verbosity configurable through the existing mechanism. Defaults should be useful in
   production without flooding logs.
8. Exercise the real path and confirm the expected event reaches the intended sink with correct
   correlation and no sensitive fields. Test failure, fallback, and disabled states.

Report which questions are now answerable, the event or metric names, redaction coverage, runtime
evidence, and remaining blind spots.
