
class CommandExecutor {

  constructor(params) {
    this._spawnSync = params.spawnSync;
    this._envVars = params.envVars;
    this._stdout = params.stdout;
    this._stderr = params.stderr;
  }

  execute({command, envVars}) {
    const args = [];
    const result = this._spawnSync(command, args, {
      shell: true,
      env: Object.assign({}, this._envVars, envVars),
      stdio: ['pipe', this._stdout, this._stderr]
    });
    return result.status;
  }

}

module.exports = CommandExecutor;
