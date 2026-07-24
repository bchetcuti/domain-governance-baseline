# Domain incident runbook

Use this template inside the organisation's existing incident, continuity or knowledge-management process. Link to approved records and vault locations rather than copying credentials or sensitive recovery material into this file.

## Document control

- Runbook owner:
- Accountable business owner:
- Approved location:
- Version:
- Last reviewed:
- Next review:
- Last exercised:
- Related incident, continuity and communications plans:

## 1. Activation

Activate or escalate this runbook when one or more of the following occurs:

- domain expiry, renewal failure or unexpected registration status;
- loss of registrar, reseller or registry access;
- unexpected domain transfer, unlock, contact or nameserver change;
- authoritative DNS outage, deletion, corruption or misrouting;
- loss of DNS-provider access or provider service;
- material SPF, DKIM, DMARC or email-authority failure;
- unexpected public domain, DNS, certificate or email signal;
- suspected compromise of domain-layer authority;
- another event that threatens public identity, service routing or trusted communication.

### Initial severity questions

- Which domain, zone or authority boundary is affected?
- Is registration authority lost or at risk?
- Are public or internal services unavailable or misdirected?
- Is email, identity, authentication or customer communication affected?
- Is there evidence of unauthorised change or active abuse?
- Are essential, safety-related or public-interest services affected?
- Can the organisation still reach providers and communicate through independent channels?

## 2. Roles and decision authority

| Role | Named person or function | Contact path | Authority during incident |
| --- | --- | --- | --- |
| Incident lead |  |  |  |
| Accountable business owner |  |  |  |
| Registrar / registration lead |  |  |  |
| DNS technical lead |  |  |  |
| Email / messaging lead |  |  |  |
| Affected service owner(s) |  |  |  |
| Cyber / risk lead |  |  |  |
| Communications lead |  |  |  |
| Legal / privacy / regulatory contact |  |  |  |
| Executive escalation |  |  |  |

### Emergency decisions

Record who may approve:

- registrar or registry lock changes;
- domain transfer or recovery action;
- nameserver or DNS emergency change;
- email-authority withdrawal or DMARC-policy change;
- supplier escalation or emergency spend;
- customer, stakeholder or public communication;
- acceptance of temporary service or security risk.

## 3. Authority and provider references

Do not place passwords, recovery codes or transfer credentials in this document.

| Boundary | Provider | Account / customer / zone identifier | Emergency support path | Approved recovery-material location |
| --- | --- | --- | --- | --- |
| Registrar / reseller |  |  |  |  |
| Registry or registry-lock service |  |  |  |  |
| Authoritative DNS |  |  |  |  |
| Email / messaging |  |  |  |  |
| Identity / SSO |  |  |  |  |
| Hosting / CDN / application |  |  |  |  |

- Monitored role mailbox available if the primary domain is unavailable:
- Independent telephone or secure-messaging path:
- Enterprise-vault location for recovery codes and support PINs:
- Location of current domain register:
- Location of registrar and DNS authority record:
- Location of authorised-sender register:
- Location of known-good DNS or zone evidence:

## 4. Impact and dependency view

- Affected domains and zones:
- Affected public websites or services:
- Affected internal applications:
- Email impact:
- Identity and authentication impact:
- API and integration impact:
- Suppliers or partners affected:
- Customer, client, community or public impact:
- Known downstream dependencies:
- Recovery priority order and rationale:

## 5. Initial containment

Record only actions that are safe and appropriate to the scenario.

- Preserve current public and provider evidence before change where possible.
- Confirm whether administrative credentials or sessions should be revoked.
- Apply or confirm registrar, registry, transfer or deletion locks where appropriate.
- Prevent additional unauthorised DNS or email-authority change.
- Preserve a known-good copy of relevant DNS state.
- Open and record provider support cases.
- Establish an independent communication channel for the response team.
- Identify changes that require emergency approval.

### Containment actions taken

| Time | Action | Implementer | Approver | Evidence or reference | Outcome |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## 6. Scenario recovery prompts

### Domain expiry or renewal failure

- Confirm registration status, grace or redemption state and provider account.
- Verify the accountable renewal owner and payment path.
- Engage registrar or reseller escalation.
- Confirm whether DNS, email and dependent services remain operational.
- Prevent accidental lapse or unauthorised re-registration where recovery remains possible.

### Registrar compromise or unauthorised transfer

- Preserve registrar notifications, audit evidence and public registration observations.
- Revoke compromised identities and secure recovery channels.
- Apply available transfer or registry protections.
- Engage registrar, reseller and registry escalation as appropriate.
- Verify registration contacts, nameservers, DNSSEC delegation data and renewal settings after recovery.

### Delegation or authoritative DNS failure

- Capture current nameserver and DNS observations.
- Compare with the approved provider and known-good state.
- Restore delegation or records through the safest viable authority path.
- Validate resolution from independent networks and resolvers.
- Validate affected services, email, identity and integrations in recovery-priority order.

### Email-authority or authentication incident

- Identify the affected sending and receiving domains.
- Compare observed SPF, DKIM and DMARC signals with the authorised-sender register.
- Remove unexpected or compromised authority through controlled DNS and provider change.
- Preserve aggregate-report, provider and message evidence where available.
- Validate legitimate sender alignment and receiving behaviour after change.

### Provider outage or loss of access

- Confirm whether the issue is provider-wide, account-specific or identity-related.
- Use the documented secondary administrator, support or recovery path.
- Assess the safe use of alternate DNS, registrar, email or communication arrangements.
- Avoid emergency migration without preserving the current state, dependencies and rollback path.

## 7. Evidence and decision log

| Time | Observation or evidence | Source | Decision | Decision maker | Follow-up reference |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

Evidence may include:

- RDAP or registration status;
- nameserver and DNS records;
- DNSSEC delegation information;
- certificate observations;
- SPF, DKIM and DMARC records;
- DMARC aggregate-report themes;
- provider audit logs and notifications;
- authentication events;
- screenshots, exports and support case records;
- service and synthetic monitoring evidence.

## 8. Communications and obligations

- Internal stakeholders to notify:
- Executive escalation required:
- Customer or service-user communication required:
- Public status or website communication required:
- Supplier or partner communication required:
- Privacy, legal, regulatory or insurer notification considered:
- Law-enforcement or registry escalation considered:
- Approved spokesperson:
- Independent communication channel if primary email is affected:

## 9. Recovery validation

- Registration authority confirmed:
- Registrar and recovery contacts confirmed:
- Nameserver delegation confirmed:
- Authoritative DNS records validated:
- DNSSEC delegation and validation checked where used:
- Public websites and applications validated:
- Email sending and receiving validated:
- Identity and authentication validated:
- Critical APIs and integrations validated:
- Public signals rechecked independently:
- Temporary access, bypasses and emergency changes recorded for removal:

## 10. Closure and follow-up

- Incident outcome:
- Residual uncertainty or accepted risk:
- Domain register updated:
- Authority review record updated:
- Authorised-sender register updated:
- Known-good DNS evidence updated:
- Provider and recovery contacts updated:
- Root cause or contributing factors recorded:
- Post-incident review owner and date:
- Actions transferred to the organisational action system:
- Recurring domain-governance review notified:

## Boundary

This starter runbook supports domain-layer incident readiness. It does not replace the organisation's incident-management, continuity, legal, privacy, regulatory or provider-specific procedures and does not guarantee recovery.
