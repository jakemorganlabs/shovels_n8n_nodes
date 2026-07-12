#!/usr/bin/env node
// Local pre-publish scanner.
// Mirrors @n8n/scan-community-package's analyzePackage() against the working
// tree (the published tarball contents: dist/ + package.json + README + LICENSE)
// so the FR-SC-4 scan gate can block publish on a brand-new package whose first
// published version does not yet exist on the npm registry. The registry-based
// `npx @n8n/scan-community-package <name>` is run as a post-publish verification
// step in publish.yml and is the authoritative check for already-published
// versions.
//
// The scanner's analyzer is the ESLint plugin `@n8n/eslint-plugin-community-nodes`
// run with its `recommended` config. We import the plugin directly (installed in
// CI via `npm install --no-save` so it does not pollute the project lockfile).

import path from 'node:path';
import { ESLint } from 'eslint';
import { defineConfig } from 'eslint/config';
import fastGlob from 'fast-glob';
import * as tsParser from '@typescript-eslint/parser';

const dir = process.argv[2] || '.';
const absDir = path.resolve(dir);

const { default: plugin } = await import('@n8n/eslint-plugin-community-nodes');

const eslint = new ESLint({
  cwd: absDir,
  allowInlineConfig: false,
  overrideConfigFile: true,
  overrideConfig: defineConfig(
    plugin.configs.recommended,
    {
      rules: { 'no-console': 'error' },
    },
    {
      files: ['**/*.json'],
      languageOptions: { parser: tsParser.default ?? tsParser },
    },
  ),
});

const filesToLint = fastGlob.sync(['**/*.js', '**/*.json'], {
  cwd: absDir,
  absolute: true,
  ignore: ['node_modules/**', '**/package-lock.json'],
});

if (filesToLint.length === 0) {
  console.log('PASS: no files found to analyze.');
  process.exit(0);
}

const results = await eslint.lintFiles(filesToLint);
const violations = results.filter((result) => result.errorCount > 0);

if (violations.length === 0) {
  console.log('PASS: local scan clean.');
  process.exit(0);
}

const formatter = await eslint.loadFormatter('stylish');
const formatted = await formatter.format(results);
console.log('FAIL: local scan found issues.');
console.log(formatted);
process.exit(1);