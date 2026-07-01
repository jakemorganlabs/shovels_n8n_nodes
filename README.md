# Shovels for n8n

[![npm version](https://badge.fury.io/js/n8n-nodes-shovels.svg)](https://www.npmjs.com/package/n8n-nodes-shovels)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Provenance](https://img.shields.io/badge/provenance-OIDC%20signed-blue)](https://www.npmjs.com/package/n8n-nodes-shovels)

> A verified, dependency-free n8n community node for the [Shovels REST API](https://docs.shovels.ai) — building permits and contractors across 1,800+ U.S. jurisdictions.

This node wraps the Shovels API in a declarative, zero-dependency configuration: pick a resource, pick an operation, set the fields, and let n8n execute the authenticated HTTP calls, pagination, and response shaping automatically.

**Status:** Part of the n8n Verified Community Nodes Program. Published from CI with a [cryptographic provenance attestation](https://docs.npmjs.com/generating-provenance-statements).

---

## Table of contents

- [Installation](#installation)
- [Credentials](#credentials)
- [Supported operations](#supported-operations)
- [The geo_id resolution model](#the-geo_id-resolution-model)
- [Pagination](#pagination)
- [Error catalog](#error-catalog)
- [Example workflow](#example-workflow)
- [Release provenance & verification](#release-provenance--verification)
- [License](#license)

---

## Installation

### From npm (once verified)

After the package receives verified status from n8n, it installs in one click from the n8n nodes panel on both **Cloud** and **self-hosted** instances.

### From source (pre-verification, self-hosted only)

1. Clone this repository.
2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
3. Link into your local self-hosted n8n instance:
   ```bash
   npm link
   ```
   Then, in your n8n project directory:
   ```bash
   npm link n8n-nodes-shovels
   ```

---

## Credentials

The node requires a **Shovels API key**.

1. Obtain your key from your Shovels account dashboard.
2. In n8n, open **Settings → Credentials → Add credential**.
3. Search for **Shovels API** and paste your key.
4. Click **Test** — a green check means the key is valid; a red check means invalid or missing.

The key is stored in n8n's encrypted credential store and injected as the `X-API-Key` header. It is never exposed in source, logs, or output.

> **Tip:** If the test fails with a network error, verify your outbound HTTPS connectivity. If it fails immediately with a credentials error, double-check the key value.

---

## Supported operations

| Resource | Operation | What it does |
|---|---|---|
| **Permit** | Search | Query permits by geography and date window (`GET /permits/search`) |
| | Get | Retrieve a single permit by its Shovels ID (`GET /permits/{id}`) |
| **Contractor** | Search | Query contractors by geography and date window (`GET /contractors/search`) |
| | Get | Retrieve a single contractor by its Shovels ID (`GET /contractors/{id}`) |
| **Address** | Resolve | Turn a street address into a `geo_id` for downstream searches (`GET /addresses/search`) |

### Permit · Search

Required fields:
- **Geo ID** — a state code (`CA`), ZIP (`94103`), or a resolved `geo_id`
- **From Date** — start of date window, `YYYY-MM-DD`
- **To Date** — end of date window, `YYYY-MM-DD`

Optional filters (under **Additional Fields**):
- **Property Type** — `residential` or `commercial`
- **Permit Tags** — comma-separated tags; prefix with `-` to exclude, e.g. `solar,-roofing`

### Permit · Get

- **Permit ID** — the Shovels permit ID

### Contractor · Search

Same required and optional field structure as Permit · Search.

### Contractor · Get

- **Contractor ID** — the Shovels contractor ID

### Address · Resolve

- **Address** — a free-form U.S. street address (e.g. `123 Main St, Austin, TX 78701`)

Returns candidate records, each carrying a `geo_id`.

---

## The geo_id resolution model

Shovels indexes permits and contractors by a unified geographic ID called a `geo_id`. The same ID is used across every search endpoint. Not every place needs to be resolved first — this is the most common source of confusion.

**When NO resolution is needed:**
- A **two-letter state code** (`CA`) is a valid `geo_id`.
- A **5-digit ZIP code** (`94103`) is a valid `geo_id`.

**When resolution IS needed:**
- A **city** or **county** name by itself is not a `geo_id`; use **Address · Resolve** to look it up.
- A **street address** is not a `geo_id`; use **Address · Resolve** to turn it into one.

**Typical flow:**

```
Street address  →  Address · Resolve  →  geo_id  →  Permit · Search
                                              │
State ZIP code ───────────────────────────────┘
```

If you pass a city or county name directly into **Geo ID**, the query may return empty results without an error — the API treats it as an unknown ID.

---

## Pagination

Search operations support two pagination modes.

### Return All

When enabled, the node walks the API's `next_page` cursor automatically until no more pages remain, accumulating all records. Use this when you need the full result set.

> **Caution:** Broad queries across large states or long date ranges can consume significant API quota. Only use Return All if you genuinely need every record.

### Limit

When Return All is off, the **Limit** field controls the maximum number of results (1–500). The node returns at most this many items and does not page further. This is the safer default for exploration and bounded workflows.

The underlying API returns `{ items, page, size, next_page }`; the node unwraps `items` so each record becomes one n8n output item automatically.

---

## Error catalog

| Condition | What you see | How to fix |
|---|---|---|
| **401 Unauthorized** | Auth error / credential failure | Check the API key in n8n credentials. Verify it is active in your Shovels account. |
| **429 Rate Limited** | Retryable error — slow down | The Shovels API has rate limits. Wait a moment, or reduce request frequency. n8n may retry automatically. |
| **Empty results** | Zero output items, no error | A valid query that simply matched nothing. Check the `geo_id`, date range, and filters. |
| **Invalid ID in batch** | Item-level error | Enable **Continue On Fail** on the node so good items proceed while failing ones are flagged. |
| **Malformed date** | Field validation or API 4xx | Dates must be `YYYY-MM-DD`. Double-check the format. |

---

## Example workflow

### Address-to-Permits walkthrough

A common pattern: resolve an address to a `geo_id`, then search permits for that geography.

**Node A — Address · Resolve**
- Address: `123 Main St, Austin, TX 78701`

**Node B — Permit · Search**
- Geo ID: `{{ $json.geo_id }}` (from Node A)
- From Date: `2024-01-01`
- To Date: `2024-01-31`
- Return All: true (or Limit: 10 for bounded testing)

**Node C — downstream (optional)**
Feed the array into a Filter, Set, or Code node to isolate residential solar permits, count by jurisdiction, etc.

A runnable export of this workflow is included in [`examples/permits-by-address.json`](examples/permits-by-address.json).

---

## Release provenance & verification

This package is published to npm by a GitHub Actions workflow, signed with an OIDC provenance attestation. Every verification-bound version is traceable to a tagged commit and a named workflow. No version intended for verification has been or will be published from a local machine.

- **npm provenance:** See the package page for the signed attestation.
- **CI pipeline:** See [`.github/workflows/publish.yml`](.github/workflows/publish.yml) (Session S04).
- **Verification:** Submitted through the n8n Creator Portal for manual quality and security review. Verified nodes display a shield in the n8n nodes panel and install in one click on Cloud and self-hosted.

---

## License

MIT © Jake Morgan. See [LICENSE](LICENSE) for details.

---

> *"The integration is configuration; the release is a proof."*
