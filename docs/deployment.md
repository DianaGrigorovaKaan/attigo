# Publishing the static site

No build step is required. Publish these files from the reviewed, merged revision:

- `index.html`, `services.html`, `about.html`, `contact.html`
- `argus.html`, `applicability-checker.html`, `widget.html`
- `styles.css`, `script.js`, `navigation.css`, `navigation.js`
- `images/`, preserving its subdirectories

Keep repository and development files off the web host: `.git/`, `node_modules/`,
`tests/`, `docs/`, Playwright output, package files, and configuration files.

## Design references

`logo-preview.html` is a local review and download page for the approved logo set.
Keep it in the repository, but leave it out of the deployment. Open it locally or
use `node tests/server.js` and visit `http://127.0.0.1:4173/logo-preview.html`.
Its image paths and download links use `images/logos/`.

The superseded concepts are archived in `docs/design/logo-options.html` for design
history. The original reference image remains at `images/logos/logo.png`; the SVG
used by the site and the approved variants also remain in that directory. The
unused, small JPEG copy has been removed; Git retains its history.

Both design pages contain `noindex` as a fallback if uploaded accidentally. This
is a search indexing instruction, not access control or a deployment exclusion.
When updating an existing deployment, remove any previously uploaded
`logo-preview.html`, `logo-options.html`, or `logo.jpg` (including a copy under
`images/logos/`). Uploading the new files alone does not remove old files.
