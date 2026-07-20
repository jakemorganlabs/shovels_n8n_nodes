# About This Piece: Shovels for n8n

**MICT-NODE-003** / Piece III of IV / n8n Verified Community Node / Supply-Chain Provenance Exemplar

## What this piece proves

Most "I built an integration" portfolio entries are a script that calls an API and an npm package pushed from a laptop. Two things are wrong with that as a credential. First, the trust surface is the author's whole machine and an opaque dependency tree. You take it on faith that the published bytes match the source. Second, nobody reviewed it.

This piece refuses that shape on both counts.

**The node is configuration, not code.** The Shovels node is declarative. It is a routing table (resources, operations, fields, and the authenticated requests they map to) that n8n's own HTTP layer executes. There is no imperative `execute()` body to audit and no arbitrary code path. The integration's behavior is its configuration. Its blast radius is its routing.

**Zero runtime dependencies. The supply chain is the source.** The `dependencies` map is empty. Nothing is fetched at install or run time, so there is no transitive tree to compromise, no postinstall script to fear, nothing for a reviewer to chase. This is the verification program's requirement. It is also the strongest supply-chain posture a package can take.

**No ambient authority.** The node reads no environment variables and touches no files. The API key lives in n8n's encrypted credential store and is injected as the `X-API-Key` header by the credential's generic-auth config. The node body never sees it. Every input is explicit.

**The release is signed and externally reviewed.** Every published version is built by a named GitHub Actions workflow from a tagged commit and carries an npm provenance attestation signed via OIDC. Anyone can cryptographically verify which workflow, repository, and commit produced the artifact. n8n then manually vets the package and marks it *verified*, after which it installs in one click on n8n Cloud and self-hosted alike with a shield next to its name. The trust is a property of the pipeline and the review, not of the author.

*The integration is configuration; the release is a proof.*

## Architecture

The node wraps the **Shovels REST API v2**: building permits and contractors across 1,800+ U.S. jurisdictions, in a declarative zero-dependency n8n integration.

| Layer | What it does |
|---|---|
| **Credential** (`ShovelsApi`) | Holds the masked API key; injects it as `X-API-Key` via generic auth; defines a cheap test request for the credential dialog. |
| **Node** (`Shovels`) | Declares the Resource / Operation tree with routing: Permit (Search, Get), Contractor (Search, Get), Address (Resolve). |
| **Pagination** | Declarative generic pagination over the API's `page`/`next_page` scheme, gated by a Return All toggle and bounded by a Limit when off. |
| **Output shaping** | `postReceive` unwraps the `items` array so each record becomes one n8n item. The user gets permits, not an envelope. |
| **Error mapping** | HTTP failures surface as typed n8n node errors: 401 auth, 429 rate limit, empty result zero items. Never thrown. |

**Base URL:** `https://api.shovels.ai/v2`
**Authentication:** `X-API-Key` header via credential generic auth
**Runtime deps:** 0
**File/env access:** none
**Languages:** English only
**License:** MIT
**Keywords:** `n8n-community-node-package`

## The geo_id resolution model

Shovels indexes permits and contractors by a unified geographic ID called `geo_id`. The most common source of user confusion is knowing when a place needs to be resolved first.

*No resolution needed:* A two-letter state code (`CA`) or a 5-digit ZIP (`94103`) is itself a valid `geo_id`.
*Resolution needed:* A city, county, or street address must be looked up via Address: Resolve before it can be used in a search.

This README spends disproportionate care here because getting it wrong produces silent empty results, not errors.

## The verified-node discipline

Three gates work together. None of them is the author's word.

**The scan is the structural gate.** `@n8n/scan-community-package` runs locally and in CI and enforces what a reviewer would otherwise check by hand: package structure, empty dependency map, absence of file/env access, naming conventions, manifest correctness. A scan failure is a red build. It cannot be waved through.

**Provenance is the release gate.** Publishing happens only from CI, only from a tagged commit, only with an OIDC-signed attestation. After 1 May 2026 a hand-published package cannot be verified, so the discipline is enforced by the program, not just chosen. The attestation is the proof that the bytes on npm are the bytes the workflow built from that commit.

**n8n verification is the external review.** The final gate is a human at n8n vetting the package for quality and security. Passing it is what converts a published package into a credential: the shield, and one-click install across Cloud and self-hosted. The author cannot grant this to themselves, which is exactly why it is worth having.

## Build arc (Sessions S01 to S04)

| Session | Focus | Outcome |
|---|---|---|
| **S01** | Scaffold, Credential, First Operation | Node skeleton, credential type with test, first routing |
| **S02** | Operations, Pagination, Errors | All 5 operations live, pagination walks `next_page`, errors typed |
| **S03** | Docs, Icon, Scan Gate | README, CHANGELOG, icon, example workflow, scan ready |
| **S04** | CI Publish, Verification Submission | GitHub Actions pipeline, `npm publish --provenance`, Creator Portal |

S03 is complete in this commit. The node is documented, scannable, shippable. S04 automates shipping.

## Outcome artifacts

| Artifact | Where | What it shows |
|---|---|---|
| Source | This repo (`main`) | Declarative TypeScript; zero deps; no fs/env |
| Build | `npm run build` to `dist/` | Compiled JS + copied SVG; manifest paths verified |
| Icon | `nodes/Shovels/shovels.svg` | Construction-themed SVG, renders at canvas + panel sizes |
| Documentation | `README.md` | Install, credentials, every operation, geo_id model, pagination, errors |
| Example workflow | `examples/permits-by-address.json` | Address Resolve to Permit Search, exportable |
| Changelog | `CHANGELOG.md` | v1.0.0 scope and deferred items |
| Contributing | `CONTRIBUTING.md` | Dev loop, test checklist, CI-only release process |
| Provenance (after S04) | npm package page | OIDC-signed attestation: workflow + commit + repo |
| Verification (after S04) | n8n nodes panel | Verified shield; one-click install |

## Sibling pieces

- **Piece I: Intake-to-Outbound Pipeline** (MICT-PIPE-001): Deterministic extraction + human-in-the-loop handoff
- **Piece II: Document Intelligence / RAG** (MICT-RAG-002): Constrained generation + attribution-first search
- **Piece III: Shovels for n8n** (MICT-NODE-003): *This piece.* Supply-chain provenance + external verification.
- **Piece IV: Multi-Agent Research System** (MICT-RAG-004): Structured reasoning with tool use and eval gates

Each piece carries the same instinct into a different domain: make the trustworthiness a *verifiable property* rather than a request for faith.

*Jake Morgan / jakemorganlabs / 2026*