<!-- @format -->

# Lumberjack Logger

**Dual-mode logging utility with semantic styling for Node.js terminal and browser console**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](package.json)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](package.json)

Lumberjack provides consistent, beautiful debug output for both Node.js terminal and browser runtime. It automatically detects your environment and applies appropriate styling using chalk (terminal) or CSS (browser).

## Features

- 🎨 **Semantic Styling** - Color-coded output with customizable emoji prefixes
- 🔄 **Dual-Mode** - Automatic environment detection (Node.js terminal or browser console)
- 🏗️ **Singleton Pattern** - Global access, single instance across all imports
- 🎯 **Scoped Loggers** - Create module-specific loggers with custom colors
- 🔍 **Auto Error Detection** - Automatically styles Error objects with stack traces
- 📊 **Hierarchical Output** - Built-in indentation and grouping for nested operations
- ✨ **Zero Configuration** - Works out of the box, disabled by default
- 🎭 **TypeScript Support** - Full type definitions included

## Installation

```bash
npm install @dataink/lumberjack
```

Chalk is an optional peer dependency for Node.js color output:

```bash
npm install chalk@^5.0.0
```

## Quick Start

```javascript
import lumberjack from "@dataink/lumberjack";

// Enable logging
lumberjack.enabled = true;

// Basic logging
lumberjack.trace("Build started");

// Log with data
lumberjack.trace("Processing files:", fileArray);

// With mode and style
lumberjack.trace("Build complete:", result, "brief", "success");

// Error handling (auto-detects Error objects)
try {
  riskyOperation();
} catch (err) {
  lumberjack.trace("Operation failed:", err, "verbose");
}

// Hierarchical logging
await lumberjack.group(async () => {
  lumberjack.trace("Parent operation");
  lumberjack.indent();
  lumberjack.trace("Child operation", data);
  lumberjack.outdent();
});
```

## API Reference

### Core Methods

#### `trace(message, obj?, mode?, style?)`

Log a message with optional data and styling.

**Parameters:**

| Parameter | Type                               | Default      | Description                     |
| --------- | ---------------------------------- | ------------ | ------------------------------- |
| `message` | `string`                           | required     | Primary message text            |
| `obj`     | `any`                              | `null`       | Optional data to display        |
| `mode`    | `'brief' \| 'verbose' \| 'silent'` | `'brief'`    | Display mode                    |
| `style`   | `string \| LumberjackStyle`        | `'standard'` | Style preset or custom instance |

**Display Modes:**

- `'brief'` - Compact single-line output with datatype and value
- `'verbose'` - Multi-line formatted output with full details
- `'silent'` - No output (useful for conditional logging)

**Style Presets:**

