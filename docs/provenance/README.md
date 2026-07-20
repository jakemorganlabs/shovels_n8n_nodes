# npm Provenance Attestation Evidence

Screenshots of the npm provenance panel for each published version.

The provenance panel shows that the package was built by a named GitHub Actions workflow from a tagged commit in this repository, with an OIDC-signed attestation that anyone can verify.

## Published versions

| Version | Date (UTC) | Workflow run | Sigstore logIndex | Screenshot | Status |
|---------|-----------|--------------|-------------------|-----------|--------|
| v0.1.4  | 2026-07-12 | [run 29188781186](https://github.com/jakemorganlabs/shovels_n8n_nodes/actions/runs/29188781186) | [2150541117](https://search.sigstore.dev/?logIndex=2150541117) | `v0.1.4.png` (slot, operator capture) | Published (validation cut) |
| v1.0.0  | 2026-07-12 | [run 29188833044](https://github.com/jakemorganlabs/shovels_n8n_nodes/actions/runs/29188833044) | [2150594713](https://search.sigstore.dev/?logIndex=2150594713) | `v1.0.0.png` (slot, operator capture) | Published (stable release) |

Provenance predicate type: `https://slsa.dev/provenance/v1` (SLSA v1).
Authoritative registry attestation URLs:
- `https://registry.npmjs.org/-/npm/v1/attestations/n8n-nodes-shovels@0.1.4`
- `https://registry.npmjs.org/-/npm/v1/attestations/n8n-nodes-shovels@1.0.0`

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