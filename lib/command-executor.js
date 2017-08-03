
const STATUS_CODE_SUCCESS = 0;

class CommandExecutor {

  constructor(params) {
    this._spawnSync = params.spawnSync;
    this._envVars = params.envVars;
    this._stdout = params.stdout;
    this._stderr = params.stderr;
  }

  execute({command, envVars, continueOnFailure}) {
    const args = [];
    const result = this._spawnSync(command, args, {
      shell: true,
      env: Object.assign({}, this._envVars, envVars),
      stdio: ['pipe', this._stdout, this._stderr]
    });
    if (result.status !== STATUS_CODE_SUCCESS && !continueOnFailure) {
      throw new Error(`Exit status ${result.status}`);
    }
  }

}

module.exports = CommandExecutor;
