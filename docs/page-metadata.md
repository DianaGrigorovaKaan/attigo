# Page metadata

The six main pages and standalone widget carry their metadata directly in the
HTML head. No JavaScript, production package or build step is needed.

Each has a unique title and description, an absolute canonical URL, Open Graph
metadata and a Twitter/X large-image card. Titles and descriptions are repeated
in the sharing tags so they can be read directly by crawlers.

## URLs and scope

Use `https://attigo.dk/` for the home page and `https://attigo.dk/<filename>.html`
for other pages. This matches the site's existing public links. The live root,
`/index.html`, HTTP and `www` variants all responded during the 14 October 2026
review; the tags identify a preferred URL without introducing server redirects.
The standalone widget has its own canonical URL without the `partner` query
parameter. Partner labels remain part of its display behaviour.

The logo design/preview pages are development references and carry `noindex`.
See [the deployment guide](deployment.md) for their locations and publication policy.

## Sharing images

- `images/social/attigo.png`: consultancy pages.
- `images/social/argus.png`: Argus and both checker formats.

Both images are 1200 × 630 PNGs, with matching dimensions and alternative text in
the metadata. PNGs are served to sharing clients; the adjacent SVG files are the
editable sources. The sources contain the approved horizontal logo geometry from
PR #7 (including the tightened T spacing), so this PR has no missing-asset dependency
on that branch. Future logo edits should also update these sources and PNG exports.
The PNGs are approximately 28 KB and 35 KB and are not inserted into the page body.

To regenerate them from the repository root after editing the sources, using the
existing development-time Playwright installation:

```sh
node <<'JS'
const { chromium } = require('playwright');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({
        viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1
    });
    for (const name of ['attigo', 'argus']) {
        const source = path.resolve(`images/social/${name}.svg`);
        await page.goto(pathToFileURL(source).href);
        await page.screenshot({ path: `images/social/${name}.png` });
    }
    await browser.close();
})();
JS
```

Inspect both exports after rendering; text uses a system sans-serif font.

## Editing notes

Keep the page title, description and sharing text aligned with the page's actual
content. In particular, the Argus description uses the product positioning agreed
in PR #5: automated compliance checks and evidence on every run. It does not claim
that Argus certifies an entire product or guarantees compliance with a framework.

Update the canonical and `og:url` together if a public page moves. Use absolute
HTTPS image URLs, and deploy the image files alongside the HTML. Social platforms
may cache earlier previews; local checks cannot verify how a platform will render
a page that has not yet been deployed.

References: [Open Graph protocol](https://ogp.me/),
[Google's canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
