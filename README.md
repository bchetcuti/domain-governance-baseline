# Domain Governance Baseline

**Domain Governance Baseline** is a practical, ten-question governance starting point for domain ownership, authority, renewal, DNS, email trust, dependencies, change control and incident readiness.

Version 1.0 establishes the ten questions as the stable, citable baseline. Five bounded practice guides help organisations move identified uncertainty into the governance processes and systems they already operate.

The Baseline is authored and stewarded by Bryan Chetcuti. It is intentionally small: not a maturity model, certification scheme, assurance service, assessment platform or workflow product.

## Reference

- **Current version:** v1.0
- **Use the baseline:** https://baseline.bryanchetcuti.com/
- **Fixed v1.0 reference:** https://baseline.bryanchetcuti.com/reference/v1.0/
- **Citation and stewardship:** https://baseline.bryanchetcuti.com/citation/
- **Source essay:** [Domain Governance as a Trust Surface](https://bryanchetcuti.com/writing/domain-governance-as-a-trust-surface/)
- **Author:** [Bryan Chetcuti](https://bryanchetcuti.com/)

Preferred citation:

> Chetcuti, B. (2026). *Domain Governance Baseline* (Version 1.0). https://baseline.bryanchetcuti.com/

Machine-readable citation metadata is available in [`CITATION.cff`](CITATION.cff).

## What the baseline is for

Most organisations do not govern the domain layer until something breaks. The Baseline provides a deliberately simple starting point before or during existing governance moments such as:

- board, executive or risk updates;
- domain, DNS or email incident reviews;
- registrar, DNS, email or digital supplier assurance; and
- recurring domain-governance reviews.

The interactive Baseline turns responses into a **Baseline Review Summary** focused on priorities, evidence needs and practical next actions. It does not produce a score, rating or assurance conclusion.

## The ten canonical questions

Version 1.0 establishes these ten questions as the canonical baseline for the v1 line:

1. Which domains do we own, and why do we own them?
2. Who is the accountable business owner for each domain?
3. Who has registrar access, and how is that access controlled?
4. When do the domains renew, and who receives renewal notices?
5. Which providers host authoritative DNS?
6. Which systems and suppliers rely on each domain?
7. Which domains are authorised to send email?
8. Are SPF, DKIM and DMARC configured and reviewed?
9. Are DNS changes logged, reviewed and recoverable?
10. What is the incident path if a domain, DNS record or email control fails?

The questions are intentionally basic. If an organisation cannot answer one clearly, that uncertainty is the starting point for follow-up.

## From baseline to practice

The five-guide sequence is intentionally complete and bounded. Each guide addresses a practical governance problem exposed by the baseline without creating another operating platform.

| Guide | Purpose |
| --- | --- |
| [01 - Establish a domain register](https://baseline.bryanchetcuti.com/resources/domain-register/) | Know which domains matter, why they exist and who is accountable. |
| [02 - Control registrar and DNS authority](https://baseline.bryanchetcuti.com/resources/registrar-dns-authority/) | Govern privileged authority, recovery paths and material DNS change. |
| [03 - Govern email authority and public signals](https://baseline.bryanchetcuti.com/resources/email-authority-public-signals/) | Connect approved senders with SPF, DKIM and DMARC evidence. |
| [04 - Establish domain incident readiness](https://baseline.bryanchetcuti.com/resources/domain-incident-readiness/) | Prepare the authority, evidence, response and recovery path for domain-layer incidents. |
| [05 - Run a recurring domain governance review](https://baseline.bryanchetcuti.com/resources/recurring-domain-governance-review/) | Keep ownership, authority, email trust and incident readiness current through an existing forum. |

Portable CSV and Markdown starter records are included with the guides for use in existing organisational systems.

## Using the interactive baseline

The published Baseline is deliberately local and lightweight:

- no account;
- no retained answers;
- no backend assessment processing;
- no analytics or telemetry;
- no scoring or comparative benchmark; and
- copied and printed outputs are generated locally in the browser.

Organisations can therefore review ownership gaps, supplier dependencies and incident readiness without placing those answers into another external assessment system.

## Stewardship and versioning

The Baseline is now in stewardship mode rather than continuous feature development.

The governing principle is:

> **Stable core. Slow stewardship. Evidence-led iteration.**

- **v1.x** is reserved for clarification, correction or supporting improvement that does not materially change the substance of the ten canonical questions.
- **v2.0** is considered only if a canonical question is added, removed or materially reframed.
- The five-guide sequence remains bounded by default.
- New ideas do not automatically become new features, guides or assessment dimensions.

See [`STEWARDSHIP.md`](STEWARDSHIP.md) for the change principles, evidence triggers, related-work boundaries and success signals used to govern future iteration.

## Contributing and feedback

Issues and pull requests are welcome where they improve the existing artefact rather than expand it by default.

Particularly useful contributions include:

- factual corrections;
- evidence that wording is unclear in real governance use;
- implementation feedback from organisations or practitioners using the Baseline or guides;
- accessibility and usability improvements;
- improvements to existing starter records; and
- evidence that a material change in domain, DNS, email or governance practice has made existing guidance inaccurate or incomplete.

The ten questions are canonical for the v1 line and the five-guide sequence is intentionally bounded. A proposal or pull request does not imply that the canonical Baseline will expand.

Coding and review agents should follow [`AGENTS.md`](AGENTS.md), which translates these stewardship boundaries into repository-specific implementation and validation instructions.

## Repository implementation

The published site is intentionally simple:

- plain HTML, CSS and vanilla JavaScript;
- no framework or build step;
- no runtime dependencies;
- static practical guides and portable starter files; and
- restrictive browser security headers for the deployed site.

Key repository surfaces include:

- `index.html` - interactive baseline;
- `js/data.js` - canonical questions and optional follow-on themes;
- `resources/` - five bounded practice guides and starter records;
- `reference/v1.0/` - fixed v1.0 reference edition;
- `citation/` - public citation, reuse and versioning information;
- `CITATION.cff` - machine-readable citation metadata;
- `CHANGELOG.md` - substantive artefact change history;
- `STEWARDSHIP.md` - stewardship and versioning position; and
- `AGENTS.md` - repository guidance for coding and review agents.

## Licence and reuse

The authored governance content - including the canonical questions, practical guidance and portable starter records - is licensed under **Creative Commons Attribution 4.0 International (CC BY 4.0)**.

Sharing and adaptation are encouraged with appropriate attribution and an indication of changes.

The source code in this repository is publicly inspectable but is **not separately licensed for reuse** unless a file or directory explicitly states otherwise.

See [`LICENSE.md`](LICENSE.md) for the full repository licensing position.

## Related work

The Domain Governance Baseline remains standalone. Related work may provide evidence or context but is not a normative dependency.

- [.au Domain Observatory (.auDO)](https://audo.bryanchetcuti.com/) - repeated observation of public domain-layer signals.
- [ThreatScope Check](https://threatscopecheck.com/) - point-in-time public evidence.
- [Bryan Chetcuti](https://bryanchetcuti.com/) - source essay, technology leadership and related digital-trust work.
