/* ============================================================
   Domain Governance Baseline Self-Assessment - content model
   Source essay: "Domain Governance as a Trust Surface" (Bryan Chetcuti, 2026)
   Philosophy: observation, not judgement. No score. A conversation starter.
   ============================================================ */

/* Neutral link-out target for people who want to see their own external signals.
   The guide itself performs no lookups - this simply points to the right tool. */
const THREATSCOPE_URL = "https://threatscopecheck.com/";

/* Answer states shared across baseline questions */
const ANSWER_STATES = [
  { id: "in_place",     label: "In place",     note: "We can answer this clearly and it holds up." },
  { id: "partial",      label: "Partial",      note: "Some of this exists, but it is incomplete or inconsistent." },
  { id: "not_in_place", label: "Not in place", note: "This is genuinely absent or unmanaged." },
  { id: "unsure",       label: "Not sure",     note: "Nobody here can confidently answer this." },
];

/* Visibility tag: is this signal observable from outside the organisation? */
const VISIBILITY = {
  external: {
    id: "external",
    label: "Externally observable",
    blurb: "Part of your public trust surface - visible to anyone via DNS, RDAP, DMARC or certificate transparency logs.",
  },
  internal: {
    id: "internal",
    label: "Internal only",
    blurb: "Not visible from outside. Depends on internal records, access controls and process.",
  },
};

/* -------------------- SECTION 1: THE BASELINE (verbatim from the essay) -------------------- */
const BASELINE_QUESTIONS = [
  {
    id: "b1",
    question: "Which domains do we own, and why do we own them?",
    visibility: "internal",
    domain: "Ownership & inventory",
    why: "A domain you have forgotten is a domain you cannot govern. An accurate inventory is the precondition for every other control.",
    // Board / exec / technical layered notes for the reflection
    board: "Without a definitive list, the board cannot know what public authority the organisation actually carries.",
    tech: "Reconcile registrar exports, DNS zones and certificate transparency logs against a maintained inventory.",
    publicOrg: "Public-interest bodies often accumulate campaign, program and legacy domains - each one is a potential entry point people trust.",
  },
  {
    id: "b2",
    question: "Who is the accountable business owner for each domain?",
    visibility: "internal",
    domain: "Accountability",
    why: "Technical management is not the same as accountability. Someone at a governance level must own the risk.",
    board: "Accountability should sit with a named role, not a departed individual or an unassigned inbox.",
    tech: "Map each domain to a business owner distinct from its technical operator.",
    publicOrg: "In public bodies, accountability that spans elections, restructures or funding cycles needs to survive turnover.",
  },
  {
    id: "b3",
    question: "Who has registrar access, and how is that access controlled?",
    visibility: "internal",
    domain: "Access control",
    why: "Registrar access is root authority over your public identity. Uncontrolled access is uncontrolled risk.",
    board: "A single shared login or a former staff member holding access is a governance failure waiting to surface.",
    tech: "Enforce MFA, least privilege, and named accounts at the registrar; remove access on offboarding.",
    publicOrg: "Loss of registrar access has taken essential public services offline - recovery can take weeks.",
  },
  {
    id: "b4",
    question: "When do the domains renew, and who receives renewal notices?",
    visibility: "internal",
    domain: "Continuity",
    why: "An expired domain is one of the most common and most avoidable ways a service goes dark.",
    board: "Renewal should not depend on one person noticing an email.",
    tech: "Route renewal notices to a monitored role inbox; consider multi-year registration and auto-renew with payment redundancy.",
    publicOrg: "A lapsed public domain can be re-registered by others and used to impersonate the organisation.",
  },
  {
    id: "b5",
    question: "Which providers host authoritative DNS?",
    visibility: "external",
    domain: "Infrastructure",
    why: "DNS is the control plane for your entire domain. You should know exactly who operates it.",
    board: "Concentration or ambiguity in DNS providers is a continuity and supplier-risk question.",
    tech: "Document authoritative nameservers per zone; understand your provider's resilience and change controls.",
    publicOrg: "Authoritative DNS is externally visible - and so is a fragile or misconfigured setup.",
  },
  {
    id: "b6",
    question: "Which systems and suppliers rely on each domain?",
    visibility: "internal",
    domain: "Dependency mapping",
    why: "A domain rarely serves one thing. A change in one place can break many.",
    board: "Understanding dependencies is what separates a contained incident from a cascading one.",
    tech: "Maintain a dependency map: websites, email, SSO, APIs, third-party integrations bound to each domain.",
    publicOrg: "Service-delivery platforms and identity providers often hang off a single domain in public bodies.",
  },
  {
    id: "b7",
    question: "Which domains are authorised to send email?",
    visibility: "external",
    domain: "Email authority",
    why: "Every domain that can send mail is a domain that can be impersonated if left unauthenticated.",
    board: "Unmanaged sending domains widen the surface for phishing that uses your name against the public.",
    tech: "Enumerate sending domains and sub-domains; apply a null-sending policy to those that should never send.",
    publicOrg: "Impersonation of a trusted public sender directly harms the people the organisation serves.",
  },
  {
    id: "b8",
    question: "Are SPF, DKIM and DMARC configured and reviewed?",
    visibility: "external",
    domain: "Email authentication",
    why: "These are the published, externally visible signals of whether email authentication policy exists.",
    board: "A missing or permissive DMARC policy is one of the most legible weak signals on your trust surface.",
    tech: "Publish SPF, DKIM and a DMARC policy moving toward enforcement; review reports rather than setting and forgetting.",
    publicOrg: "For public senders, an enforced DMARC policy is a baseline expectation, not an advanced control.",
  },
  {
    id: "b9",
    question: "Are DNS changes logged, reviewed and recoverable?",
    visibility: "internal",
    domain: "Change control",
    why: "A change you cannot see or undo is a change you cannot govern.",
    board: "Change control at the DNS layer is where governance meets operational reality.",
    tech: "Keep an audit trail of DNS changes and a recoverable copy of zone state; treat DNS as change-managed infrastructure.",
    publicOrg: "Auditability of changes to public infrastructure is often a compliance expectation in itself.",
  },
  {
    id: "b10",
    question: "What is the incident path if a domain, DNS record or email control fails?",
    visibility: "internal",
    domain: "Incident readiness",
    why: "The worst time to work out who to call is during the incident.",
    board: "A rehearsed incident path is the difference between minutes of disruption and days.",
    tech: "Define escalation, registrar and DNS emergency contacts, and recovery steps before they are needed.",
    publicOrg: "For public services, downtime is not just operational - it erodes the public trust the organisation depends on.",
  },
];

