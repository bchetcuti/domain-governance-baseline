# Domain Governance Baseline

A lightweight, interactive implementation of the ten-question starting-point checklist from
[Domain Governance as a Trust Surface](https://bryanchetcuti.com/writing/domain-governance-as-a-trust-surface/)
by Bryan Chetcuti.

Published: `https://baseline.bryanchetcuti.com/`.

## Positioning

The Domain Governance Baseline exists to make the essay's checklist easier to use in an
existing governance conversation. It is intentionally small. It is not intended to become
another assessment platform, governance system or product workflow.

It is designed for technology, risk and governance leaders who need a practical prompt before:

- a board, executive or risk update;
- a domain, DNS or email incident review;
- registrar, DNS, email or digital supplier assurance; or
- a quarterly or biannual domain-governance check-in.

Core stance:

> Most organisations do not govern the domain layer until something breaks.
>
> Your domain layer is already being read from the outside. The question is whether you
> govern it from the inside.

## What it is

A single-page checklist that reproduces the essay's ten starting-point questions and turns
answers into a local reflection summary or conversation brief.

The checklist is deliberately **not a score**. It follows the essay's position that observation
is not judgement.

- **The ten-question checklist:** domain ownership, accountability, registrar access, renewal,
  DNS, dependencies, email authority, email authentication, change control and incident readiness.
- **Optional follow-on themes:** portfolio rationalisation, supplier assurance, change control,
  continuous monitoring, public signal review and executive reporting.
- **Reflection Summary / Conversation Brief:** a structured output that leads with conversation
  priorities rather than counts. Findings are framed for board / exec / risk, technical, and
  public trust / service impact audiences.

The output is a reflection summary or conversation brief, not an assurance report, compliance
instrument, maturity score or rating.

## Why it stays local

The absence of a backend is a deliberate benefit, not only a technical constraint.

Organisations can reflect on ownership gaps, supplier dependencies and incident readiness
without placing those answers into another external assessment system.

- no account;
- no retained answers;
- no external assessment processing;
- no analytics or telemetry;
- copied and printed outputs generated locally in the browser.

The intended outcome is governance-ready narrative and questions that can be moved into the
organisation's existing board papers, incident reviews, supplier notes and recurring reports.

## Domain Governance Conversation Kit

The `/resources/` section contains one focused companion resource rather than a template pack.
The Domain Governance Conversation Kit helps a user take the baseline reflection into a real
meeting and leave with decisions, accountable owners, actions and a revisit point.

Resource pages:

- `resources/index.html` - explains the 30-minute conversation method.
- `resources/domain-governance-conversation-kit.html` - locally editable, two-page preparation and outcome kit.
- `js/resources-kit.js` - print and clear controls only; no storage or submission.

The kit is designed to support four existing governance moments:

- board, executive or risk updates;
- domain, DNS or email incident reviews;
- supplier assurance or provider reviews; and
- quarterly or biannual domain-governance check-ins.

Design principles:

- one obvious companion resource;
- locally editable without an account or backend;
- no retained content after refresh or close;
- two-page A4 print target;
- no horizontally compressed tables;
- decisions, owners, actions and dates over status reporting;
- no scoring, rating, certification or assurance framing.

The five earlier blank-template pages were retired because they duplicated each other, created
transcription work and implied a broader reporting product. Their URLs redirect to the Conversation Kit.

## Guided interaction model

The checklist is presented as a guided pass rather than a long static form.

- One checklist question or optional follow-on theme is shown at a time.
- Answered or considered items collapse into short summary rows.
- Future items are hidden until the current item is answered or skipped.
- Users can return to earlier items and change their response.
- Users can choose **Show all questions** or **Show all themes** if they prefer to scan.

Skipping is intentionally separate from uncertainty:

- **Not sure** means uncertainty itself is the finding.
- **Skip for now** means the user is choosing not to answer that item in this pass.

Skipped checklist questions are included separately in the reflection output and are not treated
as findings or gaps.

## Tech

Plain HTML, CSS and vanilla JavaScript.

No build step. No framework. No runtime dependencies.

Key files:

- `index.html` - page structure and static content sections.
- `css/style.css` - visual system, layout, responsive behaviour and print styling.
- `css/resources.css` - Conversation Kit landing, editable fields and two-page print styling.
- `js/data.js` - checklist questions, optional themes, answer states and signal metadata.
- `js/app.js` - base rendering, state, progress, theme toggle and default reflection logic.
- `js/reflection-priorities.js` - guided-pass interaction, conversation-first reflection output,
  skipped-item handling and copied conversation brief override.
- `js/instrument-enhancements.js` - governance-layer labels, suggested pathways and Conversation Kit references.
- `js/resources-kit.js` - local print and clear behaviour for the kit.
- `_redirects` - permanent redirects from retired resource-template URLs.

## Guardrails

The baseline should remain a precise companion to the essay rather than grow into a general
assessment product.

> The baseline should support a governance conversation, not become another system to operate.

Acceptable changes are narrow improvements to:

- the clarity and accuracy of the ten questions and optional guidance;
- accessibility, responsive behaviour and print quality;
- the usefulness of copied or printed reflection notes;
- the relationship between the checklist, source essay and Conversation Kit; and
- transparent versioning of substantive content changes.

The following are out of scope unless the positioning is deliberately reconsidered:

- user accounts or retained assessment histories;
- comparative scoring, benchmarking or maturity ratings;
- automated assurance or compliance claims;
- mandatory integrations with ThreatScope Check or other services;
- workflow, case-management or reporting-platform capabilities; and
- additional templates without a clearly evidenced governance event they improve.
