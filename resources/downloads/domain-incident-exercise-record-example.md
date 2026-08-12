# Domain incident exercise record - worked example

This concise worked example uses the fictional Southern Community Services scenario. It contains no credentials, recovery codes, real account identifiers or personal data.

## Exercise details

- **Exercise date:** 11 August 2026
- **Organisation:** Southern Community Services
- **Accountable owner:** Head of Corporate Services
- **Participants and roles:** normal incident lead; Technology Manager; service communications function; accountable business owner
- **Scenario selected:** "Assume at 9:15 am tomorrow the organisation loses access to authoritative DNS."
- **Domains, zones and services in scope:** `southerncommunity.example`; Cloudflare authoritative DNS; public website, Microsoft 365 and fundraising dependencies
- **Exercise type:** tabletop
- **Related record:** existing service-continuity and action records

## 1. Objective

Test whether the organisation can identify decision authority, locate current domain and DNS-authority evidence, use a secondary administration path, find provider escalation information and sequence service validation after DNS access is recovered.

## 2. Scenario

At 9:15 am the team is told that Southern Community Services has lost access to authoritative DNS. The exercise assumes no dramatic breach narrative. Participants use the normal incident and service-communications process and work from records available outside the affected path.

## 3. Evidence and records located

| Required item | Located | Accessible to more than one person | Current | Notes |
| --- | --- | --- | --- | --- |
| Domain register | Yes | Yes | Yes | Material domains, owners and dependencies can be identified. |
| Registrar / DNS authority record | Yes | Yes | Yes | Cloudflare account reference and secondary administrator can be located. No identifier or recovery secret is copied here. |
| Provider escalation detail | Partial | Yes | Partial | The support path exists, but escalation detail needs completion and validation. |
| Known-good DNS and service-validation evidence | Partial | Yes | Partial | Evidence can be found, but the order for validating dependent services is incomplete. |
| Incident and communications plans | Yes | Yes | Yes | Normal incident leadership and independent service communications are identifiable. |

## 4. Exercise timeline

| Time | Observation or decision | Participant response | Evidence used | Outcome |
| --- | --- | --- | --- | --- |
| 9:15 am | Loss of authoritative-DNS access declared. | Normal incident lead is identified and the existing incident path is activated. | Incident and communications plans. | Leadership and decision route are clear. |
| 9:25 am | Authority and affected services need confirmation. | Technology Manager locates the domain register, authority review, Cloudflare reference and secondary administrator. | Domain register and authority review. | Core evidence is available without disclosing sensitive recovery material. |
| 9:40 am | Provider escalation and recovery validation are considered. | Team identifies incomplete provider escalation detail and an unclear service-validation sequence. | Provider references and dependency record. | Actions are required before a controlled recovery test. |

## 5. Capability assessment

- **What worked:** normal incident leadership, accountable ownership and service communications were identifiable; the Cloudflare reference, secondary administrator, domain register and authority evidence could be located.
- **What remained unclear:** complete provider escalation detail and the sequence for validating website, Microsoft 365 and fundraising dependencies after recovery.
- **Decision:** update the domain incident record and route follow-up through existing service-continuity and Technology, Risk and Service Review records.

## 6. Findings and actions

| Finding or action | Owner | Due date | Destination record | Evidence of completion |
| --- | --- | --- | --- | --- |
| Complete and validate provider escalation detail. | Technology Manager | Before the next quarterly review | Existing service-continuity action record | Updated provider reference reviewed by the secondary administrator. |
| Define the service-validation sequence for material dependencies. | Technology Manager | Before the next quarterly review | Existing change and incident records | Approved validation sequence linked from the incident record. |
| Conduct a future controlled provider-exit or recovery test. | Head of Corporate Services | To be scheduled through the recurring review | Technology, Risk and Service Review action log | Completed controlled-test record and resulting actions. |

## 7. Completion

The tabletop demonstrated improved readiness: normal leadership and communications were usable, and essential organisational evidence and a secondary administration path could be found. The runbook and action records were updated through existing organisational systems.

The provider-exit or recovery capability remains open for a future controlled test. This exercise is evidence of one tabletop under controlled conditions. It is not assurance that every provider, recovery action or real incident will succeed.
