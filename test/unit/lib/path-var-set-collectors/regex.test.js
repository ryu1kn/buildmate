
const test = require('tape');

const RegexPathVarSetCollector = require('../../../../lib/path-var-set-collectors/regex');

test('RegexPathVarSetCollector#collect returns an empty string if no match found', t => {
  t.plan(1);
  const collector = new RegexPathVarSetCollector(/DIR/);
  const filePaths = ['DOES_NOT_MATCH'];
  const results = collector.collect(filePaths);
  t.deepEqual(results, []);
});

test('RegexPathVarSetCollector#collect returns a nested empty string for no match vars', t => {
  t.plan(1);
  const pathMatcher = new RegexPathVarSetCollector(/DIR/);
  const filePaths = ['DIR'];
  const results = pathMatcher.collect(filePaths);
  t.deepEqual(results, [[]]);
});

test('RegexPathVarSetCollector#collect captures a path variable', t => {
  t.plan(1);
  const pathMatcher = new RegexPathVarSetCollector(/DIR_(\d)/);
  const filePaths = ['DIR_1'];
  const results = pathMatcher.collect(filePaths);
  t.deepEqual(results, [['1']]);
});

test('RegexPathVarSetCollector#collect captures multiple path variables', t => {
  t.plan(1);
  const pathMatcher = new RegexPathVarSetCollector(/DIR_(\d)_(\d)/);
  const filePaths = ['DIR_1_2'];
  const results = pathMatcher.collect(filePaths);
  t.deepEqual(results, [['1', '2']]);
});

test('RegexPathVarSetCollector#collect captures path variables in different paths', t => {
  t.plan(1);
  const pathMatcher = new RegexPathVarSetCollector(/DIR_(\d)/);
  const filePaths = ['DIR_1', 'DIR_2'];
  const results = pathMatcher.collect(filePaths);
  t.deepEqual(results, [['1'], ['2']]);
});

test('RegexPathVarSetCollector#collect captures the same set of path variables once', t => {
  t.plan(1);
  const pathMatcher = new RegexPathVarSetCollector(/DIR_(\d)/);
  const filePaths = ['DIR_1', 'DIR_1'];
  const results = pathMatcher.collect(filePaths);
  t.deepEqual(results, [['1']]);
});
