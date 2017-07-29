
const path = require('path');

module.exports = ({currentDirectory, execSync, input}) => {
  const configPath = path.join(currentDirectory, 'buildman.config.js');
  const config = require(configPath);
  const filePaths = input.split('\n');
  config.tasks.forEach(task => {
    if (!task.path) return execSync(task.command);
    if (filePaths.includes(task.path)) return execSync(task.command);
  });
};
