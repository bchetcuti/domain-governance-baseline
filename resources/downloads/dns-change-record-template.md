# DNS change record

Use this template inside the organisation's existing ITSM ticket, engineering issue, change record or incident workflow. Remove fields that do not apply, but preserve enough evidence to attribute, validate and reverse the change.

## Change identity

- **Change reference:**
- **Domain / zone:**
- **Record names and types affected:**
- **Planned implementation date and time:**
- **Change window / expected propagation period:**
- **Normal or emergency change:**

## Reason and impact

- **Reason for change:**
- **Business or service outcome:**
- **Services, users or suppliers that may be affected:**
- **Related incident, project, request or supplier activity:**

## Accountability

- **Requester:**
- **Accountable owner:**
- **Approver:**
- **Implementer:**
- **Supplier contact, where applicable:**

## Current state

Record the current values or attach a zone export, provider export, screenshot or other recoverable evidence.

- **Current record values:**
- **Current TTL values:**
- **Evidence location / attachment:**
- **Date and time captured:**

## Planned change

Describe the exact additions, removals or modifications.

- **Records to add:**
- **Records to modify:**
- **Records to remove:**
- **TTL preparation or sequencing:**
- **Related delegation, DNSSEC, certificate, email or identity change:**

## Risk and dependencies

- **Key dependencies:**
- **Potential failure modes:**
- **Monitoring or support coverage during the change:**
- **Communications required:**

## Validation plan

State how both DNS resolution and the affected service will be checked.

- **Expected DNS result:**
- **Service or user validation:**
- **External validation, where useful:**
- **Validation owner:**
- **Time allowed before escalation or rollback:**

## Rollback plan

- **Exact records or state to restore:**
- **Who can perform rollback:**
- **Conditions that trigger rollback:**
- **Expected recovery or propagation time:**

## Completion

- **Actual implementation date and time:**
- **Implemented by:**
- **Validation evidence:**
- **Deviation from plan:**
- **Incident or issue created:**
- **Final outcome:** Successful / Rolled back / Partially completed / Further action required
- **Retrospective review required:** Yes / No
- **Follow-up owner and date:**
