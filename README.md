Attigo's website

[Automatic PR checks and test reports](docs/continuous-integration.md).

Static HTML, CSS, and JavaScript. No build step is required for deployment.

Navigation is shared through `navigation.css` and `navigation.js` on the six main pages.

To run the navigation browser checks (Node.js 20+ and npm required):

```sh
npm ci
npx playwright install chromium
npm test
```

The tests start a local server on port 4173 and cover desktop keyboard navigation,
touch menus at 320, 390, and 768px, focus on resize, and navigation without JavaScript.
To use an existing Chrome installation, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`
to its executable path when running `npm test`.

Make changes on a branch and submit a pull request for review before merging.

The applicability checker and standalone widget deliberately keep their rules inline.
See [the screening decisions and sources](docs/checker-rules.md) before changing answers.
Browser tests cover both forms; development-time checks compare every valid answer
combination and independently verify important scope scenarios.
