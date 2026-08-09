# Domain Governance Baseline - agent guidance

This repository contains the public source and stewardship record for the **Domain Governance Baseline**, an authored governance artefact by Bryan Chetcuti.

The repository is public so its implementation, version history, citation metadata and stewardship decisions can be inspected. Public visibility does not make the Baseline an open-ended product or framework.

## Read before changing anything substantive

Before proposing or implementing a substantive change, read:

1. `README.md` - public positioning, canonical scope and repository overview.
2. `STEWARDSHIP.md` - evidence thresholds, versioning and boundaries for future iteration.
3. `CHANGELOG.md` - substantive artefact history.
4. `CITATION.cff` and `LICENSE.md` - citation, attribution and reuse boundaries.

For changes to a practice guide, also read the relevant guide and the adjacent guides in the five-guide sequence.

## Canonical v1.0 boundaries

Version 1.0 establishes the ten questions in `js/data.js` as the canonical Baseline for the v1 line.

Do not add, remove or materially reframe a canonical question as routine maintenance. A material change to a canonical question is a v2.0-level decision and requires explicit stewardship intent.

The five-practice sequence is also intentionally complete and bounded:

1. Establish a domain register.
2. Control registrar and DNS authority.
3. Govern email authority and public signals.
4. Establish domain incident readiness.
5. Run a recurring domain governance review.

Do not create Guide 06, another assessment dimension, a maturity model or a broader resource catalogue unless the task explicitly establishes a distinct, evidenced governance problem that cannot be addressed credibly within the existing material.

## Product boundaries

The Baseline should support governance work, not become another system to operate.

Do not introduce by default:

- scores, benchmarks, maturity ratings or comparative rankings;
- certification, conformance or assurance claims;
- user accounts, retained assessment histories or organisational profiles;
- a backend, database, analytics or telemetry;
- automated DNS, email or public-signal assessment;
- workflow, case-management or reporting-platform capabilities;
- mandatory integrations with ThreatScope Check, .au Domain Observatory (.auDO), TrustSurface or another service;
- provider-specific operating procedures presented as universal controls; or
- speculative features that are not supported by evidence from real use.

Related work may inform or contextualise the Baseline, but it is not a normative dependency.

## Change hierarchy

When evidence justifies a change, prefer the least expansive response that solves the problem:

1. Correct or clarify existing wording.
2. Improve existing supporting guidance.
3. Improve an existing starter record.
4. Improve accessibility or usability.
5. Make a bounded v1.x change if warranted.
6. Reconsider the canonical model only when the existing model no longer credibly addresses an evidenced problem.

Expansion is the last response, not the first.

## Implementation model

The published site is deliberately simple:

- plain HTML, CSS and vanilla JavaScript;
- no framework or build step;
- no runtime dependencies;
- no backend assessment processing;
- no analytics or telemetry;
- copied and printed review output generated locally in the browser; and
- static practical guides with portable Markdown and CSV starter records.

Key paths:

- `index.html` - main interactive Baseline page.
- `js/data.js` - canonical questions, optional follow-on themes and supporting content model.
- `js/app.js` - base interaction and review behaviour.
- `js/reflection-priorities.js` - priority-first review output.
- `js/instrument-enhancements.js` - governance layers, practical pathways, version identity and provenance links.
- `resources/` - five bounded practice guides and starter records.
- `citation/` - public citation, reuse and stewardship surface.
- `reference/v1.0/` - fixed v1.0 reference edition.

## Content and style

- Use Australian English where applicable.
- Use ordinary hyphens rather than em dash characters.
- Keep governance language precise and practical.
- Avoid marketing language, product language and unsupported assurance claims.
- Preserve the distinction between observation and judgement.
- Do not imply that a passing public signal proves good governance or that a missing signal proves negligence.
- Use reserved example domains and fictional organisational details in worked examples.

## Validation expectations

There is no build pipeline to run locally. Validate the smallest relevant surface for the change.

For all changes:

- inspect the complete diff and keep unrelated files out of scope;
- run or emulate `git diff --check` where a local checkout is available;
- confirm internal and external links introduced by the change are correct;
- preserve restrictive security headers unless the change explicitly requires a reviewed policy update; and
- confirm no credentials, organisation-specific records or private operational data are introduced.

For JavaScript changes:

- syntax-check the changed script where tooling is available;
- verify the interactive Baseline still works without a backend; and
- confirm local processing and no-retained-answer behaviour remain true.

For HTML/CSS changes:

- perform a browser review of affected pages when a preview is available;
- check responsive wrapping and keyboard-visible links or controls; and
- check print behaviour when the changed surface is included in printed output.

For canonical or guidance changes:

- state whether the ten canonical questions changed;
- state whether any of the five guide boundaries changed;
- assess whether the change is v1.x-compatible or would require v2.0; and
- update `CHANGELOG.md`, citation/reference material or stewardship documentation only when the substantive change actually warrants it.

## Pull request expectations

A pull request should explain:

- the evidence or concrete problem that justifies the change;
- why the chosen response is proportionate;
- what canonical or bounded surfaces are affected;
- what was deliberately left unchanged; and
- how the change was validated.

Do not treat feature count, traffic or the mere availability of a new technical capability as sufficient justification for expanding the Baseline.

## Licensing and authorship

The authored governance content, including the canonical questions, practical guidance and portable starter records, is licensed under CC BY 4.0 as described in `LICENSE.md`.

The source code is publicly inspectable but is not separately licensed for reuse unless a file or directory states otherwise.

Preserve attribution to Bryan Chetcuti and the established Domain Governance Baseline citation when reproducing or adapting licensed governance content.
