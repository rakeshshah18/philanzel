# Backend Deploy Checklist (Render)

This file contains a short checklist and recommended Render configuration to deploy the `backend` service of this repository. Use these steps to reproduce and resolve the "Cannot find module './router'" error and ensure the service starts cleanly.

## Quick checklist (high priority)

1. Ensure Render runs the build/start inside the `backend` directory (or set `Root Directory` to `backend`).
2. Ensure Node engine is 18.x (or compatible with `package.json` `engines`).
3. Use the following Build and Start commands (either as the service commands or combined with `cd`):
   - Build Command (recommended):
     ```bash
     cd backend && npm ci
     ```
   - Start Command (recommended):
     ```bash
     cd backend && npm start
     ```

   Alternatively, if you want to build the frontend during Render build:
   - Build (monorepo style):
     ```bash
     cd backend && npm ci && npm run build:frontend
     ```
   - Start:
     ```bash
     cd backend && npm start
     ```

4. The `backend/package.json` now includes a `prestart` script that runs a diagnostic (`node ./scripts/check_express.cjs`). This will print whether Express is resolved and whether its `lib/router` files exist. Check your Render logs for these messages.

5. If `prestart` fails on Render, force a clean reinstall (clear build cache) and trigger a redeploy. On Render, you can clear build cache by redeploying with "Clear cache and deploy" (UI option) or changing an environment variable to force a fresh build.

## What to look for in Render logs

- Successful prestart output (example):

```
> philanzel@1.0.0 prestart
> node ./scripts/check_express.cjs

express resolved to: /home/render/project/backend/node_modules/express/index.js
express lib dir: /home/render/project/backend/node_modules/express
lib/router path: /home/render/project/backend/node_modules/express/lib/router
lib/router exists: true
lib/router contents: [ 'index.js', 'layer.js', 'route.js' ]
```

- If the logs show `Cannot find module 'express'` or `lib/router exists: false`, then dependencies are missing or were not installed in the right directory. Make sure the build step installs `node_modules` inside `backend`.

## Manual checks (if you have shell access on the deploy host)

```bash
# In the Render shell or SSH session, run:
cd backend
node ./scripts/check_express.cjs
# Or check specific files
ls -la node_modules/express/lib/router
node -e "console.log(require.resolve('express'))"
```

If `node ./scripts/check_express.cjs` errors, run:

```bash
rm -rf node_modules package-lock.json
npm ci
node ./scripts/check_express.cjs
```

## Optional: Force clean build on Render

- In the Render service settings, choose "Clear cache and deploy" to ensure node_modules and cached artifacts are rebuilt.

## Notes

- The diagnostic is intentionally written in CommonJS (`.cjs`) so it will run even though `package.json` uses `type: "module"`.
- The `prestart` script is lightweight and will exit quickly. It helps capture module resolution issues early.

---

If you want, I can also create a Render `render.yaml` blueprint for the backend. See the sample `render.yaml` in the repo root (if present) or use the snippet in the project README.
