#!/usr/bin/env node
// Local pre-publish scanner.
// Mirrors @n8n/scan-community-package's analyzePackage() against the working
// tree (the published tarball contents: dist/ + package.json + README + LICENSE)
// so the FR-SC-4 scan gate can block publish on a brand-new package whose first
// published version does not yet exist on the npm registry. The registry-based
// `npx @n8n/scan-community-package <name>` is run as a post-publish verification
// step in publish.yml and is the authoritative check for already-published
// versions.

import path from 'node:path';
import { analyzePackage } from '@n8n/scan-community-package/scanner/scanner.mjs';

const dir = process.argv[2] || '.';
const absDir = path.resolve(dir);

const result = await analyzePackage(absDir);

if (result.passed) {
  console.log('PASS: local scan clean.');
  process.exit(0);
} else {
  console.log('FAIL: local scan found issues.');
  console.log('Reason:', result.message);
  if (result.details) {
    console.log('\nDetails:');
    console.log(result.details);
  }
  process.exit(1);
}