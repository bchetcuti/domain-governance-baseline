#!/usr/bin/env python3
"""Check the production review workbench's stable DOM and interaction contracts."""
from html.parser import HTMLParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]


class IDs(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
    def handle_starttag(self, tag, attributes):
        for key, val in attributes:
            if key == "id":
                self.ids.append(val)


def main():
    page = (ROOT / "review/index.html").read_text(encoding="utf-8")
    app = (ROOT / "js/app.js").read_text(encoding="utf-8")
    priority = (ROOT / "js/reflection-priorities.js").read_text(encoding="utf-8")
    css = (ROOT / "css/review-workbench.css").read_text(encoding="utf-8")
    parser = IDs()
    parser.feed(page)
    errors = []
    def require(test, message):
        if not test: errors.append(message)

    require(len(parser.ids) == len(set(parser.ids)), "duplicate review DOM ids")
    for item in ("baseline-list", "maturity-list", "review-question-overview",
                 "generate-btn", "review-refresh-notice", "reflection-section",
                 "review-coverage-counts", "review-coverage-label"):
        require(item in parser.ids, "missing DOM contract: " + item)
    require(page.count('id="generate-btn"') == 1, "exactly one summary button required")
    require('<details class="review-optional-panel"' in page, "optional themes must be opt-in")
    require(page.index('id="maturity-section"') > page.index('id="reflection-section"'),
            "optional themes must be within the generated review, not before the brief")
    require(page.index('id="maturity-section"') < page.index('id="review-handoff-heading"'),
            "optional themes must precede governance handoff")
    require(page.count('id="maturity-summary"') == 1,
            "only one visible selected-follow-up destination is permitted")

    require('href="/css/review-workbench.css"' in page, "workbench stylesheet missing")
    require('const ANSWER_STATES = [' in (ROOT / "js/data.js").read_text(encoding="utf-8"), "canonical states missing")
    require('class="m-follow-checkbox"' in app, "optional selection must be a checkbox")
    require('MATURITY_STATES.forEach((s)' not in app, "optional maturity-rating buttons still rendered")
    require('state.maturity[theme.id] = "selected"' in app, "optional follow-up value missing")
    require('document.dispatchEvent(new Event("review:changed"))' in app, "optional change signal missing")
    require('document.addEventListener("review:changed"' in priority and
            'renderSelectedFollowOn();' in priority, "optional change must update selected follow-ups")
    require('function renderSelectedFollowOn()' in priority, "instant selected-topics rendering missing")
    require('function renderReviewOverview()' in priority, "question overview not generated")
    require('if (overview)' in priority and 'card.focus({ preventScroll: true })' in priority,
            "overview navigation must focus question cards")
    require('const selectedThemes = MATURITY_THEMES.filter' in priority,
            "selected themes must flow to summary and export")
    require('MATURITY_STATES.find((entry) => entry.id === chosen).label' not in priority,
            "maturity labels must not be read from an absent rating")
    require(css.count("{") == css.count("}"), "workbench styles unbalanced")
    if errors:
        for e in errors: print("ERROR:", e, file=sys.stderr)
        return 1
    print("Production review workbench contracts pass.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
