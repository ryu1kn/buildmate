
const readLines = require('./lib/read-lines');

module.exports = async ({config, execSync, stdin}) => {
  const filePaths = await readLines(stdin);
  config.tasks.forEach(task => {
    if (!task.path) return execSync(task.command);
    if (filePaths.includes(task.path)) return execSync(task.command);
  });
};
