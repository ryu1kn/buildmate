
const test = require('tape');
const sinon = require('sinon');

const CommandExecutor = require('../../../lib/command-executor');

test('CommandExecutor executes a command', async t => {
  t.plan(1);

  const {commandExecutor, spawnSync} = createCommandExecutor();
  const params = {command: 'COMMAND'};
  await commandExecutor.execute(params);
  t.deepEqual(spawnSync.args[0][0], 'COMMAND');
});

test('CommandExecutor executes a command with environment variables given to the command', async t => {
  t.plan(1);

  const {commandExecutor, spawnSync} = createCommandExecutor();
  const params = {command: 'COMMAND'};
  await commandExecutor.execute(params);
  t.deepEqual(spawnSync.args[0][2].env, {VAR: '..'});
});

test('CommandExecutor executes a command with environment variables the app created', async t => {
  t.plan(1);

  const {commandExecutor, spawnSync} = createCommandExecutor();
  const params = {
    command: 'COMMAND',
    envVars: {VAR2: 'var2'}
  };
  await commandExecutor.execute(params);
  t.deepEqual(spawnSync.args[0][2].env, {
    VAR: '..',
    VAR2: 'var2'
  });
});

test('CommandExecutor pipes the command output and error output to given streams', async t => {
  t.plan(1);

  const {commandExecutor, spawnSync} = createCommandExecutor();
  const params = {
    command: 'COMMAND',
    envVars: {VAR2: 'var2'}
  };
  await commandExecutor.execute(params);
  t.deepEqual(spawnSync.args[0][2].stdio, ['pipe', 'STDOUT', 'STDERR']);
});

test('CommandExecutor throws an error if command exits with non-0 status', async t => {
  t.plan(1);

  const {commandExecutor} = createCommandExecutor({status: 1});
  const params = {
    command: 'COMMAND',
    envVars: {VAR2: 'var2'}
  };
  try {
    commandExecutor.execute(params);
  } catch (e) {
    t.deepEqual(e.message, 'Exit status 1');
  }
});

test('CommandExecutor does not throw an error if continueOnFailure is set to true', async t => {
  const {commandExecutor} = createCommandExecutor({status: 1});
  const params = {
    command: 'COMMAND',
    envVars: {VAR2: 'var2'},
    continueOnFailure: true
  };
  commandExecutor.execute(params);
  t.end();
});

function createCommandExecutor({status = 0} = {}) {
  const spawnSync = sinon.stub().returns({status});
  const envVars = {VAR: '..'};
  const stdout = 'STDOUT';
  const stderr = 'STDERR';
  const commandExecutor = new CommandExecutor({spawnSync, envVars, stdout, stderr});
  return {commandExecutor, spawnSync};
}
