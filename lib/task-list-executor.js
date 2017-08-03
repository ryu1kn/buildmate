
const PathVarSetCollectorFactory = require('./path-var-set-collector-factory');

class TaskListExecutor {

  constructor(params) {
    this._pathVarSetCollectorFactory = new PathVarSetCollectorFactory();
    this._taskExecutor = params.taskExecutor;
  }

  execute({tasks, filePaths}) {
    return tasks.reduce(
      (promise, task) => promise.then(() => this._executeTask(task, filePaths)),
      Promise.resolve()
    );
  }

  _executeTask(task, filePaths) {
    const collector = this._pathVarSetCollectorFactory.create(task.path);
    const pathVarSet = collector.collect(filePaths);
    return pathVarSet.length > 0 ? this._taskExecutor.execute({task, pathVarSet}) : null;
  }

}

module.exports = TaskListExecutor;
