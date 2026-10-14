# Website compliance claims

Reviewed 14 October 2026 against the local Argus checkout at commit `5d66efdec1f003a89ce7907c4bf17f9537385d14`. This records the evidence behind the website wording, not a complete product audit or verification of the deployed Argus version.

## Product scope

The product owner defines Argus’s rules as designed for compliance coverage within a broader compliance plan. That plan assigns requirements to automated checks or to other methods, which may include manual assessments. Activities assigned to those other methods are outside Argus’s scope. Website copy should present the automated coverage and its evidence as the product’s purpose.

This product intent comes from the owner. The implementation references below substantiate how the checks execute and record results; they are not an assessment of a customer’s complete coverage plan.

## What the implementation supports

| Capability | Implementation evidence |
| --- | --- |
| Configured file checks | [Rule engine](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/rules/engine.go) and [rule configuration](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/config/config.go) support file presence, regex matches and age checks. Each result records whether the condition defined by that rule was met. |
| Freshness checks | [Age evaluation](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/rules/file_age.go) can use Git history or declared document dates. The rule selects the date source and age threshold relevant to its intended coverage. |
| Pipeline use and recorded results | The [GitHub Action](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/action/action.yml) invokes the agent; the surrounding workflow determines when. The [JSON report](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/output/json.go) includes check time and Git HEAD when available. Describe the evidence in terms of the checks and the time of each run. |
| Connected evidence | The [runner](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/runner/runner.go) supports optional Jira/GitLab scans and submission to Command Central. [GitLab checks](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/connectors/gitlab/checks/checks.go) and [Jira checks](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/connectors/jira/checks/checks.go) evaluate collected workflow data. The website acknowledges these capabilities as configured integrations. |
| Requirement mappings | Command Central stores [check-to-framework relationships](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/command-central/src/CommandCentral.Domain/Entities/ComplianceCheckFrameworkRule.cs); connectors also carry framework references. The [agent schema](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/config/config.go) executes configured rules. Present requirement coverage as a rule-design decision; a legal-clause field is not required on every agent rule. |

## Public example

The revised illustration uses actual checks from the customer templates:

- [CRA](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/rulesets/cra-customer-template.yaml): `CRA-DOC-003` checks whether `SBOM.json` exists.
- [NIS2](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/rulesets/nis2-customer-template.yaml): `NIS2-INC-001` checks whether `docs/incident-response-plan.md` exists.
- [IEC 62443-4-1](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/rulesets/iec62443-customer-template.yaml): `IEC-SM-001` checks whether `docs/secure-development-lifecycle.md` exists.

The illustration names the conditions these checks evaluate and labels the commit as an example. A local run confirmed their file-presence behavior. That exercise verified individual check semantics; it did not evaluate the coverage of a complete rule set or compliance plan. Each check’s role is determined by that design.

## Regulatory sources and editorial decisions

- **CRA:** The [Commission summary](https://digital-strategy.ec.europa.eu/en/policies/cra-summary) explains product scope and conformity assessment routes. Module A is not universally available. The [Regulation, Articles 69 and 71](https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng) separates transition rules from application dates: Article 14 reporting applies from 11 September 2026; the main requirements from 11 December 2027. Replace the blanket “full compliance”/maximum-fines banner with dates and a scope/role/transition review link. Describe Argus’s automated contribution within the compliance plan.
- **NIS2:** The [Commission overview](https://digital-strategy.ec.europa.eu/en/policies/nis2-directive) describes duties for covered entities, management accountability and national implementation. Frame the rules around organizational cybersecurity duties. The website describes the implemented evidence checks without promising an incident-reporting service.
- **IEC 62443:** [Part 4-1](https://webstore.iec.ch/en/publication/33615) concerns secure product development processes; [Part 4-2](https://webstore.iec.ch/en/publication/34421) specifies component technical requirements and capability security levels. The current customer template checks development artifacts relevant to Part 4-1. Name that scope rather than promising product security-level verification or certification.

The official EUR-Lex text was available through indexed excerpts; direct retrieval encountered its browser verification page. The Commission and IEC pages supplied the scope explanations. This review does not resolve national NIS2 applicability or endorse every reference in the Argus templates.

## Scope and maintenance

Keep the Argus landing page, home-page product card and checker result CTA aligned around defined automated coverage and recorded evidence. Explain the boundary of automation once. Present the rules as designed parts of the compliance plan, and describe the checks performed precisely. Keep regulatory scope and dates grounded in primary sources.

About and Contact describe consulting experience and services, rather than automatic product assurance; no biography claims were independently verified or rewritten. Questionnaire decisions remain documented separately in [checker-rules.md](checker-rules.md).

Recheck this rationale when the engine, templates or marketed capabilities change. Pin any new implementation evidence to a commit, distinguish released/deployed behavior from inspected code, and verify legal dates and scope against primary sources.