- `'standard'` - Gray (#6B7280), no prefix
- `'headsup'` - Amber (#F59E0B), ⚡ prefix
- `'error'` - Red (#EF4444), ❌ prefix (auto-applied for Error objects)
- `'success'` - Green (#10B981), ✅ prefix

**Error Auto-Detection:**

When `obj` is an Error and style is `'standard'`, automatically applies error styling and includes stack trace:

```javascript
try {
  riskyOperation();
} catch (err) {
  lumberjack.trace("Failed:", err); // Auto-applies 'error' style
  lumberjack.trace("Details:", err, "verbose"); // Shows stack trace
}
```

#### `indent()` / `outdent()` / `resetIndent()`

Control indentation for hierarchical output.

```javascript
lumberjack.trace("Parent");
lumberjack.indent();
lumberjack.trace("Child 1");
lumberjack.trace("Child 2");
lumberjack.outdent();
lumberjack.trace("Back to parent");
lumberjack.resetIndent(); // Force reset to zero
```

#### `group(fn)`

Execute a function with automatic indentation and separator.

```javascript
await lumberjack.group(async () => {
  lumberjack.trace("Step 1");
  lumberjack.trace("Step 2");
  // Auto-outdents and restores indent level
});
```

#### `showScriptOutline(operation, steps, mode?, style?)`

Display a formatted operation outline.

```javascript
lumberjack.showScriptOutline(
  "Build Process",
  [
    { name: "Clean", description: "Remove old files" },
    { name: "Compile", description: "Build sources" },
    { name: "Deploy", description: "Upload to server" },
  ],
  "verbose",
  "headsup"
);
```

#### `configure(options)`

Update logger configuration.

```javascript
lumberjack.configure({
  enabled: true,
  prefix: "[APP]",
  scope: "MyScope",
});
```

#### `createScoped(scope, options?)`

Create a scoped logger with custom prefix and color.

```javascript
const logger = Lumberjack.createScoped("Director", {
  prefix: "🎬",
  color: "#10B981",
});

logger.trace("Initialized"); // Output: 🎬 [Director] Initialized
```

### Configuration

**Enable/disable logging:**

```javascript
lumberjack.enabled = true;
// or
lumberjack.configure({ enabled: true });
```

By default, logging is **disabled**. Set `enabled = true` explicitly to see output.

### Custom Styles

Create reusable styles with color and optional prefix:

```javascript
import { LumberjackStyle } from "@dataink/lumberjack";

const purpleStyle = new LumberjackStyle("#9333EA", "🎨");
lumberjack.trace("Creative mode:", data, "brief", purpleStyle);

// Without prefix
const cyanStyle = new LumberjackStyle("#06B6D4");
lumberjack.trace("Info:", data, "brief", cyanStyle);
```

## Environment Detection

Lumberjack automatically detects and adapts to your environment:

**Node.js Terminal:**

- Uses chalk package for colored output
- Falls back to plain text if chalk is missing
- Optimized for build scripts and CLI tools

**Browser Console:**

- Uses CSS `%c` directive for styling
- Works in modern browsers with console support
- No dependencies required

Same code produces styled output in both environments without changes.

## Examples

### Basic Usage

```javascript
import lumberjack from "@dataink/lumberjack";

lumberjack.enabled = true;

lumberjack.trace("Processing started", { files: 10 }, "brief", "headsup");
lumberjack.trace("Processing complete", result, "brief", "success");
```

### Scoped Loggers

```javascript
import { Lumberjack } from "@dataink/lumberjack";

const uiLogger = Lumberjack.createScoped("UI", { color: "#10B981" });
const apiLogger = Lumberjack.createScoped("API", { color: "#3B82F6" });

uiLogger.trace("Hydrated");
apiLogger.trace("Connected", { host: "api.example.com" });
```

### Hierarchical Logging

```javascript
lumberjack.trace("Processing files...", null, "brief", "headsup");

await lumberjack.group(async () => {
  for (const file of files) {
    lumberjack.trace(`Processing: ${file.name}`, file);
  }
});

lumberjack.trace(
  "All files processed",
  { count: files.length },
  "brief",
  "success"
);
```

## Imports

**Singleton (recommended):**

```javascript
import lumberjack from "@dataink/lumberjack";
lumberjack.trace("Message");
```

**Named exports:**

```javascript
import {
  Lumberjack,
  LumberjackStyle,
  LumberjackStyles,
} from "@dataink/lumberjack";

const instance = Lumberjack.getInstance();
const style = LumberjackStyles.SUCCESS;
```

**Granular imports:**

```javascript
import lumberjack from "@dataink/lumberjack";
import { Lumberjack } from "@dataink/lumberjack/Lumberjack";
import { LumberjackStyle } from "@dataink/lumberjack/LumberjackStyle";
import { LumberjackStyles } from "@dataink/lumberjack/LumberjackStyles";
```

## TypeScript Support

Full TypeScript definitions included:

```typescript
import lumberjack, {
  Lumberjack,
  LumberjackStyle,
  LogMode,
  LogStyleName,
} from "@dataink/lumberjack";

const mode: LogMode = "verbose";
const style: LogStyleName = "success";

lumberjack.trace("Message", data, mode, style);
```

## Configuration Constants

Centralized in `src/constants.js`:

```javascript
export const INDENT_SIZE = 2; // Spaces per indent level
export const MAX_ARRAY_PREVIEW = 3; // Array items in brief mode
export const MAX_OBJECT_PREVIEW = 3; // Object keys in brief mode
export const BASE_STYLE = "color: white; font-weight: normal"; // Browser CSS
export const DEFAULT_MODE = "brief"; // Default display mode
export const DEFAULT_STYLE = "standard"; // Default style preset
```

## Best Practices

1. **Enable explicitly**: Logging is disabled by default—call `lumberjack.enabled = true` or `configure({ enabled: true })`
2. **Use scoped loggers** for module-specific logging with visual distinction
3. **Choose appropriate modes**:
   - `'brief'` for status messages
   - `'verbose'` for debugging complex objects
   - `'silent'` for conditional/sensitive logging
4. **Leverage semantic styles** for clarity:
   - `'standard'` for routine information
   - `'headsup'` for important milestones
   - `'success'` for confirmations
   - `'error'` for failures (auto-applied for Error objects)
5. **Use `group()` for hierarchical operations** to automatically manage indentation

## Package Structure

```plaintext
lumberjack/src/
├── index.js              # Package entry point - exports singleton
├── Lumberjack.class.js   # Main logger class
├── LumberjackStyle.js    # Style class (color + prefix)
├── LumberjackStyles.js   # Built-in style constants
├── constants.js          # Centralized configuration
├── package.json          # Package definition
├── types.d.ts            # TypeScript definitions
└── README.md             # This file
```

## Build & Scripts

```bash
npm run build    # Copy src → dist
npm run lint     # Syntax check via node --check
npm run sanity   # Verify basic functionality
npm run demo     # Serve demo/index.html on port 8080
```

## Troubleshooting

**Logging not appearing?**

Logging is disabled by default. Enable it:

```javascript
lumberjack.enabled = true;
```

**No colors in Node.js terminal?**

Install chalk:

```bash
npm install chalk@^5.0.0
```

Chalk is optional; output will use plain text if missing.

**TypeScript errors?**

Ensure `types.d.ts` is included in your project. Types are automatically available via the `types` field in `package.json`.

## Contributing

This package uses ES modules only. No CommonJS support.

- Import/export syntax required
- Async/await patterns
- Comprehensive JSDoc documentation
- TypeScript definitions

## Version

- **v2.0.0** - Package reorganization, constants extraction, TypeScript support

## License

MIT - Part of the dataink.io portfolio project
