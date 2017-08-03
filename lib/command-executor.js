
const STATUS_CODE_SUCCESS = 0;

class CommandExecutor {

  constructor(params) {
    this._spawn = params.spawn;
    this._envVars = params.envVars;
    this._stdout = params.stdout;
    this._stderr = params.stderr;
  }

  execute({command, envVars, continueOnFailure}) {
    const args = [];
    const commandExec = this._spawn(command, args, {
      shell: true,
      env: Object.assign({}, this._envVars, envVars),
      stdio: ['pipe', this._stdout, this._stderr]
    });
    const errorCheckCallback = this._getErrorCheckCallback(continueOnFailure);
    return this._promiseToCompletion(commandExec, errorCheckCallback);
  }

  _getErrorCheckCallback(continueOnFailure) {
    return code => code !== STATUS_CODE_SUCCESS && !continueOnFailure;
  }

  _promiseToCompletion(commandExec, errorCheckCallback) {
    return new Promise((resolve, reject) => {
      commandExec.on('close', code => {
        if (errorCheckCallback(code)) reject(new Error(`Exit status ${code}`));
        else resolve();
      });
      commandExec.on('error', reject);
    });
  }

}

module.exports = CommandExecutor;
