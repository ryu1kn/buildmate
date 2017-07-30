
class TaskExecutor {

  constructor({execSync}) {
    this._execSync = execSync;
  }

  execute({tasks, filePaths}) {
    tasks.forEach(task => {
      if (!task.path) return this._execSync(task.command);
      if (this._hasMatchingPath(task.path, filePaths)) return this._execSync(task.command);
    });
  }

  _hasMatchingPath(pathPattern, filePaths) {
    if (pathPattern instanceof String) {
      return filePaths.includes(pathPattern);
    }
    return filePaths.some(filePath => filePath.match(pathPattern));
  }

}

module.exports = TaskExecutor;
