---
name: parallel-agent-execution
description: Split work between agents only when the user or repository rules ask for it. Use for tasks that can be divided into separate parts without agents editing the same files, then combine their work into one checked result.
---

# Run parallel agents

Do not delegate merely because a task is large. Confirm that delegation is authorized and that at
least two bounded subtasks can progress independently.

1. Explore enough of the repository to map shared contracts, dependencies, and likely write
   surfaces.
2. Split work by clear outputs and non-overlapping file ownership. Keep shared files with the parent
   unless one agent owns them exclusively.
3. Give each agent the goal, relevant repository instructions, allowed write scope, required
   evidence, and stopping condition. Do not leak conclusions when the task is an independent
   validation.
4. Keep sibling repositories and external systems read-only unless they are explicitly in scope.
5. Prevent two agents from editing the same file. Never revert or overwrite another agent's work.
6. Track status and redirect an agent when new information changes its bounded task.
7. Review every result and the combined diff in the parent context. Reconcile naming, types,
   contracts, tests, docs, and incomplete handoffs.
8. Run focused checks for each surface and one full repository gate after integration.

Return one coherent result, not a bundle of agent transcripts. Report ownership, reconciled changes,
verification, and remaining integration risk.
