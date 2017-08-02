
const test = require('tape');
const sinon = require('sinon');
const {Readable} = require('stream');

const buildman = require('../../index');

test('it executes a task', async t => {
  t.plan(1);

  const config = {
    tasks: [{command: './COMMAND.sh'}]
  };
  const stdin = new Readable({
    read(_size) {
      this.push(null);
    }
  });
  const params = {
    config,
    spawnSync: sinon.stub().returns(new Buffer('COMMAND_OUTPUT')),
    stdin,
    stdout: 'STDOUT',
    stderr: 'STDERR',
    envVars: {VAR: '..'},
    logger: {log: () => {}}
  };
  await buildman(params);

  t.deepEqual(params.spawnSync.args, [[
    './COMMAND.sh',
    [],
    {
      shell: true,
      env: {VAR: '..'},
      stdio: ['pipe', 'STDOUT', 'STDERR']
    }
  ]]);
});
