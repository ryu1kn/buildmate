
class TaskExecutor {

  constructor({execSync}) {
    this._execSync = execSync;
  }

  execute({tasks, filePaths}) {
    tasks.forEach(task => {
      if (!task.path) return this._execSync(task.command);
      if (filePaths.includes(task.path)) return this._execSync(task.command);
    });
  }

}

module.exports = TaskExecutor;
