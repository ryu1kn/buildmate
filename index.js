
const path = require('path');

module.exports = ({currentDirectory, execSync}) => {
  const configPath = path.join(currentDirectory, 'buildman.config.js');
  const config = require(configPath);
  execSync(config.tasks[0].command);
};
