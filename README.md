
[![Build Status](https://travis-ci.org/ryu1kn/buildmate.svg?branch=master)](https://travis-ci.org/ryu1kn/buildmate)

# Build Mate

Given a list of file paths, invokes all build tasks that match any of the paths.

## Prerequisite

* Node.js v6

## Usage

```sh
# Make your CI service to install Build Mate
$ npm install -g buildmate

# Pipe git diff output to Build Mate
$ git diff --name-only COMMIT1...COMMIT2 | buildmate
```

* `buildmate.config.js`

```js
module.exports = {
  "tasks": [
    {
      "description": "Notify build start",
      "command": "./notify-build-start.sh",
      "continueOnFailure": true
    },
    {
      "path": /^(modules\/[^/]+)\//,
      "command": "cd $BM_PATH_VAR_1 && npm run build"
    },
    {
      "path": /lib\/.*/,
      "command": "./build.sh lib"
    }
  ]
}
```

If `COMMIT1...COMMIT2` includes changes in the following files:

```
modules/module-A/src/index.js
modules/module-B/test/lib/bootstrap.js
```

Build Mate invokes following 3 commands in the order

```sh
./notify-build-start.sh                 # Failure of this task command doesn't abort the build
cd modules/module-A && npm run build    # $BM_PATH_VAR_1 is expanded to modules/module-A
cd modules/module-B && npm run build    # $BM_PATH_VAR_1 is expanded to modules/module-B
```

Possible task properties:

| Property                  | Effect                                                                    | Note                |
| ------------------------- | ------------------------------------------------------------------------- | ------------------- |
| path                      | Path pattern to decide if task should be executed (and capture path vars) |                     |
| description               | Task description                                                          |                     |
| command                   | Command to execute                                                        |                     |
| continueOnFailure         | Continue build if a task is failed                                        |                     |
| commandCurrentDir         |                                                                           | Not yet implemented |
| `unless`/`if`/`condition` | run / not run task if other task has been run, or other conditions        | Not yet implemented |
