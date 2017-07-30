
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

test('it executes multiple tasks', async t => {
  t.plan(1);

  const execSync = sinon.spy();
  const taskExecutor = new TaskExecutor({execSync});
  const tasks = [
    {command: 'COMMAND1'},
    {command: 'COMMAND2'}
  ];
  const filePaths = [];
  await taskExecutor.execute({tasks, filePaths});
  t.deepEqual(execSync.args, [['COMMAND1'], ['COMMAND2']]);
});

test('it executes tasks that match path patterns', async t => {
  t.plan(1);

  const execSync = sinon.spy();
  const taskExecutor = new TaskExecutor({execSync});
  const tasks = [
    {
      path: 'dir1/test.txt',
      command: 'COMMAND1'
    },
    {
      path: 'dir2/test.txt',
      command: 'COMMAND2'
    }
  ];
  const filePaths = ['dir2/test.txt'];
  await taskExecutor.execute({tasks, filePaths});
  t.deepEqual(execSync.args, [['COMMAND2']]);
});

test('path can be a regular expression', async t => {
  t.plan(1);

  const execSync = sinon.spy();
  const taskExecutor = new TaskExecutor({execSync});
  const tasks = [
    {
      path: 'dir1/file1',
      command: 'COMMAND1'
    },
    {
      path: /dir2\/.*/,
      command: 'COMMAND2'
    }
  ];
  const filePaths = ['dir2/file2'];
  await taskExecutor.execute({tasks, filePaths});
  t.deepEqual(execSync.args, [['COMMAND2']]);
});

test('task gets executed once even if multiple files match the task path', async t => {
  t.plan(1);

  const execSync = sinon.spy();
  const taskExecutor = new TaskExecutor({execSync});
  const tasks = [
    {
      path: 'dir1/file1',
      command: 'COMMAND1'
    },
    {
      path: /dir2\/.*/,
      command: 'COMMAND2'
    }
  ];
  const filePaths = ['dir2/file2', 'dir2/file3'];
  await taskExecutor.execute({tasks, filePaths});
  t.deepEqual(execSync.args, [['COMMAND2']]);
});
