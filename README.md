
# Build Man

Given a list of file paths, invokes all build tasks that match any of the paths.

* You can give git commit range instead of list of file paths

## Usage

```sh
# Make your CI service to install Build man
$ npm install

# Execute buildman with commit range
$ buildman --git-commit-range COMMIT1..COMMIT2
```

* `buildman.config.js`

```js
module.exports = {
  "tasks": [
    {
      "path": "/modules/:moduleName/**/*",
      "command": "npm run build",
      "commandCurrentDir": "/modules/$BUILDMAN_PATH_MODULENAME",
    },
    {
      "path": "/lib/**/*",
      "command": "./build.sh lib",
      "ignoreFailure": true
    },
    {
      "path": "/**/*",
      "command": "./notify-build-start.sh"
    }
  ]
}
```

If COMMIT1..COMMIT2 includes changes in following files:

```
/modules/module-A/src/index.js
/modules/module-B/test/lib/bootstrap.js
```

Build man invokes following 4 commands (order of module-A/B build is not guaranteed):

```sh
npm run build       # Set current directory to /modules/module-A
npm run build       # Set current directory to /modules/module-B
./notify-build-start.sh
```

Possible task properties:

* `path`
* `command`
* `ignoreFailure`
* `commandCurrentDir`
* `unless` or `if` or `condition`: run / not run task if other task has been run, or other conditions
