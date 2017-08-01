
const test = require('tape');

const NullPathVarSetCollector = require('../../../../lib/path-var-set-collectors/null');

test('NullPathVarSetCollector matches any path', t => {
  t.plan(1);
  const pathVarSetCollector = new NullPathVarSetCollector();
  const filePaths = ['ANY_PATH'];
  const results = pathVarSetCollector.collect(filePaths);
  t.deepEqual(results, [[]]);
});
