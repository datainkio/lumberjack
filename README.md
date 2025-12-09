# lumberjack

Lumberjack is a utility package that tarts up console messages to improve the developer experience.

## Getting Started

### 1. Local Package Installation

```JavaScript
// In each consuming project's package.json, add:
"@datainkio/lumberjack": "file:../lumberjack"

// Then install:
npm install
```

Best Practice: Use relative file paths during development. This lets you modify Lumberjack and see changes immediately across projects without republishing.

### 2. Enable Logging per Project

```JavaScript
// In each project's entry point or main module
import lumberjack from '@datainkio/lumberjack';

// Only enable for development builds
if (process.env.NODE_ENV === 'development') {
  lumberjack.enabled = true;
}
```

Best Practice: Tie logging to environment variables rather than hardcoding. This prevents production verbosity.

### 3. Create Project-Specific Scoped Loggers

```JavaScript
// In each project, e.g., portfolio-site/src/logger.js
import { Lumberjack } from '@datainkio/lumberjack';

export const buildLogger = Lumberjack.createScoped('Build', {
  prefix: '🏗️',
  color: '#3B82F6'
});

export const apiLogger = Lumberjack.createScoped('API', {
  prefix: '🔌',
  color: '#10B981'
});

export const uiLogger = Lumberjack.createScoped('UI', {
  prefix: '🎨',
  color: '#8B5CF6'
});
```

Best Practice: Centralize logger creation in a single module per project. Re-export scoped loggers to avoid duplication.

### 4. Configure Build Scripts

```JavaScript
{
  "scripts": {
    "dev": "NODE_ENV=development node --loader ./src/index.js",
    "build": "NODE_ENV=production node build.js",
    "debug": "DEBUG=* node --inspect ./src/index.js"
  }
}
```

Best Practice: Use environment variables to control Lumberjack verbosity across dev/build/debug workflows.

### 5. Heat, Serve, and Enjoy

## Workflow & Commands

- **Build**: `npm run build` (copies `src/` to `dist/`)
- **Lint (syntax check)**: `npm run lint` (runs `node --check` across `src/**/*.js`)
- **Sanity check**: `npm run sanity` (imports from `./src/index.js`, enables, logs `ok`)
- **Demo**: `npm run demo` (instantiates a server for review in browser)
- **Optional chalk install** for colored terminal output: `npm install chalk@^5` (peer, optional).
- **Type surface review**: open `types.d.ts` and ensure parity with runtime changes.
