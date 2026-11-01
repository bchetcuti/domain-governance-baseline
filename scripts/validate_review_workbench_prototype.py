#!/usr/bin/env python3
"""Check that the isolated Baseline workbench prototype stays complete and bounded."""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "prototypes/review-workbench/index.html"
CSS = ROOT / "css/review-workbench-prototype.css"
JS = ROOT / "js/review-workbench-prototype.js"
CANONICAL = ROOT / "js/data.js"


class IdParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.external_scripts = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if "id" in attributes:
            self.ids.append(attributes["id"])
        if tag == "script" and attributes.get("src", "").startswith(("http:", "https:")):
            self.external_scripts.append(attributes["src"])


def main():
    html = PAGE.read_text(encoding="utf-8")
    style = CSS.read_text(encoding="utf-8")
    js = JS.read_text(encoding="utf-8")
    data = CANONICAL.read_text(encoding="utf-8")
    parser = IdParser()
    parser.feed(html)
    errors = []

    def require(condition, message):
        if not condition:
            errors.append(message)

    require(len(parser.ids) == len(set(parser.ids)), "Duplicate ID in preview HTML")
    require(not parser.external_scripts, "Unexpected external JavaScript")
    require('<meta name="robots" content="noindex,nofollow">' in html,
            "Isolated design prototype must not be indexed")
    for path in ("/js/data.js", "/js/review-workbench-prototype.js",
                 "/css/style.css", "/css/site-shell.css",
                 "/css/review-workbench-prototype.css"):
        require(path in html, f"Missing source dependency: {path}")
        require((ROOT / path.lstrip("/")).is_file(), f"Dependency file is missing: {path}")

    for step in ("review", "explore", "brief"):
        require(f'id="stage-{step}"' in html, f"Missing {step} stage")
        require(f'data-stage-target="{step}"' in html, f"No way to navigate to {step}")
        require(f'id="stage-{step}-title"' in html, f"Missing {step} heading")

    for field in ("prototype-question", "question-overview", "prototype-answer-options",
                  "brief-findings", "metric-answered", "metric-open", "metric-unaddressed",
                  "include-theme", "brief-theme-section", "brief-copy", "brief-print",
                  "skip-answer", "reset-answer", "unaddressed-items"):
        require(field in parser.ids, f"Missing interactive hook: {field}")

    for term in ("BASELINE_QUESTIONS.find((entry) => entry.id === \"b3\")",
                 "MATURITY_THEMES.find((entry) => entry.id === \"m2\")"):
        require(term in js, "Prototype must use canonical model: " + term)
    for phrase in ("Who has registrar access, and how is that access controlled?",
                   'id: "m2"', 'theme: "Supplier assurance"'):
        require(phrase in data, "Expected canonical content missing: " + phrase)

    require("Fictional example" in html and "Southern Community Services" in html,
            "Fictional content needs prominent identification")
    require("Object.hasOwn(responses, q.id)" in js and "skipped.add(question.id)" in js,
            "Coverage and skip behaviour must be explicit")
    require("window.localStorage" not in js and "fetch(" not in js and
            "sessionStorage" not in js, "Prototype must not store or transmit responses")
    require("risk or maturity rating" in js and "No score" in js,
            "Boundary language is required in the generated brief")
    require(len(re.findall(r"\{", style)) == len(re.findall(r"\}", style)),
            "Stylesheet braces are not balanced")
    require("#stage-brief[hidden]" in style and "@media print" in style,
            "Print should expose the brief and suppress the workbench")
    if errors:
        print("Workbench prototype validation failed:", file=sys.stderr)
        for error in errors:
            print(" - " + error, file=sys.stderr)
        return 1
    print("Workbench prototype validated: canonical source, interactions, privacy and page structure.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
