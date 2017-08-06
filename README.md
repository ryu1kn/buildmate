
[![Build Status](https://travis-ci.org/ryu1kn/buildmate.svg?branch=master)](https://travis-ci.org/ryu1kn/buildmate)

# Build Mate

Build Mate. Given a list of file paths, invokes all build tasks that match any of the paths.

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
  tasks: [
    // Failure of the notification doesn't abort the whole build
    {
      description: 'Notify build start',
      command: './notify-build-start.sh',
      continueOnFailure: true
    },

    // Regex path pattern.
    // Capturing parts of path with `()` and reference them in the command with BM_PATH_VAR_X env variables
    {
      path: /^(modules\/[^/]+)\//,        
      command: 'cd $BM_PATH_VAR_1 && npm run build'
    },

    // Glob path pattern
    {
      path: 'lib/**',
      command: './build.sh lib'
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

### Task properties

* `path`
  * Optional. Path pattern to decide if task should be executed (and capture path vars).
    `path` can be an regular expression or glob. Omitting `path` will always execute the task.
* `description`
  * Optional. Task description printed out at the beginning of task execution.
* `command`
  * Required. Command to execute. Path variables captured in `path` matching phase can be referenced
    as environment variables like `BM_PATH_VAR_N` where `N` is a sequential number starts from 1.
* `continueOnFailure` 
  * Optional. Specify `true` if you want to continue the build on the task failure.
* `commandCurrentDir`
  * Optional. **Not yet implemented**
* `condition` like `unless` or `if`
  * Optional. **Not yet implemented**
