#!/usr/bin/env bash
# secret_gate.sh — blocks commits that contain secrets or forbidden patterns
# Run: bash scripts/secret_gate.sh
# Exit 0 = clean; Exit 1 = dirty (blocks commit)

set -euo pipefail

ERR=0

echo "=== Secret Gate ==="
echo "Scanning for forbidden patterns..."

# Pattern: _authToken in any file (npmrc auth) — exclude docs and README which document the pattern
if git grep -q "_authToken" -- ':!scripts/secret_gate.sh' ':!docs/' ':!README.md' 2>/dev/null; then
  echo "FAIL: _authToken found in repository. Remove it before committing."
  ERR=1
fi

# Pattern: npm token strings (long alphanumeric npm tokens) — exclude docs and README which document the pattern
if git grep -qE 'npm_[A-Za-z0-9]{30,}' -- ':!scripts/secret_gate.sh' ':!docs/' ':!README.md' 2>/dev/null; then
  echo "FAIL: npm token pattern found. Remove it before committing."
  ERR=1
fi

# Pattern: generic API keys / secrets
if git grep -qEi '(api[_-]?key|apikey|apikeyid|access[_-]?token|private[_-]?key|secret[_-]?key)' -- ':!scripts/secret_gate.sh' ':!docs/' ':!README.md' 2>/dev/null; then
  echo "WARN: potential secret keyword found in code. Review manually."
  # Warning only — does not block
fi

# Pattern: .env files committed
if git ls-files | grep -qE '^\.env($|\.)' 2>/dev/null; then
  echo "FAIL: .env file(s) committed. Add to .gitignore and remove."
  ERR=1
fi

if [ $ERR -eq 0 ]; then
  echo "PASS: No forbidden patterns found."
  exit 0
else
  echo "ABORT: Secret gate failed. Fix the issues above before committing."
  exit 1
fi
