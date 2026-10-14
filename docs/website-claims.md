# Website compliance claims

Reviewed 14 October 2026 against the local Argus checkout at commit `5d66efdec1f003a89ce7907c4bf17f9537385d14`. This records the evidence behind the website wording, not a complete product audit or verification of the deployed Argus version.

## What the implementation supports

| Capability | Evidence and wording boundary |
| --- | --- |
| Configured file checks | [Rule engine](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/rules/engine.go) and [rule configuration](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/config/config.go) support file presence, regex matches and age checks. A match is evidence of that condition, not proof of secure behavior or complete compliance. |
| Freshness checks | [Age evaluation](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/rules/file_age.go) can use Git history or declared document dates. A recent commit or declared date does not independently establish that a substantive review occurred. |
| Pipeline use and recorded results | The [GitHub Action](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/action/action.yml) invokes the agent; the surrounding workflow determines when. The [JSON report](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/output/json.go) includes check time and Git HEAD when available. This is a run snapshot, not continuous observation or proof of an unchanged working tree. |
| Connected evidence | The [runner](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/runner/runner.go) supports optional Jira/GitLab scans and submission to Command Central. [GitLab checks](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/connectors/gitlab/checks/checks.go) and [Jira checks](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/connectors/jira/checks/checks.go) evaluate collected workflow data. The website acknowledges these capabilities as configured integrations. |
| Requirement mappings | Command Central stores [check-to-framework relationships](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/command-central/src/CommandCentral.Domain/Entities/ComplianceCheckFrameworkRule.cs); connectors also carry framework references. The [agent schema](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/config/config.go) does not require a legal clause on every rule. Mappings and coverage need review; “every check mapped to a clause” was too absolute. |

## Public example

The revised illustration uses actual checks from the customer templates:

- [CRA](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/rulesets/cra-customer-template.yaml): `CRA-DOC-003` checks whether `SBOM.json` exists.
- [NIS2](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/rulesets/nis2-customer-template.yaml): `NIS2-INC-001` checks whether `docs/incident-response-plan.md` exists.
- [IEC 62443-4-1](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/rulesets/iec62443-customer-template.yaml): `IEC-SM-001` checks whether `docs/secure-development-lifecycle.md` exists.

Built the inspected agent into `/tmp` and ran these three `file-exists` checks in an isolated temporary directory with empty target files and no server/connector configuration. All three passed, with messages reporting zero-byte files. That is consistent with the rule semantics and demonstrates why a green result must identify the check performed. The illustration now says files were found, labels its commit as an example, and states that content and adequacy need review. Framework labels describe the template context; they are not claims that an entire clause has been satisfied.

## Regulatory sources and editorial decisions

- **CRA:** The [Commission summary](https://digital-strategy.ec.europa.eu/en/policies/cra-summary) explains product scope and conformity assessment routes. Module A is not universally available. The [Regulation, Articles 69 and 71](https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng) separates transition rules from application dates: Article 14 reporting applies from 11 September 2026; the main requirements from 11 December 2027. Replace the blanket “full compliance”/maximum-fines banner with dates and a scope/role/transition review link. Automated evidence checks support assessment; they do not establish conformity.
- **NIS2:** The [Commission overview](https://digital-strategy.ec.europa.eu/en/policies/nis2-directive) describes duties for covered entities, management accountability and national implementation. This is organizational cybersecurity work, not a product certification or general permission to sell. Remove the implied promise of automated incident-reporting deadline management.
- **IEC 62443:** [Part 4-1](https://webstore.iec.ch/en/publication/33615) concerns secure product development processes; [Part 4-2](https://webstore.iec.ch/en/publication/34421) specifies component technical requirements and capability security levels. The current customer template checks development artifacts. It cannot establish a product security level or certification. The website now names that scope.

The official EUR-Lex text was available through indexed excerpts; direct retrieval encountered its browser verification page. The Commission and IEC pages supplied the scope explanations. This review does not resolve national NIS2 applicability or endorse every reference in the Argus templates.

## Scope and maintenance

Update the Argus landing page, home-page product card, checker result CTA and services banner together. Replace the claim that attestation is not evidence with an explanation of engineering review and repeatable checks working together. Remove promises of evidence being “valid right now,” comprehensive automated verification and guaranteed audit readiness.

About and Contact describe consulting experience and services, rather than automatic product assurance; no biography claims were independently verified or rewritten. Questionnaire decisions remain documented separately in [checker-rules.md](checker-rules.md).

Recheck this rationale when the engine, templates or marketed capabilities change. Pin any new implementation evidence to a commit, distinguish released/deployed behavior from inspected code, and verify legal dates and scope against primary sources.
