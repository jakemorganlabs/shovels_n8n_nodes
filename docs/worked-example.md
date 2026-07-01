# Worked Example — Address-to-Permits Walkthrough

This example walks an end-to-end workflow in self-hosted n8n using every major capability added in Session S02.

## Goal

Resolve a free-form U.S. address to a `geo_id`, then search permits for that geography across a date range, with pagination, and end up with individual permit records flowing downstream.

## Prerequisites

- Self-hosted n8n with the Shovels node installed (local file link or npm).
- A valid Shovels API key configured as a credential.

## Workflow

### Step 1: Address · Resolve (Node A)

- **Resource:** Address
- **Operation:** Resolve
- **Address:** `123 Main St, Austin, TX 78701`

The node calls `GET /addresses/search?address=123+Main+St%2C+Austin%2C+TX+78701`. The API returns candidates; each candidate becomes one n8n item, carrying a `geo_id`. Pick the one with the highest match score (typically the first item) and pass `geo_id` downstream.

### Step 2: Permit · Search with pagination (Node B)

- **Resource:** Permit
- **Operation:** Search
- **Geo ID:** `{{ $json.geo_id }}` (from Node A)
- **From Date:** `2024-01-01`
- **To Date:** `2024-01-31`
- **Return All:** true

With Return All enabled, the node walks the API's `next_page` cursor automatically via the declarative pagination block:

```
continue: '={{ $response.body.next_page !== null }}'
request.qs.page: '={{ $response.body.next_page }}'
```

The `postReceive` hook unwraps `items` so downstream nodes receive permits, not `{ items, page, size, next_page }` envelopes.

A large geo_id + a 30-day window typically yields >1 page; Return All accumulates every record into the output array.

### Step 3: Downstream filter (Node C, optional)

Feed the array into any n8n transform node (e.g. Filter, Set, Code) to isolate residential solar permits, count by jurisdiction, etc.

## Verification Checklist

| Check | Expected | Status |
|---|---|---|
| Address resolve returns candidates with `geo_id` | At least one item with `geo_id` present | ☐ |
| Passing that `geo_id` into Permit · Search returns records | Non-empty items array | ☐ |
| Return All walks full pagination | Item count equals total reported by API | ☐ |
| Return All off + Limit = 10 caps output to 10 items | Exactly 10 items | ☐ |

## Empty-result behavior

Use a `geo_id` with no permits in the chosen date range. The node returns **zero items** without throwing. This is the correct n8n behavior; downstream condition nodes should check `{{ $json }}` length to branch.

## Error scenarios to log

- **401:** Temporarily set the credential key to a bogus value. Execute Permit · Search. The node surfaces a typed auth error. Fix the key and rerun.
- **429:** If reachable, rapid sequential execution may trigger rate limiting. The declarative layer surfaces the 429 as a rate-limit error.
- **Invalid ID in a batch:** If iterating a list of IDs with a bad entry, enable **Continue On Fail** on the node. Good items proceed; the bad one is flagged as an item-level error.

## Notes

- State codes (e.g. `CA`) and ZIP codes (e.g. `94103`) are themselves valid `geo_id` values — no resolution needed.
- The same walkthrough works for Contractor · Search; swap the resource and the date parameters apply identically.
- This document seeds the README screenshots and example workflow in Session S03.
