# Worked walkthrough scenario canon

## Purpose

This file is the narrative source of truth for the worked walkthrough published at `/walkthrough/`.

The walkthrough demonstrates how one fictional organisation moves from uncertain Domain Governance Baseline answers into evidence, accountable decisions, organisational records and recurring governance practice.

It does not define a target state, answer key, maturity model, assurance method or sixth practice guide. The ten canonical Baseline questions and five-guide sequence remain unchanged.

## The organisation

**Southern Community Services** is a fictional, medium-sized Australian not-for-profit organisation headquartered in Melbourne. It provides community services across metropolitan Melbourne and runs public fundraising campaigns to support service delivery.

The organisation is deliberately ordinary rather than unusually mature or unusually weak. Technology is a small internal function supported by external suppliers. Domain-layer responsibilities have accumulated over time across technology, fundraising, communications and a digital agency.

Relevant roles are:

- **Board** - receives risk and service-continuity reporting through existing governance processes.
- **Executive Leadership Team** - accountable for organisational operations and material risk.
- **Head of Corporate Services** - accountable business owner for core organisational technology and the primary domain.
- **Technology Manager** - technical operator for registrar, DNS, Microsoft 365 and related infrastructure.
- **Fundraising Manager** - accountable for fundraising campaigns and the business need for campaign sending authority.
- **Communications Manager** - accountable for public brand and web content.
- **Digital agency** - external supplier operating the public website and performing approved web/DNS changes where required.

The recurring forum used later in the walkthrough is the existing **Technology, Risk and Service Review**. No new committee is created for domain governance.

## Domains and provider context

All domain names are reserved examples. They do not identify a real organisation.

| Domain or boundary | Purpose | Starting context |
| --- | --- | --- |
| `southerncommunity.example` | Primary public identity, website and staff email | Active and clearly material |
| `southernservices.example` | Defensive holding and redirect to the primary site | Known, but its continuing purpose has not recently been reviewed |
| `winterappeal.example` | Previous fundraising campaign domain | Still registered, but absent from the current internal domain list and awaiting a retain/retire decision |
| `appeal.southerncommunity.example` | Current fundraising campaign and supporter communication boundary | Material subdomain operated with a fundraising supplier and digital agency |

Plausible provider relationships are:

- **Registrar:** Melbourne IT for the registered domains.
- **Authoritative DNS:** Cloudflare.
- **Staff email:** Microsoft 365.
- **Fundraising platform:** a fictional SaaS fundraising provider.
- **Public website:** operated with an external Australian digital agency.

These are scenario details only. They are not endorsements, universal control requirements or claims about what is typical across Australian NFPs.

## Governance trigger

The walkthrough begins while Southern Community Services is preparing a public website refresh and a change to its fundraising platform.

During the normal technology and risk review, the proposed change raises several basic questions:

- Which domains does the organisation actually control, and why are they still held?
- Who is accountable for each one?
- Who can alter registration or authoritative DNS?
- Which services and suppliers depend on the domains?
- Which domains and suppliers are authorised to send email?
- What happens if registrar or DNS authority is lost during the change?

The participants can answer parts of these questions, but several answers depend on memory, supplier knowledge or assumptions rather than a current organisational record.

The narrative premise is:

> The organisation does not discover that its domain environment is "bad". It discovers that several important facts exist as assumptions rather than governed evidence.

## Initial Baseline review

Use the ten canonical Baseline questions unchanged.

| # | Initial response | Scenario reason |
| --- | --- | --- |
| 1 | **Partial** | The primary and defensive domains are known, but the registrar export reveals `winterappeal.example`, and the current campaign subdomain is not represented consistently in internal records. |
| 2 | **Partial** | The Head of Corporate Services is clearly accountable for the primary domain, but campaign, defensive and legacy ownership has been treated informally. |
| 3 | **Not sure** | Two internal administrators are expected to have registrar access, but an historic digital-agency access path may still exist and nobody in the review can confirm its current privilege. |
| 4 | **Partial** | Auto-renew is enabled, but renewal notices and payment dependencies rely too heavily on individual mailboxes and knowledge. |
| 5 | **In place** | Cloudflare is known to host authoritative DNS and the current nameserver evidence aligns with that understanding. |
| 6 | **Partial** | The website and Microsoft 365 dependencies are known, but fundraising, redirects and supplier dependencies are not recorded together. |
| 7 | **Not sure** | Microsoft 365 is an approved sender, but the fundraising platform and a previous campaign sending path need to be reconciled with current approval. |
| 8 | **Partial** | SPF, DKIM and DMARC records exist, but evidence of who reviews them, what is expected and whether obsolete supplier authority remains is incomplete. |
| 9 | **Partial** | Cloudflare retains provider audit history and some changes use the existing change process, but agency changes have not always been tied to a consistent approval, validation and rollback record. |
| 10 | **Not in place** | The organisation has an incident-management process, but registrar/DNS recovery contacts, account identifiers, independent communication paths and domain-specific recovery validation are not assembled into a usable incident path. |

Do not convert these responses into a score, percentage, maturity level or assurance conclusion.

