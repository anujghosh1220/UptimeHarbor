## Vercel Deployment (Manual, Free)

1. Go to https://vercel.com/new and import https://github.com/anujghosh1220/UptimeHarbor
2. Framework Preset: "Other" (since this is a monorepo structure)
3. Build Command: `npm run build`
4. Output Directory: `frontend/dist`
5. Install Command: `npm install`
6. No environment variables required for local-style demo
7. Deploy

Notes:
- In-memory storage; data resets on cold starts
- Free Hobby plan limits apply
- The vercel.json handles API route rewrites automatically
