
# Build Man

Given a list of file paths, invokes all build tasks that match any of the paths.

## Usage

```sh
# Make your CI service to install Build man
$ npm install

# Pipe git diff output to Build Man
$ git diff --name-only COMMIT1...COMMIT2 | buildman
```

* `buildman.config.js`

```js
module.exports = {
  "tasks": [
    {
      "description": "Notify build start",
      "command": "./notify-build-start.sh"
    },
    {
      "path": /modules\/(moduleName)\/.*/,
      "command": "npm run build",
      "commandCurrentDir": "modules/$BM_PATH_VAR_1",
    },
    {
      "path": "lib/**/*",
      "command": "./build.sh lib",
      "ignoreFailure": true
    }
  ]
}
```

If COMMIT1..COMMIT2 includes changes in following files:

```
modules/module-A/src/index.js
modules/module-B/test/lib/bootstrap.js
```

Build man invokes following 3 commands in the order

```sh
./notify-build-start.sh
npm run build       # Set current directory to modules/module-A
npm run build       # Set current directory to modules/module-B
```

Possible task properties:

* `path`
* `description`
* `command`
* `ignoreFailure`
* `commandCurrentDir`
* `unless` or `if` or `condition`: run / not run task if other task has been run, or other conditions
