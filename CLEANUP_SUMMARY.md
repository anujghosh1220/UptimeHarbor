## Cleanup & Accuracy Summary

- Removed node_modules and server.log from Git tracking; updated .gitignore (node_modules, dist, *.log, .env, .env.local)
- Verified backend (node backend/local/server.cjs) starts and responds to /api/stats
- Frontend API points to http://localhost:3001/api by default
- Tests: 4 passed; TypeScript clean; build succeeds
- README/AWS claims clarified (not deployed, local in-memory)
