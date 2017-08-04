
const test = require('tape');
const sinon = require('sinon');

const TaskExecutor = require('../../../lib/task-executor');
const TaskListExecutor = require('../../../lib/task-list-executor');

test('TaskListExecutor executes a command', t => {
  t.plan(1);

  const {commandExecutor, taskListExecutor} = createTaskListExecutor();
  const tasks = [
    {command: 'COMMAND'}
  ];
  const filePaths = [];
  taskListExecutor.execute({tasks, filePaths}).then(() => {
    t.deepEqual(commandExecutor.execute.args[0][0], {command: 'COMMAND'});
  });
});

test('TaskListExecutor prints out the command that it is going to execute', t => {
  t.plan(1);

  const {logger, taskListExecutor} = createTaskListExecutor();
  const tasks = [
    {command: 'COMMAND'}
  ];
  const filePaths = [];
  taskListExecutor.execute({tasks, filePaths}).then(() => {
    t.deepEqual(logger.log.args[1][0], 'COMMAND');
  });
});

test('TaskListExecutor prints out the command description', t => {
  t.plan(1);

  const {logger, taskListExecutor} = createTaskListExecutor();
  const tasks = [
    {
      description: 'DESCRIPTION',
      command: 'COMMAND'
    }
  ];
  const filePaths = [];
  taskListExecutor.execute({tasks, filePaths}).then(() => {
    t.deepEqual(logger.log.args[0][0], '\n===> DESCRIPTION');
  });
});

test('TaskListExecutor executes multiple tasks', t => {
  t.plan(2);

  const {commandExecutor, taskListExecutor} = createTaskListExecutor();
  const tasks = [
    {command: 'COMMAND1'},
    {command: 'COMMAND2'}
  ];
  const filePaths = [];
  taskListExecutor.execute({tasks, filePaths}).then(() => {
    t.deepEqual(commandExecutor.execute.args[0][0], {command: 'COMMAND1'});
    t.deepEqual(commandExecutor.execute.args[1][0], {command: 'COMMAND2'});
  });
});

test('TaskListExecutor executes tasks that match path patterns', t => {
  t.plan(1);

  const {commandExecutor, taskListExecutor} = createTaskListExecutor();
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
  taskListExecutor.execute({tasks, filePaths}).then(() => {
    t.deepEqual(commandExecutor.execute.args[0][0], {command: 'COMMAND2'});
  });
});

test('path can be a regular expression', t => {
  t.plan(1);

  const {commandExecutor, taskListExecutor} = createTaskListExecutor();
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
  taskListExecutor.execute({tasks, filePaths}).then(() => {
    t.deepEqual(commandExecutor.execute.args[0][0], {command: 'COMMAND2'});
  });
});

test('TaskListExecutor executes no tasks when none of the path patterns match', t => {
  t.plan(2);

  const {commandExecutor, taskListExecutor, logger} = createTaskListExecutor();
  const tasks = [
    {
      path: 'dir1/test.txt',
      command: 'COMMAND1'
    },
    {
      path: /dir2\/test.txt/,
      command: 'COMMAND2'
    }
  ];
  const filePaths = ['NOT_EXISTING/test.txt'];
  taskListExecutor.execute({tasks, filePaths, logger}).then(() => {
    t.deepEqual(commandExecutor.execute.args, []);
    t.deepEqual(logger.log.args, []);
  });
});

test('task gets executed once even if multiple files match the task path', t => {
  t.plan(1);

  const {commandExecutor, taskListExecutor} = createTaskListExecutor();
  const tasks = [
    {
      path: /dir\/.*/,
      command: 'COMMAND2'
    }
  ];
  const filePaths = ['dir/file1', 'dir/file2'];
  taskListExecutor.execute({tasks, filePaths}).then(() => {
    t.deepEqual(commandExecutor.execute.args[0][0], {command: 'COMMAND2'});
  });
});

test('Path components can be referred in a command as environment variables', t => {
  t.plan(1);

  const {commandExecutor, taskListExecutor} = createTaskListExecutor();
  const tasks = [
    {
      path: /dir1\/([^/]+)\/([^/]+)\/.*/,
      command: 'COMMAND'
    }
  ];
  const filePaths = ['dir1/dir2/dir3/file'];
  taskListExecutor.execute({tasks, filePaths}).then(() => {
    t.deepEqual(commandExecutor.execute.args, [[{
      command: 'COMMAND',
      envVars: {
        BM_PATH_VAR_1: 'dir2',
        BM_PATH_VAR_2: 'dir3'
      }
    }]]);
  });
});

test('Task gets executed per distinct sets of path parameters', t => {
  t.plan(1);

  const {commandExecutor, taskListExecutor} = createTaskListExecutor();
  const tasks = [
    {
      path: /dir1\/([^/]+)\/.*/,
      command: 'COMMAND'
    }
  ];
  const filePaths = ['dir1/dir2/file', 'dir1/dir3/file'];
  taskListExecutor.execute({tasks, filePaths}).then(() => {
    t.deepEqual(commandExecutor.execute.args, [
      [{
        command: 'COMMAND',
        envVars: {BM_PATH_VAR_1: 'dir2'}
      }],
      [{
        command: 'COMMAND',
        envVars: {BM_PATH_VAR_1: 'dir3'}
      }]
    ]);
  });
});

test('Task gets executed once if the sets of path parameters are identical', t => {
  t.plan(1);

  const {commandExecutor, taskListExecutor} = createTaskListExecutor();
  const tasks = [
    {
      path: /dir1\/([^/]+)\/.*/,
      command: 'COMMAND'
    }
  ];
  const filePaths = ['dir1/dir2/file1', 'dir1/dir2/file2'];
  taskListExecutor.execute({tasks, filePaths}).then(() => {
    t.deepEqual(commandExecutor.execute.args, [[{
      command: 'COMMAND',
      envVars: {BM_PATH_VAR_1: 'dir2'}
    }]]);
  });
});

function createTaskListExecutor() {
  const logger = {log: sinon.spy()};
  const commandExecutor = {execute: sinon.stub().returns('STATUS_CODE')};
  const taskExecutor = new TaskExecutor({commandExecutor, logger});
  const taskListExecutor = new TaskListExecutor({taskExecutor});
  return {commandExecutor, logger, taskListExecutor};
}
