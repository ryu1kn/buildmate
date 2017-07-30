
const readLines = require('./lib/read-lines');
const TaskExecutor = require('./lib/task-executor');

module.exports = async ({config, execSync, stdin}) => {
  const taskExecutor = new TaskExecutor({execSync});
  taskExecutor.execute({
    tasks: config.tasks,
    filePaths: await readLines(stdin)
  });
};
