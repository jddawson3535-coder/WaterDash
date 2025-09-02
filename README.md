# PWS Dashboard (Next.js)

A minimal Next.js app that renders your `Dashboard.tsx` and fetches live SDWIS/ECHO data.

## Local development

```bash
pnpm i   # or npm i / yarn
pnpm dev # or npm run dev
```

Then open http://localhost:3000

## Deploy (any of these)

### Vercel
1. Create a GitHub repo and push this folder.
2. In Vercel, **New Project** → import the repo → framework: Next.js → deploy.
3. Set any env you need (none required).

### Netlify
1. New site → From Git → select repo.
2. Build command: `next build`
3. Publish directory: `.next`
4. Add a `netlify.toml` if you want an adapter; or use Netlify Next.js runtime.

### Cloudflare Pages
1. Pages → Create a project → Connect Git.
2. Framework preset: Next.js.
3. Build: `next build` ; Output: `.next`.
   (Cloudflare detects Next and uses the appropriate adapter.)

### Render / Railway / Replit
- Render: create a Web Service; Build: `npm install && npm run build`; Start: `npm start`.
- Railway: New project from repo → Add Node build and start commands.
- Replit: Import from GitHub → "Run" uses `npm run dev` by default; switch to `npm start` for production.

## Notes
- EPA ECHO rate-limits unauthenticated calls. Consider using a key from https://api.data.gov/signup/ for higher limits; paste it into the dashboard field.
- No server code is required; all fetches are client-side.

---

## Secure proxy & env vars

This project includes an Edge API route at `app/api/echo/[...slug]/route.ts` that forwards calls to
`https://echodata.epa.gov/echo`. On the client, keep **Use Server Proxy** = ON (default).

- Create `.env` (or set dashboard env) with:
  ```bash
  DATA_GOV_API_KEY=your_api_key_here
  ```
- On **Vercel**: Project → Settings → Environment Variables → add `DATA_GOV_API_KEY` → Redeploy.
- On **Netlify**: Site settings → Environment variables → add the key → Redeploy.
- On **Cloudflare Pages**: Settings → Variables → add `DATA_GOV_API_KEY` → Re-deploy.

## Custom domain (quick cues)

- **Vercel**: Settings → Domains → Add → enter your domain → follow nameserver or CNAME instructions.
- **Cloudflare Pages**: Custom domains → Set up → Add Domain → configure DNS (CNAME to Pages).
- **Netlify**: Site configuration → Domain management → Add custom domain → verify → set primary.

After DNS propagates, your app answers on `https://yourdomain.com`.

---

## Extra routes

- `/api/health` → returns `{ status: "ok", time: ... }`
- `/api/echo/limits` → diagnostic: shows if `DATA_GOV_API_KEY` is configured on server
- `/api/echo/*` → cached proxy to ECHO (with `s-maxage=300, stale-while-revalidate=600`)

## Caching & diagnostics

- **CDN caching**: Add `&ttl=300` to any `/api/echo/*` request to enable edge CDN caching for 5 minutes (`s-maxage`). Example:
  `/api/echo/sdw_rest_services.get_systems?state_abbr=OK&ttl=300`
- **Healthcheck**: `/api/health` returns JSON `{ status, uptime_ms, proxy_env_key_present, version }`
- **Rate limit diagnostics**: `/api/echo/limits` performs a tiny upstream call and returns the `x-ratelimit-*` headers if provided by api.data.gov

