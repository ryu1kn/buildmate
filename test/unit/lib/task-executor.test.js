
const test = require('tape');
const sinon = require('sinon');

const TaskExecutor = require('../../../lib/task-executor');

test('TaskExecutor executes a task', t => {
  t.plan(1);

  const params = {
    commandExecutor: {execute: sinon.spy()},
    logger: {log: () => {}}
  };
  const taskExecutor = new TaskExecutor(params);
  const task = {command: 'COMMAND'};
  const pathVarSet = [[]];
  taskExecutor.execute({task, pathVarSet});
  t.deepEqual(params.commandExecutor.execute.args[0][0], {command: 'COMMAND'});
});
