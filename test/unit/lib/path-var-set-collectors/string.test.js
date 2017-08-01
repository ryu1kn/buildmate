
const test = require('tape');

const StringPathVarSetCollector = require('../../../../lib/path-var-set-collectors/string');

test('StringPathVarSetCollector matches to exact same string', t => {
  t.plan(1);
  const pathVarSetCollector = new StringPathVarSetCollector('DIR/FILE');
  const filePaths = ['DIR/FILE'];
  const results = pathVarSetCollector.collect(filePaths);
  t.deepEqual(results, [[]]);
});

test('StringPathVarSetCollector#collect returns an empty string if no match found', t => {
  t.plan(1);
  const pathVarSetCollector = new StringPathVarSetCollector('DIR/FILE');
  const filePaths = ['NO_MATCH'];
  const results = pathVarSetCollector.collect(filePaths);
  t.deepEqual(results, []);
});
