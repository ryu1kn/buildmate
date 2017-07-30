
class TaskExecutor {

  constructor({execSync}) {
    this._execSync = execSync;
  }

  execute({tasks, filePaths}) {
    tasks.forEach(task => {
      if (!task.path) return this._execSync(task.command);
      const matches = this._matchPath(task.path, filePaths);
      if (!matches) return;
      if (Array.isArray(matches) && matches.length > 0) {
        const env = matches.reduce((accumulated, value, i) => {
          return Object.assign({}, accumulated, {[`BM_PATH_VAR_${i + 1}`]: value});
        }, Object.create(null));
        return this._execSync(task.command, {env});
      }
      return this._execSync(task.command);
    });
  }

  _matchPath(pathPattern, filePaths) {
    if (pathPattern instanceof RegExp) {
      return filePaths.map(filePath => {
        const match = filePath.match(pathPattern);
        return match && match.slice(1, match.length);
      })[0];
    }
    return filePaths.includes(pathPattern);
  }

}

module.exports = TaskExecutor;
