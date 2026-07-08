# Verification Submission — n8n-nodes-shovels

> Controlled document: MICT-NODE-003-S04
> DO NOT claim "verified" until the shield is granted.

## Package identification

| Field | Value |
|-------|-------|
| Package name | `n8n-nodes-shovels` |
| GitHub URL | `https://github.com/jakemorganlabs/shovels_n8n_nodes` |
| npm URL | `https://www.npmjs.com/package/n8n-nodes-shovels` |
| License | MIT |
| Submission date | `__OPERATOR__: YYYY-MM-DD` |
| Submission ID / Acknowledgment | `__OPERATOR__: fill after Creator Portal submission` |

## Compliance checklist

All items must be confirmed before submitting to the Creator Portal.

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| 1 | Zero runtime dependencies (`dependencies: {}`) | ✓ | `package.json` — dependencies map is empty |
| 2 | MIT license | ✓ | `LICENSE` file present |
| 3 | English-only (UI labels, docs, error messages) | ✓ | All `displayName` and `description` fields in English |
| 4 | Single service (Shovels REST API only) | ✓ | `requestDefaults.baseURL` points only to `https://api.shovels.ai/v2` |
| 5 | No `fs` / `env` access from node code | ✓ | Source reviewed — no `fs`, `process.env`, or `require('fs')` |
| 6 | OIDC-signed provenance on npm | ✓ | See `docs/provenance/` for attestation screenshots |
| 7 | CI scan gate blocks publish on findings | ✓ | `.github/workflows/publish.yml` — scan step runs before publish, exits non-zero |
| 8 | No secrets in repository | ✓ | `scripts/secret_gate.sh` passes before each commit |
| 9 | Public repository | ✓ | `jakemorganlabs/shovels_n8n_nodes` is public |
| 10 | `n8n-community-node-package` keyword present | ✓ | `package.json` keywords include `n8n-community-node-package` |

## Review feedback log

| Date | Feedback (from n8n reviewer) | Resolution | Resolved in version |
|------|-----------------------------|------------|---------------------|
| — | — | — | — |

## Status

`Verification: submitted __OPERATOR__: YYYY-MM-DD — awaiting n8n review.`

> **Post-shield update:** Once the verified shield is granted, update this file and the README status line. Do not claim verified status before then.
