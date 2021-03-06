
const test = require('tape');
const {Readable} = require('stream');

const readLines = require('../../../lib/read-lines');

test('it reads all lines from STDIN', t => {
  t.plan(1);

  const stdin = new Readable({
    read(_size) {
      this.push('CHUNK1\nCHUNK2\n');
      this.push('CHUNK3\n');
      this.push(null);
    }
  });
  readLines(stdin).then(lines => {
    t.deepEqual(lines , ['CHUNK1', 'CHUNK2', 'CHUNK3']);
  });
});
