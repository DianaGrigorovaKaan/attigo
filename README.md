Attigo's website

[Automatic PR checks and test reports](docs/continuous-integration.md).

Static HTML, CSS, and JavaScript. No build step is required for deployment.
See [the accessibility review](docs/accessibility-review.md) for findings, scope and validation.

Navigation is shared through `navigation.css` and `navigation.js` on the six main pages.

To run the browser checks (Node.js 20+ and npm required):

```sh
npm ci
npx playwright install chromium firefox webkit
npm test
```

The tests start a local server on port 4173 and cover desktop keyboard navigation,
touch menus at 320, 390, and 768px, focus on resize, and navigation without JavaScript.
Motion checks cover reduced-motion preferences (including changes while a page is
open), anchor scrolling, hover effects, and readable content without JavaScript.
To use an existing Chrome installation, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`
to its executable path when running `npm test`.

The suite runs in Chromium, Firefox and WebKit, including skip links, narrow layouts,
enlarged text and text spacing. Use `npm test -- --project=chromium` to run just
Chromium. On Linux, Playwright may also require system libraries
(`npx playwright install-deps`).

Make changes on a branch and submit a pull request for review before merging.

See [publishing the static site](docs/deployment.md) for the deployment file list
and the location of the logo preview and archived design concepts.

The applicability checker and standalone widget deliberately keep their rules inline.
See [the screening decisions and sources](docs/checker-rules.md) before changing answers.
Browser tests cover both forms; development-time checks compare every valid answer
combination and independently verify important scope scenarios.

See [website claim decisions and sources](docs/website-claims.md) before changing
Argus capability claims or the site’s regulatory summaries.
