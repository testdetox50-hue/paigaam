# paigaam reviewer notes

## Architecture

This repository contains several largely independent JavaScript applications: a root Vite/React frontend (`package.json`, `vite.config.ts`), a documented Express scaffold under `demo-app/`, and separate server experiments under `server/` and `resend-test/`. The `demo-app` backend is layered into config, middleware, routes, controllers, services, models, and utilities, with `src/index.js` responsible only for startup. The root project uses TypeScript configuration references (`tsconfig.json`) but its package scripts are focused on Vite and frontend lint/build workflows.

## Conventions

- `demo-app` uses native ES modules: `package.json` sets `"type": "module"` and imports include explicit `.js` extensions, e.g. `demo-app/src/app.js`.
- Keep Express construction separate from process startup. `demo-app/src/app.js` exports `createApp`; `demo-app/src/index.js` calls it and invokes `app.listen(...)`.
- Middleware is registered centrally and in order in `demo-app/src/app.js`: JSON parsing, request logging, rate limiting, `/api` routes, then `notFound` and `errorHandler`. Changes to ordering can alter behavior.
- API code follows a route/controller/service split. Controllers delegate business operations to `itemService` (`demo-app/src/controllers/itemController.js`) rather than implementing storage logic directly.
- Controllers are exported as grouped objects with concise action names, such as `itemController.list`, `.get`, `.create`, `.update`, and `.remove`.
- REST responses use JSON for normal and error responses. Creation returns `201`; deletion returns `204` with `.end()`; missing items return `404` with `{ error: 'Item not found' }` (`demo-app/src/controllers/itemController.js`).
- Environment loading and defaults are centralized in `demo-app/src/config/index.js`, which imports `dotenv/config` and exposes `config.port` and `config.env`.
- Root frontend tooling uses Vite with the React plugin (`vite.config.ts`), TypeScript build checking (`tsc -b`), and Oxlint (`package.json`). Preserve the existing no-semicolon style in TypeScript config files while noting that the demo Express files use semicolons.

## Intentional non-standard choices

- The repository intentionally contains multiple package manifests and applications rather than one unified workspace: root `social-trend`, `demo-app`, `server`, and `resend-test` each define their own scripts and dependencies.
- `demo-app` is explicitly a scaffold/demo project (`demo-app/README.md`); simple in-memory-style service boundaries and minimal configuration should not be judged as production completeness without broader context.
- Error responses expose `err.message` in `demo-app/src/middleware/errorHandler.js`; this is the current project behavior, not an accidental fallback mismatch.

## Watch out for

- Do not assume root scripts apply to subprojects. Run and review changes against the relevant package (`demo-app`, `server`, or `resend-test`).
- Flag Express middleware placed after `notFound`/`errorHandler`, missing `next`-compatible error handling, or routes registered outside the `/api` mount when the documented structure is intended.
- Flag controllers that bypass the service layer or return inconsistent status codes/error shapes.
- Check new environment-dependent code for centralized dotenv/config handling rather than scattered `process.env` access.
- Be alert to missing validation around `req.body` and `req.params.id`; the sampled controllers pass both directly to services.
- Avoid treating `resend-test`’s placeholder test script or sparse package metadata as evidence that the root application’s test/build workflow is broken.