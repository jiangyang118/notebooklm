smoke-check endpoints locally (as much as possible here) or tailor .env for zero-external deps (SQLite + Chroma)?

- cd notebooklm-ai/backend
- cp .env.example .env (add OPENAI_API_KEY for embed/search/chat/summary if desired)
- npm install
- node server.js
- Optional smoke: chmod +x smoke.sh && ./smoke.sh
