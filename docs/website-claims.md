# Website compliance claims

Reviewed 14 October 2026 against the local Argus checkout at commit `5d66efdec1f003a89ce7907c4bf17f9537385d14`. This records the evidence behind the website wording, not a complete product audit or verification of the deployed Argus version.

## Product and message

The central product is the rules engine and evidence capture. Customers can introduce automated compliance checking into development even when they have no such capability today. Lead with the value: written procedures become repeatable pipeline checks, failures become actionable development work, and each run contributes evidence.

The attestation argument is central. A periodic manual observation establishes that a condition was met when inspected. Repeated automated checks build a recorded history of that condition across development. “Continuous evidence” means evidence captured on successive runs; the public example says “every checked build.” The message focuses on automating checkable facts within the customer’s compliance programme.

Customers have different starting points:

- Established teams can translate their ISMS controls, contractual obligations and internal policies into rules, including requirements beyond EU regulations.
- Teams establishing their approach can use starter rule sets and optional Attigo consulting to define rules and complementary manual procedures.

The supplied CRA, NIS2 and IEC rule sets are easy starting points, not complete framework solutions. Rules are designed with compliance coverage in mind. Requirements assigned to other methods remain outside Argus’s scope; the product page does not frame those deliberate choices as unfinished work.

The operational example is a missing SBOM in a new project or evidence older than a configured policy permits. Argus exposes a failing check in the pipeline. The team can prioritise and assign the work in its normal planning process, and later runs check the condition again. This describes the team acting on results; it does not claim that Argus automatically creates or assigns development tasks.

## Public illustration

The hero shows three illustrative runs of the same SBOM-presence check. Each row has a time, an example commit and a PASS result. This makes the repeated observation tangible: “The SBOM was present in every checked build.” It is a marketing illustration of recorded run data, not a screenshot of a specific product screen.

The [CRA customer template’s `CRA-DOC-003` rule](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/rulesets/cra-customer-template.yaml) checks for `SBOM.json`. The [JSON report](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/output/json.go) supplies result, check time and available Git commit. The illustrated times and commits are fictional. The earlier local run verified the rule’s file-presence semantics; it was not an evaluation of a complete compliance plan.

## What the implementation supports

| Capability | Implementation evidence |
| --- | --- |
| Configured file checks | [Rule engine](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/rules/engine.go) and [rule configuration](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/config/config.go) support file presence, regex matches and age checks. Each result records whether the condition defined by that rule was met. |
| Freshness checks | [Age evaluation](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/rules/file_age.go) can use Git history or declared document dates. The rule selects the date source and age threshold relevant to its intended coverage. |
| Pipeline use and recorded results | The [GitHub Action](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/action/action.yml) invokes the agent; the surrounding workflow determines when. The [JSON report](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/output/json.go) includes check time and Git HEAD when available. Describe the evidence in terms of the checks and the time of each run. |
| Connected evidence | The [runner](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/runner/runner.go) supports optional Jira/GitLab scans and submission to Command Central. [GitLab checks](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/connectors/gitlab/checks/checks.go) and [Jira checks](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/connectors/jira/checks/checks.go) evaluate collected workflow data. The website acknowledges these capabilities as configured integrations. |
| Pipeline feedback | The [runner’s exit-code handling](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/runner/runner.go) exposes rule failures to CI; the pipeline configuration determines how the team uses those results. |
| Requirement mappings | Command Central stores [check-to-framework relationships](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/command-central/src/CommandCentral.Domain/Entities/ComplianceCheckFrameworkRule.cs); connectors also carry framework references. The [agent schema](https://github.com/attigodk/argus/blob/5d66efdec1f003a89ce7907c4bf17f9537385d14/agent/internal/config/config.go) executes configured rules. Present requirement coverage as a rule-design decision; a legal-clause field is not required on every agent rule. |

## Regulatory sources and editorial decisions

- **CRA:** The [Commission summary](https://digital-strategy.ec.europa.eu/en/policies/cra-summary) explains product scope and conformity assessment routes. Module A is not universally available. The [Regulation, Articles 69 and 71](https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng) separates transition rules from application dates: Article 14 reporting applies from 11 September 2026; the main requirements from 11 December 2027. Replace the blanket “full compliance”/maximum-fines banner with dates and a scope/role/transition review link. Describe Argus’s automated contribution within the compliance plan.
- **NIS2:** The [Commission overview](https://digital-strategy.ec.europa.eu/en/policies/nis2-directive) describes duties for covered entities, management accountability and national implementation. Frame the rules around organizational cybersecurity duties. The website describes the implemented evidence checks without promising an incident-reporting service.
- **IEC 62443:** [Part 4-1](https://webstore.iec.ch/en/publication/33615) concerns secure product development processes; [Part 4-2](https://webstore.iec.ch/en/publication/34421) specifies component technical requirements and capability security levels. The current customer template checks development artifacts relevant to Part 4-1. Name that scope rather than promising product security-level verification or certification.

The official EUR-Lex text was available through indexed excerpts; direct retrieval encountered its browser verification page. The Commission and IEC pages supplied the scope explanations. This review does not resolve national NIS2 applicability or endorse every reference in the Argus templates.

## Scope and maintenance

Keep the Argus landing page, home-page product card and checker CTA aligned around introducing automated checks, actionable pipeline feedback and evidence captured through development. Give the rules engine and evidence capture the lead; place starter sets and optional consulting in supporting sections. Preserve the attestation argument through specific, repeatable observations. Keep regulatory scope and dates grounded in primary sources.

About and Contact describe consulting experience and services, rather than automatic product assurance; no biography claims were independently verified or rewritten. Questionnaire decisions remain documented separately in [checker-rules.md](checker-rules.md).

Recheck this rationale when the engine, templates or marketed capabilities change. Pin any new implementation evidence to a commit, distinguish released/deployed behavior from inspected code, and verify legal dates and scope against primary sources.