## How the findings cluster

The walkthrough must make clear that the review does **not** produce ten independent remediation tasks.

The uncertainties cluster into the five existing practices:

1. **Visibility, purpose, ownership and renewal** - Guide 01: Establish a domain register.
2. **Registrar/DNS authority and recoverability** - Guide 02: Control registrar and DNS authority.
3. **Approved email authority versus observable signals** - Guide 03: Govern email authority and public signals.
4. **Domain-layer response and recovery** - Guide 04: Establish domain incident readiness.
5. **Keeping evidence, decisions and exceptions current** - Guide 05: Run a recurring domain governance review.

No additional framework, control family or assessment dimension should be invented around these clusters.

## Canonical walkthrough outcomes

### Guide 01 - establish visibility and ownership

The organisation reconciles registrar information, Cloudflare zones, Microsoft 365 verified domains, supplier records and known campaign information.

The resulting domain register makes purpose, accountable owner, technical operator, registrar, DNS provider, renewal responsibility, email use and material dependencies visible in one governed record.

`winterappeal.example` remains unresolved. The organisation does **not** automatically retire it. The Fundraising Manager and Communications Manager are assigned a retain/retire decision with a due date.

Renewal notifications are moved towards a monitored organisational role mailbox rather than depending solely on an individual's inbox.

### Guide 02 - establish authority

The authority review confirms named internal administrator access and identifies an historic supplier access path.

The digital agency does not require registrar-level authority for normal website operations. Unnecessary registrar access is removed. Where supplier DNS access remains operationally necessary, it is constrained to the required Cloudflare role or zone rather than broad account authority.

MFA, secondary administration, recovery contacts, account identifiers, transfer protection and the location of recovery material are recorded. Recovery is organisational rather than dependent on one person or personal mailbox.

The organisation also makes material DNS changes traceable to its existing change process, with current state, approval, validation and rollback evidence.

### Guide 03 - reconcile email authority and public evidence

Microsoft 365 is confirmed as the approved staff-mail sender. The current fundraising platform is recorded as an approved supporter-communication path using `appeal.southerncommunity.example`.

A previous campaign sending path is found in historical configuration or public evidence and requires closure or explicit temporary approval.

The walkthrough must preserve this distinction:

> Public observation tells the organisation what appears possible. The authorised-sender record tells it what is approved. Governance requires reconciling the two.

Public SPF, DKIM and DMARC evidence supports the review but does not prove internal approval or overall control effectiveness.

One temporary fundraising/supplier sending exception may remain at the end of the walkthrough, but it must have an owner, rationale and expiry or reconsideration date.

### Guide 04 - exercise incident readiness

Use a simple tabletop prompt:

> Assume at 9:15 am tomorrow the organisation loses access to authoritative DNS.

The exercise should not become a dramatic breach narrative.

The organisation confirms that its normal incident lead and service communications process are usable. It can identify the primary DNS account and a secondary administrator, but the exercise exposes gaps such as provider escalation detail, independent recovery evidence, service-validation sequencing or an untested provider-exit/recovery path.

The runbook is updated with roles, provider references, dependencies, evidence locations, decision authority, recovery validation and follow-up actions.

The exercise finishes successfully enough to demonstrate improved readiness, while leaving at least one concrete recovery or provider-exit test open.

### Guide 05 - keep it true

Southern Community Services does not establish a domain-governance committee.

Instead, a 30-45 minute domain-governance item is incorporated into the existing quarterly **Technology, Risk and Service Review**.

The pre-read draws from the authoritative records already created or improved: domain register, authority review, sender register, renewal horizon, material changes, incidents/near misses, public observations and open actions.

Decisions and actions are routed back into existing organisational systems and records.

## Closing state

The walkthrough must not end with ten "In place" responses or an implied perfect state.

By the end, the organisation can demonstrate that:

- its material domain portfolio and purpose are documented;
- accountable owners are named;
- registrar and DNS authority are attributable and recoverable;
- approved email authority is recorded and reconciled with relevant public evidence;
- domain-layer incident roles and recovery paths are documented and exercised; and
- domain governance now has a recurring place in an existing governance forum.

Material items remain open:

- `winterappeal.example` still requires an explicit retain/retire decision;
- one temporary fundraising/supplier sending exception remains until its defined expiry or migration point; and
- one recovery or provider-exit capability still requires a future test.

The intended closing lesson is:

> Good governance is not achieving a score. It is knowing what is true, what remains uncertain, who owns it, what decision has been made and what happens next.

## Tone and boundaries

The walkthrough should feel Australian through context rather than caricature:

- use Australian English;
- use ordinary Australian NFP, technology, risk and governance language;
- retain the Melbourne/community-services context;
- avoid unnecessary legislative or compliance references;
- avoid implying the fictional environment is representative of the .auDO NFP cohort;
- avoid marketing language and provider endorsement;
- preserve observation versus judgement;
- use ordinary hyphens rather than em dashes.

The walkthrough is evidence of how the existing Baseline can be used. It must not expand what the Baseline claims to be.