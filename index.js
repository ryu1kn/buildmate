
const readLines = require('./lib/read-lines');
const TaskExecutor = require('./lib/task-executor');

module.exports = async ({config, execSync, stdin, envVars}) => {
  const taskExecutor = new TaskExecutor({execSync, envVars});
  taskExecutor.execute({
    tasks: config.tasks,
    filePaths: await readLines(stdin)
  });
};
