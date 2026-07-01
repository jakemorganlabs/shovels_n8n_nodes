# Contributing to Shovels for n8n

Thank you for your interest. This document covers how to develop, test, and release the node.

## Development setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the TypeScript source:
   ```bash
   npm run build
   ```

## Linking for local testing

For live testing in a self-hosted n8n instance:

```bash
npm link
```

Then, in your n8n project directory:

```bash
npm link n8n-nodes-shovels
```

Restart n8n. The Shovels node and credential will appear in the nodes panel.

## Testing against the live API

A valid Shovels API key is required for live testing.

1. Add a **Shovels API** credential in n8n.
2. Create a workflow with the Shovels node.
3. Test each operation:
   - **Address · Resolve** — verify address-to-geo_id lookup.
   - **Permit / Contractor · Search** — verify geo_id + date + optional filters.
   - **Permit / Contractor · Get** — verify retrieval by ID.
   - **Pagination** — test Return All vs Limit.
   - **Error cases** — test with a bad key (401), a no-match geo_id (empty), and continue-on-fail with a bad ID in a batch.

## Running the scan gate

Before any release, run the structural check locally:

```bash
npx @n8n/scan-community-package n8n-nodes-shovels
```

All warnings must be resolved before the package is considered releasable.

## Release process

Releases are **CI-only**. Do not publish from your local machine.

1. Ensure the scan passes locally.
2. Update `CHANGELOG.md` with the new version entry.
3. Tag the release:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
4. The GitHub Actions workflow (`publish.yml`) builds, scans, and publishes to npm with an OIDC-signed provenance attestation.
5. After publish, submit the new version through the n8n Creator Portal for verification review.

See the build plan (Session S04) for the full CI pipeline details.
