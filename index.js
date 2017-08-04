
const readLines = require('./lib/read-lines');
const TaskListExecutor = require('./lib/task-list-executor');
const TaskExecutor = require('./lib/task-executor');
const CommandExecutor = require('./lib/command-executor');

module.exports = ({config, spawn, stdin, stdout, stderr, envVars, logger}) => {
  const commandExecutor = new CommandExecutor({spawn, envVars, stdout, stderr});
  const taskExecutor = new TaskExecutor({commandExecutor, logger});
  const taskListExecutor = new TaskListExecutor({taskExecutor});
  return readLines(stdin).then(lines =>
    taskListExecutor.execute({
      tasks: config.tasks,
      filePaths: lines
    })
  );
};
