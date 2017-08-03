
const PATH_VAR_ENV_PREFIX = 'BM_PATH_VAR_';
const DESCRIPTION_LEADER = '\n===> ';

class TaskExecutor {

  constructor(params) {
    this._commandExecutor = params.commandExecutor;
    this._logger = params.logger;
  }

  execute({task, pathVarSet}) {
    const executionPlans = pathVarSet.map(
      pathVars => Object.assign({}, task, {_pathVars: pathVars})
    );
    this._logger.log(DESCRIPTION_LEADER + task.description);
    executionPlans.forEach(executionPlan => {
      this._execute(executionPlan);
    });
  }

  _execute({command, continueOnFailure, _pathVars}) {
    this._logger.log(command);
    const envVars = _pathVars.length > 0 ? {envVars: this._buildEnvVars(_pathVars)} : null;
    const continueOnFailureWrap = continueOnFailure ? {continueOnFailure} : null;
    const params = Object.assign({}, {command}, continueOnFailureWrap, envVars);
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
