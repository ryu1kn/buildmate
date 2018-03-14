
const test = require('tape');
const td = require('testdouble');
const {Readable} = require('stream');

const buildmate = require('../../index');

test('it executes a task', t => {
  t.plan(1);

  const config = {tasks: [{command: './COMMAND.sh'}]};
  const spawn = td.function();
  const command = {
    on: (eventName, callback) => {
      const status = 0;
      setTimeout(() => {
        callback(status);
      }, 0);
    }
  };
  td.when(spawn('./COMMAND.sh', [], {
    shell: true,
    env: {VAR: '..'},
    stdio: ['pipe', 'STDOUT', 'STDERR']
  })).thenReturn(command);

  const params = {
    config,
    spawn,
    stdin: createFakeStdin(),
    stdout: 'STDOUT',
    stderr: 'STDERR',
    envVars: {VAR: '..'},
    logger: {log: () => {}}
  };
  buildmate(params).then(t.pass);
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
