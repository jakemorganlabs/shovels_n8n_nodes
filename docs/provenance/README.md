# npm Provenance Attestation Evidence

This directory holds screenshots of the npm provenance panel for each published version.

The provenance panel shows that the package was built by a named GitHub Actions workflow from a tagged commit in this repository, with an OIDC-signed attestation that anyone can verify.

## Placeholder slots

| Version | Status | Screenshot |
|---------|--------|------------|
| v0.1.0  | Pending (validation cut) | `v0.1.0.png` — operator capture |
| v1.0.0  | Pending (release cut)    | `v1.0.0.png` — operator capture |

## Operator steps

1. After CI publishes a version, visit `https://www.npmjs.com/package/n8n-nodes-shovels`
2. Scroll to the **Provenance** section on the package page
3. Screenshot the panel showing: repository URL, commit SHA, workflow path, run ID
4. Save the screenshot here as `vX.Y.Z.png`
5. Commit to `closeout-evidence` branch per `docs/runbook.md`
