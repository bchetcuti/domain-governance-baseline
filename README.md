# Domain Governance Baseline

A public, standalone guide and guided self-assessment built on the essay
[Domain Governance as a Trust Surface](https://bryanchetcuti.com/writing/domain-governance-as-a-trust-surface/)
by Bryan Chetcuti.

Published: `https://baseline.bryanchetcuti.com/`.

## Positioning

The Domain Governance Baseline is a public credibility asset first. It is designed for
technology, risk and governance leaders who need to explain domain governance upwards:
to executive, board, risk and service-leadership audiences.

It provides a self-service entry point for domain-governance conversations and can also
support a facilitated Domain Governance Review. ThreatScope Check can act as a utility
bridge for externally observable signals, but this baseline remains useful without
automation.

Core stance:

> Most organisations do not govern the domain layer until something breaks.
>
> Your domain layer is already being read from the outside. The question is whether you
> govern it from the inside.

## What it is

A single-page web tool that turns the essay's 10-question baseline checklist and six
maturity themes into a guided reflection.

The tool is deliberately **not a score**. It follows the essay's position that observation
is not judgement.

- **Section 1 - The baseline:** ten baseline questions covering domain ownership,
  accountability, registrar access, renewal, DNS, dependencies, email authority,
  email authentication, change control and incident readiness.
- **Section 2 - Maturity themes:** portfolio rationalisation, supplier assurance,
  change control, continuous monitoring, public signal review and executive reporting.
- **Reflection Summary / Conversation Brief:** a structured output that leads with
  conversation priorities rather than counts. Findings are framed for board / exec / risk,
  technical, and public trust / service impact audiences.

The output is a reflection summary or conversation brief, not an assurance report,
compliance instrument, maturity score or rating.

## Guided interaction model

The baseline is designed as a guided pass rather than a long static checklist.

- One baseline question or maturity theme is shown at a time.
- Answered or considered items collapse into short summary rows.
- Future items are hidden until the current item is answered or skipped.
- Users can return to earlier items and change their response.
- Users can choose **Show all questions** or **Show all themes** if they prefer to scan.

Skipping is intentionally separate from uncertainty:

- **Not sure** means uncertainty itself is the finding.
- **Skip for now** means the user is choosing not to answer that item in this pass.

Skipped baseline questions are included separately in the reflection output and are not
treated as findings or gaps.

## Privacy

Nothing is sent anywhere.

There is no backend, no analytics and no answer storage. All state lives in the browser
tab and is gone when the tab closes or reloads.

The copied conversation brief and printed/PDF reflection are generated locally in the
browser.

## Tech

Plain HTML, CSS and vanilla JavaScript.

No build step. No framework. No runtime dependencies.

Key files:

- `index.html` - page structure and static content sections.
- `css/style.css` - visual system, layout, responsive behaviour and print styling.
- `js/data.js` - baseline questions, maturity themes, answer states and signal metadata.
- `js/app.js` - base rendering, state, progress, theme toggle and default reflection logic.
- `js/reflection-priorities.js` - guided-pass interaction, conversation-first reflection
  output, skipped-item handling and copied conversation brief override.

## Extending later

The content model in `js/data.js` is separated from the interaction logic. Each
externally observable question is already tagged, so a future integration could pre-fill
or support the observable half of the baseline without changing the baseline's
self-service value.

Any future automation should preserve the tool's core boundary:

> The baseline should support a governance conversation, not become a scorecard.

Potential future extensions:

- pre-fill externally observable signal checks using ThreatScope Check;
- add optional local export/import of an in-progress session;
- add a static printable blank worksheet;
- add a versioned changelog for baseline content changes.