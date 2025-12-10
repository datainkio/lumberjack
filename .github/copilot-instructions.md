# Copilot Instructions for Lumberjack

## Overview & Architecture

- **Project**: ESM logging utility (`@dataink/lumberjack`) with dual-mode output (Node.js terminal via chalk, browser console via CSS).
- **Source location**: All canonical code in `lumberjack/src/` (`index.js`, `Lumberjack.class.js`, `LumberjackStyle.js`, `LumberjackStyles.js`, `constants.js`).
- **Module type**: ESM only (`"type": "module"` in `package.json`). No CommonJS support.
- **Exports**: Package.json maps exports: `.` → `./src/index.js`, `./Lumberjack` → `./src/Lumberjack.class.js`, `./LumberjackStyle` → `./src/LumberjackStyle.js`, `./LumberjackStyles` → `./src/LumberjackStyles.js`.

## Default Behavior

- **Logging disabled by default**: Set `lumberjack.enabled = true` explicitly to enable. `Lumberjack.configure({ enabled: true })` also works. See `OPTIMIZATION_SUMMARY.md` for v2 changes.
- **Environment auto-detection**: At runtime, code detects browser via `window`/`document`; otherwise assumes Node.js.
  - **Browser**: Uses `console.log('%c...')` with CSS styling from `BASE_STYLE` constant.
  - **Node.js**: Uses chalk (v5+) for hex color terminal output. Chalk is optional peer dependency; falls back to plain text if missing.

## Core API

**Singleton instance** (`lumberjack`): `trace(message, obj?, mode?, style?)`, `indent()`, `outdent()`, `resetIndent()`, `group(fn)`, `showScriptOutline(op, steps, mode?, style?)`, `createScoped(scope, opts?)`, `configure(opts)`, `enabled` (getter/setter).

**Static class methods** (`Lumberjack`): `getInstance(enabled?)`, `configure(options)`, `createScoped(scope, options)`.

## Modes & Styles

- **Modes**: `'brief'` (default, single-line previews), `'verbose'` (multi-line formatted values), `'silent'` (short-circuits, no output).
- **Styles**: String names `'default'` | `'headsup'` | `'error'` | `'success'`, or `LumberjackStyle` instance.
  - `DEFAULT`: Gray-500 (#6B7280), no prefix.
  - `HEADSUP`: Amber-500 (#F59E0B), ⚡ prefix.
  - `ERROR`: Red-500 (#EF4444), ❌ prefix.
  - `SUCCESS`: Green-500 (#10B981), no prefix.
- **Error auto-detection**: If `style === 'default'` and `obj` is an `Error`, `trace` automatically coerces to `'error'` style and includes stack trace. Override by passing explicit style.

## Indentation & Grouping

- **Indent tracking**: Private instance field `#indentLevel`; `INDENT_SIZE = 2` spaces per level.
- **`group(fn)`**: Adds separator line, indents, executes `fn` (sync or async), restores indent. Use for hierarchical output blocks.
- **`resetIndent()`**: Force indent back to 0 when managing independent flows.
- **Separator**: `LumberjackStyles.SEPARATOR = "::::::::::::::::::"` printed between groups.

## Scoped Loggers

`Lumberjack.createScoped(scope, { prefix?, color? })` returns proxy object with same API as singleton. Automatically prepends `[Scope]` to messages. Returns start/complete log lines around `group()`.

- **Node.js**: Uses chalk for scope color.
- **Browser**: Uses CSS color styling for scope text.

## Data Formatting

- **Brief mode** (`'brief'`): Arrays truncated to `MAX_ARRAY_PREVIEW` (3) items, objects to `MAX_OBJECT_PREVIEW` (3) keys.
- **Verbose mode** (`'verbose'`): Expands full values with indentation via `_formatVerbosePlain`.
- **Preview helpers**: `_getValue` generates single-line previews; modify only if changing truncation behavior.

## Configuration & Constants

- **`configure(options)`**: Accepts `{ enabled, prefix, styles, scope }`.
  - `enabled`: Boolean to toggle logging.
  - `prefix`: String prepended before style prefixes.
  - `styles`: Object with custom `LumberjackStyle` instances to override defaults.
  - `scope`: Scope name for scoped logger creation.
- **Constants** (in `src/constants.js`): `INDENT_SIZE`, `MAX_ARRAY_PREVIEW`, `MAX_OBJECT_PREVIEW`, `BASE_STYLE`, `DEFAULT_MODE`, `DEFAULT_STYLE`. Change here, not hardcoded values.

## Browser vs Node Distinctions

- **Browser**: Uses `%c` CSS directive. Ensure style arrays parallel message arrays in all formatting functions.
- **Node**: Chalk hex colors and bold. No ANSI escape sequences—only chalk API.
- **Optional chalk**: Peer dependency; missing chalk in Node degrades to plain text.

## TypeScript Support

- Public API types in `types.d.ts`: `LogMode`, `LogStyleName`, `Lumberjack` class, `LumberjackStyle` class, `ScopedLogger` interface.
- Keep type signatures aligned with `Lumberjack.class.js` when modifying.

## Documentation & References

- **Primary docs**: `OPTIMIZATION_SUMMARY.md` (v2 architecture & changes). `README.md` has formatting issues; prefer code comments.
- **No MIGRATION.md**: Disabled-by-default behavior documented in `OPTIMIZATION_SUMMARY.md`.

## Build & Testing

- **`npm run build`**: Copies `src` → `dist` directory.
- **`npm run lint`**: Runs `node --check` on all `src/**/*.js` files.
- **`npm run sanity`**: Imports `./src/index.js`, enables logging, traces 'ok'.
- **`npm run demo`**: Serves `demo/index.html` on port 8080 for browser testing.

## Common Pitfalls

1. **Forgetting to enable**: No output unless `enabled = true`.
2. **Browser chalk reliance**: Chalk features unavailable in browser; use CSS or style names.
3. **Silent mode output**: Mode `'silent'` short-circuits; use `'brief'` or `'verbose'`.
4. **CJS require**: Only ESM imports supported; `require('@dataink/lumberjack')` fails.
5. **Missing chalk**: Optional peer; Node falls back to plain text without it. Install `chalk@^5` for colors.

## Usage Examples

- **Enable & trace**: `import lumberjack from '@dataink/lumberjack'; lumberjack.enabled = true; lumberjack.trace('Build start', cfg, 'brief', 'headsup');`
- **Scoped with color**: `const uiLogger = Lumberjack.createScoped('UI', { prefix: '🎨', color: '#10B981' }); uiLogger.trace('Hydrated');`
- **Script outline**: `lumberjack.enabled = true; lumberjack.showScriptOutline('Deploy', [{ name: 'build', description: 'Bundle assets' }, { name: 'upload', script: 'aws s3 sync' }], 'brief', 'headsup');`
- **Hierarchical logging**: `await lumberjack.group(async () => { lumberjack.trace('Parent'); lumberjack.indent(); lumberjack.trace('Child'); lumberjack.outdent(); });`
