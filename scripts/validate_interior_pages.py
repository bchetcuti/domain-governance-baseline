#!/usr/bin/env python3
"""Validate the five bounded practice guides and visual page anchors."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
GUIDES = {
    "domain-register": ("scope", "establish", "fields", "evidence", "failure-modes"),
    "registrar-dns-authority": ("authority-boundaries", "establish", "authority-record", "change-record", "evidence", "failure-modes"),
    "email-authority-public-signals": ("authority-boundaries", "establish", "sender-register", "public-signal-review", "evidence", "failure-modes"),
    "domain-incident-readiness": ("incident-scope", "establish", "runbook", "exercise", "evidence", "failure-modes"),
    "recurring-domain-governance-review": ("review-boundary", "establish", "agenda", "action-log", "evidence", "failure-modes"),
}


def fail(errors: list[str], path: str, message: str) -> None:
    errors.append(f"{path}: {message}")


def main() -> int:
    errors: list[str] = []
    for slug, anchors in GUIDES.items():
        relative = f"resources/{slug}/index.html"
        page = ROOT / relative
        html = page.read_text(encoding="utf-8")

        if html.count("<h1>") != 1:
            fail(errors, relative, "expected exactly one H1")
        if html.count('class="guide-contents"') != 1:
            fail(errors, relative, "expected one local table of contents")
        if 'href="/css/inner-pages.css"' not in html:
            fail(errors, relative, "shared interior stylesheet missing")
        if 'guide-preview-hero-grid' not in html:
            fail(errors, relative, "guide output-led header missing")

        steps = re.findall(r'class="step-number">(\d+)</div>', html)
        if steps != [str(i) for i in range(1, 9)]:
            fail(errors, relative, f"eight method steps changed: {steps}")

        for anchor in anchors:
            if f'id="{anchor}"' not in html or f'href="#{anchor}"' not in html:
                fail(errors, relative, f"missing or unlinked guide anchor: {anchor}")

        for href in re.findall(r'href="([^"]+)"\s+download\b', html):
            if href.startswith(("http:", "https:", "/")):
                fail(errors, relative, f"unexpected non-relative download: {href}")
                continue
            target = (page.parent / href).resolve()
            if not target.is_file() or not target.is_relative_to(ROOT.resolve()):
                fail(errors, relative, f"missing downloaded file: {href}")

    register = (ROOT / "resources/domain-register/index.html").read_text(encoding="utf-8")
    example = (ROOT / "resources/downloads/domain-register-example.csv").read_text(encoding="utf-8")
    if "Fictional example" not in register or "southerncommunity.example" not in register:
        fail(errors, "resources/domain-register/index.html", "fictional record label or domain missing")
    if "southerncommunity.example" not in example:
        fail(errors, "resources/downloads/domain-register-example.csv", "fixture reference missing")

    index = (ROOT / "resources/index.html").read_text(encoding="utf-8")
    if 'class="practice-map"' not in index or index.count('href="/css/inner-pages.css"') != 1:
        fail(errors, "resources/index.html", "missing practice pathway or shared styling")

    walkthrough = (ROOT / "walkthrough/index.html").read_text(encoding="utf-8")
    if 'class="walkthrough-orientation"' not in walkthrough or "Fictional example" not in walkthrough:
        fail(errors, "walkthrough/index.html", "fictional context missing")
    if 'id="initial-review"' not in walkthrough or 'class="table-scroll"' not in walkthrough:
        fail(errors, "walkthrough/index.html", "review evidence or accessible table missing")

    for relative in ("reference/v1.0/index.html", "citation/index.html"):
        html = (ROOT / relative).read_text(encoding="utf-8")
        if 'class="editorial-page"' not in html or 'href="/css/inner-pages.css"' not in html:
            fail(errors, relative, "editorial presentation missing")

    if errors:
        print("Interior page validation failed:", file=sys.stderr)
        for error in errors:
            print("- " + error, file=sys.stderr)
        return 1
    print("Interior page validation passed for five guides, walkthrough and reference surfaces.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
