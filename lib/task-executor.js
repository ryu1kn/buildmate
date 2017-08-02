
const PATH_VAR_ENV_PREFIX = 'BM_PATH_VAR_';
const DESCRIPTION_LEADER = '\n===> ';

class TaskExecutor {

  constructor(params) {
    this._commandExecutor = params.commandExecutor;
    this._logger = params.logger;
  }

  execute({task, pathVarSet}) {
    const executionPlans = pathVarSet.map(pathVars => ({
      command: task.command,
      pathVars
    }));
    this._logger.log(DESCRIPTION_LEADER + task.description);
    executionPlans.forEach(executionPlan => {
      this._execute(executionPlan.command, executionPlan.pathVars);
    });
  }

  _execute(command, pathVars) {
    this._logger.log(command);
    const envVars = pathVars.length > 0 ? {envVars: this._buildEnvVars(pathVars)} : null;
    const params = Object.assign({}, {command}, envVars);
    this._commandExecutor.execute(params);
  }

  _buildEnvVars(pathVars) {
    return pathVars.reduce((result, value, i) => {
      const pathVarEnvName = PATH_VAR_ENV_PREFIX + (i + 1);
      return Object.assign({}, result, {[pathVarEnvName]: value});
    }, Object.create(null));
  }

}

module.exports = TaskExecutor;
