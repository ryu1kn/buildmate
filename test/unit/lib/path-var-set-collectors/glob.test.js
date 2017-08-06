
const test = require('tape');

const GlobPathVarSetCollector = require('../../../../lib/path-var-set-collectors/glob');

test('GlobPathVarSetCollector matches to exact same string', t => {
  t.plan(1);
  const pathVarSetCollector = new GlobPathVarSetCollector('DIR/FILE');
  const filePaths = ['DIR/FILE'];
  const results = pathVarSetCollector.collect(filePaths);
  t.deepEqual(results, [[]]);
});

test('GlobPathVarSetCollector#collect returns an empty string if no match found', t => {
  t.plan(1);
  const pathVarSetCollector = new GlobPathVarSetCollector('DIR/FILE');
  const filePaths = ['NO_MATCH'];
  const results = pathVarSetCollector.collect(filePaths);
  t.deepEqual(results, []);
});

test('GlobPathVarSetCollector uses glob pattern to find match in given file paths', t => {
  t.plan(1);
  const pathVarSetCollector = new GlobPathVarSetCollector('DIR/**/*.js');
  const filePaths = ['DIR/DIR2/DIR3/FILE.js'];
  const results = pathVarSetCollector.collect(filePaths);
  t.deepEqual(results, [[]]);
});

test('GlobPathVarSetCollector requires full match', t => {
  t.plan(1);
  const pathVarSetCollector = new GlobPathVarSetCollector('DIR');
  const filePaths = ['DIR/DIR2/DIR3/FILE.js'];
  const results = pathVarSetCollector.collect(filePaths);
  t.deepEqual(results, []);
});
