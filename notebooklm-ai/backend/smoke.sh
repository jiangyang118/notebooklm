#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:3001/api"

echo "== Health =="
curl -s "$BASE/health" | sed 's/.*/HEALTH: &/'

TMP_FILE="/tmp/notebooklm-demo.md"
echo "Hello NotebookLM $(date)" > "$TMP_FILE"

echo "\n== Upload =="
UPLOAD_JSON=$(curl -s -F "file=@${TMP_FILE};type=text/markdown" "$BASE/docs/upload")
echo "$UPLOAD_JSON" | sed 's/.*/UPLOAD: &/'

DOC_ID=$(echo "$UPLOAD_JSON" | sed -n 's/.*"doc_id"[[:space:]]*:[[:space:]]*\([0-9][0-9]*\).*/\1/p')
if [ -z "${DOC_ID:-}" ]; then
  echo "Could not extract doc_id from upload response" >&2
  exit 1
fi
echo "DOC_ID=$DOC_ID"

echo "\n== List =="
curl -s "$BASE/docs/list" | sed 's/.*/LIST: &/'

echo "\n== Get Document =="
curl -s "$BASE/docs/$DOC_ID" | sed 's/.*/DOC: &/'

echo "\n== Generate Summary =="
curl -s -H 'Content-Type: application/json' -d '{"content":"This is a short content to summarize."}' "$BASE/generate/summary" | sed 's/.*/SUMMARY: &/'

echo "\n== Generate Audio (placeholder) =="
curl -s -H 'Content-Type: application/json' -d '{"content":"This is an audio overview."}' "$BASE/generate/audio" | sed 's/.*/AUDIO: &/'

echo "\n== Embed Document (requires OpenAI API key) =="
curl -s -X POST "$BASE/embed/$DOC_ID" | sed 's/.*/EMBED: &/'

echo "\n== Search (requires OpenAI API key) =="
curl -s -H 'Content-Type: application/json' -d '{"query":"hello","top_k":5}' "$BASE/search" | sed 's/.*/SEARCH: &/'

echo "\n== Chat (requires OpenAI API key) =="
curl -s -H 'Content-Type: application/json' -d '{"query":"What did I upload?","top_k":5}' "$BASE/chat" | sed 's/.*/CHAT: &/'

echo "\nSmoke test finished."

