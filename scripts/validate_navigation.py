#!/usr/bin/env python3
"""Validate global navigation across public Domain Governance Baseline HTML pages."""

from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]

PUBLIC_PAGES = {
    "index.html": None,
    "404.html": None,
    "review/index.html": "/review/",
    "citation/index.html": None,
    "reference/v1.0/index.html": None,
    "walkthrough/index.html": "/walkthrough/",
    "resources/index.html": "/resources/",
    "resources/domain-register/index.html": "/resources/",
    "resources/registrar-dns-authority/index.html": "/resources/",
    "resources/email-authority-public-signals/index.html": "/resources/",
    "resources/domain-incident-readiness/index.html": "/resources/",
    "resources/recurring-domain-governance-review/index.html": "/resources/",
}

PRIMARY_LINKS = (
    ('href="/review/"', ">Review</a>"),
    ('href="/resources/"', ">Practice guides</a>"),
    ('href="/walkthrough/"', ">Walkthrough</a>"),
)

FOOTER_LABELS = (
    "Baseline Review",
    "Practice guides",
    "Worked walkthrough",
)


def fail(message: str, failures: list[str]) -> None:
    failures.append(message)


def main() -> int:
    failures: list[str] = []

    for relative_path, active_href in PUBLIC_PAGES.items():
        path = ROOT / relative_path
        if not path.exists():
            fail(f"{relative_path}: file is missing", failures)
            continue

        html = path.read_text(encoding="utf-8")

        if 'href="/css/navigation.css"' not in html:
            fail(f"{relative_path}: missing shared navigation stylesheet", failures)

        if 'src="/js/theme.js"' not in html:
            fail(f"{relative_path}: missing shared theme control", failures)

        nav_match = re.search(
            r'<nav class="site-nav" aria-label="Primary">(?P<body>.*?)</nav>',
            html,
            flags=re.DOTALL,
        )
        if not nav_match:
            fail(f"{relative_path}: missing primary site navigation", failures)
            continue

        nav = nav_match.group("body")
        for href, label in PRIMARY_LINKS:
            if href not in nav or label not in nav:
                fail(f"{relative_path}: missing primary navigation item {label[1:-4]}", failures)

        active_links = re.findall(
            r'<a href="([^"]+)" aria-current="page">', nav
        )
        expected = [] if active_href is None else [active_href]
        if active_links != expected:
            fail(
                f"{relative_path}: aria-current links {active_links!r}, expected {expected!r}",
                failures,
            )

        footer_match = re.search(
            r'<nav class="footer-nav" aria-label="Explore">(?P<body>.*?)</nav>',
            html,
            flags=re.DOTALL,
        )
        if not footer_match:
            fail(f"{relative_path}: missing Explore footer navigation", failures)
        else:
            footer = footer_match.group("body")
            for label in FOOTER_LABELS:
                if f">{label}</a>" not in footer:
                    fail(f"{relative_path}: footer label is not normalised: {label}", failures)

    if failures:
        print("Navigation validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print(f"Navigation validation passed for {len(PUBLIC_PAGES)} public HTML pages.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
