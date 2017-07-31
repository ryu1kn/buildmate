
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
  t.deepEqual(execSync.args[0][0], 'COMMAND');
});

test('it executes a command with env variables', async t => {
  t.plan(1);

  const execSync = sinon.spy();
  const envVars = {VAR: '..'};
  const taskExecutor = new TaskExecutor({execSync, envVars});
  const tasks = [
    {command: 'COMMAND'}
  ];
  const filePaths = [];
  await taskExecutor.execute({tasks, filePaths});
  t.deepEqual(execSync.args, [[
    'COMMAND',
    {
      env: {VAR: '..'}
    }
  ]]);
});

test('it executes multiple tasks', async t => {
  t.plan(2);

  const execSync = sinon.spy();
  const taskExecutor = new TaskExecutor({execSync});
  const tasks = [
    {command: 'COMMAND1'},
    {command: 'COMMAND2'}
  ];
  const filePaths = [];
  await taskExecutor.execute({tasks, filePaths});
  t.deepEqual(execSync.args[0][0], 'COMMAND1');
  t.deepEqual(execSync.args[1][0], 'COMMAND2');
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
  t.deepEqual(execSync.args[0][0], 'COMMAND2');
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
  t.deepEqual(execSync.args[0][0], 'COMMAND2');
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
  t.deepEqual(execSync.args[0][0], 'COMMAND2');
});

test('Path components can be referred in a command as environment variables', async t => {
  t.plan(1);

  const execSync = sinon.spy();
  const taskExecutor = new TaskExecutor({execSync});
  const tasks = [
    {
      path: /dir1\/([^/]+)\/([^/]+)\/.*/,
      command: 'COMMAND'
    }
  ];
  const filePaths = ['dir1/dir2/dir3/file'];
  await taskExecutor.execute({tasks, filePaths});
  t.deepEqual(execSync.args, [[
    'COMMAND',
    {
      env: {
        BM_PATH_VAR_1: 'dir2',
        BM_PATH_VAR_2: 'dir3'
      }
    }
  ]]);
});

test('Task gets executed per distinct sets of path parameters', async t => {
  t.plan(1);

  const execSync = sinon.spy();
  const taskExecutor = new TaskExecutor({execSync});
  const tasks = [
    {
      path: /dir1\/([^/]+)\/.*/,
      command: 'COMMAND'
    }
  ];
  const filePaths = ['dir1/dir2/file', 'dir1/dir3/file'];
  await taskExecutor.execute({tasks, filePaths});
  t.deepEqual(execSync.args, [
    [
      'COMMAND',
      {
        env: {BM_PATH_VAR_1: 'dir2'}
      }
    ],
    [
      'COMMAND',
      {
        env: {BM_PATH_VAR_1: 'dir3'}
      }
    ]
  ]);
});

test('Task gets executed once if the sets of path parameters are identical', async t => {
  t.plan(1);

  const execSync = sinon.spy();
  const taskExecutor = new TaskExecutor({execSync});
  const tasks = [
    {
      path: /dir1\/([^/]+)\/.*/,
      command: 'COMMAND'
    }
  ];
  const filePaths = ['dir1/dir2/file1', 'dir1/dir2/file2'];
  await taskExecutor.execute({tasks, filePaths});
  t.deepEqual(execSync.args, [
    [
      'COMMAND',
      {
        env: {BM_PATH_VAR_1: 'dir2'}
      }
    ]
  ]);
});