/* -------------------- SECTION 2: MATURITY THEMES (the layer above the baseline) -------------------- */
/* These are reflective, not scored. Each captures the essay's named maturity work
   plus the deeper themes Bryan raised: change control, continuous monitoring, public signal review. */
const MATURITY_STATES = [
  { id: "not_started", label: "Not started",  note: "We have not begun this work." },
  { id: "emerging",    label: "Emerging",     note: "Ad hoc or informal - happening, but not deliberately." },
  { id: "established",  label: "Established",  note: "A defined, repeatable practice." },
  { id: "embedded",    label: "Embedded",     note: "Governed, reviewed and integrated into how we operate." },
];

const MATURITY_THEMES = [
  {
    id: "m1",
    anchor: "portfolio-rationalisation",
    theme: "Domain portfolio rationalisation",
    prompt: "Do we deliberately decide which domains to keep, consolidate or retire - rather than accumulating them?",
    meaning: "Rationalisation is the deliberate, periodic decision about which domains the organisation should hold - treating the portfolio as a managed set rather than an accumulation. It covers active, redundant, defensive and legacy domains, and the choice to consolidate or retire each one.",
    why: "Every domain you hold is a domain you must govern: renew it, secure its access, monitor its signals and account for its risk. An unmanaged portfolio quietly grows the attack surface and the cost of continuity. Retiring a domain is a governance act too - done carelessly, a lapsed domain can be re-registered and used against you.",
    good: "Every domain has a documented reason to exist. Redundant, defensive and legacy domains are reviewed on a cycle, and retirement is a managed decision - not an accidental lapse.",
    failures: [
      "Campaign, product and vanity domains accumulate with no owner and no review date.",
      "Nobody can say why half the portfolio is held, so nothing is ever retired.",
      "A domain is dropped to save cost, then re-registered by a third party who trades on the trust it still carries.",
    ],
    connects: "Builds directly on the inventory and ownership baseline (questions 1–2).",
  },
  {
    id: "m2",
    anchor: "supplier-assurance",
    theme: "Supplier assurance",
    prompt: "Do we hold our registrars, DNS and email providers to defined expectations, and know what happens if one fails?",
    meaning: "Supplier assurance is knowing - and holding to account - the providers who operate parts of your domain layer: registrars, DNS hosts, email and security services. It covers their resilience, their access controls, their security posture and, critically, what happens if one of them fails or you need to leave.",
    why: "The domain layer is largely operated by third parties. Their weaknesses become your weaknesses, and their outages become your outages. Concentration in a single provider is a continuity risk that rarely appears in a risk register until it materialises. Assurance turns an implicit dependency into a governed relationship.",
    good: "Provider resilience, access controls and exit paths are understood and contractually addressed. Supplier concentration risk is visible to the people accountable for continuity.",
    failures: [
      "A single provider operates registration, DNS and email - and there is no plan if they fail.",
      "Nobody has read what the registrar actually guarantees, or how to recover access in an emergency.",
      "An exit path exists in theory but has never been tested, so migration under pressure is unrehearsed.",
    ],
    connects: "Extends the infrastructure and dependency baseline (questions 5–6).",
  },
  {
    id: "m3",
    anchor: "change-control",
    theme: "Change control",
    prompt: "Are changes to domains, DNS and email controls proposed, reviewed, logged and reversible as a matter of course?",
    meaning: "Change control is treating the domain and DNS layer as change-managed infrastructure: changes are proposed, reviewed, logged and reversible, rather than made ad hoc by whoever has access. It matures the baseline question of whether changes are logged into a standing discipline.",
    why: "A single DNS record can redirect your website, break your email or hand an attacker a valid certificate. Most serious domain-layer incidents are not exotic attacks - they are unreviewed changes. A change you cannot see or undo is a change you cannot govern, and the DNS layer is where governance meets operational reality.",
    good: "DNS and domain changes follow a defined process with review and an audit trail. Nothing changes silently, and any change can be traced and rolled back.",
    failures: [
      "Anyone with registrar or DNS access can change records with no review and no record of who did what.",
      "There is no recoverable copy of zone state, so a bad change cannot be cleanly rolled back.",
      "Emergency changes bypass process entirely and are never reconciled afterwards.",
    ],
    connects: "Matures the change-control baseline (question 9) into a standing discipline.",
  },
  {
    id: "m4",
    anchor: "continuous-monitoring",
    theme: "Continuous monitoring",
    prompt: "Do we actively watch our domains, certificates and email signals - rather than discovering problems when something breaks?",
    meaning: "Continuous monitoring is actively watching the domain layer - expiry dates, certificate issuance, DNS drift, DMARC reports - with alerting, so problems are noticed as they emerge rather than when a service breaks. It turns incident readiness from reactive to proactive.",
    why: "The domain layer changes underneath you: certificates are issued, records drift, providers change defaults, and expiry dates arrive. Without monitoring, the first signal of a problem is an outage or an impersonation campaign. Certificate transparency and DMARC reporting mean much of this can be watched - the question is whether anyone is watching.",
    good: "Expiry, certificate issuance, DNS drift and DMARC reports are monitored with alerting. The governance layer is observed continuously, not just at incident time.",
    failures: [
      "Renewal depends on someone noticing an email, and expiry is discovered only when the site goes dark.",
      "Unexpected certificates are issued for your domains and nobody sees the transparency-log entry.",
      "DMARC reports are received but never read, so authentication failures go unnoticed for months.",
    ],
    connects: "Turns the incident-readiness baseline (question 10) from reactive to proactive.",
  },
  {
    id: "m5",
    anchor: "public-signal-review",
    theme: "Public signal review",
    prompt: "Do we periodically look at our own domains the way an outsider would - reviewing the signals that form our public trust surface?",
    meaning: "Public signal review is periodically inspecting your own domains the way an outsider would - looking at DNSSEC, DMARC, RDAP accuracy and certificate transparency as the visible signals that make up your public trust surface. It operationalises the central idea of the essay: parts of the domain layer are observable, and worth observing yourself.",
    why: "Others already read these signals - attackers assessing targets, partners assessing risk, researchers assessing sectors. If you never look at your own trust surface, you are the last to know how it presents. The point is not to chase a perfect scorecard; it is to understand the signals in context, because a passing signal does not prove good management and a missing one does not prove neglect.",
    good: "DNSSEC, DMARC, RDAP accuracy and certificate transparency are reviewed as public signals, understood in context and not treated as a score to game.",
    failures: [
      "The organisation has never looked at its own domains from the outside.",
      "Signals are treated as a score to maximise, rather than as prompts for a governance conversation.",
      "RDAP registration data is stale or incoherent, quietly undermining how legitimate the domain appears.",
    ],
    connects: "Operationalises the essay's central idea: the domain layer is a visible trust surface.",
  },
  {
    id: "m6",
    anchor: "executive-reporting",
    theme: "Executive reporting & digital governance integration",
    prompt: "Does the domain layer appear in board and executive reporting, inside broader digital governance - not just in a technical backlog?",
    meaning: "This is the point where the domain layer stops being a technical backlog item and becomes a governed institutional asset - appearing in board and executive reporting, in plain language, inside the organisation's broader digital governance. It is where all the other themes are made visible to the people accountable.",
    why: "The domain layer already carries identity, communications, service delivery and reputation. If it only lives in a technical backlog, the people accountable for those things cannot govern it, and it surfaces only after a failure. Reporting it as an institutional asset lets an organisation manage digital trust before it is tested, rather than after it has failed.",
    good: "Domain governance is a recurring, plain-language item in risk and digital-governance reporting. Boards can discuss it as an institutional asset, before it is tested rather than after it fails.",
    failures: [
      "The domain layer appears only in IT tickets, invisible to risk and executive oversight.",
      "Reporting is so technical that boards cannot engage with it or ask the right questions.",
      "Domain governance sits outside the digital governance structure entirely, owned by no forum.",
    ],
    connects: "Places the whole surface where the essay argues it belongs - inside digital governance.",
  },
];
