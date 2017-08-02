
const PathVarSetCollectorFactory = require('./path-var-set-collector-factory');

class TaskListExecutor {

  constructor(params) {
    this._pathVarSetCollectorFactory = new PathVarSetCollectorFactory();
    this._taskExecutor = params.taskExecutor;
  }

  execute({tasks, filePaths}) {
    tasks.forEach(task => {
      const collector = this._pathVarSetCollectorFactory.create(task.path);
      const pathVarSet = collector.collect(filePaths);
      if (pathVarSet.length > 0) this._taskExecutor.execute({task, pathVarSet});
    });
  }

}

module.exports = TaskListExecutor;
