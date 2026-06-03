#!/usr/bin/env bash
# ai-commit.sh — stage, commit, and push work completed by an AI agent.
#
# Usage:
#   scripts/ai-commit.sh "<type>: <subject>" ["<body>"]
#
# <type> should be one of: feat, fix, chore, docs, refactor, test, meta
# <subject> is a short imperative summary (≤ 72 chars).
# <body> (optional) is a longer description; pass an empty string to omit.
#
# Behavior:
#   - Refuses to run if working tree is clean (nothing to commit).
#   - Stages all tracked + untracked changes (git add -A).
#   - Appends a trailer marking this as AI-authored.
#   - Pushes the current branch to its upstream (sets upstream on first push).
#
# This script is intentionally minimal. Workflows decide WHEN to call it.

set -euo pipefail

if [[ $# -lt 1 || -z "${1:-}" ]]; then
  echo "usage: $0 \"<type>: <subject>\" [\"<body>\"]" >&2
  exit 2
fi

SUBJECT="$1"
BODY="${2:-}"

cd "$(git rev-parse --show-toplevel)"

if git diff --quiet && git diff --cached --quiet && [[ -z "$(git ls-files --others --exclude-standard)" ]]; then
  echo "ai-commit: working tree clean, nothing to commit." >&2
  exit 0
fi

git add -A

TRAILER="Co-authored-by: AI-Agent <ai-agent@local>"

if [[ -n "$BODY" ]]; then
  git commit -m "$SUBJECT" -m "$BODY" -m "$TRAILER"
else
  git commit -m "$SUBJECT" -m "$TRAILER"
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if git rev-parse --abbrev-ref --symbolic-full-name "@{u}" >/dev/null 2>&1; then
  git push
else
  git push -u origin "$BRANCH"
fi
