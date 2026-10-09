# paigaam reviewer notes

## Architecture

This repository contains a Vite/React frontend at the root (`package.json`, `vite.config.ts`) plus several independent Node/Express experiments or services: `demo-app/`, `server/`, and `resend-test/`. The root project uses TypeScript configuration references and React via `@vitejs/plugin-react`; the Express demo is organized into config, middleware, controllers, services, routes, and tests. `server/` and `resend-test/` are separate minimal packages rather than dependencies of the root application.

## Conventions

- Root frontend commands are defined in `package.json`: use Vite for development/build/preview and `oxlint` for linting; TypeScript builds through `tsc -b`.
- Vite configuration is kept in `vite.config.ts` and uses `defineConfig` with the React plugin.
- Express demo application setup is separated from process startup: `demo-app/src/app.js` exports `createApp()`, while `demo-app/src/index.js` imports it and calls `listen`.
- Express middleware order is load-bearing in `demo-app/src/app.js`: JSON parsing, request logging, rate limiting, `/api` routes, `notFound`, then `errorHandler`. New middleware should preserve appropriate ordering, especially the final error handler.
- Demo configuration is centralized in `demo-app/src/config/index.js`, loads environment variables via `dotenv/config`, and exposes `config.port` and `config.env`.
- Demo controllers expose grouped object methods, e.g. `itemController.list`, `get`, `create`, `update`, and `remove` in `demo-app/src/controllers/itemController.js`; business operations are delegated to `itemService`.
- HTTP responses use JSON error objects such as `{ error: 'Item not found' }`; successful creation returns `201`, deletion returns `204` with `.end()`.
- All local ESM imports in the demo include `.js` extensions, consistent with `"type": "module"` in `demo-app/package.json`.
- The demo README’s structure is authoritative for layer placement: routes define endpoints, controllers handle requests, services contain business logic, and middleware handles cross-cutting concerns.

## Intentional non-standard choices

- There are multiple standalone `package.json` files with different dependency versions and scripts. Do not assume the root package manages `demo-app`, `server`, or `resend-test`; each is independently runnable.
- The repository includes both a TypeScript/React frontend and JavaScript Express applications. Do not require one language or tooling convention across all subprojects.
- The demo uses a factory (`createApp`) instead of exporting a singleton Express app, enabling isolated app construction for tests.

## Watch out for

- Do not add routes after `notFound` or place error handling before routes in `demo-app/src/app.js`; doing so changes request handling.
- Preserve `.js` extensions in new ESM imports within the demo, `server`, or other `"type": "module"` packages.
- Flag controllers that bypass services for business logic, or services that become coupled to Express request/response objects.
- `demo-app/src/middleware/errorHandler.js` returns `err.message` to clients, which can expose internals; review any expansion of this behavior carefully, especially for production errors.
- Environment-dependent values should follow the existing dotenv/config pattern rather than being hard-coded in startup or controllers.