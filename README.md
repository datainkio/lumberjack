# 🪓 Lumberjack

Modern DX logging for terminal + browser. Styled, scoped, indentation-aware logs that stay quiet until you say otherwise.

<p align="left">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40datainkio%2Flumberjack?color=3B82F6&label=npm&logo=npm">
  <img alt="Node Target" src="https://img.shields.io/badge/node-%3E%3D18-10B981?logo=node.js">
  <img alt="ESM Only" src="https://img.shields.io/badge/module-ESM%20only-9333EA?logo=javascript">
</p>

> **Heads up:** Logging ships disabled. Toggle `lumberjack.enabled = true` (or `Lumberjack.configure({ enabled: true })`) before expecting any output.

---

## ✨ Why Lumberjack?

- **Dual-mode output**: Chalk-colored Node terminals, CSS-styled browser consoles.
- **Scoped orchestration**: Namespaced loggers with prefixes/colors for each domain.
- **Intelligent formatting**: Brief previews, verbose deep dives, automatic error styling.
- **Indent-aware grouping**: Track script hierarchies without manual spacing hacks.

---

## ⚡ Quick Start

```shell
npm install @datainkio/lumberjack
```

```javascript
import lumberjack from "@datainkio/lumberjack";

if (process.env.NODE_ENV === "development") {
  lumberjack.enabled = true;
}

lumberjack.trace("Build start", { version: "2.0.0" }, "brief", "headsup");
```

---

## 🧪 Demo UX (from `demo/index.html`)

Each section mirrors the interactive browser demo so GitHub readers get the same guided experience.

### 1. 🚀 Enable Logger First

```javascript
lumberjack.enabled = !lumberjack.enabled;
lumberjack.trace("✅ Logger enabled! Check console for all subsequent logs.");
```

| Action                                       | What it shows                      |
| -------------------------------------------- | ---------------------------------- |
| Enable toggle                                | Logger state (disabled by default) |
| Standard / Headsup / Success / Error buttons | Styled traces with emojis + color  |

---

### 2. 📊 Brief vs Verbose Data

```javascript
lumberjack.trace("Brief mode", sampleData, "brief");
lumberjack.trace("Verbose mode", sampleData, "verbose");
```

- **Brief**: Arrays/objects truncated to previews.
- **Verbose**: Fully formatted payloads with indentation.

---

### 3. ❌ Auto Error Detection

```javascript
try {
  throw new Error("Simulated runtime error");
} catch (err) {
  lumberjack.trace("Caught exception (auto detects Error)", err, "verbose");
}
```

Errors logged with `'standard'` style automatically upgrade to `'error'` (❌ red) with stack traces.

---

### 4. 📐 Indentation & Grouping

```javascript
lumberjack.trace("Level 0");
lumberjack.indent();
lumberjack.trace("Level 1");
lumberjack.resetIndent();

await lumberjack.group(async () => {
  lumberjack.trace("Parent started");
  lumberjack.trace("Child operation (auto-indented)");
});
```

- `indent()`/`outdent()`/`resetIndent()` give manual control.
- `group(fn)` draws separators, indents for the duration, restores state afterwards.

---

### 5. 🏷️ Scoped Loggers

```javascript
import { Lumberjack } from "@datainkio/lumberjack";

const uiLogger = Lumberjack.createScoped("UI", {
  prefix: "🎨",
  color: "#10B981",
});
uiLogger.trace("Component mounted");
```

Scoped loggers prepend `[Scope]` and inherit the same API (`trace`, `group`, etc.).

---

### 6. 🗺️ Script Outlines

```javascript
lumberjack.showScriptOutline(
  "Deploy Pipeline",
  [
    { name: "build", description: "Bundle assets" },
    { name: "upload", description: "Deploy to CDN" },
  ],
  "brief",
  "headsup"
);
```

Use outlines to render pipelines/CI steps with brief or verbose detail levels.

---

### 7. 🎨 Custom Styles

```javascript
import LumberjackStyle from "@datainkio/lumberjack/LumberjackStyle";

const purpleStyle = new LumberjackStyle("#9333EA", "🎨");
lumberjack.trace("Royal vibes", { theme: "amethyst" }, "brief", purpleStyle);
```

Pass a `LumberjackStyle` instance (or style name) into any `trace()` call for bespoke color+prefix combos.

---

### 8. ⚙️ Configuration

```javascript
lumberjack.configure({
  enabled: true,
  prefix: "[APP] ",
});
lumberjack.trace("Logger reconfigured with prefix");
```

Config options: `{ enabled, prefix, styles, scope }`.

---

## 📦 Project Setup

### Local package linking

```json
// package.json
"@datainkio/lumberjack": "file:../lumberjack"
```

```shell
npm install
```

### Build & workflow commands

| Command                | Description                                |
| ---------------------- | ------------------------------------------ |
| `npm run build`        | Copy `src/` → `dist/`                      |
| `npm run lint`         | `node --check src/**/*.js`                 |
| `npm run sanity`       | Imports `src/index.js`, enables, logs `ok` |
| `npm run demo`         | Serves `demo/index.html` (port 8080)       |
| `npm install chalk@^5` | Optional peer for colored Node output      |

---

## 🧠 API Cheat Sheet

| Feature          | Method(s)                                                   |
| ---------------- | ----------------------------------------------------------- | --------- | --------- | ----------------------------- |
| Singleton logger | `import lumberjack from '@datainkio/lumberjack'`            |
| Enable/disable   | `lumberjack.enabled = true/false`                           |
| Scoped loggers   | `Lumberjack.createScoped(scope, opts)`                      |
| Modes            | `'brief'                                                    | 'verbose' | 'silent'` |
| Styles           | `'standard'                                                 | 'headsup' | 'error'   | 'success'`or`LumberjackStyle` |
| Groups           | `await lumberjack.group(async () => { ... })`               |
| Script outlines  | `lumberjack.showScriptOutline(title, steps, mode?, style?)` |

---

## 🧭 Browser vs Node

| Environment | Output                 | Styling                                             |
| ----------- | ---------------------- | --------------------------------------------------- |
| Browser     | `console.log('%c...')` | CSS via `BASE_STYLE`                                |
| Node        | `console.log()`        | Chalk hex (optional peer, falls back to plain text) |

---

## 📚 Further Reading

- [`OPTIMIZATION_SUMMARY.md`](./OPTIMIZATION_SUMMARY.md) – v2 architecture notes.
- [`types.d.ts`](./types.d.ts) – public TypeScript surface.
- Source of truth: [`src/`](./lumberjack/src) (ESM-only exports).

---

## 🧩 Sample Logger Module

```javascript
// filepath: portfolio-site/src/logger.js
import { Lumberjack } from "@datainkio/lumberjack";

export const buildLogger = Lumberjack.createScoped("Build", {
  prefix: "🏗️",
  color: "#3B82F6",
});

export const apiLogger = Lumberjack.createScoped("API", {
  prefix: "🔌",
  color: "#10B981",
});

export const uiLogger = Lumberjack.createScoped("UI", {
  prefix: "🎨",
  color: "#8B5CF6",
});
```

---

🔥 Enable the logger, open DevTools, and let Lumberjack tidy up your console.
