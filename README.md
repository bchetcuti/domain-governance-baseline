# Domain Governance Baseline

A public, standalone guide and self-assessment built on the essay
[Domain Governance as a Trust Surface](https://bryanchetcuti.com/writing/domain-governance-as-a-trust-surface/)
by Bryan Chetcuti.

Intended public home: `https://baseline.bryanchetcuti.com/`.

## Positioning

The Domain Governance Baseline is a public credibility asset first. It is designed for
technology and risk leaders who need to explain domain governance upwards: to executive,
board, risk and service-leadership audiences.

It also aligns with The Trust Practice's Domain Governance Review as a self-service entry
point. ThreatScope Check can remain a utility bridge for externally observable signals, but
this baseline should remain useful without automation.

Core stance:

> Most organisations do not govern the domain layer until something breaks.
>
> Your domain layer is already being read from the outside. The question is whether you
> govern it from the inside.

## What it is

A single-page web tool that turns the essay's 10-question baseline checklist and six
maturity themes into a reflective self-assessment. It is deliberately **not a score** -
consistent with the essay's stance that observation is not judgement.

- **Section 1 - The baseline:** the 10 baseline questions, each answerable as In place /
  Partial / Not in place / Not sure, and tagged as either *externally observable* or
  *internal only*.
- **Section 2 - Maturity themes:** portfolio rationalisation, supplier assurance, change
  control, continuous monitoring, public signal review, and executive reporting.
- **Reflection summary:** a structured, layered output that leads with conversation
  priorities rather than counts. Findings are framed for board / exec / risk, technical,
  and public trust / service impact audiences. Export via copy-to-clipboard or
  print/save-as-PDF.

The output is a reflection summary or conversation brief, not an assurance report,
compliance instrument, maturity score or rating.

## Privacy

Nothing is sent anywhere. There is no backend, no analytics, and no storage - all state
lives in the browser tab and is gone when it closes.

## Tech

Plain HTML + CSS + vanilla JS. No build step, no dependencies. Deploys as static files
to Cloudflare Pages or any static host.

```
index.html
_headers
css/style.css
js/data.js
js/app.js
js/reflection-priorities.js
```

## Extending later

The content model in `js/data.js` is separated from logic. Each externally-observable
question is already tagged, so a future integration could pre-fill the observable half of
the baseline without changing the baseline's self-service value.
