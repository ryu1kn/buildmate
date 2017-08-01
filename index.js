
const readLines = require('./lib/read-lines');
const TaskListExecutor = require('./lib/task-list-executor');

module.exports = async ({config, execSync, stdin, envVars, logger}) => {
  const taskExecutor = new TaskListExecutor({execSync, envVars, logger});
  taskExecutor.execute({
    tasks: config.tasks,
    filePaths: await readLines(stdin)
  });
};
