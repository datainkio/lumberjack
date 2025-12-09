# Project Structure & DX Guide

Purpose: keep this lightweight logging utility easy to develop, test, and publish while avoiding unnecessary complexity.

## Current Layout (keep stable)

- `lumberjack/` — package root (ESM). Source lives only in `src/` (`index.js`, `Lumberjack.class.js`, `LumberjackStyle.js`, `LumberjackStyles.js`, `constants.js`). Root entry files have been removed; no shims remain. Types in `types.d.ts`; metadata in `package.json`; docs in `README.md`, `MIGRATION.md`, `OPTIMIZATION_SUMMARY.md`.
- `.github/copilot-instructions.md` — AI agent guide (authoritative behavioral rules).

## Recommended Structure (DX-first)

- **Code lives in `lumberjack/src/`**. If you add transforms later, emit `dist/` ESM mirroring `src/` and update exports map.
- **Docs**: keep user-facing docs in `lumberjack/README.md`; add focused notes here (`PROJECT_STRUCTURE.md`) and migration notes in `MIGRATION.md`. Avoid duplicating API text.
- **Types**: maintain `types.d.ts` alongside sources; update when signatures change. Keep it aligned with `Lumberjack.class.js`.
- **Constants**: add new defaults in `constants.js` only—no magic numbers in core files.
- **Exports map**: extend `package.json` exports if new entry points are added (e.g., `./constants`), and prefer named ESM imports everywhere.

## Workflow & Commands

- **Build**: `npm run build` (copies `src/` to `dist/`)
- **Lint (syntax check)**: `npm run lint` (runs `node --check` across `src/**/*.js`)
- **Sanity check**: `npm run sanity` (imports from `./src/index.js`, enables, logs `ok`)
- **Optional chalk install** for colored terminal output: `npm install chalk@^5` (peer, optional).
- **Type surface review**: open `types.d.ts` and ensure parity with runtime changes.

## Conventions & Patterns

- Logging is **disabled by default**; set `lumberjack.enabled = true` or `Lumberjack.configure({ enabled: true })` when you need output. `DEBUG=true` also enables on first `getInstance`.
- Modes: `'brief' | 'verbose' | 'silent'`; styles: `'standard' | 'headsup' | 'error' | 'success'` or `LumberjackStyle` instance. Error objects auto-switch `standard` to `error`.
- Environment detection: browser path uses `%c` + CSS (`BASE_STYLE`), Node uses `chalk.hex`; keep branches in sync when adding formatting.
- Scoped loggers: `createScoped(scope, { prefix?, color? })` wraps all methods; in browser scope color is CSS, in Node chalk.
- Grouping: `group(fn)` adds separators (`LumberjackStyles.SEPARATOR`) and manages indent; call `resetIndent()` when mixing flows.

## Atomic Design Applicability

- Library is non-UI; atomic design is not directly applicable. If you add UI demos/docs, treat them as a separate `examples/` or `docs/demo/` space and apply atomic organization there (atoms: text styles/buttons; molecules: log panels; organisms: demo pages).

## When Adding Features

- Update `constants.js` and `types.d.ts` first; mirror changes in runtime paths for Node and browser.
- Prefer pure functions or small helpers inside `Lumberjack.class.js` to keep the class readable; avoid widening public surface unless exported in `package.json`.
- Keep peer deps optional; favor dynamic `import()` for environment-specific packages.

## Release Checklist (manual)

- Bump version in `package.json` if publishing.
- Verify imports with the Node sanity check above (with and without chalk installed).
- Re-read `MIGRATION.md` to ensure default-disabled behavior remains intact.
