# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-07-01

### Added
- Initial release — Shovels node for n8n Verified Community Nodes Program.
- **Resource / Operation** surface across three resources:
  - **Permit** — Search by geography and date window; Get by ID.
  - **Contractor** — Search by geography and date window; Get by ID.
  - **Address** — Resolve a free-form address to a `geo_id`.
- Declarative routing with zero runtime dependencies.
- Credential type (`shovelsApi`) with masked API-key field and test request.
- Pagination via Return All (walk `next_page` until exhausted) or Limit (cap at 1–500).
- Response unwrapping so each API `items` record becomes one n8n output item.
- Additional Fields collection for optional filters (property type, permit tags).
- Full README covering install, credentials, geo_id resolution, pagination, error catalog, and example workflow.
- MIT license and `n8n-community-node-package` keyword for discovery.

### Known limitations / deferred
- Polling trigger deferred to v1.1 (optional).
- Shovels Markets, Lists, and Decisions endpoints not covered in v1.0.

### Notes
- This release is published from CI with an npm provenance attestation (OIDC-signed).
- `dependencies` map is intentionally empty; runtime dependency count is zero.
