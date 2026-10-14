---
name: maintain-engineering-site
description: Refresh a personal engineering site and its reusable instruction kit using evidence from code and work sessions. Use for recurring content reviews, article planning, resource updates, design polish, and site maintenance.
---

# Maintain an engineering site

Keep the site useful to engineers who need to understand a real decision, reproduce a technique,
or use an instruction in their own repository. Finish the requested implementation and validation.
Do not replace an established voice or design with a new identity during routine maintenance.

## Establish the current contract

- Read the target repository instructions, writing guide, brand guide, engineering principles,
  route/content model, and test map. Use the existing checkout, history, and rendered site as evidence.
- Inspect branch, remote, worktree changes, and the last maintenance record. Preserve unrelated work.
  Read reference repositories for tooling patterns; edit only repositories included in the request.
- Confirm which instruction kit is canonical. Inspect its current source and installation rules.
  Updating a site's resource copy does not update the kit itself. Report that distinction accurately.
- Review the site's index, AI resources, article details, About, and other affected pages before editing.
  Read the actual content, follow source links, and check the current runtime.
- Use available design, copywriting, copy-editing, motion, and plain-language skills when they improve
  this task. The author's writing rules and explicit preferences take precedence over stock advice.

## Mine work into an article plan

- Inventory the available, authorized work sessions and relevant code repositories. Start with the
  period since the last review; expand when the user asks for the full history. Record the coverage.
- Use sessions to find recurring problems and decisions. Corroborate candidates against current code,
  commits, tests, documentation, or primary public sources. A proposed fix in a chat is not shipped work.
- Distinguish personal experience, verified repository facts, an inference, and a proposed experiment.
  Do not turn an uncertain session summary into a first-person production incident or measured result.
- Update the existing Markdown article plan instead of accumulating duplicate plans. For each useful
  candidate include a concrete title, intended reader, central message, opening, and substantive outline.
  Name the example, commands, schema, diagram, failure path, and tradeoff that would carry the article.
- Explain why posting it helps: product behavior, customer trust, operator effort, debugging, cost,
  review speed, team clarity, or delivery reliability. Include a short suggested announcement.
- Record supporting files or public sources, overlap with existing articles, and evidence still needed.
  Prioritize distinct ideas with enough evidence to write. Do not fill a quota with generic topics.
- Keep raw sessions, credentials, private endpoints, customer data, and internal incident details out
  of published files. Keep private evidence notes outside public output. State what was unavailable.

## Edit the site and instruction kit

- Follow the author's plain technical voice: short sentences, concrete nouns, active verbs, precise
  technical terms, and first person only for supported experience. Open with a real problem and stakes.
- Make titles describe the actual system, technique, or result. Explain the reader's benefit alongside
  the implementation. Cut slogans, inflated authority, vague metaphors, invented numbers, and filler.
- Check technical examples against current source and documentation. Exercise runnable examples when
  their correctness carries the article. Include failure behavior and limits, not only the happy path.
- When removing an article, update every reference, listing, feed, search result, sitemap, and export
  affected by the content model. Follow the repository's route policy; do not invent redirect shims.
- For resource updates, edit the canonical kit first. Keep resource IDs, source descriptions, file
  names, copyable content, and installation bundles aligned. Update catalog copies from that source.
- Extract a new skill only for a repeatable workflow with useful, non-obvious guidance. Improve an
  existing skill when it already owns the task. Keep instructions separate from explanatory articles.
- Maintain metadata, structured data, social previews, internal links, Markdown exports, and prompt
  exports when the site supports them. Update the matching durable docs with changed behavior.

## Preserve the design decisions

- Keep the established index headlines and split title/subtitle hero structure unless the user asks
  to change them. Use history to recover an earlier version when it is explicitly preferred.
- Keep the main writing hero focused on text. Do not add an author portrait or byline there. Update
  the existing About and sidebar portraits when a replacement image is supplied.
- Use concrete section names on About. Do not add a second capability list below the introduction;
  describe experience through the actual work history.
- Optimize the supplied photo without changing the person's appearance. Preserve its aspect ratio,
  check the crop in the browser, remove unnecessary metadata, and update all old asset references.
- Retain the site's tokens, typography, layout, technical components, and light/dark treatment.
  Add small details that improve hierarchy, focus, spacing, and controls without increasing clutter.
- Keep hero backgrounds smoothly and continuously animated while visible. Do not replace requested
  ambient motion with a static design. Use elapsed time, continuous loops, soft highlights, and stable
  geometry. Check wrap boundaries, high refresh rates, resizes, and theme changes for jumps.
- Keep the document and reading position still on load, refresh, navigation, and fast scrolling.
  Do not animate the page wrapper, replay entrance effects, or fight native scroll restoration.
- Pause decorative work when offscreen or hidden and resume without catching up. Respect reduced
  motion with a static frame. Keep the text veil, contrast, touch targets, and keyboard focus intact.

## Align maintenance tooling when requested

- Inspect the named reference repositories before copying their conventions. Reuse the site's own
  runtime, package manager, lockfile, hooks, and CI instead of installing a parallel toolchain.
- Keep one static-check command shared by local hooks and CI. Run tests and builds separately.
  Cache package downloads; do not let stale installed modules bypass a frozen-lockfile install.
- Give Renovate and Dependabot distinct responsibilities when both are requested. Validate their
  current schemas, managers, target branch, grouping, and merge policy against official documentation.
- Make dependency updates run the required checks. Keep major updates reviewable and require passing
  checks for automatic merges. Use the repository's code owners and existing release workflow.
- Do not introduce sibling secrets, deployment destinations, or notification recipients by copying CI.

## Verify and deliver

- Run focused checks, then the appropriate full gates in every changed repository. Verify resource
  discovery, privacy checks, bundled files, and installation into a temporary directory for kit changes.
- Check changed pages in a real browser at desktop and phone widths, both themes, and reduced motion.
  Exercise hard refresh at a saved reading position, rapid scrolling, client navigation, and history.
- Inspect console and network failures, document width, image decoding, metadata, and relevant content
  exports. Watch complete animation cycles; screenshots alone cannot establish smoothness.
- Verify removed URLs, catalog links, and source parity. Record exact commands and observed results,
  including the environment and any untested production behavior.
- If commit and push are already authorized, finish them without asking again. Otherwise leave the
  checked changes ready for review. Use the user's existing identity and task-based commit messages.
- Preserve unrelated changes, avoid force pushes, verify remote tracking parity, and report the final
  worktree state and CI result for each published repository. Stop publication if required checks fail.
- Never add tool attribution, session links, or assistant authorship to commits or published output.
  End with the useful changes, article-plan and skill locations, validation, and remaining limits.
