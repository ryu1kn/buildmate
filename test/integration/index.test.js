
const test = require('tape');
const {exec} = require('child_process');

test('it executes a command', t => {
  t.plan(1);

  const options = {cwd: __dirname};
  exec('../../bin/buildman', options, (error, stdout, stderr) => {
    t.equal(stdout, 'Hi, I\'m buildman\n');
  });
});
