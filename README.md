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

## From baseline to practice

The `/resources/` section provides practical guidance for establishing the basic governance
practices behind the ten questions.

The relationship is deliberately simple:

- the essay explains **why** domain governance matters;
- the baseline reveals **what is unclear**;
- the practical guides explain **what to establish next**.

This is not a maturity model, resource catalogue or separate product surface. Each guide carries
the substantive expertise. Starter files are portable artefacts for use in systems the
organisation already operates.

### Practice guide 01: Establish a domain register

The first guide is intentionally foundational and narrow. It explains how to create a minimum
credible register of registrable domains and material subdomain governance boundaries.

It covers:

- what belongs in scope and why every hostname should not be registered;
- evidence sources beyond a single registrar account;
- business purpose, accountable ownership and technical operation;
- registrar, authoritative DNS and renewal responsibility;
- email use and critical service or supplier dependencies;
- explicit unknowns, next actions and review triggers;
- evidence that the practice exists and common failure modes.

Starter files:

- `resources/downloads/domain-register-template.csv` - blank Excel-compatible CSV;
- `resources/downloads/domain-register-example.csv` - worked example using reserved example domains.

The public route is `https://baseline.bryanchetcuti.com/resources/domain-register/`.

### Practice guide 02: Control registrar and DNS authority

The second guide establishes control over the privileged paths that can renew or transfer domains,
change delegation, alter authoritative DNS and recover authority during an incident.

It covers:

- registration, delegation, DNS and recovery authority boundaries;
- accountable ownership, approval and named privileged administration;
- replacement of shared and personal access;
- MFA, least privilege and scoped automation credentials;
- organisational recovery paths, provider identifiers and emergency contacts;
- transfer, deletion and proportionate registry-level protections;
- approved, evidenced, validated and reversible DNS changes;
- privileged-access review, recovery testing, evidence and common failure modes.

Starter files:

- `resources/downloads/domain-authority-review-template.csv` - blank authority-review CSV;
- `resources/downloads/domain-authority-review-example.csv` - worked registrar, DNS and delegated-zone example;
- `resources/downloads/dns-change-record-template.md` - portable DNS change record for existing ITSM or engineering workflows.

The public route is `https://baseline.bryanchetcuti.com/resources/registrar-dns-authority/`.

### Practice guide 03: Govern email authority and public signals

The third guide connects approved sending authority with the public SPF, DKIM and DMARC evidence
that recipients and external systems can observe.

It covers:

- organisational, sending-system, authentication and public-evidence boundaries;
- approved sending domains, systems, suppliers and business owners;
- visible From, envelope-from / return-path and DKIM signing identities;
- connected governance of SPF, DKIM, DMARC policy and aggregate reporting;
- deliberate treatment of domains that should not send;
- reconciliation of expected authority with observed public mail signals;
- supplier offboarding, temporary exceptions and review triggers;
- evidence that the practice exists and common failure modes.

Starter files:

- `resources/downloads/authorised-sender-register-template.csv` - blank authorised-sender CSV;
- `resources/downloads/authorised-sender-register-example.csv` - worked staff, campaign and non-sending example;
- `resources/downloads/email-public-signal-review-template.md` - portable public-signal review record.

The public route is `https://baseline.bryanchetcuti.com/resources/email-authority-public-signals/`.

Potential later guides are not promised or published as placeholders. Each requires a separate,
validated decision. The likely sequence, if evidence supports it, is:

1. domain incident readiness;
2. recurring domain-governance review.

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
- `css/resources-tokens.css` - intermediate spacing tokens shared by practical-guide pages.
- `css/resources.css` - practical guide layout and responsive / print styling.
- `js/data.js` - checklist questions, optional themes, answer states and signal metadata.
- `js/app.js` - base rendering, state, progress, theme toggle and default reflection logic.
- `js/reflection-priorities.js` - guided-pass interaction, conversation-first reflection output,
  skipped-item handling and copied conversation brief override.
- `js/instrument-enhancements.js` - governance-layer labels, suggested pathways and links from
  reflection findings to the matching practical guide.
- `resources/index.html` - From baseline to practice landing page.
- `resources/domain-register/index.html` - domain-register implementation guide.
- `resources/registrar-dns-authority/index.html` - registrar and DNS authority implementation guide.
- `resources/email-authority-public-signals/index.html` - email authority and public-signals implementation guide.

## Guardrails

The baseline should remain a precise companion to the essay rather than grow into a general
assessment product.

> The baseline should support a governance conversation, not become another system to operate.

Acceptable changes are narrow improvements to:

- the clarity and accuracy of the ten questions and optional guidance;
- accessibility, responsive behaviour and print quality;
- the usefulness of copied or printed reflection notes;
- substantive implementation guidance for a validated governance problem;
- portable starter files that can be adopted into existing organisational systems; and
- transparent versioning of substantive content changes.

The following are out of scope unless the positioning is deliberately reconsidered:

- user accounts or retained assessment histories;
- comparative scoring, benchmarking or maturity ratings;
- automated assurance or compliance claims;
- mandatory integrations with ThreatScope Check or other services;
- workflow, case-management or reporting-platform capabilities;
- generic blank-template catalogues;
- browser-based imitation forms where a portable standard file is more useful; and
- publishing placeholder guides or a promised suite before each practice has been validated.

A new guide should be added only when it can name the specific governance problem it solves,
explain the minimum credible practice, identify evidence and review cadence, and provide a
starter artefact that improves real-world adoption.
