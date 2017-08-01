
const test = require('tape');
const sinon = require('sinon');
const {Readable} = require('stream');

const buildman = require('../../index');

test('it executes a task', async t => {
  t.plan(1);

  const config = {
    tasks: [
      {
        command: './COMMAND.sh'
      }
    ]
  };
  const stdin = new Readable({
    read(_size) {
      this.push(null);
    }
  });
  const execSync = sinon.spy();
  const envVars = {VAR: '..'};
  const logger = {log: () => {}};
  await buildman({config, execSync, stdin, envVars, logger});

  t.deepEqual(execSync.args, [[
    './COMMAND.sh',
    {env: {VAR: '..'}}
  ]]);
});
