import lumberjack from '../src/index.js';

// Enable logging to see the output
lumberjack.configure({ enabled: true });

// Test 1: Basic trace with caller location
console.log('\n=== Test 1: Basic trace ===');
lumberjack.trace('This is a test message', { data: 'value' });

// Test 2: Trace with different styles
console.log('\n=== Test 2: Different styles ===');
lumberjack.trace('Success message', null, 'brief', 'success');
lumberjack.trace('Error message', null, 'brief', 'error');
lumberjack.trace('Headsup message', null, 'brief', 'headsup');

// Test 3: Scoped logger
console.log('\n=== Test 3: Scoped logger ===');
const apiLogger = lumberjack.createScoped('API', { prefix: '🌐', color: '#60A5FA' });
apiLogger.trace('API request started', { url: '/api/users' });

// Test 4: Grouped logging
console.log('\n=== Test 4: Grouped logging ===');
await lumberjack.group(async () => {
  lumberjack.trace('Inside group - step 1');
  lumberjack.indent();
  lumberjack.trace('Nested step 2');
  lumberjack.outdent();
  lumberjack.trace('Back to step 3');
});

console.log('\n=== All tests complete ===');
console.log('Notice how each log now shows the correct source file and line number!');
