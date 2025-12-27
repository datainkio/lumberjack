# Vite Build Setup

This document describes the Vite configuration for building the lumberjack library and development servers.

## Overview

The repository now uses Vite for:
- **Library builds**: Bundling the source code into distributable modules
- **Development servers**: Running demo and docs with hot module replacement (HMR)
- **Documentation builds**: Building static documentation sites

## Build Configurations

### 1. Library Build (`vite.config.lib.js`)

Builds the library into the `dist/` directory with ES modules format.

**Features:**
- Preserves module structure (each source file becomes a separate module)
- External dependency handling (chalk is marked as external)
- Optimized output with proper file naming
- **Vite plugin** (`viteCopyVendor`) automatically syncs built files to docs vendor directory

**Build Output:**
```
dist/
├── index.js                 # Main entry point
├── Lumberjack.class.js      # Lumberjack class
├── LumberjackStyle.js       # Style class
├── LumberjackStyles.js      # Predefined styles
├── config.js                # Configuration constants
├── constants.js             # String constants
└── utils.js                 # Utility functions
```

**Automatic Vendor Sync:**
After building, the plugin automatically copies all files to:
```
docs/assets/js/vendors/lumberjack/
├── index.js
├── Lumberjack.class.js
├── LumberjackStyle.js
├── LumberjackStyles.js
├── config.js
├── constants.js
└── utils.js
```

### 2. Demo Server (`vite.config.js`)

Development server for the browser demo at `demo/index.html`.

**Features:**
- Hot module replacement (HMR) for instant updates
- Module resolution with alias support
- Relative imports from source files

**Start with:**
```bash
npm run dev
```

**Access at:** `http://localhost:5173/`

### 3. Docs Server (`vite.config.js`)

Development server for documentation at `docs/index.html`.

**Start with:**
```bash
npm run dev:docs
```

**Access at:** `http://localhost:5173/`

## NPM Scripts

### Development

- **`npm run dev`** - Start demo development server with HMR
- **`npm run dev:docs`** - Start docs development server with HMR
- **`npm run test:dev`** - Run tests in watch mode

### Building

- **`npm run build`** - Build library and automatically sync docs vendor files
  - Runs: `vite build --config vite.config.lib.js`
  - Automatically copies built files to `docs/assets/js/vendors/lumberjack/` via Vite plugin
- **`npm run build:lib`** - Build library only
  - Runs: `vite build --config vite.config.lib.js`
  - Same as `npm run build`

### Testing

- **`npm run test`** - Run tests once
- **`npm run test:ui`** - Run tests with UI dashboard
- **`npm run test:coverage`** - Generate coverage reports

## File Structure

```
lumberjack/
├── src/                     # Source files
│   ├── index.js            # Main entry point
│   ├── Lumberjack.class.js # Core class
│   ├── LumberjackStyle.js  # Style class
│   ├── LumberjackStyles.js # Predefined styles
│   ├── config.js           # Configuration
│   ├── constants.js        # Constants
│   └── utils.js            # Utilities
├── dist/                    # Built library (generated)
├── demo/                    # Browser demo
│   └── index.html          # Demo page
├── docs/                    # Documentation
│   ├── index.html          # Docs page
│   └── assets/js/vendors/lumberjack/  # Vendor copy (auto-generated)
├── tests/                   # Test files
├── scripts/
│   └── vite-copy-vendor.js # Vite plugin for vendor sync
├── vite.config.js          # Main Vite config (demo/docs)
├── vite.config.lib.js      # Library build config
└── vitest.config.js        # Test config
```

## Building the Library

### Development Build

```bash
npm run build:lib
```

Outputs to `dist/` with source maps and optimized modules.

### Production Build

```bash
npm run build
```

Builds the library and syncs vendor files to docs.

## Module Resolution

### In Demo/Docs

Use relative imports from the root:
```javascript
import lumberjack from "../src/index.js";
import { Lumberjack } from "../src/Lumberjack.class.js";
```

### In Tests

Imports work directly from source:
```javascript
import lumberjack from '../src/index.js';
import { Lumberjack } from '../src/Lumberjack.class.js';
```

## Configuration Details

### vite.config.lib.js

```javascript
{
  plugins: [viteCopyVendor()],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'lumberjack',
      formats: ['es']
    },
    rollupOptions: {
      external: ['chalk'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src'
      }
    }
  }
}
```

**Key settings:**
- `plugins: [viteCopyVendor()]` - Vite plugin that copies built files to docs vendor directory
- `preserveModules: true` - Each source file becomes a separate module
- `external: ['chalk']` - Chalk is not bundled (peer dependency)
- `formats: ['es']` - Only ES modules (modern JavaScript)

### Vite Copy Vendor Plugin (`scripts/vite-copy-vendor.js`)

Custom Vite plugin that automatically syncs the built library to the docs vendor directory.

**What it does:**
1. Runs after the library build completes
2. Removes old vendor files from `docs/assets/js/vendors/lumberjack/`
3. Copies all built files from `dist/` to the vendor directory
4. Logs success message

**Why it's needed:**
- Eliminates the need for a separate sync script
- Integrates vendor sync directly into the build process
- Ensures docs always have the latest library files

### vite.config.js

```javascript
{
  server: {
    middlewareMode: false
  },
  build: {
    outDir: 'dist-docs'
  }
}
```

**Key settings:**
- `middlewareMode: false` - Full dev server (not middleware mode)
- `outDir: 'dist-docs'` - Separate output directory for docs builds

### vitest.config.js

```javascript
{
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  test: {
    environment: 'node',
    globals: true
  }
}
```

**Key settings:**
- `environment: 'node'` - Tests run in Node.js
- `globals: true` - No need to import describe/it/expect
- Path alias for cleaner imports

## Advantages of Vite

1. **Fast Development** - Instant HMR updates during development
2. **Modern Tooling** - Uses native ES modules in development
3. **Optimized Builds** - Rollup-based production builds
4. **Module Preservation** - Each source file stays separate (better for library consumers)
5. **Zero Configuration** - Sensible defaults for most use cases

## Migration from Old Build

The old build system (`scripts/build.js`) simply copied files from `src/` to `dist/`. The new Vite build:

- Validates module syntax
- Optimizes the output
- Handles external dependencies properly
- Provides better error messages

Both approaches produce the same module structure, but Vite adds validation and optimization.

## Troubleshooting

### Import Resolution Errors

If you see "Failed to resolve import", check:
1. File paths are relative (e.g., `../src/index.js`)
2. File extensions are included (`.js`)
3. Files exist in the source directory

### HMR Not Working

If hot module replacement isn't working:
1. Check browser console for errors
2. Ensure you're accessing via `http://localhost:5173/`
3. Try refreshing the page manually

### Build Errors

If the build fails:
1. Check for syntax errors in source files
2. Ensure all imports are resolvable
3. Run `npm run test` to verify code quality

## Next Steps

- Run `npm run dev` to start the demo development server
- Run `npm run build:lib` to build the library
- Run `npm run test` to verify everything works
