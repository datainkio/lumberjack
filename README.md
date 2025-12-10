# 🪓 Lumberjack

<p align="center">
  <strong>Developer-first logging UX for browsers + terminals.</strong><br>
  Styled traces, scoped streams, outlines, grouping, and sweet, sweet silence.<br>
  <a href="lumberjack/demo/index.html">Lumberjack in action</a>
</p>

<p align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40datainkio%2Flumberjack?color=3B82F6&label=npm&logo=npm">
  <img alt="Node Target" src="https://img.shields.io/badge/node-%3E%3D18-10B981?logo=node.js">
  <img alt="ESM Only" src="https://img.shields.io/badge/module-ESM%20only-9333EA?logo=javascript">
</p>

> **Heads up:** Lumberjack ships mute. Call `lumberjack.enabled = true` (or `Lumberjack.configure({ enabled: true })`) before expecting output.

---

## ✨ Why Lumberjack?

| Signal             | What you get                                                                 |
| ------------------ | ---------------------------------------------------------------------------- |
| 🎨 Styled output   | Chalk-colored Node logs, CSS-powered browser logs, optional custom palettes. |
| 🧠 Smarter data    | Brief vs verbose payloads, error auto-detection, script outlines.            |
| 🧭 Structure aware | Indentation helpers, async-aware grouping, scoped loggers with prefixes.     |
| 💤 Opt-in noise    | Logging disabled until you explicitly enable it.                             |

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

## 🎬 Demo Tour (mirrors `demo/index.html`)

Experience the GitHub README exactly like the browser demo—each section pairs the same narrative, controls, and code.

### 1. 🚀 Enable & Style Palette

| Control                                               | Result                                      |
| ----------------------------------------------------- | ------------------------------------------- |
| Toggle enable                                         | Turns logging on/off (disabled by default). |
| Standard / ⚡ Headsup / ✅ Success / ❌ Error buttons | Showcase default styles + emojis.           |

```javascript
lumberjack.enabled = !lumberjack.enabled;

// Standard message
lumberjack.trace("Standard message", sampleData, "brief", "standard");

// Headsup (⚡ amber)
lumberjack.trace(
  "Important notification",
  { priority: "high" },
  "brief",
  "headsup"
);

// Success (✓ green)
lumberjack.trace(
  "Operation completed",
  { duration: "1.2s" },
  "brief",
  "success"
);

// Error (❌ red)
lumberjack.trace("Something went wrong", { code: 500 }, "brief", "error");
```

---

### 2. 📊 Data Logging — Brief vs Verbose

| Mode    | Behavior                                             |
| ------- | ---------------------------------------------------- |
| Brief   | Collapses arrays/objects to previews (3 items/keys). |
| Verbose | Expands every field with indentation.                |

```javascript
lumberjack.trace("Brief mode (truncates arrays/objects)", sampleData, "brief");
lumberjack.trace("Verbose mode (expands all data)", sampleData, "verbose");
```

---

### 3. ❌ Auto Error Detection

```javascript
try {
  throw new Error("Simulated runtime error");
} catch (err) {
  // Style auto-switches to 'error' for Error objects
  lumberjack.trace("Caught exception (auto-detects Error):", err, "verbose");
}
```

Errors passed with the default style automatically render with the ❌ red treatment and include stack traces.

---

### 4. 📐 Indentation & Grouping

```javascript
// Manual indentation
lumberjack.trace("Level 0");
lumberjack.indent();
lumberjack.trace("Level 1 (indented)");
lumberjack.indent();
lumberjack.trace("Level 2 (double indent)");
lumberjack.outdent();
lumberjack.trace("Back to Level 1");
lumberjack.resetIndent();
lumberjack.trace("Reset to Level 0");

// Grouped logs (auto-indent/outdent)
await lumberjack.group(async () => {
  lumberjack.trace("Parent operation started");
  lumberjack.trace("Child operation 1 (auto-indented)");
  lumberjack.trace("Child operation 2 (auto-indented)");
});
lumberjack.trace("After group (indent restored)");
```

- `indent()`, `outdent()`, `resetIndent()` for manual control.
- `group(fn)` adds separators, auto-indents during `fn`, restores when finished (async-safe).

---

### 5. 🏷️ Scoped Loggers

```javascript
import { Lumberjack } from "@datainkio/lumberjack";

// Create scoped logger with custom prefix and color
const uiLogger = Lumberjack.createScoped("UI", {
  prefix: "🎨",
  color: "#10B981",
});
uiLogger.trace("Component mounted");
uiLogger.trace("State updated", { count: 42 });

// Scoped logger with grouping
const apiLogger = Lumberjack.createScoped("API", {
  prefix: "🌐",
  color: "#F59E0B",
});
await apiLogger.group(async () => {
  apiLogger.trace("Fetching data...");
  apiLogger.trace("Processing response...");
});
```

