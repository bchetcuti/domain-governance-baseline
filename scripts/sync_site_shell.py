#!/usr/bin/env python3
"""Synchronise static header/footer markup without a runtime include or build step.

Usage:
  python scripts/sync_site_shell.py --write  # authoring-time updates
  python scripts/sync_site_shell.py --check  # CI/local drift check (default)

Each published HTML file remains fully static and self-contained.
"""
from __future__ import annotations

import argparse
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_PAGES = (
    "index.html",
    "404.html",
    "review/index.html",
    "citation/index.html",
    "reference/v1.0/index.html",
    "walkthrough/index.html",
    "resources/index.html",
    "resources/domain-register/index.html",
    "resources/registrar-dns-authority/index.html",
    "resources/email-authority-public-signals/index.html",
    "resources/domain-incident-readiness/index.html",
    "resources/recurring-domain-governance-review/index.html",
)
NAV_SECTIONS = {
    "index.html": "OVERVIEW",
    "walkthrough/index.html": "WALKTHROUGH",
    "review/index.html": "REVIEW",
    "resources/index.html": "GUIDES",
    "resources/domain-register/index.html": "GUIDES",
    "resources/registrar-dns-authority/index.html": "GUIDES",
    "resources/email-authority-public-signals/index.html": "GUIDES",
    "resources/domain-incident-readiness/index.html": "GUIDES",
    "resources/recurring-domain-governance-review/index.html": "GUIDES",
    "reference/v1.0/index.html": "REFERENCE",
    "citation/index.html": "REFERENCE",
}
HEADER_RE = re.compile(
    r'(?m)^[ \t]*<header class="site-header(?: shell-header)?">[\s\S]*?^[ \t]*</header>'
)
FOOTER_RE = re.compile(
    r'(?m)^[ \t]*<footer class="site-footer(?: shell-footer)?">[\s\S]*?^[ \t]*</footer>'
)
STYLESHEET = '  <link rel="stylesheet" href="/css/site-shell.css" />'
NAV_CSS = '  <link rel="stylesheet" href="/css/navigation.css" />'


def site_header(path: str, template: str) -> str:
    active = NAV_SECTIONS.get(path)
    result = template
    for section in ("OVERVIEW", "WALKTHROUGH", "GUIDES", "REFERENCE", "REVIEW"):
        placeholder = "{{ACTIVE_" + section + "}}"
        assert result.count(placeholder) == 1, f"Missing unique token {placeholder}"
        result = result.replace(placeholder, ' aria-current="page"' if active == section else "")
    return result


def render_page(path: str, html: str, header: str, footer: str) -> str:
    replacement = site_header(path, header)
    updated, header_count = HEADER_RE.subn(lambda _match: replacement, html)
    if header_count != 1:
        raise ValueError(f"{path}: expected 1 header, found {header_count}")
    updated, footer_count = FOOTER_RE.subn(lambda _match: footer, updated)
    if footer_count != 1:
        raise ValueError(f"{path}: expected 1 footer, found {footer_count}")
    if NAV_CSS not in updated:
        raise ValueError(f"{path}: shared navigation stylesheet missing")
    if STYLESHEET not in updated:
        updated = updated.replace(NAV_CSS, NAV_CSS + "\n" + STYLESHEET, 1)
    if updated.count(STYLESHEET) != 1:
        raise ValueError(f"{path}: duplicate shared shell stylesheet")
    return updated


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--write", action="store_true", help="Regenerate static shell on all pages")
    group.add_argument("--check", action="store_true", help="Fail if HTML differs from templates")
    args = parser.parse_args()

    header = (ROOT / "templates/site-header.html").read_text(encoding="utf-8").rstrip("\n")
    footer = (ROOT / "templates/site-footer.html").read_text(encoding="utf-8").rstrip("\n")
    changed: list[str] = []
    for relative in PUBLIC_PAGES:
        path = ROOT / relative
        existing = path.read_text(encoding="utf-8")
        desired = render_page(relative, existing, header, footer)
        if desired != existing:
            changed.append(relative)
            if args.write:
                path.write_text(desired, encoding="utf-8")

    if changed and not args.write:
        print("Site shell drift: " + ", ".join(changed), file=sys.stderr)
        print("Run: python scripts/sync_site_shell.py --write", file=sys.stderr)
        return 1

    action = "Updated" if args.write else "Validated"
    print(f"{action} {len(PUBLIC_PAGES)} static public pages; {len(changed)} changed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
