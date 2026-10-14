# Applicability screening decisions

Reviewed 14 October 2026. This is a documented screening policy, not a legal opinion or a country-specific applicability determination.

Both pages retain static questions and small inline `evaluate(answers)` functions. The widget remains a standalone HTML file with no runtime dependencies. Deliberate duplication is checked by development-time tests; there is no shared production rules engine or state-machine framework.

## Sources and resulting decisions

- [CRA regulation, Articles 2–3, 69 and 71](https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng) and the [Commission's CRA summary](https://digital-strategy.ec.europa.eu/en/policies/cra-summary): ask about commercial supply/exclusions, EU product availability and direct **or indirect** data connections, including device interfaces. Explicitly identified Article 2 exclusions produce “Not indicated”; uncertainty stays “May apply.” Standalone SaaS and product-dependent remote processing need separate consideration. Planned availability is not treated as current placement. Reporting starts 11 September 2026; main requirements start 11 December 2027, subject to transition rules. Open-source licensing alone does not establish an exemption; non-commercial/open-source uncertainty is routed to scope review.
- [NIS2, Articles 2, 4 and 26 and Annexes I/II](https://eur-lex.europa.eu/eli/dir/2022/2555/oj/eng), the [Commission's NIS2 FAQ](https://digital-strategy.ec.europa.eu/en/faqs/directive-measures-high-common-level-cybersecurity-across-union-nis2-directive-faqs), and the [EU SME definition](https://eur-lex.europa.eu/eli/reco/2003/361/oj/eng): ask about the entity's own activities in the EU, separately from product sales and customers' sectors. Size means SME classification, not headcount alone. Listed manufacturing can be in scope; small size does not rule out exceptions. DNS/TLD/trust/public-telecom entities get a separate size-independent branch. Finance requires review of DORA and the sector-specific provisions. “Other” does not exclude the many Annex I/II activities absent from this short questionnaire. National law and exact entity type must still be checked.
- [IEC's description of IEC 62443](https://syc-se.iec.ch/deliveries/cybersecurity-guidelines/security-standards-and-best-practices/iec-62443/): ask explicitly about intended industrial automation/control use. Transport or healthcare sector membership alone is insufficient. Intended IACS use returns “Relevant standard,” not a statement that legislation mandates certification. Unknown use or conflicting OT/no-IACS answers require clarification. Contracts and the relevant parts of the series still need review.

## Questions and outputs

Both interfaces now ask the same eight questions with identical answer values:

1. Product type.
2. Commercial CRA scope, an identified exclusion, or uncertainty.
3. Current/planned/no EU product availability.
4. Internet/local-or-indirect/no/unknown data connectivity.
5. Current/no/unknown EU organizational activity.
6. Small/medium/large/unknown EU SME classification.
7. The organization's own activity.
8. Yes/no/unknown intended industrial automation/control use.

The full checker retains four steps of two questions. The widget uses selects. The previously unused personal-data question is replaced by intended industrial use. Required-answer gating includes the final step, and missing answers do not generate results. Both interfaces explain uncertainty using the same labels and text; “Not indicated” means the supplied answers do not indicate scope, not a definitive exemption.

The broader lists are intentionally short. “Other / unsure” is a review route, not an exclusion. The tool does not calculate SME classification, determine national designations, classify a medical device, or decide whether a particular service meets a legal entity definition. A claim of an Article 2 exclusion is supplied by the user and needs confirmation. No fines are estimated from these limited inputs.

The full checker's previous NIST and RED result cards become supplementary guidance. [NIST CSF 2.0](https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20) can be used across organization sizes and sectors. [RED](https://single-market-economy.ec.europa.eu/sectors/electrical-and-electronic-engineering-industries-eei/radio-equipment-directive-red_en) requires a separate radio assessment: local networking does not establish wired-only equipment. Neither is inferred from the answers as a fourth or fifth applicability conclusion.

## Verification and maintenance

`tests/checkers.spec.js` checks independently specified scenarios, all 51,840 valid answer combinations for result parity, identical available answers, missing-answer handling, and browser submission/edit/reset flows. The exhaustive comparison prevents divergence; the scenario expectations are the independent check on chosen outcomes. Update both inline functions and this rationale when changing rules, then run `npm test` as documented in the README.

The widget grows beyond the previous 15 KB claim because it includes the missing questions, scope explanations and source links. The stale size claim is removed from the embed preview. The existing 500×600 iframe remains usable with native vertical scrolling; no iframe resizing library or network submission is added.
