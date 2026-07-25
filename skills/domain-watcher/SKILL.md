---
name: domain-watcher
description: Design, implement, or audit automated domain-registration and TLS-certificate expiry monitoring. Use for RDAP or WHOIS lookup jobs, certificate checks, expiry alerts, rolling issues, retry behavior, or resilient scheduled monitoring across a domain inventory.
---

# Monitor domain and certificate expiration

1. Resolve the inventory from a documented, non-secret source. Validate and normalize hostnames
   before making network requests.
2. Check registration expiry through RDAP first when supported and use a narrowly parsed WHOIS
   fallback only when needed. Record the source and timestamp for each result.
3. Check the served TLS certificate chain independently. Registration and certificate expiry are
   different risks and require separate status fields.
4. Use bounded concurrency, timeouts, and exponential backoff for transient failures. Treat one
   failed lookup as `unknown`; do not abort the entire report.
5. Calculate alert windows from configuration with sensible defaults. Distinguish expired, urgent,
   warning, healthy, and unknown states.
6. Emit a deterministic report ordered by urgency. Prefer one rolling issue or stateful alert that
   updates on change and closes when healthy over a daily stream of duplicate notifications.
7. Never print credentials or private inventory metadata. Keep notification destinations and tokens
   in the platform's secret store.
8. Test parser fixtures, date boundaries, retries, unknown results, alert transitions, and
   idempotent issue updates. Run the job in a safe dry-run mode before enabling its schedule.
