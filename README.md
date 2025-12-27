# @datainkio/lumberjack

Styled logging for both:
- **Node.js terminals** (uses `chalk` if installed)
- **Browser DevTools console** (uses `%c` + CSS)

Logging is **disabled by default**. You must explicitly enable it.

## Install

```bash
npm install @datainkio/lumberjack
```

This is a **private** scoped package. You’ll need npm auth configured for the `@datainkio` scope.

### Optional: terminal colors (Node.js)

`chalk` is an **optional peer dependency**. If you want colored terminal output:

```bash
npm install chalk
```

## Usage

### Default singleton logger

```js
import lumberjack from "@datainkio/lumberjack";

// enable output
lumberjack.enabled = true;

lumberjack.trace("Hello", { a: 1 }, "brief", "default");
lumberjack.trace("Heads up", { priority: "high" }, "brief", "headsup");
lumberjack.trace("Success", { id: 123 }, "brief", "success");
lumberjack.trace("Error", { code: 500 }, "brief", "error");
```

### Import the class + style helpers

```js
import { Lumberjack, LumberjackStyles } from "@datainkio/lumberjack";

Lumberjack.configure({ enabled: true });
Lumberjack.trace("Using the static API", { ok: true }, "brief", LumberjackStyles.HEADSUP);
```

### Subpath imports

```js
import Lumberjack from "@datainkio/lumberjack/Lumberjack";
import LumberjackStyle from "@datainkio/lumberjack/LumberjackStyle";
import LumberjackStyles from "@datainkio/lumberjack/LumberjackStyles";

const purple = new LumberjackStyle("#9333EA", "🎨", "bold", 12);

Lumberjack.configure({ enabled: true });
Lumberjack.trace("Custom style", { theme: "purple" }, "brief", purple);
Lumberjack.trace("Built-in style", { ok: true }, "brief", LumberjackStyles.SUCCESS);
```

### Scoped loggers

```js
import { Lumberjack } from "@datainkio/lumberjack";

const api = Lumberjack.createScoped("API", { prefix: "🌐", color: "#60A5FA" });
api.trace("Request started", { url: "/health" }, "brief", "headsup");
```

### Configuration options

```js
import lumberjack from "@datainkio/lumberjack";

// Configure with multiple options
lumberjack.configure({
  enabled: true,
  prefix: "[APP] ",
  showCallerLocation: true,  // Show file:line location (default: true)
});

// Disable caller location display
lumberjack.configure({
  showCallerLocation: false,
});
```

## Modes and styles

- **Modes**: `"brief"` (default), `"verbose"`, `"silent"`
- **Style names**: `"default"`, `"headsup"`, `"success"`, `"error"`

## Debugging in Browser DevTools

When debugging code that uses Lumberjack, you can **ignore Lumberjack library files** to skip over internal implementation details and focus on your own code.

### How to Ignore Lumberjack Scripts

1. Open DevTools (F12) → Settings (⚙️ icon, bottom right)
2. Go to the **Ignore List** tab
3. Add these patterns to ignore all Lumberjack scripts:
   - `Lumberjack`
   - `index.js`
4. DevTools will now automatically skip over these files when stepping through code

This makes debugging much easier by hiding library internals and jumping directly to your application code.

## Development

- Build published artifacts: `npm run build` (copies `src/` → `dist/`)
- Sync docs vendor bundle: `npm run docs:vendor` (copies `dist/` → `docs/assets/js/vendors/lumberjack/`)
- Syntax-check dist output: `npm run lint`
