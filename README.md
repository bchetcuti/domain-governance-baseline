# Domain Governance Baseline - Self-Assessment

An interactive, fully standalone self-assessment built on the essay
[Domain Governance as a Trust Surface](https://bryanchetcuti.com/writing/domain-governance-as-a-trust-surface/)
by Bryan Chetcuti.

## What it is

A single-page web tool that turns the essay's 10-question baseline checklist and six
maturity themes into a reflective self-assessment. It is deliberately **not a score** -
consistent with the essay's stance that observation is not judgement.

- **Section 1 - The baseline:** the 10 baseline questions (verbatim from the essay), each
  answerable as In place / Partial / Not in place / Not sure, and tagged as either
  *externally observable* (part of the public trust surface) or *internal only*.
- **Section 2 - Maturity themes:** portfolio rationalisation, supplier assurance, change
  control, continuous monitoring, public signal review, and executive reporting.
- **Reflection:** a structured, layered output (board/risk · technical · public-interest)
  showing conversations worth having, the public trust surface, what's already in place,
  and maturity standing. Export via copy-to-clipboard or print/save-as-PDF.

## Privacy

Nothing is sent anywhere. There is no backend, no analytics, and no storage - all state
lives in the browser tab and is gone when it closes.

## Tech

Plain HTML + CSS + vanilla JS. No build step, no dependencies. Deploys as static files
to Cloudflare Pages (or any static host).

```
index.html
css/style.css
js/data.js    # content model - questions, themes, reflection copy
js/app.js     # rendering, state, reflection logic
```

## Extending later

The content model in `js/data.js` is separated from logic. Each externally-observable
question is already tagged, so a future integration (e.g. live DNSSEC / DMARC / RDAP
lookups via ThreatScope Check) could pre-fill the observable half of the baseline
without touching the rendering or reflection code.
