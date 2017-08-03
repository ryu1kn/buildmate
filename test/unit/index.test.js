
const test = require('tape');
const sinon = require('sinon');
const {Readable} = require('stream');

const buildman = require('../../index');

test('it executes a task', async t => {
  t.plan(1);

  const config = {
    tasks: [{command: './COMMAND.sh'}]
  };
  const stdin = createFakeStdin();
  const params = {
    config,
    spawn: createFakeSpawn(),
    stdin,
    stdout: 'STDOUT',
    stderr: 'STDERR',
    envVars: {VAR: '..'},
    logger: {log: () => {}}
  };
  await buildman(params);

  t.deepEqual(params.spawn.args, [[
    './COMMAND.sh',
    [],
    {
      shell: true,
      env: {VAR: '..'},
      stdio: ['pipe', 'STDOUT', 'STDERR']
    }
  ]]);
});

function createFakeStdin() {
  return new Readable({
    read(_size) {
      this.push(null);
    }
  });
}

function createFakeSpawn() {
  const status = 0;
  const command = {
    on: (eventName, callback) => {
      setTimeout(() => {
        callback(status);
      }, 0);
    }
  };
  return sinon.stub().returns(command);
}
