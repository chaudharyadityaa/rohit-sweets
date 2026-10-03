# Deployment

The live site is spread across three free-tier platforms.

## Current production stack

| Piece | Platform | URL |
|---|---|---|
| Frontend | Netlify | https://rohit-sweets.netlify.app |
| Backend | Railway | https://rohit-sweets-production.up.railway.app |
| Database | Neon | (see Railway's `DB_URL` variable — don't share this publicly) |

## How deploys work

Both Netlify and Railway auto-deploy on every push to the `main` branch on GitHub. There is no manual deploy step for normal code changes.

git add .
git commit -m "describe the change"
git push


Netlify rebuilds the frontend (~1-2 min). Railway rebuilds the backend Docker image (~3-5 min). Watch progress in each platform's dashboard under "Deploys" / "Deployments".

## Redeploying without a code change

If you only changed an environment variable:
- **Netlify:** Deploys tab → Trigger deploy → Deploy site (required — env vars are baked in at build time)
- **Railway:** redeploys automatically when you save a changed variable

## Environment variables in production

Set these directly in each platform's dashboard (never in code, never committed):

**Railway (backend) → Variables:**
- `DB_URL`, `DB_USER`, `DB_PASSWORD` — from Neon
- `JWT_SECRET` — the same secret generated during setup (changing it logs out every admin session)
- `CORS_ALLOWED_ORIGINS` — `https://rohit-sweets.netlify.app`
- `ADMIN_PASSWORD` — **do not set this in production** (the account already exists; setting it again does nothing, since the seeder only runs once, but there's no reason to have it sitting in the dashboard)

**Netlify (frontend) → Site settings → Environment variables:**
- `VITE_API_BASE_URL` — `https://rohit-sweets-production.up.railway.app`

## Database migrations in production

Flyway runs automatically on backend startup — any new `V3__...sql` file you add and push will be applied to the Neon database the next time Railway deploys. There is no separate migration step.

**Rule: never edit a migration file that has already been deployed.** Flyway checksums each file; editing an old one will break startup. Always add a new one.

## Checking the backend is healthy

Invoke-RestMethod -Uri https://rohit-sweets-production.up.railway.app/api/products


Should return the live product list. If it hangs for 30-60 seconds first, that's the free-tier cold start — normal.

## Rolling back a bad deploy

- **Netlify:** Deploys tab → find the last known-good deploy → "Publish deploy" (instant rollback, no rebuild needed)
- **Railway:** Deployments tab → find the last known-good deployment → redeploy it

## Moving to a custom domain (when the owner gets one)

1. **Netlify:** Site settings → Domain management → Add a domain → follow their DNS instructions
2. **Railway:** Settings → Networking → add a custom domain → follow their DNS instructions
3. Update `CORS_ALLOWED_ORIGINS` on Railway to the new frontend domain
4. Update `VITE_API_BASE_URL` on Netlify only if the backend domain also changes