
const test = require('tape');
const sinon = require('sinon');

const TaskExecutor = require('../../../lib/task-executor');

test('it executes a command', async t => {
  t.plan(1);

  const execSync = sinon.spy();
  const taskExecutor = new TaskExecutor({execSync});
  const tasks = [
    {command: 'COMMAND'}
  ];
  const filePaths = [];
  await taskExecutor.execute({tasks, filePaths});
  t.deepEqual(execSync.args, [['COMMAND']]);
});
