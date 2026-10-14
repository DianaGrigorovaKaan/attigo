# Accessibility and browser review

Reviewed 14 October 2026. Scope: Home, Services, About, Contact, Argus,
Applicability Checker and the standalone widget. Logo preview/design files are
outside the public-site review.

## Findings and changes

- The six site pages lacked a main landmark and a way to skip repeated navigation.
  Each now has a native skip link and focusable `main`. The existing smooth-scroll
  handler leaves skip links to the browser, so focus moves as well as the viewport.
  The widget also has a main landmark and a first-level heading in each active view.
- Footer section headings jumped to level four. They now use level two, retaining
  their existing visual size. Questionnaire fieldsets, legends, labels and help
  associations remain intact.
- Light grey secondary text and footer labels were too faint. For example, the
  original footer labels measured 3.39:1 and service durations 2.53:1; normal text
  needs 4.5:1. These colours are now stronger, as are the large section numbers.
- White text on the Argus blue buttons measured 3.48:1. Buttons, their hover states,
  small blue labels, and the checker results call to action now have sufficient
  text contrast. Small text on navy uses the existing pale blue. Widget select
  borders are darker so the control boundary is easier to distinguish.
- Keyboard focus has a two-colour indicator visible on light and dark surfaces.
  The fixed-header pages reserve scroll space above focused content.
- The Argus heading overflowed at 320 CSS pixels with increased text spacing.
  Long words can now wrap, the example header can wrap its labels, and framework
  badges can grow with enlarged text. The checker's footer columns can wrap too.

The production changes use HTML and CSS, plus small edits to existing JavaScript
for native skip-link behaviour and the widget's renamed heading focus targets.
There are no new runtime dependencies or JavaScript files.

## Validation

The committed Playwright suite runs in Chromium, Firefox and WebKit. It includes
existing navigation and checker scenarios plus keyboard skip links with JavaScript
on/off, radio-key operation through every checker step, reverse tabbing below the
fixed header, and layout checks on all seven pages.

Reflow is tested at 320 CSS pixels (the layout width of a 1280px viewport at 400%
zoom). Text-only enlargement is simulated separately at 200%, including fonts
specified in pixels. Both layouts also receive increased line, paragraph, letter
and word spacing. These checks measure horizontal overflow, including elements
inside clipping containers; they are not an assertion that every possible font
setting or browser zoom interaction has been tested.

An additional local audit with axe-core 4.14.0 found no reported violations for
WCAG 2 A/AA, WCAG 2.1 AA and best-practice checks on the seven entry views and both
checkers' likely/maybe/not-indicated result states. The audit library was installed
in a temporary directory only. Initial page audits allowed existing entrance
animations to settle. Mobile/desktop screenshots and keyboard focus indicators
were inspected as well. External web fonts were blocked for repeatable checks.

This is a focused engineering review, not a full WCAG conformance assessment.
Native screen-reader speech output (such as NVDA or VoiceOver) and physical iOS
Safari were not tested; Playwright's WebKit coverage tests the engine on Linux.
The existing reduced-motion work and clipboard handling remain in their separate
PRs, #3 and #4. Product wording remains in PR #5.

## Reference criteria

- [Bypass blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html)
- [Contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [Text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
- [Focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
