---
globs:
  - '**'
---

# Spec, scaffold, then tests

Write the design first, let the agent scaffold the shape and failing tests, then fill in the logic.

The most reliable way I use an agent isn’t “write this feature.” It’s a three-step relay where I keep the parts that need judgment and hand off the parts that don’t.

```ts title="spec → scaffold → tests"
// step 3 output: a failing suite that IS the spec
describe('idempotent charge', () => {
  it('charges once for a repeated key', async () => {
    const key = 'idem_123';
    await charge({ key, cents: 500 });
    await charge({ key, cents: 500 }); // retry
    expect(await totalCharged(key)).toBe(500); // not 1000
  });

  it('rejects a key reused with a different body', async () => {
    await charge({ key: 'idem_9', cents: 500 });
    await expect(charge({ key: 'idem_9', cents: 999 })).rejects.toThrow('idempotency key conflict');
  });
});
```

### Judgment stays with me

The spec — what the system should do and why — is the part a model can’t own. I write that. The skeleton and the tests are mechanical translations of it, which is exactly what agents are good at.

### A failing test is the contract

Tests come before logic, so the agent and I agree on “done” before a line of implementation exists. The suite goes red, I make it green, and there’s never a debate about whether the feature works.

<Principle title="The failing test is the handoff">
  Let the agent scaffold the shape, but make the behavior executable before implementation starts.
  The red test is the contract the code has to satisfy.
</Principle>

### Where it works best

This pattern is strongest when the behavior has a crisp invariant: idempotency, permission checks,
parser output, retry handling, API contract shape, billing math, or migration compatibility. The
agent can scaffold the boring parts once the invariant is clear.

It is weaker when the work is mostly product judgment or visual taste. In those cases I still want a
written spec, but the verification might be screenshots, design review, or a manual acceptance pass
instead of a unit test.
