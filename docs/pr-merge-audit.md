# Pull request merge audit — 15 October 2026

Audited all eleven merged PRs against `main` at
`64c4d26399c6f86ed584cd89798e748a0272a372`.

## Finding

PR #9 was the only PR missing from `main`. It targeted
`fix/standalone-logo-colour`, and merged into that branch after PR #7 had already
merged the logo work into `main`. A later merge into an already-merged feature
branch does not automatically update `main`.

All other PR merge commits are ancestors of the audited `main`. Reconstructing
each of the eleven merges from its recorded parents with
`git merge-tree --write-tree` produced exactly the recorded merge tree, with no
conflicts. There were no merge-resolution edits that dropped part of a PR.

## Results

| PR | Changes checked | Result on audited `main` |
| --- | --- | --- |
| [#1](https://github.com/DianaGrigorovaKaan/attigo/pull/1) | Shared accessible navigation and initial browser tests | Present; later accessibility additions retained |
| [#2](https://github.com/DianaGrigorovaKaan/attigo/pull/2) | Aligned inline checker rules, source notes and parity tests | Present |
| [#3](https://github.com/DianaGrigorovaKaan/attigo/pull/3) | Reduced-motion styles, simplified scroll script and motion tests | Present; the Firefox test correction from #11 retained |
| [#4](https://github.com/DianaGrigorovaKaan/attigo/pull/4) | Three-check example and accessible embed-copy feedback | Present |
| [#5](https://github.com/DianaGrigorovaKaan/attigo/pull/5) | Approved Argus positioning and claims documentation | Present |
| [#6](https://github.com/DianaGrigorovaKaan/attigo/pull/6) | Skip links, focus, contrast, reflow and three-browser coverage | Present |
| [#7](https://github.com/DianaGrigorovaKaan/attigo/pull/7) | Logo variants, preview and graphics relocation | Present |
| [#8](https://github.com/DianaGrigorovaKaan/attigo/pull/8) | Page metadata, sharing images and source SVGs | Present |
| [#9](https://github.com/DianaGrigorovaKaan/attigo/pull/9) | Unused-style and JPEG removal, archived concepts, noindex and deployment guide | Missing; restored by this correction |
| [#10](https://github.com/DianaGrigorovaKaan/attigo/pull/10) | PR workflow, reports and CI instructions | Present |
| [#11](https://github.com/DianaGrigorovaKaan/attigo/pull/11) | Firefox native-anchor test timing correction | Present |

## Correction

Reapply the original PR #9 commit (`2321865`) onto current `main`. Before adding
this audit record and updating the metadata documentation link, the resulting
tree was verified to match the clean merge of the audited `main` with PR #9's
merge commit (`21c2d02`) exactly. This preserves the later changes to shared files
while restoring the complete missing patch.

The restored [deployment guide](deployment.md) is the file list for publishing.
It also identifies development/design files to exclude and obsolete files to
remove from an existing deployment. The list is documentation, not an automated
deployment mechanism.

The approved logo variants remain available in the preview; replacing every
production header logo was not part of PR #7 and is not a missing merge change.

## Checking future stacked PRs

When a PR targets another feature branch, retarget it to `main` after its parent
PR merges and before merging the dependent PR. A `Merged` label alone does not
prove that a change is in `main`; check commit ancestry and the resulting files.
