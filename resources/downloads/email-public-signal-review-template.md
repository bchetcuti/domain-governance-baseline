# Email authority and public-signal review

Use this record inside an existing governance, risk, messaging, supplier or change process. It does not perform a lookup and is not an assurance report.

## Review details

- Review date:
- Reviewer:
- Accountable owner:
- Reason for review:
- Domains and subdomains in scope:
- Related change, incident, supplier or risk record:

## 1. Expected internal authority

For each domain in scope, identify the approved sending systems from the authorised-sender register.

- Approved sending systems and providers:
- Approved visible From domains:
- Approved envelope-from / return-path domains:
- Approved DKIM signing domains and selectors:
- Domains that should not send:
- Known temporary exceptions:

## 2. Observed public signals

Record the evidence source and observation time. A public signal shows what is published or observable; it does not by itself prove that internal authority is complete or approved.

### Mail routing (MX)

- Observed records:
- Expected receiving provider or posture:
- Difference requiring investigation:

### SPF

- Observed policy:
- Authorised providers represented:
- Unexpected include, redirect, address or permissive mechanism:
- Alignment with approved envelope-from domains:

### DKIM

DKIM selectors are not reliably discoverable without knowing what to query. Validate the selectors recorded for each approved sender or provided by the sending service.

- Selectors tested:
- Signing domains observed:
- Current and valid:
- Unexpected, obsolete or missing selector evidence:

### DMARC

- Observed organisational-domain policy:
- Subdomain policy where relevant:
- Alignment mode and enforcement posture:
- Aggregate report destination:
- Failure or anomaly themes observed in reports:

### Additional transport signals, where used

- MTA-STS policy and mode:
- TLS-RPT destination:
- Other relevant public mail signals:

## 3. Reconcile expected and observed authority

- Approved sender missing from public authorisation:
- Public authorisation with no approved internal owner:
- Domain that should not send but remains permissive:
- Supplier or platform that should have been removed:
- Authentication or alignment inconsistency:
- Observation that requires internal evidence before judgement:

## 4. Decisions and actions

| Decision or action | Owner | Due date | Evidence of completion |
| --- | --- | --- | --- |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

## 5. Completion

- Changes implemented:
- Public signals rechecked:
- DMARC reporting reviewed after change:
- Exceptions approved and expiry recorded:
- Authorised-sender register updated:
- Next scheduled review:
- Final outcome or remaining uncertainty:

## Boundary

This record supports governance of email authority and public evidence. It does not certify deliverability, prevent all impersonation, replace provider-specific engineering guidance or prove control effectiveness on its own.
