# Lumberjack Test Suite

Comprehensive test suite for the @datainkio/lumberjack logging library using Vitest.

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with UI
```bash
npm test:ui
```

### Run tests with coverage
```bash
npm test:coverage
```

### Run specific test file
```bash
npm test -- tests/utils.test.js
```

### Run tests matching a pattern
```bash
npm test -- --grep "brighten"
```

## Test Coverage

The test suite includes **163 tests** across 5 test files:

### 1. **utils.test.js** (8 tests)
Tests the `brighten()` utility function that lightens hex colors.

- Color brightening with various percentages
- Hex color format handling (3-digit and 6-digit)
- Edge cases (black, white, zero percent, negative percent)
- Proper hex expansion and capping at 255

### 2. **LumberjackStyle.test.js** (20 tests)
Tests the `LumberjackStyle` class for immutable style configuration.

**Constructor:**
- Valid color and prefix creation
- Font weight and font size parameters
- Input validation (hex color, fontWeight type, fontSize range)
- Object freezing (immutability)

**Getters:**
- Color, prefix, fontWeight, fontSize accessors
- Default values for optional parameters
- Secondary color (brightened) generation

**Edge Cases:**
- Lowercase and mixed-case hex colors
- Empty and multi-character prefixes
- Zero font size

### 3. **LumberjackStyles.test.js** (26 tests)
Tests the `LumberjackStyles` predefined style constants.

**Static Styles:**
- DEFAULT (gray, no prefix)
- HEADSUP (amber, ⚡ prefix)
- ERROR (red, ❌ prefix)
- SUCCESS (green, no prefix)
- SEPARATOR constant

**getStyle() Method:**
- String-based style lookup (case-insensitive)
- Direct LumberjackStyle instance passthrough
- Object with color and color_secondary properties
- Fallback to DEFAULT for invalid inputs
- Null/undefined/empty string handling

**Immutability:**
- Prevents modification of all predefined styles
- Frozen object enforcement

**Color Secondary:**
- Brightened color generation for all styles

### 4. **Lumberjack.test.js** (69 tests)
Tests the main `Lumberjack` singleton class.

**Singleton Pattern:**
- getInstance() returns same instance
- configure() updates settings
- enabled property getter/setter

**Indentation:**
- indent() increases level
- outdent() decreases level (with floor at 0)
- resetIndent() resets to zero
- _getIndent() returns correct spacing

**Trace Method:**
- Logging when enabled/disabled
- Silent mode suppression
- Message and object parameters
- Mode support (brief, verbose, silent)
- Style parameter handling
- Auto-detection of Error objects
- Null/undefined object handling

**Value Formatting (_getValue):**
- Primitive types (null, undefined, string, number, boolean)
- Arrays with truncation for long arrays
- Objects with key-value pairs
- Error objects
- Functions
- Circular reference detection

**Verbose Formatting (_formatVerbosePlain):**
- Indented multi-line output
- Nested object/array formatting
- Error stack trace inclusion
- Max depth limiting
- Circular reference detection

**Style Resolution (_getStyle):**
- Direct LumberjackStyle instance passthrough
- Style object with color and color_secondary
- String-based style lookup via LumberjackStyles

**Scoped Loggers (createScoped):**
- Scope name inclusion
- Optional prefix and color options
- enabled getter/setter
- config property access
- indent/outdent support
- group() support
- showScriptOutline() support

**Grouping (group):**
- Function execution
- Async function support
- Indent increase during execution
- Indent restoration after execution
- Error handling with indent restoration

**Script Outline (showScriptOutline):**
- Brief and verbose modes
- Custom style support
- Disabled state handling
- Script sequence formatting

**Static Methods:**
- Static trace() method
- Static enabled getter/setter

### 5. **index.test.js** (40 tests)
Tests the default singleton export and public API.

**Exports:**
- Default lumberjack singleton
- Lumberjack class
- LumberjackStyle class
- LumberjackStyles class

**Singleton API:**
- trace() with all parameters
- indent/outdent/resetIndent
- group() with sync and async functions
- showScriptOutline()
- configure()
- createScoped()
- enabled property

**Integration Tests:**
- Combined method usage
- Scoped logger workflows
- Group and indentation combinations
- Custom and predefined styles

## Test Structure

Each test file follows a consistent structure:

```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Module Name', () => {
  beforeEach(() => {
    // Setup before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup after each test
    console.log.mockRestore();
  });

  describe('Feature Group', () => {
    it('should do something specific', () => {
      // Arrange
      const instance = Lumberjack.getInstance();
      
      // Act
      instance.trace('message');
      
      // Assert
      expect(console.log).toHaveBeenCalled();
    });
  });
});
```

## Mocking Strategy

The tests use Vitest's built-in mocking capabilities:

- **console.log**: Mocked to verify logging calls without actual output
- **vi.clearAllMocks()**: Resets all mocks between tests
- **vi.spyOn()**: Spies on console methods to verify behavior

## Key Testing Patterns

### 1. Singleton Testing
```javascript
const instance1 = Lumberjack.getInstance();
const instance2 = Lumberjack.getInstance();
expect(instance1).toBe(instance2);
```

### 2. Configuration Testing
```javascript
Lumberjack.configure({ enabled: true });
expect(Lumberjack.enabled).toBe(true);
```

### 3. Indentation Testing
```javascript
instance.resetIndent();
instance.indent();
expect(instance._getIndent()).toBe('  ');
```

### 4. Logging Verification
```javascript
vi.spyOn(console, 'log').mockImplementation(() => {});
lumberjack.enabled = true;
lumberjack.trace('message');
expect(console.log).toHaveBeenCalled();
```

### 5. Async Testing
```javascript
it('should support async functions', async () => {
  let executed = false;
  await lumberjack.group(async () => {
    executed = true;
  });
  expect(executed).toBe(true);
});
```

## Coverage Goals

The test suite aims for comprehensive coverage of:

- ✅ All public methods and properties
- ✅ All style constants and variations
- ✅ Error handling and edge cases
- ✅ Singleton pattern enforcement
- ✅ Indentation and grouping logic
- ✅ Format functions (brief and verbose modes)
- ✅ Scoped logger functionality
- ✅ Integration scenarios

## Continuous Integration

These tests are designed to run in CI/CD pipelines:

```bash
npm test -- --run  # Run once and exit
npm test:coverage  # Generate coverage reports
```

## Debugging Tests

### Run a single test
```bash
npm test -- --grep "should brighten a 6-digit hex color"
```

### Run with verbose output
```bash
npm test -- --reporter=verbose
```

### Debug in Node
```bash
node --inspect-brk ./node_modules/.bin/vitest
```

## Contributing

When adding new features to lumberjack:

1. Write tests first (TDD approach)
2. Ensure all tests pass: `npm test`
3. Check coverage: `npm test:coverage`
4. Update this README if adding new test categories

## Test Dependencies

- **vitest**: ^1.0.0 - Testing framework
- **Node.js**: >=18 - Runtime environment

## Notes

- Tests use Node.js environment (not browser)
- Singleton instance persists across tests (by design)
- Console.log is mocked to avoid test output pollution
- All tests are synchronous except where async is explicitly tested
