---
globs:
  - '**'
---

# Domain and TLS expiry watcher

A daily check that ranks domains and certificates by expiry, then keeps one rolling issue current.

The cheapest outage to prevent is the one where a domain or certificate quietly lapses. This job runs daily, checks registration and TLS expiry for everything you watch, and nags you with a single rolling issue before anything goes dark.

```ts title="check-expiry.ts"
const ALERT_DAYS = Number(process.env.ALERT_DAYS ?? '60');

async function expiryFor(domain: string) {
  // RDAP first (registry server, then rdap.org), whois as fallback.
  for (const url of rdapUrls(domain)) {
    const data = await fetchJson(url); // retries 429/5xx, treats 404 as definitive
    const event = data?.events?.find((e) => e.eventAction === 'expiration');
    if (event) return { source: 'rdap', expiry: new Date(event.eventDate) };
  }
  const fromWhois = await whoisExpiry(domain); // matches common expiry lines
  return fromWhois ?? { source: 'unknown', expiry: null };
}

const rows = await mapPool(watched, 4, async (d) => {
  const { expiry, source } = await expiryFor(d);
  const daysLeft = expiry ? Math.floor((+expiry - Date.now()) / 86_400_000) : null;
  return { domain: d, expiry, source, daysLeft };
});
rows.sort((a, b) => (a.daysLeft ?? Infinity) - (b.daysLeft ?? Infinity));
```

### Degrade, never fail the run

Every lookup is wrapped so one unresolvable domain returns `unknown` instead of crashing the job. Network calls retry transient `429`/`5xx` with backoff and treat `404` as final, and the whole fan-out runs through a bounded pool of four — not an unbounded `Promise.all` that hammers registries. The report always prints, even when a few rows can't be determined.

### One rolling issue, not a daily inbox flood

When anything is inside the alert window the job opens or updates a single issue titled "Domains expiring soon", and auto-closes it when everything is healthy again. You get notified on real change, not a green email every morning — the surest way to teach people to ignore the alert.

<Principle title="Alerts should represent change">
  A daily green notification trains people to ignore the system. One rolling issue gives the team a
  durable place to see what changed and what still needs action.
</Principle>
