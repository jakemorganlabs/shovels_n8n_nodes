# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2026-07-21

### Changed
- README status and version badge refresh; badge now reads the live npm version
  via shields.io instead of a cached badge host.

### Notes
- No functional/runtime changes since 1.0.1.

## [1.0.2] - 2026-07-20

### Changed
- Republished from the current commit history so the provenance attestation
  references a commit reachable from `main`. Attestations for earlier versions
  reference pre-cleanup commit SHAs.

### Notes
- No functional/runtime changes since 1.0.1.

## [1.0.1] - 2026-07-20

### Changed
- Rewrote README and supporting docs for clarity.
- Synced in-body version references to 1.0.1.

### Notes
- No functional/runtime changes. Node behavior, operations, and zero-dependency
  posture are unchanged from 1.0.0.

## [Unreleased]: validation cuts

These cuts were the published-by-CI validation ladder for the new package. They
exist on npm and on the public release history; they are not stable releases.

### 0.1.4 / 2026-07-12
- Published via `publish.yml` from tagged release `v0.1.4`.
- First cut to publish end-to-end with OIDC-signed provenance (sigstore logIndex 2150541117).
- Structural fix from cut-4 installed: lint toolchain `--no-save`, `npm ci --ignore-scripts`, `scripts/scan_local.mjs` invokes `@n8n/eslint-plugin-community-nodes` directly.

### 0.1.0 to 0.1.3 / 2026-07-12
- Validation cuts that failed in CI; not stable releases.
- v0.1.0: `npm ci` failed compiling `isolated-vm` (a transitive `@n8n/expression-runtime` native dep we never import). Fix rolled into v0.1.1: `npm ci --ignore-scripts`.
- v0.1.1: registry-based `@n8n/scan-community-package <name>` returns 404. Scan-before-first-publish is structurally impossible. Fix rolled into v0.1.2: pre-publish local lint via `scripts/scan_local.mjs`.
- v0.1.2: scanner as devDep conflicts with `n8n-workflow@^1.96` peer (needs `>=2`). Fix rolled into v0.1.3: install lint toolchain `--no-save --legacy-peer-deps`.
- v0.1.3: `npm publish PUT` returned 403. npm token lacked `bypass-2FA` permission. Fix rolled into v0.1.4: operator regenerated the granular token with the bypass-2FA option enabled.

## [1.0.0] / 2026-07-12

### Added
- Initial release. Shovels node for the n8n Verified Community Nodes Program.
- **Resource / Operation** surface across three resources:
  - **Permit**: Search by geography and date window; Get by ID.
  - **Contractor**: Search by geography and date window; Get by ID.
  - **Address**: Resolve a free-form address to a `geo_id`.
- Declarative routing with zero runtime dependencies.
- Credential type (`shovelsApi`) with masked API-key field and test request.
- Pagination via Return All (walk `next_page` until exhausted) or Limit (cap at 1 to 500).
- Response unwrapping so each API `items` record becomes one n8n output item.
- Additional Fields collection for optional filters (property type, permit tags).
- Full README covering install, credentials, geo_id resolution, pagination, error catalog, and example workflow.
- MIT license and `n8n-community-node-package` keyword for discovery.

### Known limitations / deferred
- Polling trigger deferred to v1.1 (optional).
- Shovels Markets, Lists, and Decisions endpoints not covered in v1.0.

### Notes
- This release is published from CI with an npm provenance attestation (OIDC-signed, SLSA v1).
- Sigstore transparency log entry: [logIndex 2150594713](https://search.sigstore.dev/?logIndex=2150594713).
- npm provenance panel: https://www.npmjs.com/package/n8n-nodes-shovels
- `dependencies` map is intentionally empty; runtime dependency count is zero.