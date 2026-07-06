const test = require('node:test');
const assert = require('node:assert/strict');

// Use the source TypeScript implementation in tests to avoid browser-only compiled bundle imports.
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
  },
});

const { EditorEngine } = require('../src/core/EditorEngine.ts');

test('EditorEngine forwards all arguments to registered commands', () => {
  const engine = new EditorEngine();
  const handler = (state, ...args) => {
    assert.equal(state, engine.state);
    assert.deepEqual(args, ['value', 2, { ok: true }]);
    return true;
  };

  engine.commandRegistry.register('multiArgCommand', handler);

  const result = engine.execCommand('multiArgCommand', 'value', 2, { ok: true });

  assert.equal(result, true);
});
