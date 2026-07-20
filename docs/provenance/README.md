# npm Provenance Attestation Evidence

Screenshots of the npm provenance panel for each published version.

The provenance panel shows that the package was built by a named GitHub Actions workflow from a tagged commit in this repository, with an OIDC-signed attestation that anyone can verify.

## Published versions

| Version | Date (UTC) | Workflow run | Sigstore logIndex | Status |
|---------|-----------|--------------|-------------------|--------|
| v0.1.4  | 2026-07-12 | [run 29188781186](https://github.com/jakemorganlabs/shovels_n8n_nodes/actions/runs/29188781186) | [2150571250](https://search.sigstore.dev/?logIndex=2150571250) | Published (validation cut) |
| v1.0.0  | 2026-07-12 | [run 29188833044](https://github.com/jakemorganlabs/shovels_n8n_nodes/actions/runs/29188833044) | [2150594713](https://search.sigstore.dev/?logIndex=2150594713) | Published (first stable) |
| v1.0.1  | 2026-07-20 | [run 29738578067](https://github.com/jakemorganlabs/shovels_n8n_nodes/actions/runs/29738578067) | [2205633193](https://search.sigstore.dev/?logIndex=2205633193) | Published (docs refresh) |
| v1.0.2  | 2026-07-20 | [run 29741918595](https://github.com/jakemorganlabs/shovels_n8n_nodes/actions/runs/29741918595) | [2206083254](https://search.sigstore.dev/?logIndex=2206083254) | Published (history re-bind) |
| v1.0.3  | 2026-07-20 | [run 29786269998](https://github.com/jakemorganlabs/shovels_n8n_nodes/actions/runs/29786269998) | [2208747473](https://search.sigstore.dev/?logIndex=2208747473) | Published (current) |

logIndex values are the SLSA-provenance entries read directly from each version's
registry attestation bundle, not transcribed from the UI.

Screenshot slots (operator capture): `v0.1.4.png`, `v1.0.0.png`.

Provenance predicate type: `https://slsa.dev/provenance/v1` (SLSA v1).
Authoritative registry attestation URLs follow the pattern:
- `https://registry.npmjs.org/-/npm/v1/attestations/n8n-nodes-shovels@<version>`

## History cleanup (2026-07-20)

The repository history was rewritten on 2026-07-20 to remove an unwanted
co-author trailer from the root commit and normalize author identity. Only
commit metadata changed; every tree is identical. Consequence: the attestations
for v0.1.4, v1.0.0, and v1.0.1 reference pre-cleanup commit SHAs (`201e418e`,
`4d58d7f2`, `3b3b34fd`), while the tags now point at the rewritten equivalents.

The content is still verifiable: the tree hash inside each attested commit
equals the tree hash of the current tag (`git rev-parse <tag>^{tree}`).
v1.0.2 and later attest against the current history directly, and npm
signatures for all versions verify via `npm audit signatures`.

## Verifying provenance yourself

Anyone can verify provenance without trusting the author:

```bash
npm install -g npm@latest  # npm 9.6+ for sigstore verification
npm audit signatures        # checks published signature against sigstore transparency log
# Or inspect the attestation directly:
curl https://registry.npmjs.org/-/npm/v1/attestations/n8n-nodes-shovels@1.0.0
```

The attestation proves the package was built by the `publish` workflow in
`jakemorganlabs/shovels_n8n_nodes` from the tagged commit `v1.0.0`. Trust is a
property of the pipeline, not of the author.

## Operator step

Capture screenshots of the npm provenance panel for both versions and commit them here as `v0.1.4.png` and `v1.0.0.png`. The brief's `v0.1.0.png` / `v1.0.0.png` schema resolves to `v0.1.4.png` for the validation cut (the actual published version).