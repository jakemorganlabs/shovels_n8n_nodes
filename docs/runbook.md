# Runbook: n8n-nodes-shovels

> Controlled document for operators. Covers build, publish, rollback, closeout.

## Build

```bash
npm install
npm run build          # tsc + svg copy to dist/
```

Requirements:
- Node.js 20+ (match CI)
- `n8n-workflow` as peer dependency

## Local verification

```bash
# 1. Verify dist/ is NOT committed
git ls-files | grep '^dist/' && echo "FAIL: dist/ is tracked" || echo "OK"

# 2. Check tarball contents
npm pack --dry-run

# 3. Secret gate
bash scripts/secret_gate.sh

# 4. Manual install into local n8n
npm link
# In your n8n project directory:
npm link n8n-nodes-shovels
```

## CI publish pipeline

The workflow `.github/workflows/publish.yml` triggers **only** on GitHub Release `published` events.

Steps:
1. Ensure `NPM_TOKEN` (Automation-type) is set in repo Settings -> Secrets -> Actions.
2. Ensure repo is **public** (OIDC provenance requirement).
3. Create a GitHub Release at the desired tag (e.g. `v0.1.0`).
4. CI runs automatically: checkout -> setup-node -> `npm ci` -> `npm run build` -> `@n8n/scan-community-package` -> `npm publish --provenance --access public`.
5. If any step fails, the publish is blocked. Fix and re-cut.

Validation-cut hard cap: **three cuts maximum** (v0.1.0 to v0.1.2). If not clean by then, pause and diagnose structurally before burning v1.0.0.

## Rollback

npm does not support unpublishing versions with dependents. If a bad version is published:

1. Publish a patch release (vX.Y.Z+1) with the fix via the same CI workflow.
2. Update CHANGELOG with the regression and fix.
3. Deprecate the bad version on npm only if it is genuinely harmful (use `npm deprecate`).

## Closeout protocol (final evidence commit)

After v1.0.0 publishes and provenance is verified on npm:

```bash
git checkout -b closeout-evidence
# Drop provenance screenshots into docs/provenance/:
#   v0.1.0.png, v1.0.0.png
# Fill submission ID into docs/verification.md
bash scripts/secret_gate.sh          # evidence is the likeliest place a URL/token sneaks in
git add docs/evidence README.md && git commit -m "closeout: production evidence; provenance verified on npm, verification submitted"
git push -u origin closeout-evidence # merge, then tag if not already tagged
```

Operator reminder:
- Delete merged branches after closeout (zero stale branches at repo-close).
- Set GitHub repo description and topics: `n8n-community-node-package`, `n8n`, `shovels`, `permits`, `provenance`.
- Pin the repo for portfolio visibility.

## Release notes template

Every GitHub Release should contain:

**Highlights**
- (3 bullets max: what changed and why)

**Evidence**
- Links into `docs/evidence/` for scan output, provenance screenshots

**Docs**
- SRS/TDD revision
- Runbook update
- Changelog link