Scoped loggers inherit the full API (`trace`, `group`, outlines, etc.) and prepend `[Scope]` plus optional prefixes.

---

### 6. 🗺️ Script Outlines

```javascript
// Brief outline
lumberjack.showScriptOutline(
  "Deploy Pipeline",
  [
    { name: "build", description: "Bundle assets" },
    { name: "test", description: "Run test suite" },
    { name: "upload", description: "Deploy to CDN" },
  ],
  "brief",
  "headsup"
);

// Verbose outline with scripts/triggers/deps
lumberjack.showScriptOutline(
  "CI/CD Workflow",
  [
    {
      name: "lint",
      description: "Check code style",
      script: "npm run lint",
      triggers: ["push", "pull_request"],
    },
    {
      name: "build",
      description: "Compile TypeScript",
      script: "tsc --project tsconfig.json",
      dependencies: ["lint"],
    },
    {
      name: "deploy",
      description: "Upload artifacts",
      script: "aws s3 sync dist/ s3://bucket",
      dependencies: ["build"],
      triggers: ["main"],
    },
  ],
  "verbose",
  "headsup"
);
```

Use outlines to narrate release pipelines, CI steps, or scripts with both summary and deep detail modes.

---

### 7. 🎨 Custom Styles

```javascript
import LumberjackStyle from "@datainkio/lumberjack/LumberjackStyle";

// Create custom style instance
const purpleStyle = new LumberjackStyle("#9333EA", "🎨");

// Single message
lumberjack.trace(
  "Single custom purple message (next message will be standard)",
  { theme: "royal" },
  "brief",
  purpleStyle
);

// Consistent style usage
lumberjack.trace("Purple style message 1", { count: 1 }, "brief", purpleStyle);
lumberjack.trace("Purple style message 2", { count: 2 }, "brief", purpleStyle);
lumberjack.trace("Purple style message 3", { count: 3 }, "brief", purpleStyle);

// Reset to standard style
lumberjack.trace(
  "Back to standard style (gray, no prefix)",
  { reset: true },
  "brief",
  "standard"
);
```

Swap any built-in style with a `LumberjackStyle` instance to brand your logs.

---

### 8. ⚙️ Configuration

```javascript
lumberjack.configure({
  enabled: true,
  prefix: "[APP] ",
});

// Prefix will appear on all subsequent messages
lumberjack.trace("Logger reconfigured with prefix");
```

Config accepts `{ enabled, prefix, styles, scope }`. Combine with scoped loggers for per-domain prefixes.

---

## 📦 Project Setup

```json
// package.json
"@datainkio/lumberjack": "file:../lumberjack"
```

```shell
npm install
```

| Command                | Description                                 |
| ---------------------- | ------------------------------------------- |
| `npm run build`        | Copy `src/` → `dist/`.                      |
| `npm run lint`         | `node --check src/**/*.js`.                 |
| `npm run sanity`       | Imports `src/index.js`, enables, logs `ok`. |
| `npm run demo`         | Serves `demo/index.html` on port 8080.      |
| `npm install chalk@^5` | Optional peer for colored Node output.      |

---

## 🧠 API Cheat Sheet

| Topic            | Call                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------- |
| Singleton import | `import lumberjack from "@datainkio/lumberjack";`                                         |
| Enable / disable | `lumberjack.enabled = true/false` or `lumberjack.configure({ enabled: true })`            |
| Scoped loggers   | `Lumberjack.createScoped(scope, { prefix, color })`                                       |
| Modes            | `"brief"`, `"verbose"`, `"silent"`                                                        |
| Styles           | `"standard"`, `"headsup"`, `"error"`, `"success"` or `new LumberjackStyle(color, prefix)` |
| Grouping         | `await lumberjack.group(async () => { ... })`                                             |
| Script outlines  | `lumberjack.showScriptOutline(title, steps, mode?, style?)`                               |

---

## 🧭 Browser vs Node

| Env     | Output                 | Styling                                                     |
| ------- | ---------------------- | ----------------------------------------------------------- |
| Browser | `console.log('%c...')` | CSS via `BASE_STYLE`.                                       |
| Node    | `console.log()`        | Chalk hex colors (optional peer, falls back to plain text). |

---

## 📚 Further Reading

- [`OPTIMIZATION_SUMMARY.md`](./OPTIMIZATION_SUMMARY.md) — v2 architecture + “disabled by default” rationale.
- [`types.d.ts`](./types.d
