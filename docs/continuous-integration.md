# Browser checks on pull requests

The `Playwright tests` GitHub Actions workflow runs when a pull request is opened,
updated or reopened, and when changes reach `main`. Pull requests targeting other
branches are included. Once the workflow is on the default branch, it can also be
started manually from the Actions tab. A newer run cancels an older run for the
same PR or branch.

The `Browser tests` check installs the locked npm dependencies and Playwright's
browsers, then runs `npm test` against the local test server. It uses the projects
in `playwright.config.js`: initially Chromium, with Firefox and WebKit included
once the cross-browser configuration in PR #6 is merged. Test files added by other
PRs are discovered automatically. Nothing is deployed by this workflow.

CI rejects focused tests (`test.only`) so they cannot accidentally hide the rest
of the suite. Two workers limit contention; tests have a ten-minute overall limit
and the job has a twenty-minute limit including installation. Failed tests retain
Playwright traces.

## Reviewing a result

Open `Browser tests` in the PR's checks to see the run and its logs. The run's
Artifacts section contains `playwright-report`, retained for 14 days. Download and
extract it, then use the repository's installed Playwright to open the directory
containing `index.html`:

```sh
npx playwright show-report /path/to/extracted/report
```

The HTML report includes trace links for failed tests. If installation fails
before tests start, there may be no report; use the job log instead.

The same test command can be run locally after installing the dependencies and
browsers:

```sh
CI=true PLAYWRIGHT_HTML_OPEN=never npm test -- --forbid-only --workers=2 --global-timeout=600000 --reporter=line,html --trace=retain-on-failure
```

Adding the workflow creates a visible PR check. Requiring it before merging is a
separate repository branch-protection setting; this PR does not change that setting.
Existing PRs will receive the check on their next update after the workflow is
merged into their target branch.

Workflow structure follows the [Playwright CI guide](https://playwright.dev/docs/ci-intro).
GitHub actions are pinned to release commits, with their version labels alongside.
