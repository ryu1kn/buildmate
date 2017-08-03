
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

Build man invokes following 3 commands in the order

```sh
./notify-build-start.sh
cd modules/module-A && npm run build    # $BM_PATH_VAR_1 is expanded to modules/module-A
cd modules/module-B && npm run build    # $BM_PATH_VAR_1 is expanded to modules/module-B
```

Possible task properties:

| Property                  | Effect                                                             | Note                |
| ------------------------- | ------------------------------------------------------------------ | ------------------- |
| path                      |                                                                    |                     |
| description               |                                                                    |                     |
| command                   |                                                                    |                     |
| ignoreFailure             |                                                                    | Not yet implemented |
| commandCurrentDir         |                                                                    | Not yet implemented |
| `unless`/`if`/`condition` | run / not run task if other task has been run, or other conditions | Not yet implemented |
