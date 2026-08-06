# Shovels for n8n — Verified Community Node — SRS & TDD

**Doc ID:** MICT-NODE-003
**Version:** 1.1 — As built
**Author:** Jake Morgan
**Status:** Shipped. `v1.0.9` on npm. n8n Creator Portal Verified.

> The integration is configuration. The release is a proof.

---

## Revision record

| Rev | Date | Status | Summary |
|---|---|---|---|
| 1.0 | Baseline | Approved for build | Full SRS/TDD. Verification listed as a goal. |
| 1.1 | As built | Shipped and verified | Verification granted. Release mechanics and scan findings recorded. See the change log below. |

### Changes from Rev 1.0

1. **§3.8, §12.D — Verification.** The n8n Creator Portal reviewed and verified the node. The only manual-review request was a `homepage` field in `package.json`. The node installs in one click from the n8n nodes panel on self-hosted and Cloud.
2. **§12.C, §19 — Release trigger.** Rev 1.0 said "on a tagged release." As built, the publish workflow fires on the GitHub **Release published** event. A push or a bare tag does not publish. Cutting the Release is the release act.
3. **§19 — Version immutability.** npm rejects a republish of an existing version number. A 403 on publish means the version already landed, in part or in full. The correct response is a patch bump, not a retry.
4. **§10, §11 — Scan compliance findings.** Four changes got the package through `@n8n/scan-community-package`: an `icon` on the credential class, `usableAsTool: true` on the node, `inputs`/`outputs` typed with `NodeConnectionTypes.Main` (the plural export; the singular is type-only in `n8n-workflow ^1.96.0`), and sentence-case operation actions with a default on the Property Type option.
5. **§18 — Test environment.** Local n8n runs on Node 22 via `npx n8n`. n8n rejects Node 24. Pin the Node version before you test.
6. **Release v1.0.9.** A maintenance release. It carries the documentation and verification-status updates recorded in this revision. No functional change to the node.

All other sections stand as baselined. The declarative design, the zero-dependency rule, and the credential contract shipped as specified.

---

## §1 Purpose and scope

This document specifies and records the design of `n8n-nodes-shovels`, a community node that wraps the Shovels REST API: building permits and contractors across 1,800+ U.S. jurisdictions.

The node is declarative. It is a routing table that n8n's HTTP layer executes, not an imperative script. It has zero runtime dependencies, no filesystem access, and no environment access.

## §2 System overview

1. The user picks a resource: `Permit`, `Contractor`, or `Address`.
2. The user picks an operation: `Search`, `Get`, or `Resolve`.
3. The credential attaches the `X-API-Key` header to every request.
4. Search operations walk the `next_page` cursor until the result set is exhausted.
5. The output stage unwraps the `items` array. Each API record becomes one n8n item.
6. Errors surface as typed n8n errors: 401 credential, 429 retryable. An empty result is a valid query with no matches.

## §3 Functional requirements (summary)

| ID | Requirement |
|---|---|
| FR-ND | The node must implement `INodeType` in the declarative style, with routing on operations. |
| FR-CR | The credential type must carry the API key and must never log it. |
| FR-PG | Search operations must paginate on the `next_page` cursor with no user code. |
| FR-GE | The Address resource must resolve a street address to a `geo_id`. |
| FR-SC | A release must build, scan, and sign in CI. A failed scan must block the publish. |
| FR-DOC | The README must surface the provenance attestation and the verified status. |

## §8 Technology as built

| Layer | As built |
|---|---|
| Language | TypeScript, compiled to `dist/`. Node and credential classes implement n8n interfaces. |
| Style | Declarative routing only. No `execute()` body. |
| Dependencies | None at runtime. `n8n-workflow` as a peer dependency. Build and lint tools as dev dependencies. |
| Scan gate | `@n8n/scan-community-package` runs in CI before publish. |
| Release | GitHub Actions on the Release event: `npm publish --provenance --access public` with `id-token: write`. |
| Distribution | Public npm, `n8n-nodes-shovels`, current `v1.0.9`, OIDC-signed provenance attestation. |

## §12 Ship procedure (as exercised)

1. Merge to `main`.
2. Run the scan locally. Fix any finding.
3. Bump the version. Do not reuse a published number.
4. Cut a GitHub Release.
5. CI checks out the commit, installs, builds, and scans.
6. CI publishes with an OIDC provenance attestation.
7. Confirm the version with `npm view`.

**NOTE:** `npm view` reflects the registry at once. The npm web page and the README badges are cache-served and may lag by minutes to an hour. Do not treat badge lag as a failed publish.

## §13 The verified-node discipline

Hand-publishing is forbidden for verification. The workflow is the only sanctioned publisher. Every release therefore carries the same guarantee: built and scanned in CI, published with a cryptographic attestation that binds the artifact to this repository and commit, and reviewed by n8n. The guarantee holds for every version, not only the demo day.

---

*Piece III of a five-piece portfolio. The capstone's release pipeline inherits this piece's publish and provenance discipline.*
