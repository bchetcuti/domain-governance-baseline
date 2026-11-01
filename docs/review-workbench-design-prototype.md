# Review workbench — design acceptance prototype

This is a **private, isolated design preview** for the next practitioner-adoption improvement. It is not a replacement for `/review/`, and the prototype route is deliberately `noindex,nofollow`.

## What it demonstrates

1. **The ten-question workbench:** a two-column layout with one focused canonical question, selected-state controls, meaningful evidence disclosure and a persistent ten-question overview. One question is interactive; the remaining entries are fictional context, not navigable in this preview.
2. **Optional exploration:** one of the six existing themes, *Supplier assurance*, with supporting guidance on demand and a choice to include the theme as follow-up. No optional maturity rating is collected.
3. **Governance decision brief:** dynamically reflects the changed answer, skipped/unaddressed distinction and selected optional theme. It leads with coverage and evidence requiring follow-up, not a score. Board, technical and public-trust interpretations are disclosed separately. The brief can be copied or printed.

The question (Q03) and supplier-assurance theme (M02) come directly from `js/data.js`. No canonical question or theme content is rewritten. The example is explicitly identified as **fictional Southern Community Services**.

## Fictional scenario and counts

The sample begins with eight of ten answers: four in place, three partial, one not sure. Two remain unaddressed. Q03 is initially *Not sure*; visitors can select a different answer, skip it, or reset to the fictional default. Coverage, follow-up items and print/copy content are recalculated from the same in-memory state. Skipped questions do not become governance findings. Findings are in canonical question order, not automated risk order.

The noninteractive sample answers are not claims about Southern Community Services or any other actual organisation. The preview has no persistence, remote requests, analytics or accounts.

## Design decisions to accept

- The question remains dominant: canonical wording first, with plain-language context and technical evidence available but not compulsory to read.
- Keep the ten-question overview on-screen without exposing ten full-length cards simultaneously. Use the existing four answer states, plus `Skip for now`.
- Do not require optional themes to generate a result; treat them as possible extensions to an existing governance conversation.
- Lead results with completion and follow-up coverage, clear evidence requests and a governance hand-off; make detailed interpretations expandable.
- Copy/print the same fictional findings displayed on screen. Never generate a score, assurance conclusion or automated risk priority.

## What this is not

This prototype does **not** implement the full ten-question interaction, change `/review/`, replace the six optional-theme content model, or add a risk-management platform. It is a decision point before proceeding to two production PRs: (a) the workbench and optional exploration; (b) the results and portable export.

## Validation and release gate

`python3 scripts/validate_review_workbench_prototype.py` and `node --check js/review-workbench-prototype.js` run alongside existing static-site checks in the prototype branch. Visually inspect desktop/mobile, light/dark, and keyboard use. Verify Q03 answer → brief, skip → coverage, optional theme → follow-up, copy, and print. The route should not be linked from the main site.

**Do not merge the design preview into production.** Following visual/interaction acceptance, implement the agreed patterns in the existing `/review/` route behind separate, reviewable PRs. Close the prototype PR when superseded.
