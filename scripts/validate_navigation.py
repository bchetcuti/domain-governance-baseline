#!/usr/bin/env python3
"""Validate shared static navigation, footer, page context and shell drift."""
from pathlib import Path
import re
import sys

from sync_site_shell import PUBLIC_PAGES, NAV_SECTIONS, render_page

ROOT = Path(__file__).resolve().parents[1]
NAV_LINKS = (
    ("/", "Overview"),
    ("/walkthrough/", "Walkthrough"),
    ("/resources/", "Practice guides"),
    ("/reference/v1.0/", "Reference"),
)
FOOTER_LINKS = ("Baseline Review", "Worked walkthrough", "Practice guides")
SECTION_TARGETS = {
    "OVERVIEW": "/",
    "WALKTHROUGH": "/walkthrough/",
    "GUIDES": "/resources/",
    "REFERENCE": "/reference/v1.0/",
}


def main() -> int:
    errors: list[str] = []
    header = (ROOT / "templates/site-header.html").read_text(encoding="utf-8").rstrip("\n")
    footer = (ROOT / "templates/site-footer.html").read_text(encoding="utf-8").rstrip("\n")

    for path in PUBLIC_PAGES:
        html = (ROOT / path).read_text(encoding="utf-8")
        try:
            expected = render_page(path, html, header, footer)
            if expected != html:
                errors.append(f"{path}: header/footer does not match canonical template")
        except ValueError as exc:
            errors.append(str(exc))
            continue

        if 'href="/css/navigation.css"' not in html or 'href="/css/site-shell.css"' not in html:
            errors.append(f"{path}: missing shared navigation or shell stylesheet")
        if 'src="/js/theme.js"' not in html:
            errors.append(f"{path}: missing theme control script")
        if html.count('data-theme-toggle') != 1:
            errors.append(f"{path}: expected one theme-toggle control")

        nav = re.search(
            r'<nav class="site-nav shell-nav" aria-label="Primary">(?P<links>.*?)</nav>',
            html,
            flags=re.DOTALL,
        )
        if not nav:
            errors.append(f"{path}: missing primary navigation")
            continue

        content = nav.group("links")
        for href, label in NAV_LINKS:
            if f'href="{href}"' not in content or f">{label}</a>" not in content:
                errors.append(f"{path}: missing navigation item {label}")

        active = re.findall(r'<a href="([^"]+)" aria-current="page">', content)
        section = NAV_SECTIONS.get(path)
        expected_current = [SECTION_TARGETS[section]] if section in SECTION_TARGETS else []
        if active != expected_current:
            errors.append(f"{path}: active navigation {active!r}, expected {expected_current!r}")

        review_action = re.search(r'<a class="shell-review-link"[^>]+>', html)
        if not review_action or 'href="/review/"' not in review_action.group():
            errors.append(f"{path}: missing primary review action")
        elif ('aria-current="page"' in review_action.group()) != (path == "review/index.html"):
            errors.append(f"{path}: incorrect review action current-page state")

        foot = re.search(
            r'<nav class="footer-nav shell-footer-nav" aria-label="Explore">(.*?)</nav>',
            html,
            flags=re.DOTALL,
        )
        if not foot:
            errors.append(f"{path}: missing shared footer exploration")
        else:
            for label in FOOTER_LINKS:
                if f">{label}</a>" not in foot.group(1):
                    errors.append(f"{path}: footer navigation missing {label}")

    if errors:
        print("Site navigation validation failed:", file=sys.stderr)
        for error in errors:
            print("- " + error, file=sys.stderr)
        return 1

    print(f"Site navigation and shell validation passed for {len(PUBLIC_PAGES)} pages.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
