# Site shell and guide design preview

This branch is a **visual acceptance prototype** for [#29](https://github.com/bchetcuti/domain-governance-baseline/issues/29), not an estate-wide rollout.

## Intended direction

The homepage now establishes an outcome-led visual voice. This prototype asks whether that voice should be extended through a consistent shell and a practical inner-page treatment before copying it to all public pages.

### Header

- Make the Baseline name and Bryan Chetcuti's authorship consistent rather than using the header byline as a changing page title.
- Make **Overview**, **Walkthrough**, **Practice guides** and **Reference** directly discoverable.
- Give **Start review** a single distinct action treatment without disguising it as the site's product.
- Show a theme control using the existing `js/theme.js` implementation.
- Use a two-row layout at medium widths and a horizontally scrollable navigation line on narrow screens instead of introducing a JavaScript menu.

### Footer

- Begin with a clear route back into the practical review.
- Separate **Use the Baseline**, **Reference & reuse**, and **Related work**.
- Keep authorship and the content licence visible; make boundaries quieter rather than repeating four disclaimers.
- Describe external ecosystem links as context rather than prerequisites. Retain the currently published .auDO link during this prototype, pending confirmation of the migration destination.

### Representative guide: Establish a domain register

- Reuse the broader homepage's two-column, outcome-first introduction.
- Show an explicit **Fictional example** register entry using the existing `southerncommunity.example` fixture from the worked CSV.
- Provide simple in-page orientation to scope, method, starter record, evidence and pitfalls.
- Preserve existing eight-step method, evidence, downloads, original URL, content and print outputs.
- Keep section bodies more editorial and restrained than the homepage. The guide is read and used, not merely promoted.

## Scope / safety

Only `index.html` and `resources/domain-register/index.html` demonstrate the new header/footer. There is one additional scoped stylesheet, `css/shell-preview.css`. The navigation test recognises exactly these two preview pages; all other pages retain their old checks and markup.

No canonical questions, five-guide boundaries, state processing, telemetry, scoring, citation version, downloads, or provider controls change.

## Decisions to validate in preview

1. Does the header feel like one stable authored publication while making the review action immediately obvious?
2. On mobile, does the two-row header with scrollable navigation feel natural, or would a smaller set of visible links be preferable?
3. Does the footer provide the right density of navigation, attribution and related work without becoming a second homepage?
4. Does the guide's fictional register extract help a new practitioner understand what a useful record looks like?
5. Is the guide's visual language clearly related to the homepage while retaining readability and being useful in print?

## Suggested follow-on implementation (after acceptance)

- Build a deterministic **authoring-time shell synchronisation** script using the existing Python tooling. No runtime HTML injection, network fetching, backend or framework. Preserve static rendered HTML at every URL.
- Roll out the approved header/footer in a separate PR across all public pages and expand `scripts/validate_navigation.py` to require consistency without prototype exceptions.
- Then align the walkthrough, resources index, five guides and reference/citation pages in bounded PRs, with visual checks and unchanged canonical material.

A prototype branch should **not** be merged as-is; the static shell must be made maintainable and applied deliberately after visual acceptance.
